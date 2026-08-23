import React, { useState } from 'react';
import { useSalon } from '../../context/SalonContext';
import {
  Eye, EyeOff, Scissors, User,
  ArrowRight, CheckCircle, Lock, AlertCircle
} from 'lucide-react';
import {
  firebaseRegister,
  firebaseLogin,
  validateEmail,
  validatePhone,
  validatePassword,
  passwordStrength,
} from '../../firebase/authService';

// ─── Admin Master Credentials ───────────────────────────────────────────────
const ADMIN = {
  email:    'admin@stylesync.com',
  password: 'Admin@2025',
  name:     'Admin — StyleSync',
};

// ─── Validation: run all rules, return array of error strings ──────────────────
const runValidations = ({ mode, role, form }) => {
  const errors = {};

  // ── Email ──────────────────────────────────────────────────────────────
  if (!form.email.trim()) {
    errors.email = 'Email address is required.';
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

    // ── Phone (customer only) ────────────────────────────────────
    if (role === 'customer' && form.phone) {
      if (!validatePhone(form.phone)) {
        errors.phone = 'Enter a valid 10-digit Indian mobile number (starts with 6-9).';
      }
    }

    // ── Staff Role ───────────────────────────────────────────────────────
    if (role === 'staff' && !form.staffRole) {
      errors.staffRole = 'Please select your specialization.';
    }
  }

  return errors;
};

// ─── Password Strength Meter Component ────────────────────────────────────────
const StrengthMeter = ({ password }) => {
  if (!password) return null;
  const s = passwordStrength(password);
  return (
    <div className="mt-2 space-y-1">
      <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: s.width, backgroundColor: s.color }}
        />
      </div>
      <div className="flex items-center justify-between text-xs">
        <span className="text-slate-400">Security Strength:</span>
        <span className="font-semibold" style={{ color: s.color }}>{s.label}</span>
      </div>
    </div>
  );
};

// ─── Field Error Component ─────────────────────────────────────────────────────
const FieldError = ({ msg }) =>
  msg ? (
    <p className="flex items-center gap-1.5 text-xs text-rose-400 mt-1.5 font-medium">
      <AlertCircle size={13} className="shrink-0" /> {msg}
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
      case 'auth/invalid-credential':      return 'Invalid email or password. Please verify your credentials.';
      case 'auth/too-many-requests':       return 'Too many failed attempts. Please try again later.';
      case 'auth/network-request-failed':  return 'Network error. Please check your internet connection.';
      case 'auth/operation-not-allowed':   return 'Email/Password sign-in is disabled in Firebase Console.';
      default:                             return msg || 'Authentication failed. Please check your details.';
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
      // 1. Admin master login
      if (isAdminCredential(form.email, form.password)) {
        loginUser({ name: ADMIN.name, email: ADMIN.email, role: 'admin' });
        return;
      }

      // 2. Firebase Auth login
      const user = await firebaseLogin(form.email, form.password);

      // 3. Role verification
      if (user.role !== selectedRole) {
        setGlobalError(
          `This account is registered as "${user.role.toUpperCase()}". Please switch to the "${user.role}" tab.`
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
      await firebaseRegister({
        name:      form.name,
        email:     form.email,
        password:  form.password,
        phone:     form.phone,
        role:      selectedRole,
        staffRole: form.staffRole,
      });
      setSuccess('Account created successfully! Please sign in with your credentials.');
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
        ? 'Sign in to book in-shop & home salon appointments'
        : 'Create your personal StyleSync customer account',
    },
    staff: {
      icon:  <Scissors size={20} />,
      label: 'Staff / Stylist',
      hint:  mode === 'login'
        ? 'Sign in to manage your appointments & schedule'
        : 'Register as a certified StyleSync salon specialist',
    },
  };
  const currentRole = roleConfig[selectedRole] || roleConfig.customer;

  return (
    <div className="min-h-screen w-full bg-black flex items-stretch overflow-hidden">

      {/* ── Left Panel: Luxury High-Fashion Branding ──────────────────────── */}
      <div className="hidden lg:flex lg:w-[45%] relative flex-col justify-between p-14 overflow-hidden border-r border-white/10">

        <div className="geometric-accent w-96 h-96 rotate-45 -left-32 -top-16" />
        <div className="geometric-accent w-64 h-64 rotate-[20deg] -left-8 top-1/3" />
        <div className="geometric-accent w-48 h-48 rotate-12 left-24 top-1/2" />

        <div className="absolute inset-0 z-0">
          <img
            src="/hero_model.png"
            alt="Style Sync luxury fashion"
            className="w-full h-full object-cover object-top opacity-35"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent" />
        </div>

        {/* Brand Logo */}
        <div className="relative z-10">
          <div className="flex items-center gap-2.5 mb-2">
            <div className="w-10 h-10 rounded-lg bg-primary/20 border border-primary flex items-center justify-center shadow-[0_0_15px_rgba(225,29,72,0.4)]">
              <Scissors size={22} className="text-primary" />
            </div>
            <span className="font-display text-3xl font-bold tracking-tight">
              <span className="text-primary">Style</span>{' '}
              <span className="text-white">Sync</span>
            </span>
          </div>
          <p className="text-slate-400 text-xs tracking-widest uppercase font-medium pl-0.5">
            Luxury Salon Management & Care System
          </p>
        </div>

        {/* Tagline & Feature Highlights */}
        <div className="relative z-10 space-y-6">
          <h2 className="font-display text-5xl font-bold text-white leading-[1.15] uppercase tracking-tight">
            Luxury<br />
            <span className="text-primary text-glow">Reimagined</span><br />
            For Modern<br />Salons.
          </h2>
          <p className="text-slate-300 text-sm max-w-sm leading-relaxed">
            Automate in-shop bookings, staff rosters, digital billing, and specialized elderly home visits.
          </p>
          <div className="flex flex-wrap gap-2 pt-2">
            {['In-Shop Booking', 'Elderly At-Home Care', 'AI Salon Bot', 'Digital Billing'].map((f) => (
              <span key={f} className="flex items-center gap-1.5 px-3.5 py-1.5 border border-white/15 bg-white/5 backdrop-blur-md text-xs text-slate-200 rounded-full font-medium shadow-sm">
                <CheckCircle size={13} className="text-primary" /> {f}
              </span>
            ))}
          </div>
        </div>

        {/* Security & Database Status */}
        <div className="relative z-10 flex items-center gap-2.5 text-xs text-slate-400 border-t border-white/10 pt-4">
          <Lock size={14} className="text-primary shrink-0" />
          <span>Cloud Database connected with secure server-side password encryption.</span>
        </div>
      </div>

      {/* ── Right Panel: Auth Form Container ──────────────────────────────── */}
      <div className="flex-1 flex flex-col justify-center px-6 sm:px-12 lg:px-16 py-10 overflow-y-auto bg-gradient-to-b from-black via-zinc-950 to-black">

        {/* Mobile Header Logo */}
        <div className="flex lg:hidden items-center gap-2.5 mb-6">
          <div className="w-8 h-8 rounded bg-primary/20 border border-primary flex items-center justify-center">
            <Scissors size={18} className="text-primary" />
          </div>
          <span className="font-display text-2xl font-bold">
            <span className="text-primary">Style</span>{' '}
            <span className="text-white">Sync</span>
          </span>
        </div>

        {/* Heading & Subtitle */}
        <div className="mb-6 max-w-md w-full">
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-white mb-1.5 tracking-tight">
            {mode === 'login' ? 'Welcome Back' : 'Create Account'}
          </h1>
          <p className="text-slate-400 text-sm">
            {mode === 'login'
              ? 'Sign in to access your customized dashboard'
              : 'Register to start booking and managing appointments'}
          </p>
        </div>

        {/* ── Role Selector Tabs ────────────────────────────────────────── */}
        <div className="max-w-md w-full mb-5">
          <div className="grid grid-cols-2 gap-3">
            {['customer', 'staff'].map((role) => {
              const rc = roleConfig[role];
              const isActive = selectedRole === role;
              return (
                <button
                  key={role}
                  type="button"
                  onClick={() => { setSelectedRole(role); resetForm(); }}
                  className={`flex flex-col items-center gap-2 py-3.5 px-3 border rounded transition-all duration-200 cursor-pointer text-center
                    ${isActive
                      ? 'border-primary bg-primary/10 text-primary shadow-[0_0_18px_rgba(225,29,72,0.25)] font-bold'
                      : 'border-white/10 bg-white/2 text-slate-400 hover:border-white/25 hover:text-slate-200'
                    }`}
                >
                  <div className={isActive ? 'text-primary' : 'text-slate-400'}>{rc.icon}</div>
                  <span className="text-xs uppercase tracking-wider font-semibold">
                    {rc.label}
                  </span>
                </button>
              );
            })}
          </div>
          <p className="text-xs text-slate-400 mt-2 px-1 italic">{currentRole.hint}</p>
        </div>

        {/* ── Form Fields Container ──────────────────────────────────────── */}
        <div className="space-y-4 w-full max-w-md">

          {/* Full Name — Register Only */}
          {mode === 'register' && (
            <div>
              <label className="form-label">
                Full Name <span className="text-primary">*</span>
              </label>
              <input
                type="text"
                className={`form-input mt-1 ${fieldErrors.name ? 'border-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.25)]' : ''}`}
                placeholder="Enter your full name"
                value={form.name}
                onChange={setField('name')}
                onKeyDown={(e) => e.key === 'Enter' && submit()}
              />
              <FieldError msg={fieldErrors.name} />
            </div>
          )}

          {/* Email Address */}
          <div>
            <label className="form-label">
              Email Address <span className="text-primary">*</span>
            </label>
            <input
              type="email"
              className={`form-input mt-1 ${fieldErrors.email ? 'border-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.25)]' : ''}`}
              placeholder="Enter your email address"
              value={form.email}
              onChange={setField('email')}
              onKeyDown={(e) => e.key === 'Enter' && submit()}
            />
            <FieldError msg={fieldErrors.email} />
            {form.email && !fieldErrors.email && validateEmail(form.email) && (
              <p className="text-xs text-green-400 mt-1.5 flex items-center gap-1">
                <CheckCircle size={12} /> Valid email format
              </p>
            )}
          </div>

          {/* Phone Number — Customer Register */}
          {mode === 'register' && selectedRole === 'customer' && (
            <div>
              <label className="form-label">
                Mobile Number <span className="text-slate-400 font-normal">(10-digit Indian Mobile)</span>
              </label>
              <input
                type="tel"
                className={`form-input mt-1 ${fieldErrors.phone ? 'border-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.25)]' : ''}`}
                placeholder="Enter 10-digit mobile number"
                maxLength={10}
                value={form.phone}
                onChange={setField('phone')}
                onKeyDown={(e) => e.key === 'Enter' && submit()}
              />
              <FieldError msg={fieldErrors.phone} />
              {form.phone && validatePhone(form.phone) && (
                <p className="text-xs text-green-400 mt-1.5 flex items-center gap-1">
                  <CheckCircle size={12} /> Valid 10-digit mobile number
                </p>
              )}
            </div>
          )}

          {/* Staff Specialization — Staff Register */}
          {mode === 'register' && selectedRole === 'staff' && (
            <div>
              <label className="form-label">
                Specialization / Role <span className="text-primary">*</span>
              </label>
              <select
                className={`form-select mt-1 ${fieldErrors.staffRole ? 'border-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.25)]' : ''}`}
                value={form.staffRole}
                onChange={setField('staffRole')}
              >
                <option value="">-- Select your specialization --</option>
                <option value="Senior Master Stylist">Senior Master Stylist & Hair Care</option>
                <option value="Senior Ayur-Therapist & Elderly Care Specialist">Senior Ayur-Therapist & Elderly Care</option>
                <option value="Precision Grooming Specialist">Precision Grooming & Shaving</option>
                <option value="Senior Skincare & Reflexology Specialist">Senior Skincare & Facial Therapy</option>
                <option value="Colorist & Hair Artist">Colorist & Hair Artist</option>
                <option value="Nail & Pedicure Spa Specialist">Nail & Pedicure Spa Specialist</option>
              </select>
              <FieldError msg={fieldErrors.staffRole} />
            </div>
          )}

          {/* Password Field */}
          <div>
            <label className="form-label">
              Password <span className="text-primary">*</span>
              {mode === 'register' && (
                <span className="text-slate-400 font-normal text-xs ml-1">(min 8 chars, uppercase, number & symbol)</span>
              )}
            </label>
            <div className="relative mt-1">
              <input
                type={showPw ? 'text' : 'password'}
                className={`form-input pr-11 ${fieldErrors.password ? 'border-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.25)]' : ''}`}
                placeholder="Enter your password"
                value={form.password}
                onChange={setField('password')}
                onKeyDown={(e) => e.key === 'Enter' && submit()}
              />
              <button
                type="button"
                onClick={() => setShowPw(!showPw)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors cursor-pointer p-1"
                aria-label={showPw ? 'Hide password' : 'Show password'}
              >
                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            <FieldError msg={fieldErrors.password} />
            {mode === 'register' && <StrengthMeter password={form.password} />}
          </div>

          {/* Confirm Password — Register Only */}
          {mode === 'register' && (
            <div>
              <label className="form-label">
                Confirm Password <span className="text-primary">*</span>
              </label>
              <div className="relative mt-1">
                <input
                  type={showConfirmPw ? 'text' : 'password'}
                  className={`form-input pr-11 ${fieldErrors.confirmPassword ? 'border-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.25)]' : ''}`}
                  placeholder="Confirm your password"
                  value={form.confirmPassword}
                  onChange={setField('confirmPassword')}
                  onKeyDown={(e) => e.key === 'Enter' && submit()}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPw(!showConfirmPw)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors cursor-pointer p-1"
                  aria-label={showConfirmPw ? 'Hide password' : 'Show password'}
                >
                  {showConfirmPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              <FieldError msg={fieldErrors.confirmPassword} />
              {form.confirmPassword && form.password === form.confirmPassword && !fieldErrors.confirmPassword && (
                <p className="text-xs text-green-400 mt-1.5 flex items-center gap-1">
                  <CheckCircle size={12} /> Passwords match perfectly
                </p>
              )}
            </div>
          )}

          {/* Password Requirements Checklist — Register Only */}
          {mode === 'register' && (
            <div className="p-3 border border-white/10 bg-white/2 rounded text-xs text-slate-400 space-y-1 mt-2">
              {[
                { rule: 'At least 8 characters long',       ok: form.password.length >= 8 },
                { rule: 'At least one uppercase letter (A-Z)', ok: /[A-Z]/.test(form.password) },
                { rule: 'At least one numeric digit (0-9)',   ok: /[0-9]/.test(form.password) },
                { rule: 'At least one special character (@, #, !…)', ok: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(form.password) },
              ].map(({ rule, ok }) => (
                <p key={rule} className={`flex items-center gap-1.5 ${ok ? 'text-green-400 font-medium' : 'text-slate-400'}`}>
                  {ok ? <CheckCircle size={12} className="text-green-400" /> : <span className="w-2.5 h-2.5 rounded-full border border-slate-600 inline-block" />}
                  {rule}
                </p>
              ))}
            </div>
          )}

          {/* Global Alert Messages */}
          {globalError && (
            <div className="p-3 border border-primary/50 bg-primary/10 rounded text-sm text-rose-300 flex items-start gap-2.5">
              <AlertCircle size={16} className="text-primary mt-0.5 shrink-0" />
              <span>{globalError}</span>
            </div>
          )}
          {success && (
            <div className="p-3 border border-green-500/40 bg-green-500/10 rounded text-sm text-green-300 flex items-center gap-2.5">
              <CheckCircle size={16} className="text-green-400 shrink-0" />
              <span>{success}</span>
            </div>
          )}

          {/* Primary Action Button */}
          <button
            type="button"
            onClick={submit}
            disabled={loading}
            className="btn-red-neon w-full justify-between mt-2 cursor-pointer disabled:opacity-50"
          >
            <span>
              {loading
                ? (mode === 'login' ? 'Signing in…' : 'Creating Account…')
                : mode === 'login'
                  ? `Sign In as ${currentRole.label}`
                  : `Register as ${currentRole.label}`}
            </span>
            {!loading && <ArrowRight size={18} />}
          </button>

        </div>

        {/* ── Toggle Login / Register ───────────────────────────────────── */}
        <div className="mt-7 text-sm text-slate-400 max-w-md w-full">
          {mode === 'login' ? (
            <>
              Don&apos;t have an account yet?{' '}
              <button
                type="button"
                onClick={() => { setMode('register'); resetForm(); }}
                className="text-primary hover:text-rose-400 font-semibold transition-colors cursor-pointer underline underline-offset-4"
              >
                Register here
              </button>
            </>
          ) : (
            <>
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => { setMode('login'); resetForm(); }}
                className="text-primary hover:text-rose-400 font-semibold transition-colors cursor-pointer underline underline-offset-4"
              >
                Sign in here
              </button>
            </>
          )}
        </div>

      </div>
    </div>
  );
};

export default AuthPage;

