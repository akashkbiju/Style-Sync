import React, { useState } from 'react';
import { useSalon } from '../../context/SalonContext';
import {
  Eye, EyeOff, Scissors, User, Users, ShieldCheck,
  ArrowRight, CheckCircle, Lock, Phone, Mail, AlertCircle
} from 'lucide-react';
import {
  firebaseRegister,
  firebaseLogin,
  validateEmail,
  validatePhone,
  validatePassword,
  passwordStrength,
} from '../../firebase/authService';

// ─── Admin Credentials (never stored in DB, hardcoded in source) ───────────────
const ADMIN = {
  email:    'admin@stylesync.com',
  password: 'Admin@2025',
  name:     'Admin — StyleSync',
};

// ─── Validation: run all rules, return array of error strings ──────────────────
const runValidations = ({ mode, role, form }) => {
  const errors = {};

  // ── Email ──────────────────────────────────────────────────────────────
  if (!form.email) {
    errors.email = 'Email is required.';
  } else if (!validateEmail(form.email)) {
    errors.email = 'Enter a valid email address (e.g. name@domain.com).';
  }

  // ── Password ───────────────────────────────────────────────────────────
  if (!form.password) {
    errors.password = 'Password is required.';
  } else if (mode === 'register') {
    const { valid, message } = validatePassword(form.password);
    if (!valid) errors.password = message;
  }

  if (mode === 'register') {
    // ── Full Name ────────────────────────────────────────────────────────
    if (!form.name.trim()) errors.name = 'Full name is required.';

    // ── Confirm Password ─────────────────────────────────────────────────
    if (!form.confirmPassword) {
      errors.confirmPassword = 'Please confirm your password.';
    } else if (form.password !== form.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match.';
    }

    // ── Phone (customer only) ────────────────────────────────────────────
    if (role === 'customer' && form.phone) {
      if (!validatePhone(form.phone)) {
        errors.phone = 'Enter a valid 10-digit Indian mobile number (starts with 6-9).';
      }
    }

    // ── Staff Role ───────────────────────────────────────────────────────
    if (role === 'staff' && !form.staffRole) {
      errors.staffRole = 'Please select your specialisation.';
    }
  }

  return errors;
};

// ─── Password Strength Meter Component ────────────────────────────────────────
const StrengthMeter = ({ password }) => {
  if (!password) return null;
  const s = passwordStrength(password);
  return (
    <div className="mt-1.5 space-y-1">
      <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: s.width, backgroundColor: s.color }}
        />
      </div>
      <p className="text-xs" style={{ color: s.color }}>
        Strength: <span className="font-semibold">{s.label}</span>
      </p>
    </div>
  );
};

// ─── Field Error Component ─────────────────────────────────────────────────────
const FieldError = ({ msg }) =>
  msg ? (
    <p className="flex items-center gap-1 text-xs text-rose-400 mt-1">
      <AlertCircle size={12} /> {msg}
    </p>
  ) : null;

// ─── Main AuthPage ─────────────────────────────────────────────────────────────
export const AuthPage = () => {
  const [mode, setMode] = useState('login');           // 'login' | 'register'
  const [selectedRole, setSelectedRole] = useState('customer'); // 'customer' | 'staff'
  const [showPw, setShowPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);
  const [globalError, setGlobalError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const { loginUser } = useSalon();

  const [form, setForm] = useState({
    name: '', email: '', phone: '', staffRole: '',
    password: '', confirmPassword: '',
  });

  const setField = (field) => (e) => {
    setFieldErrors((prev) => ({ ...prev, [field]: '' }));
    setGlobalError('');
    setForm((p) => ({ ...p, [field]: e.target.value }));
  };

  const resetForm = (keepSuccess = false) => {
    setForm({ name: '', email: '', phone: '', staffRole: '', password: '', confirmPassword: '' });
    setFieldErrors({});
    setGlobalError('');
    if (!keepSuccess) setSuccess('');
  };

  const friendlyFirebaseError = (err) => {
    const code = err?.code || '';
    const msg = err?.message || '';
    switch (code) {
      case 'auth/email-already-in-use':    return 'An account with this email already exists.';
      case 'auth/invalid-email':           return 'Invalid email address format.';
      case 'auth/weak-password':           return 'Password is too weak. Use at least 8 characters.';
      case 'auth/user-not-found':          return 'No account found with this email.';
      case 'auth/wrong-password':          return 'Incorrect password. Please try again.';
      case 'auth/invalid-credential':      return 'Invalid email or password. Please try again.';
      case 'auth/too-many-requests':       return 'Too many failed attempts. Please try again later.';
      case 'auth/network-request-failed':  return 'Network error. Please check your internet connection.';
      case 'auth/operation-not-allowed':   return 'Email/Password sign-in is disabled. Please enable it in Firebase Console -> Authentication -> Sign-in method.';
      default:                             return msg || 'Something went wrong. Please try again.';
    }
  };

  // ── Admin check ────────────────────────────────────────────────────────────
  const isAdminCredential = (email, password) =>
    email.trim() === ADMIN.email && password === ADMIN.password;

  // ── Login ──────────────────────────────────────────────────────────────────
  const handleLogin = async () => {
    setGlobalError('');
    const errors = runValidations({ mode: 'login', role: selectedRole, form });
    if (Object.keys(errors).length) { setFieldErrors(errors); return; }

    setLoading(true);
    try {
      // Admin special login — works from either tab
      if (isAdminCredential(form.email, form.password)) {
        loginUser({ name: ADMIN.name, email: ADMIN.email, role: 'admin' });
        return;
      }

      // Firebase Auth login — password verified server-side against hashed copy
      const user = await firebaseLogin(form.email, form.password);

      // Role guard — make sure they're logging into the right tab
      if (user.role !== selectedRole) {
        setGlobalError(
          `This account is registered as "${user.role}". Please select the "${user.role}" tab.`
        );
        return;
      }
      loginUser(user);
    } catch (err) {
      setGlobalError(friendlyFirebaseError(err));
    } finally {
      setLoading(false);
    }
  };

  // ── Register ───────────────────────────────────────────────────────────────
  const handleRegister = async () => {
    setGlobalError('');
    const errors = runValidations({ mode: 'register', role: selectedRole, form });
    if (Object.keys(errors).length) { setFieldErrors(errors); return; }

    setLoading(true);
    try {
      // Firebase creates account — password is hashed automatically (bcrypt / SHA-256)
      await firebaseRegister({
        name:      form.name,
        email:     form.email,
        password:  form.password,
        phone:     form.phone,
        role:      selectedRole,
        staffRole: form.staffRole,
      });
      setSuccess('Account created successfully! You can now sign in.');
      setMode('login');
      resetForm(true);
    } catch (err) {
      setGlobalError(friendlyFirebaseError(err));
    } finally {
      setLoading(false);
    }
  };

  const submit = mode === 'login' ? handleLogin : handleRegister;

  const roleConfig = {
    customer: {
      icon:  <User size={20} />,
      label: 'Customer',
      hint:  mode === 'login'
        ? 'Sign in to book salon services  •  Admin: enter your special ID on any tab'
        : 'Create your personal Style Sync account',
    },
    staff: {
      icon:  <Scissors size={20} />,
      label: 'Staff / Stylist',
      hint:  mode === 'login'
        ? 'Sign in to access your schedule  •  Admin: enter your special ID on any tab'
        : 'Register as a certified StyleSync stylist',
    },
  };
  const currentRole = roleConfig[selectedRole] || roleConfig.customer;

  return (
    <div className="min-h-screen w-full bg-black flex items-stretch overflow-hidden">

      {/* ── Left Panel: Branding ──────────────────────────────────────────── */}
      <div className="hidden lg:flex lg:w-[45%] relative flex-col justify-between p-14 overflow-hidden">

        <div className="geometric-accent w-96 h-96 rotate-45 -left-32 -top-16" />
        <div className="geometric-accent w-64 h-64 rotate-[20deg] -left-8 top-1/3" />
        <div className="geometric-accent w-48 h-48 rotate-12 left-24 top-1/2" />

        <div className="absolute inset-0 z-0">
          <img
            src="/hero_model.png"
            alt="Style Sync fashion"
            className="w-full h-full object-cover object-top opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent" />
        </div>

        {/* Logo */}
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-3">
            <Scissors size={28} className="text-primary" />
            <span className="font-display text-3xl font-bold">
              <span className="text-primary">Style</span>{' '}
              <span className="text-white">Sync</span>
            </span>
          </div>
          <p className="text-slate-400 text-sm tracking-widest uppercase">Salon Management System</p>
        </div>

        {/* Tagline */}
        <div className="relative z-10 space-y-6">
          <h2 className="font-display text-5xl font-bold text-white leading-tight uppercase">
            Luxury<br />
            <span className="text-primary">Reimagined</span><br />
            For Every<br />Salon.
          </h2>
          <p className="text-slate-400 text-sm max-w-xs leading-relaxed">
            Manage bookings, staff, payments, and home service requests — all from one elegant platform.
          </p>
          <div className="flex flex-wrap gap-2">
            {['Smart Booking', 'Elderly Home Visits', 'AI Chatbot', 'Online Payments'].map(f => (
              <span key={f} className="flex items-center gap-1.5 px-3 py-1 border border-white/10 text-xs text-slate-300 rounded-full">
                <CheckCircle size={12} className="text-primary" /> {f}
              </span>
            ))}
          </div>
        </div>

        {/* Security badge */}
        <div className="relative z-10 flex items-center gap-2 text-xs text-slate-600">
          <Lock size={12} />
          <span>Passwords encrypted with Firebase bcrypt hashing — never stored in plain text</span>
        </div>
      </div>

      {/* ── Right Panel: Auth Form ────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col justify-center px-6 sm:px-12 lg:px-14 py-10 overflow-y-auto">

        {/* Mobile logo */}
        <div className="flex lg:hidden items-center gap-2 mb-8">
          <Scissors size={24} className="text-primary" />
          <span className="font-display text-2xl font-bold">
            <span className="text-primary">Style</span>{' '}
            <span className="text-white">Sync</span>
          </span>
        </div>

        {/* Header */}
        <div className="mb-7">
          <h1 className="font-display text-4xl font-bold text-white mb-1">
            {mode === 'login' ? 'Welcome Back' : 'Create Account'}
          </h1>
          <p className="text-slate-400 text-sm">
            {mode === 'login'
              ? 'Sign in to continue to your dashboard'
              : 'Join the Style Sync platform today'}
          </p>
        </div>

        {/* ── Role Selector ─────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          {['customer', 'staff'].map((role) => {
            const rc = roleConfig[role];
            const isActive = selectedRole === role;
            return (
              <button
                key={role}
                onClick={() => { setSelectedRole(role); resetForm(); }}
                className={`flex flex-col items-center gap-2 py-4 px-2 border transition-all duration-200 cursor-pointer rounded
                  ${isActive
                    ? 'border-primary bg-primary/10 text-primary shadow-[0_0_15px_rgba(225,29,72,0.3)]'
                    : 'border-white/10 text-slate-400 hover:border-white/30 hover:text-white'
                  }`}
              >
                {rc.icon}
                <span className="text-xs font-semibold uppercase tracking-wider">
                  {rc.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Role hint */}
        <p className="text-xs text-slate-500 mb-5 px-0.5 italic">{currentRole.hint}</p>

        {/* ── Form Fields ───────────────────────────────────────────────── */}
        <div className="space-y-3 w-full max-w-md">

          {/* Full Name — register only */}
          {mode === 'register' && (
            <div>
              <label className="form-label">Full Name *</label>
              <input
                type="text"
                className={`form-input mt-1 ${fieldErrors.name ? 'border-rose-500' : ''}`}
                placeholder="e.g. Priya Sharma"
                value={form.name}
                onChange={setField('name')}
              />
              <FieldError msg={fieldErrors.name} />
            </div>
          )}

          {/* Phone — register + customer */}
          {mode === 'register' && selectedRole === 'customer' && (
            <div>
              <label className="form-label">
                Phone Number
                <span className="text-slate-600 ml-1 font-normal">(10-digit Indian mobile)</span>
              </label>
              <div className="relative mt-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm">+91</span>
                <input
                  type="tel"
                  className={`form-input pl-12 ${fieldErrors.phone ? 'border-rose-500' : ''}`}
                  placeholder="9876543210"
                  maxLength={10}
                  value={form.phone}
                  onChange={setField('phone')}
                />
              </div>
              <FieldError msg={fieldErrors.phone} />
              {form.phone && validatePhone(form.phone) && (
                <p className="text-xs text-green-400 mt-1 flex items-center gap-1">
                  <CheckCircle size={12} /> Valid Indian mobile number
                </p>
              )}
            </div>
          )}

          {/* Staff Role — register + staff */}
          {mode === 'register' && selectedRole === 'staff' && (
            <div>
              <label className="form-label">Specialisation / Role *</label>
              <select
                className={`form-select mt-1 ${fieldErrors.staffRole ? 'border-rose-500' : ''}`}
                value={form.staffRole}
                onChange={setField('staffRole')}
              >
                <option value="">-- Select your role --</option>
                <option>Senior Stylist</option>
                <option>Colorist</option>
                <option>Hair Therapist</option>
                <option>Nail Artist</option>
                <option>Spa Therapist</option>
                <option>Makeup Artist</option>
                <option>Receptionist</option>
              </select>
              <FieldError msg={fieldErrors.staffRole} />
            </div>
          )}

          {/* Email */}
          <div>
            <label className="form-label">Email Address *</label>
            <div className="relative mt-1">
              <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="email"
                className={`form-input pl-9 ${fieldErrors.email ? 'border-rose-500' : ''}`}
                placeholder="you@example.com"
                value={form.email}
                onChange={setField('email')}
                onKeyDown={(e) => e.key === 'Enter' && submit()}
              />
            </div>
            <FieldError msg={fieldErrors.email} />
            {form.email && !fieldErrors.email && validateEmail(form.email) && (
              <p className="text-xs text-green-400 mt-1 flex items-center gap-1">
                <CheckCircle size={12} /> Valid email format
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="form-label">
              Password *
              {mode === 'register' && (
                <span className="text-slate-600 ml-1 font-normal">(min 8 chars, 1 uppercase, 1 number, 1 special)</span>
              )}
            </label>
            <div className="relative mt-1">
              <input
                type={showPw ? 'text' : 'password'}
                className={`form-input pr-12 ${fieldErrors.password ? 'border-rose-500' : ''}`}
                placeholder={mode === 'register' ? 'e.g. MyPass@123' : '••••••••'}
                value={form.password}
                onChange={setField('password')}
                onKeyDown={(e) => e.key === 'Enter' && submit()}
              />
              <button
                type="button"
                onClick={() => setShowPw(!showPw)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                {showPw ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            </div>
            <FieldError msg={fieldErrors.password} />
            {/* Password strength meter shown only on register */}
            {mode === 'register' && <StrengthMeter password={form.password} />}
          </div>

          {/* Confirm Password — register only */}
          {mode === 'register' && (
            <div>
              <label className="form-label">Confirm Password *</label>
              <div className="relative mt-1">
                <input
                  type={showConfirmPw ? 'text' : 'password'}
                  className={`form-input pr-12 ${fieldErrors.confirmPassword ? 'border-rose-500' : ''}`}
                  placeholder="Re-enter password"
                  value={form.confirmPassword}
                  onChange={setField('confirmPassword')}
                  onKeyDown={(e) => e.key === 'Enter' && submit()}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPw(!showConfirmPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  {showConfirmPw ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
              <FieldError msg={fieldErrors.confirmPassword} />
              {form.confirmPassword && form.password === form.confirmPassword && !fieldErrors.confirmPassword && (
                <p className="text-xs text-green-400 mt-1 flex items-center gap-1">
                  <CheckCircle size={12} /> Passwords match
                </p>
              )}
            </div>
          )}

          {/* Password rules cheat-sheet — register */}
          {mode === 'register' && (
            <div className="p-3 border border-white/8 bg-white/2 rounded text-xs text-slate-500 space-y-1">
              {[
                { rule: 'At least 8 characters',           ok: form.password.length >= 8 },
                { rule: 'One uppercase letter (A-Z)',       ok: /[A-Z]/.test(form.password) },
                { rule: 'One number (0-9)',                 ok: /[0-9]/.test(form.password) },
                { rule: 'One special character (@, #, !…)', ok: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(form.password) },
              ].map(({ rule, ok }) => (
                <p key={rule} className={`flex items-center gap-1.5 ${ok ? 'text-green-400' : 'text-slate-500'}`}>
                  {ok ? <CheckCircle size={11} /> : <span className="w-3 h-3 rounded-full border border-slate-600 inline-block" />}
                  {rule}
                </p>
              ))}
            </div>
          )}

          {/* Global error / success */}
          {globalError && (
            <div className="p-3 border border-primary/50 bg-primary/10 rounded text-sm text-rose-300 flex items-start gap-2">
              <AlertCircle size={15} className="text-primary mt-0.5 shrink-0" /> {globalError}
            </div>
          )}
          {success && (
            <div className="p-3 border border-green-500/40 bg-green-500/10 rounded text-sm text-green-300 flex items-center gap-2">
              <CheckCircle size={15} className="text-green-400 shrink-0" /> {success}
            </div>
          )}

          {/* Submit */}
          <button
            onClick={submit}
            disabled={loading}
            className="btn-red-neon w-full justify-between mt-1"
          >
            <span>
              {loading
                ? (mode === 'login' ? 'Signing in…' : 'Creating account…')
                : mode === 'login'
                  ? `Sign In as ${currentRole.label}`
                  : 'Create Account'}
            </span>
            {!loading && <ArrowRight size={18} />}
          </button>

          {/* Admin tip */}
          {mode === 'login' && (
            <div className="p-3 border border-white/5 bg-white/2 rounded text-xs text-slate-600 flex items-center gap-2">
              <ShieldCheck size={13} className="text-slate-600 shrink-0" />
              <span>
                <span className="text-slate-400 font-semibold">Admin?</span>{' '}
                Use your special credentials on either tab — you&apos;ll be routed to the Admin Dashboard automatically.
              </span>
            </div>
          )}

          {/* Firestore DB notice */}
          <div className="flex items-center gap-2 text-xs text-slate-700 pt-1">
            <Lock size={11} />
            <span>Data stored securely in Firebase Firestore. Passwords encrypted server-side.</span>
          </div>

        </div>

        {/* ── Toggle Login / Register ───────────────────────────────────── */}
        <div className="mt-7 text-sm text-slate-500">
          {mode === 'login' ? (
            <>
              Don&apos;t have an account?{' '}
              <button
                onClick={() => { setMode('register'); resetForm(); }}
                className="text-primary hover:text-rose-400 font-semibold transition-colors cursor-pointer"
              >
                Register here
              </button>
            </>
          ) : (
            <>
              Already have an account?{' '}
              <button
                onClick={() => { setMode('login'); resetForm(); }}
                className="text-primary hover:text-rose-400 font-semibold transition-colors cursor-pointer"
              >
                Sign in
              </button>
            </>
          )}
        </div>

      </div>
    </div>
  );
};

export default AuthPage;
