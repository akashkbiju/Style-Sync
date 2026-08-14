import React, { useState } from 'react';
import { useSalon } from '../../context/SalonContext';
import { Eye, EyeOff, Scissors, User, Users, ShieldCheck, ArrowRight, CheckCircle, Lock } from 'lucide-react';

// ─── Seeded Demo Accounts ───────────────────────────────────────────────────
const DEMO_ACCOUNTS = {
  customer: [
    { email: 'sarah@email.com', password: 'sarah123', name: 'Sarah Jenkins', phone: '9876543210' },
    { email: 'priya@email.com', password: 'priya123', name: 'Priya Sharma',  phone: '9123456789' },
  ],
  staff: [
    { email: 'anna@stylesync.com', password: 'anna123', name: 'Anna Kapoor', role: 'Senior Stylist' },
    { email: 'raj@stylesync.com',  password: 'raj123',  name: 'Raj Verma',   role: 'Colorist' },
  ],
};

const ADMIN_CREDENTIALS = {
  email: 'admin@stylesync.com',
  password: 'Admin@2025',
  name: 'Admin — StyleSync',
};

// ─── Utility: random booking-ID-like token ───────────────────────────────────
const uid = () => Math.floor(100000 + Math.random() * 900000).toString();

export const AuthPage = () => {
  // 'login' | 'register'
  const [mode, setMode] = useState('login');
  // 'customer' | 'staff' | 'admin'
  const [selectedRole, setSelectedRole] = useState('customer');
  const [showPw, setShowPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const { loginUser } = useSalon();

  // Form fields
  const [form, setForm] = useState({
    name: '', email: '', phone: '', staffRole: '',
    password: '', confirmPassword: '',
  });

  const set = (field) => (e) => {
    setError('');
    setForm((p) => ({ ...p, [field]: e.target.value }));
  };

  // ── Login ──────────────────────────────────────────────────────────────────
  const handleLogin = () => {
    setError('');
    if (!form.email || !form.password) { setError('Please fill in all fields.'); return; }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);

      // ✅ Admin credentials work from ANY role tab — check first
      if (
        form.email === ADMIN_CREDENTIALS.email &&
        form.password === ADMIN_CREDENTIALS.password
      ) {
        loginUser({ name: ADMIN_CREDENTIALS.name, email: form.email, role: 'admin' });
        return;
      }

      // Regular customer / staff login
      const accounts = DEMO_ACCOUNTS[selectedRole] || [];
      const match = accounts.find(
        (a) => a.email === form.email && a.password === form.password
      );

      // Also check localStorage-registered accounts
      const registered = JSON.parse(localStorage.getItem(`stylesync_${selectedRole}_accounts`) || '[]');
      const regMatch = registered.find(
        (a) => a.email === form.email && a.password === form.password
      );

      const found = match || regMatch;
      if (found) {
        loginUser({ ...found, role: selectedRole });
      } else {
        setError('Invalid email or password. Please try again.');
      }
    }, 800);
  };

  // ── Register ───────────────────────────────────────────────────────────────
  const handleRegister = () => {
    setError('');
    if (!form.name || !form.email || !form.password || !form.confirmPassword)
      { setError('Please fill in all required fields.'); return; }
    if (selectedRole === 'staff' && !form.staffRole)
      { setError('Please enter your staff role / specialisation.'); return; }
    if (form.password.length < 6)
      { setError('Password must be at least 6 characters.'); return; }
    if (form.password !== form.confirmPassword)
      { setError('Passwords do not match.'); return; }

    const key = `stylesync_${selectedRole}_accounts`;
    const existing = JSON.parse(localStorage.getItem(key) || '[]');
    if (existing.find((a) => a.email === form.email))
      { setError('An account with this email already exists.'); return; }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      const newUser = {
        id: uid(),
        name: form.name,
        email: form.email,
        phone: form.phone,
        password: form.password,
        role: selectedRole,
        ...(selectedRole === 'staff' && { staffRole: form.staffRole }),
      };
      localStorage.setItem(key, JSON.stringify([...existing, newUser]));
      setSuccess('Account created successfully! You can now log in.');
      setMode('login');
      setForm({ name: '', email: '', phone: '', staffRole: '', password: '', confirmPassword: '' });
    }, 900);
  };

  const submit = mode === 'login' ? handleLogin : handleRegister;

  const roleConfig = {
    customer: {
      icon: <User size={20} />,
      label: 'Customer',
      hint: mode === 'login'
        ? 'Customer demo: sarah@email.com / sarah123  •  Admin: use your special ID here'
        : 'Create your personal Style Sync account',
      color: 'from-pink-600 to-rose-700',
    },
    staff: {
      icon: <Scissors size={20} />,
      label: 'Staff / Stylist',
      hint: mode === 'login'
        ? 'Staff demo: anna@stylesync.com / anna123  •  Admin: use your special ID here'
        : 'Register as a certified StyleSync stylist',
      color: 'from-violet-600 to-purple-700',
    },
  };

  const currentRole = roleConfig[selectedRole] || roleConfig.customer;

  return (
    <div className="min-h-screen w-full bg-black flex items-stretch overflow-hidden">

      {/* ── Left Panel: Branding ─────────────────────────────────────── */}
      <div className="hidden lg:flex lg:w-1/2 relative flex-col justify-between p-14 overflow-hidden">

        {/* Geometric accents */}
        <div className="geometric-accent w-96 h-96 rotate-45 -left-32 -top-16" />
        <div className="geometric-accent w-64 h-64 rotate-[20deg] -left-8 top-1/3" />
        <div className="geometric-accent w-48 h-48 rotate-12 left-24 top-1/2" />

        {/* Model image */}
        <div className="absolute inset-0 z-0">
          <img
            src="/hero_model.png"
            alt="Style Sync fashion"
            className="w-full h-full object-cover object-top opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/60 to-transparent" />
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

          {/* Feature pills */}
          <div className="flex flex-wrap gap-2 mt-4">
            {['Smart Booking', 'Elderly Home Visits', 'AI Chatbot', 'Online Payments'].map(f => (
              <span key={f} className="flex items-center gap-1.5 px-3 py-1 border border-white/10 text-xs text-slate-300 rounded-full">
                <CheckCircle size={12} className="text-primary" /> {f}
              </span>
            ))}
          </div>
        </div>

        {/* Bottom quote */}
        <p className="relative z-10 text-xs text-slate-600 tracking-widest uppercase">
          © 2025 Style Sync — All Rights Reserved
        </p>
      </div>

      {/* ── Right Panel: Auth Form ───────────────────────────────────── */}
      <div className="flex-1 flex flex-col justify-center px-6 sm:px-12 lg:px-16 py-10 relative overflow-y-auto">

        {/* Mobile logo */}
        <div className="flex lg:hidden items-center gap-2 mb-8">
          <Scissors size={24} className="text-primary" />
          <span className="font-display text-2xl font-bold">
            <span className="text-primary">Style</span>{' '}
            <span className="text-white">Sync</span>
          </span>
        </div>

        {/* Header */}
        <div className="mb-8">
          <h1 className="font-display text-4xl font-bold text-white mb-1">
            {mode === 'login' ? 'Welcome Back' : 'Create Account'}
          </h1>
          <p className="text-slate-400 text-sm">
            {mode === 'login'
              ? 'Sign in to continue to your dashboard'
              : 'Join the Style Sync platform today'}
          </p>
        </div>

        {/* ── Role Selector ──────────────────────────────────────────── */}
        <div className="grid grid-cols-2 gap-3 mb-8">
          {['customer', 'staff'].map((role) => {
            const rc = roleConfig[role];
            const isActive = selectedRole === role;
            return (
              <button
                key={role}
                onClick={() => { setSelectedRole(role); setError(''); setSuccess(''); }}
                className={`flex flex-col items-center gap-2 py-4 px-2 border transition-all duration-200 cursor-pointer rounded
                  ${isActive
                    ? 'border-primary bg-primary/10 text-primary shadow-[0_0_15px_rgba(225,29,72,0.3)]'
                    : 'border-white/10 text-slate-400 hover:border-white/30 hover:text-white bg-white/3'
                  }`}
              >
                {rc.icon}
                <span className="text-xs font-semibold uppercase tracking-wider leading-none text-center">
                  {rc.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Role hint */}
        <p className="text-xs text-slate-500 mb-6 -mt-4 px-1 italic">
          {currentRole.hint}
        </p>


        {/* ── Form ───────────────────────────────────────────────────── */}
        <div className="space-y-4 w-full max-w-md">

          {/* Full Name (register only) */}
          {mode === 'register' && selectedRole !== 'admin' && (
            <div className="form-group mb-0">
              <label className="form-label">Full Name *</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Priya Sharma"
                value={form.name}
                onChange={set('name')}
              />
            </div>
          )}

          {/* Phone (register + customer) */}
          {mode === 'register' && selectedRole === 'customer' && (
            <div className="form-group mb-0">
              <label className="form-label">Phone Number</label>
              <input
                type="tel"
                className="form-input"
                placeholder="e.g. 9876543210"
                value={form.phone}
                onChange={set('phone')}
              />
            </div>
          )}

          {/* Staff Role (register + staff) */}
          {mode === 'register' && selectedRole === 'staff' && (
            <div className="form-group mb-0">
              <label className="form-label">Specialisation / Role *</label>
              <select className="form-select" value={form.staffRole} onChange={set('staffRole')}>
                <option value="">-- Select your role --</option>
                <option>Senior Stylist</option>
                <option>Colorist</option>
                <option>Hair Therapist</option>
                <option>Nail Artist</option>
                <option>Spa Therapist</option>
                <option>Makeup Artist</option>
                <option>Receptionist</option>
              </select>
            </div>
          )}

          {/* Email */}
          <div className="form-group mb-0">
            <label className="form-label">Email Address *</label>
            <input
              type="email"
              className="form-input"
              placeholder={
                selectedRole === 'admin' ? 'admin@stylesync.com' : 'you@example.com'
              }
              value={form.email}
              onChange={set('email')}
              onKeyDown={(e) => e.key === 'Enter' && submit()}
            />
          </div>

          {/* Password */}
          <div className="form-group mb-0">
            <label className="form-label">Password *</label>
            <div className="relative">
              <input
                type={showPw ? 'text' : 'password'}
                className="form-input pr-12"
                placeholder={mode === 'login' ? '••••••••' : 'Min. 6 characters'}
                value={form.password}
                onChange={set('password')}
                onKeyDown={(e) => e.key === 'Enter' && submit()}
              />
              <button
                type="button"
                onClick={() => setShowPw(!showPw)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Confirm Password (register only) */}
          {mode === 'register' && selectedRole !== 'admin' && (
            <div className="form-group mb-0">
              <label className="form-label">Confirm Password *</label>
              <div className="relative">
                <input
                  type={showConfirmPw ? 'text' : 'password'}
                  className="form-input pr-12"
                  placeholder="Re-enter password"
                  value={form.confirmPassword}
                  onChange={set('confirmPassword')}
                  onKeyDown={(e) => e.key === 'Enter' && submit()}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPw(!showConfirmPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  {showConfirmPw ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
          )}

          {/* Error / Success Messages */}
          {error && (
            <div className="p-3 border border-primary/50 bg-primary/10 rounded text-sm text-rose-300 flex items-start gap-2">
              <span className="text-primary mt-0.5">⚠</span> {error}
            </div>
          )}
          {success && (
            <div className="p-3 border border-green-500/40 bg-green-500/10 rounded text-sm text-green-300 flex items-start gap-2">
              <CheckCircle size={16} className="text-green-400 mt-0.5 shrink-0" /> {success}
            </div>
          )}

          {/* Submit Button */}
          <button
            onClick={submit}
            disabled={loading}
            className="btn-red-neon w-full justify-between mt-2"
          >
            <span>
              {loading
                ? 'Please wait…'
                : mode === 'login'
                  ? `Sign In as ${currentRole.label}`
                  : `Create Account`}
            </span>
            {!loading && <ArrowRight size={18} />}
          </button>

          {/* Admin Tip */}
          <div className="mt-1 p-3 border border-white/5 bg-white/2 rounded text-xs text-slate-500 flex items-center gap-2">
            <ShieldCheck size={14} className="text-slate-600" />
            <span>Admins: Use your credentials in the staff portal.</span>
          </div>
        </div>

        {/* ── Toggle mode ───────────────────────────────────────────── */}
        <div className="mt-8 text-sm text-slate-500">
          {mode === 'login' ? (
            <>
              Don&apos;t have an account?{' '}
              <button
                onClick={() => { setMode('register'); setError(''); setSuccess(''); }}
                className="text-primary hover:text-rose-400 font-semibold transition-colors cursor-pointer"
              >
                Register here
              </button>
            </>
          ) : (
            <>
              Already have an account?{' '}
              <button
                onClick={() => { setMode('login'); setError(''); setSuccess(''); }}
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
