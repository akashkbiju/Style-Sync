import React, { useState, useEffect } from 'react';
import { useSalon } from '../context/SalonContext';
import { 
  User, 
  UserCheck, 
  ShieldCheck, 
  LogOut,
  ChevronDown,
  Scissors,
  Calendar,
  BookOpen,
  Home,
  LayoutGrid,
  Settings,
  CreditCard,
  MessageSquare,
  HeartHandshake,
  Users,
  Sun,
  Moon,
  Menu,
  X,
  PhoneCall,
  Sparkles
} from 'lucide-react';

export const Navbar = () => {
  const { 
    activeRole,
    customerTab, 
    setCustomerTab,
    adminTab,
    setAdminTab,
    currentUser,
    logoutUser,
    theme,
    toggleTheme
  } = useSalon();

  const [showUserMenu, setShowUserMenu] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Close mobile drawer on escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setMobileMenuOpen(false);
        setShowUserMenu(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Prevent background scroll when mobile drawer is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [mobileMenuOpen]);

  const roleLabel = activeRole === 'admin' ? 'Admin' : activeRole === 'staff' ? 'Staff' : 'Customer';
  const roleBadgeClass =
    activeRole === 'admin'
      ? 'bg-rose-950/80 text-rose-300 border-primary shadow-[0_0_10px_rgba(225,29,72,0.3)]'
      : activeRole === 'staff'
      ? 'bg-violet-950/80 text-violet-300 border-violet-600/60 shadow-[0_0_10px_rgba(139,92,246,0.3)]'
      : 'bg-primary/10 text-primary border-primary/40 shadow-[0_0_10px_rgba(225,29,72,0.2)]';

  // Customer nav items
  const customerNavItems = [
    { key: 'home',         label: 'Home',         icon: <Home size={14} /> },
    { key: 'catalog',      label: 'Services',      icon: <BookOpen size={14} /> },
    { key: 'book-inshop',  label: 'Book Salon',    icon: <Calendar size={14} /> },
    { key: 'book-home',    label: 'Elderly & Home', icon: <HeartHandshake size={14} />, highlight: true },
    { key: 'my-bookings',  label: 'My Bookings',   icon: <LayoutGrid size={14} /> },
  ];

  // Admin nav items
  const adminNavItems = [
    { key: 'dashboard',     label: 'Dashboard',      icon: <LayoutGrid size={14} /> },
    { key: 'home-requests', label: 'Home Requests',  icon: <HeartHandshake size={14} /> },
    { key: 'services',      label: 'Services',       icon: <Settings size={14} /> },
    { key: 'staff',         label: 'Staff',          icon: <Users size={14} /> },
    { key: 'payments',      label: 'Payments',       icon: <CreditCard size={14} /> },
    { key: 'feedback',      label: 'Feedback',       icon: <MessageSquare size={14} /> },
  ];

  const handleNavClick = (tabKey) => {
    if (activeRole === 'customer') {
      setCustomerTab(tabKey);
    } else if (activeRole === 'admin') {
      setAdminTab(tabKey);
    }
    setMobileMenuOpen(false);
  };

  return (
    <>
      <nav 
        className="fixed w-full z-50 top-0 left-0 border-b transition-colors duration-300"
        style={{
          backgroundColor: 'var(--nav-bg)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          borderColor: 'var(--border-subtle)'
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between gap-4">
          
          {/* ── Logo ─────────────────────────────────────────── */}
          <div 
            className="flex items-center gap-2 cursor-pointer group shrink-0"
            onClick={() => {
              if (activeRole === 'customer') setCustomerTab('home');
              if (activeRole === 'admin') setAdminTab('dashboard');
              setMobileMenuOpen(false);
            }}
          >
            <Scissors size={22} className="text-primary -rotate-45 group-hover:rotate-0 transition-transform duration-300" />
            <span className="font-display text-2xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
              <span className="text-primary text-glow">Style</span> Sync
            </span>
          </div>

          {/* ── Desktop Nav Links ────────────────────────────── */}
          <div className="hidden lg:flex items-center space-x-7 text-[11px] font-semibold tracking-[0.16em] uppercase overflow-x-auto">

            {/* Customer links */}
            {activeRole === 'customer' && customerNavItems.map(({ key, label, icon, highlight }) => (
              <button
                key={key}
                onClick={() => handleNavClick(key)}
                className={`flex items-center gap-1.5 py-1.5 transition-all cursor-pointer relative whitespace-nowrap
                  ${customerTab === key
                    ? 'text-primary text-glow font-bold after:content-[\'\'] after:absolute after:-bottom-2.5 after:left-0 after:w-full after:h-[2px] after:bg-primary after:shadow-[0_0_12px_rgba(225,29,72,0.9)]'
                    : highlight
                    ? 'text-purple-400 hover:text-purple-300 font-bold'
                    : 'text-slate-400 hover:text-[var(--text-primary)]'
                  }`}
              >
                {icon}{label}
                {highlight && (
                  <span className="ml-0.5 px-1.5 py-0.2 bg-purple-500/20 text-purple-300 rounded text-[9px] lowercase font-normal border border-purple-500/30">
                    care
                  </span>
                )}
              </button>
            ))}

            {/* Staff — single indicator */}
            {activeRole === 'staff' && (
              <span className="flex items-center gap-1.5 text-primary font-bold text-glow">
                <UserCheck size={14} /> Staff Assigned Portal
              </span>
            )}

            {/* Admin links */}
            {activeRole === 'admin' && adminNavItems.map(({ key, label, icon }) => (
              <button
                key={key}
                onClick={() => handleNavClick(key)}
                className={`flex items-center gap-1.5 py-1.5 transition-all cursor-pointer relative whitespace-nowrap
                  ${adminTab === key
                    ? 'text-primary text-glow font-bold after:content-[\'\'] after:absolute after:-bottom-2.5 after:left-0 after:w-full after:h-[2px] after:bg-primary after:shadow-[0_0_12px_rgba(225,29,72,0.9)]'
                    : 'text-slate-400 hover:text-[var(--text-primary)]'
                  }`}
              >
                {icon}{label}
              </button>
            ))}
          </div>

          {/* ── Right Controls: Theme Toggle + User Account + Hamburger Button ── */}
          <div className="flex items-center gap-3 shrink-0">
            
            {/* Theme Switcher Toggle Button */}
            <button
              onClick={toggleTheme}
              className="theme-toggle-btn"
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              aria-label="Toggle Dark/Light Mode"
            >
              {theme === 'dark' ? (
                <Sun size={17} className="text-amber-400 hover:rotate-90 transition-transform duration-300" />
              ) : (
                <Moon size={17} className="text-indigo-600 hover:-rotate-12 transition-transform duration-300" />
              )}
            </button>

            {/* User Account Button (Desktop & Tablet) */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="hidden sm:flex items-center gap-2 px-3.5 py-2 border text-xs font-bold uppercase tracking-widest transition-all duration-200 cursor-pointer"
                style={{
                  borderColor: 'var(--border-strong)',
                  color: 'var(--text-primary)',
                  backgroundColor: 'var(--bg-glass)'
                }}
              >
                {/* Role icon avatar */}
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold uppercase text-white
                  ${activeRole === 'admin' ? 'bg-rose-600' : activeRole === 'staff' ? 'bg-violet-600' : 'bg-primary'}`}
                >
                  {currentUser?.name?.charAt(0) || 'U'}
                </span>
                <span className="max-w-[100px] truncate">
                  {currentUser?.name?.split(' ')[0] || 'Account'}
                </span>
                <ChevronDown size={12} className={`transition-transform duration-200 ${showUserMenu ? 'rotate-180' : ''}`} />
              </button>

              {/* Desktop User Dropdown */}
              {showUserMenu && (
                <div 
                  className="absolute right-0 top-full mt-2 w-64 border shadow-[0_10px_40px_rgba(0,0,0,0.6)] z-50 rounded-sm"
                  style={{
                    backgroundColor: 'var(--dropdown-bg)',
                    borderColor: 'var(--border-subtle)',
                    color: 'var(--text-primary)'
                  }}
                >
                  
                  {/* User info */}
                  <div className="px-5 py-4 border-b" style={{ borderColor: 'var(--border-subtle)' }}>
                    <div className="flex items-center gap-3 mb-2">
                      <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white uppercase
                        ${activeRole === 'admin' ? 'bg-rose-600' : activeRole === 'staff' ? 'bg-violet-600' : 'bg-primary'}`}
                      >
                        {currentUser?.name?.charAt(0) || 'U'}
                      </div>
                      <div className="overflow-hidden">
                        <p className="text-sm font-bold leading-tight truncate max-w-[150px]" style={{ color: 'var(--text-primary)' }}>
                          {currentUser?.name}
                        </p>
                        <p className="text-[11px] truncate max-w-[150px]" style={{ color: 'var(--text-secondary)' }}>
                          {currentUser?.email}
                        </p>
                      </div>
                    </div>
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest border ${roleBadgeClass}`}>
                      {activeRole === 'admin' && <ShieldCheck size={10} />}
                      {activeRole === 'staff' && <UserCheck size={10} />}
                      {activeRole === 'customer' && <User size={10} />}
                      {roleLabel} · Logged In
                    </span>
                  </div>

                  {/* Account details */}
                  {currentUser?.phone && (
                    <div className="px-5 py-2.5 border-b text-[11px]" style={{ borderColor: 'var(--border-subtle)', color: 'var(--text-secondary)' }}>
                      📞 {currentUser.phone}
                    </div>
                  )}
                  {currentUser?.staffRole && (
                    <div className="px-5 py-2.5 border-b text-[11px]" style={{ borderColor: 'var(--border-subtle)', color: 'var(--text-secondary)' }}>
                      ✂️ {currentUser.staffRole}
                    </div>
                  )}

                  {/* Sign Out */}
                  <button
                    onClick={() => { logoutUser(); setShowUserMenu(false); }}
                    className="w-full flex items-center gap-2.5 px-5 py-3.5 text-xs uppercase tracking-widest font-bold text-rose-500 hover:bg-primary hover:text-white transition-all duration-200 cursor-pointer"
                  >
                    <LogOut size={14} />
                    Sign Out
                  </button>
                </div>
              )}
            </div>

            {/* ── Mobile & Tablet Hamburger Toggle Button ── */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`hamburger-btn ${mobileMenuOpen ? 'active' : ''}`}
              aria-label="Toggle Mobile Menu"
            >
              <span></span>
              <span></span>
              <span></span>
            </button>

          </div>

        </div>
      </nav>

      {/* ── Mobile Hamburger Drawer Backdrop ────────────────── */}
      <div 
        className={`hamburger-backdrop ${mobileMenuOpen ? 'open' : ''}`}
        onClick={() => setMobileMenuOpen(false)}
      />

      {/* ── Mobile Hamburger Drawer ─────────────────────────── */}
      <aside 
        className={`hamburger-drawer ${mobileMenuOpen ? 'open' : ''}`}
        aria-hidden={!mobileMenuOpen}
      >
        {/* Drawer Header */}
        <div className="p-5 border-b flex items-center justify-between" style={{ borderColor: 'var(--border-subtle)' }}>
          <div className="flex items-center gap-2">
            <Scissors size={20} className="text-primary -rotate-45" />
            <span className="font-display text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
              <span className="text-primary">Style</span> Sync
            </span>
          </div>
          <button 
            onClick={() => setMobileMenuOpen(false)}
            className="p-1 rounded text-slate-400 hover:text-[var(--text-primary)] transition-colors cursor-pointer"
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>

        {/* User Card inside Drawer */}
        <div className="p-5 border-b" style={{ borderColor: 'var(--border-subtle)', background: 'var(--bg-glass)' }}>
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white uppercase shrink-0
              ${activeRole === 'admin' ? 'bg-rose-600' : activeRole === 'staff' ? 'bg-violet-600' : 'bg-primary'}`}
            >
              {currentUser?.name?.charAt(0) || 'U'}
            </div>
            <div className="overflow-hidden flex-1">
              <p className="text-sm font-bold leading-tight truncate" style={{ color: 'var(--text-primary)' }}>
                {currentUser?.name || 'Valued Client'}
              </p>
              <p className="text-[11px] truncate" style={{ color: 'var(--text-secondary)' }}>
                {currentUser?.email}
              </p>
            </div>
          </div>
          <div className="mt-3 flex items-center justify-between">
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider border rounded-full ${roleBadgeClass}`}>
              {roleLabel} View
            </span>
            <button
              onClick={toggleTheme}
              className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded border cursor-pointer"
              style={{ borderColor: 'var(--border-subtle)', color: 'var(--text-secondary)' }}
            >
              {theme === 'dark' ? <Sun size={12} className="text-amber-400" /> : <Moon size={12} className="text-indigo-500" />}
              {theme === 'dark' ? 'Light' : 'Dark'}
            </button>
          </div>
        </div>

        {/* Drawer Nav Links */}
        <div className="p-4 flex-1 space-y-1.5">
          <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-[0.2em]" style={{ color: 'var(--text-muted)' }}>
            Navigation Menu
          </div>

          {/* Customer links */}
          {activeRole === 'customer' && customerNavItems.map(({ key, label, icon, highlight }) => {
            const isActive = customerTab === key;
            return (
              <button
                key={key}
                onClick={() => handleNavClick(key)}
                className={`w-full flex items-center justify-between px-3.5 py-3 rounded text-xs font-bold uppercase tracking-wider transition-all cursor-pointer text-left
                  ${isActive 
                    ? 'bg-primary text-white shadow-[0_0_15px_rgba(225,29,72,0.4)]' 
                    : highlight
                    ? 'text-purple-400 hover:bg-purple-950/20 hover:text-purple-300'
                    : 'text-slate-300 hover:bg-white/5 hover:text-white'
                  }`}
              >
                <span className="flex items-center gap-3">
                  {icon}
                  {label}
                </span>
                {highlight && !isActive && (
                  <span className="px-2 py-0.5 text-[9px] bg-purple-500/20 text-purple-300 border border-purple-500/30 rounded uppercase">
                    Elderly
                  </span>
                )}
              </button>
            );
          })}

          {/* Staff */}
          {activeRole === 'staff' && (
            <div className="px-3.5 py-3 rounded text-xs font-bold text-primary flex items-center gap-3">
              <UserCheck size={16} /> Staff Assigned Dashboard
            </div>
          )}

          {/* Admin links */}
          {activeRole === 'admin' && adminNavItems.map(({ key, label, icon }) => {
            const isActive = adminTab === key;
            return (
              <button
                key={key}
                onClick={() => handleNavClick(key)}
                className={`w-full flex items-center gap-3 px-3.5 py-3 rounded text-xs font-bold uppercase tracking-wider transition-all cursor-pointer text-left
                  ${isActive 
                    ? 'bg-primary text-white shadow-[0_0_15px_rgba(225,29,72,0.4)]' 
                    : 'text-slate-300 hover:bg-white/5 hover:text-white'
                  }`}
              >
                {icon}
                {label}
              </button>
            );
          })}
        </div>

        {/* Senior Care Support Line & Footer */}
        <div className="p-4 border-t space-y-3" style={{ borderColor: 'var(--border-subtle)' }}>
          <div className="p-3 rounded border text-xs" style={{ borderColor: 'rgba(168, 85, 247, 0.3)', background: 'rgba(168, 85, 247, 0.08)' }}>
            <div className="flex items-center gap-1.5 font-bold text-purple-400 mb-1">
              <PhoneCall size={12} /> Senior Care Helpline
            </div>
            <p className="text-[11px]" style={{ color: 'var(--text-secondary)' }}>
              Call <strong>+91 98765 43210</strong> for direct phone assisted home bookings.
            </p>
          </div>

          {/* Sign Out Button */}
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              logoutUser();
            }}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded border border-rose-500/30 text-rose-400 hover:bg-rose-600 hover:text-white text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
          >
            <LogOut size={14} />
            Sign Out
          </button>
        </div>

      </aside>

      {/* Backdrop for Desktop User Menu */}
      {showUserMenu && (
        <div className="fixed inset-0 z-40" onClick={() => setShowUserMenu(false)} />
      )}
    </>
  );
};
