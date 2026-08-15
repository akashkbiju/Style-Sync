// ─── Firebase Auth & Firestore Service with Graceful Offline Fallback ──────────
// Handles: Register (create account) + Login (sign in) + Logout
// If Firebase is not fully configured, has network issues, or throws rules errors,
// it transparently falls back to localStorage accounts so the application never breaks.

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from 'firebase/auth';
import {
  doc,
  setDoc,
  getDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { auth, db } from './firebaseConfig';

// ─── Validation Helpers ────────────────────────────────────────────────────────

/** Indian mobile: starts with 6-9, exactly 10 digits */
export const validatePhone = (phone) => /^[6-9]\d{9}$/.test(phone.trim());

/** RFC-5322 simplified email regex */
export const validateEmail = (email) =>
  /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/.test(email.trim());

/**
 * Password rules:
 *  - Minimum 8 characters
 *  - At least one uppercase letter (A-Z)
 *  - At least one digit (0-9)
 *  - At least one special character (!@#$%^&*...)
 */
export const validatePassword = (password) => {
  if (password.length < 8)
    return { valid: false, message: 'Password must be at least 8 characters.' };
  if (!/[A-Z]/.test(password))
    return { valid: false, message: 'Password must contain at least one uppercase letter.' };
  if (!/[0-9]/.test(password))
    return { valid: false, message: 'Password must contain at least one number.' };
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password))
    return { valid: false, message: 'Password must contain at least one special character (e.g. @, #, !).' };
  return { valid: true, message: '' };
};

/** Password strength label for UI meter */
export const passwordStrength = (password) => {
  let score = 0;
  if (password.length >= 8)  score++;
  if (password.length >= 12) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) score++;
  if (score <= 1) return { label: 'Weak',   color: '#ef4444', width: '20%' };
  if (score <= 2) return { label: 'Fair',   color: '#f59e0b', width: '40%' };
  if (score <= 3) return { label: 'Good',   color: '#3b82f6', width: '65%' };
  if (score <= 4) return { label: 'Strong', color: '#10b981', width: '85%' };
  return               { label: 'Excellent', color: '#6366f1', width: '100%' };
};

// ─── Local Mock Database Helpers (Fallback) ───────────────────────────────────
const getLocalAccounts = (role) => {
  const key = `stylesync_${role}_accounts`;
  return JSON.parse(localStorage.getItem(key) || '[]');
};

const saveLocalAccount = (role, user) => {
  const key = `stylesync_${role}_accounts`;
  const existing = getLocalAccounts(role);
  localStorage.setItem(key, JSON.stringify([...existing, user]));
};

// ─── Firebase Register with Fallback ─────────────────────────────────────────
export const firebaseRegister = async ({ name, email, password, phone, role, staffRole }) => {
  const userData = {
    uid:       `usr-${Math.floor(100000 + Math.random() * 900000)}`,
    name:      name.trim(),
    email:     email.trim().toLowerCase(),
    phone:     phone?.trim() || '',
    role,
    staffRole: staffRole || '',
    password, // Store locally in plain text for demonstration if Firebase fails
  };

  try {
    console.log('Attempting Firebase Auth registration...');
    // 1. Create Firebase Auth account
    const credential = await createUserWithEmailAndPassword(auth, email.trim(), password);
    const user = credential.user;

    // Update display name in Firebase Auth
    await updateProfile(user, { displayName: name.trim() });

    console.log('Firebase Auth registration succeeded. Attempting Firestore write...');
    // 2. Try saving to Firestore
    try {
      await setDoc(doc(db, 'users', user.uid), {
        uid:       user.uid,
        name:      name.trim(),
        email:     email.trim().toLowerCase(),
        phone:     phone?.trim() || '',
        role,
        staffRole: staffRole || '',
        createdAt: serverTimestamp(),
      });
      console.log('Firestore write succeeded.');
    } catch (dbError) {
      console.warn('Firestore write failed (rules or config). Falling back to LocalStorage profiles.', dbError);
      // Even if Firestore fails, the auth user is created. We save metadata in LocalStorage so they can proceed.
      saveLocalAccount(role, { ...userData, uid: user.uid });
    }

    return {
      uid:       user.uid,
      name:      name.trim(),
      email:     email.trim().toLowerCase(),
      phone:     phone?.trim() || '',
      role,
      staffRole: staffRole || '',
    };

  } catch (authError) {
    console.warn('Firebase Auth registration failed. Using LocalStorage fallback database.', authError.message);
    
    // Check if the user already exists locally
    const existing = getLocalAccounts(role);
    if (existing.find(a => a.email === email.trim().toLowerCase())) {
      throw { code: 'auth/email-already-in-use', message: 'Account already exists.' };
    }

    // Save to local fallback database
    saveLocalAccount(role, userData);
    return userData;
  }
};

// ─── Firebase Login with Fallback ────────────────────────────────────────────
export const firebaseLogin = async (email, password) => {
  const loginEmail = email.trim().toLowerCase();

  try {
    console.log('Attempting Firebase Auth login...');
    const credential = await signInWithEmailAndPassword(auth, email.trim(), password);
    const user = credential.user;

    console.log('Firebase Auth login succeeded. Fetching Firestore profile...');
    try {
      const snap = await getDoc(doc(db, 'users', user.uid));
      if (snap.exists()) {
        const profile = snap.data();
        return {
          uid:       user.uid,
          name:      profile.name,
          email:     profile.email,
          phone:     profile.phone,
          role:      profile.role,
          staffRole: profile.staffRole,
        };
      }
    } catch (dbError) {
      console.warn('Firestore profile fetch failed. Looking in LocalStorage profiles fallback...', dbError);
    }

    // Fallback: Check local storage for metadata if Firestore is blocked but auth worked
    const allRoles = ['customer', 'staff'];
    for (const r of allRoles) {
      const match = getLocalAccounts(r).find(a => a.email === loginEmail);
      if (match) {
        return { ...match, uid: user.uid };
      }
    }

    // Default metadata if no local record exists
    return {
      uid:       user.uid,
      name:      user.displayName || 'StyleSync User',
      email:     user.email,
      phone:     '',
      role:      email.endsWith('@stylesync.com') ? 'staff' : 'customer',
      staffRole: '',
    };

  } catch (authError) {
    console.warn('Firebase Auth login failed. Trying LocalStorage fallback database...', authError.message);

    // If Firebase Auth fails (or key is invalid), try local mock accounts database
    const allRoles = ['customer', 'staff'];
    for (const r of allRoles) {
      const match = getLocalAccounts(r).find(
        (a) => a.email === loginEmail && a.password === password
      );
      if (match) {
        console.log(`Successfully logged in using LocalStorage fallback for role: ${r}`);
        return match;
      }
    }

    // If neither Firebase nor Local DB matches, throw the auth error
    throw authError;
  }
};

// ─── Firebase Logout with Fallback ───────────────────────────────────────────
export const firebaseLogout = async () => {
  try {
    await signOut(auth);
  } catch (err) {
    console.warn('Firebase signOut error:', err);
  }
};
