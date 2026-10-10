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
  Sparkles,
  AlertTriangle,
  Check,
  Smartphone,
  Download
} from 'lucide-react';

export const Navbar = () => {
  const { 
    activeRole,
    customerTab, 
    setCustomerTab,
    adminTab,
    setAdminTab,
    currentUser,
    pendingStaff,
    logoutUser,
    theme,
    toggleTheme,
    staffTab,
    setStaffTab,
    updateUserProfile
  } = useSalon();

  const [showUserMenu, setShowUserMenu] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [modalName, setModalName] = useState('');
  const [modalPhone, setModalPhone] = useState('');
  const [modalAvatar, setModalAvatar] = useState('');
  const [modalSuccess, setModalSuccess] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);

  useEffect(() => {
    const handleBeforeInstall = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      alert("📱 How to install StyleSync App on your device:\n\n• On Android (Chrome): Tap the 3 dots menu at top right, then tap 'Install app' or 'Add to Home screen'.\n• On iPhone (Safari): Tap the Share button at the bottom, scroll down, and tap 'Add to Home Screen'.\n• On PC/Mac: Click the Install icon in the browser address bar.");
      return;
    }
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
    }
  };

  // Sync modal inputs when opened or currentUser changes
  useEffect(() => {
    if (currentUser) {
      setModalName(currentUser.name || '');
      setModalPhone(currentUser.phone || '');
      setModalAvatar(currentUser.avatar || '');
    }
  }, [currentUser, showProfileModal]);

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
    { key: 'home',           label: 'Home',           icon: <Home size={14} /> },
    { key: 'ai-hair-studio', label: 'AI Hair Studio', icon: <Sparkles size={14} />, highlight: true },
    { key: 'catalog',        label: 'Services',        icon: <BookOpen size={14} /> },
    { key: 'book-inshop',    label: 'Book Salon',      icon: <Calendar size={14} /> },
    { key: 'book-home',      label: 'Elderly & Home',  icon: <HeartHandshake size={14} /> },
    { key: 'my-bookings',    label: 'My Bookings',     icon: <LayoutGrid size={14} /> },
    { key: 'complaints',     label: 'Complaint Box',   icon: <AlertTriangle size={14} /> },
  ];

  // Admin nav items
  const adminNavItems = [
    { key: 'dashboard',     label: 'Dashboard',      icon: <LayoutGrid size={14} /> },
    { key: 'home-requests', label: 'Home Requests',  icon: <HeartHandshake size={14} /> },
    { key: 'services',      label: 'Services',       icon: <Settings size={14} /> },
    { key: 'staff',         label: 'Staff',          icon: <Users size={14} /> },
    { key: 'customers',     label: 'Customers',      icon: <User size={14} /> },
    { key: 'payments',      label: 'Payments',       icon: <CreditCard size={14} /> },
    { key: 'feedback',      label: 'Grievances & Reviews', icon: <MessageSquare size={14} /> },
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
                {key === 'staff' && pendingStaff.length > 0 && (
                  <span className="ml-1 min-w-[18px] h-[18px] rounded-full bg-amber-500 text-black text-[9px] font-extrabold flex items-center justify-center px-1 shadow-[0_0_8px_rgba(245,158,11,0.5)]" style={{ animation: 'pulse 2s ease-in-out infinite' }}>
                    {pendingStaff.length}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* ── Right Controls: Theme Toggle + User Account + Hamburger Button ── */}
          <div className="flex items-center gap-3 shrink-0">
            
            {/* Install App Button (Desktop) */}
            <button
              onClick={handleInstallClick}
              className="hidden lg:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer text-zinc-300 hover:text-white hover:border-primary bg-zinc-900/80 border-white/10 shadow-sm active:scale-95"
              title="Install StyleSync App on your device"
            >
              <Smartphone size={13} className="text-primary" />
              <span>Install App</span>
            </button>

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
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold uppercase text-white overflow-hidden
                  ${activeRole === 'admin' ? 'bg-rose-600' : activeRole === 'staff' ? 'bg-violet-600' : 'bg-primary'}`}
                >
                  {currentUser?.avatar ? (
                    <img src={currentUser.avatar} alt="" className="w-full h-full object-cover rounded-full" />
                  ) : (
                    currentUser?.name?.charAt(0) || 'U'
                  )}
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
                      <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white uppercase overflow-hidden shrink-0
                        ${activeRole === 'admin' ? 'bg-rose-600' : activeRole === 'staff' ? 'bg-violet-600' : 'bg-primary'}`}
                      >
                        {currentUser?.avatar ? (
                          <img src={currentUser.avatar} alt="" className="w-full h-full object-cover rounded-full" />
                        ) : (
                          currentUser?.name?.charAt(0) || 'U'
                        )}
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

                  {/* Profile Settings */}
                  <button
                    onClick={() => {
                      if (activeRole === 'staff') {
                        setStaffTab('profile');
                      } else {
                        setShowProfileModal(true);
                      }
                      setShowUserMenu(false);
                    }}
                    className="w-full flex items-center gap-2.5 px-5 py-3 text-xs uppercase tracking-widest font-bold text-slate-300 hover:text-white hover:bg-white/5 transition-all duration-200 cursor-pointer border-b"
                    style={{ borderColor: 'var(--border-subtle)' }}
                  >
                    <User size={13} className="text-amber-400" />
                    Profile Settings
                  </button>

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
            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white uppercase shrink-0 overflow-hidden
              ${activeRole === 'admin' ? 'bg-rose-600' : activeRole === 'staff' ? 'bg-violet-600' : 'bg-primary'}`}
            >
              {currentUser?.avatar ? (
                <img src={currentUser.avatar} alt="" className="w-full h-full object-cover rounded-full" />
              ) : (
                currentUser?.name?.charAt(0) || 'U'
              )}
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

          {/* Mobile Install App Button */}
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              handleInstallClick();
            }}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded border border-primary/40 bg-primary/10 text-primary hover:bg-primary/20 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer shadow-sm"
          >
            <Smartphone size={14} />
            Install StyleSync App
          </button>

          {/* Profile Settings Button in Drawer */}
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              if (activeRole === 'staff') {
                setStaffTab('profile');
              } else {
                setShowProfileModal(true);
              }
            }}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded border border-amber-500/30 text-amber-400 hover:bg-amber-500/10 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
          >
            <User size={14} />
            Profile Settings
          </button>

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

      {/* ── User Profile Settings Modal (For Customers & Admins) ── */}
      {showProfileModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={() => setShowProfileModal(false)}
        >
          <div 
            className="w-full max-w-md p-6 rounded-xl border shadow-2xl relative"
            style={{
              backgroundColor: 'var(--bg-card, #14141d)',
              borderColor: 'var(--border-strong, rgba(245, 158, 11, 0.3))'
            }}
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-4 border-b mb-5" style={{ borderColor: 'var(--border-subtle)' }}>
              <div className="flex items-center gap-2.5">
                <User size={20} className="text-amber-400" />
                <h3 className="font-display text-lg font-bold text-white m-0">Profile Settings</h3>
              </div>
              <button 
                onClick={() => setShowProfileModal(false)}
                className="p-1 rounded text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={async (e) => {
              e.preventDefault();
              await updateUserProfile({
                name: modalName.trim() || currentUser?.name,
                phone: modalPhone.trim(),
                avatar: modalAvatar
              });
              setModalSuccess(true);
              setTimeout(() => {
                setModalSuccess(false);
                setShowProfileModal(false);
              }, 1200);
            }}>
              {/* Avatar Selector */}
              <div className="flex items-center gap-4 mb-5 p-3 rounded-lg bg-white/5 border border-white/10">
                <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-amber-400/80 bg-black/40 flex items-center justify-center shrink-0">
                  {modalAvatar ? (
                    <img src={modalAvatar} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-2xl font-bold text-amber-400">
                      {modalName?.charAt(0) || 'U'}
                    </span>
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                    <button
                      type="button"
                      onClick={() => {
                        const styles = ['lorelei', 'avataaars', 'personas', 'notionists'];
                        const s = styles[Math.floor(Math.random() * styles.length)];
                        const seed = Math.random().toString(36).substring(2, 8);
                        setModalAvatar(`https://api.dicebear.com/7.x/${s}/svg?seed=${seed}`);
                      }}
                      className="px-2.5 py-1 text-[11px] font-bold rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30 transition-all cursor-pointer flex items-center gap-1.5"
                    >
                      <Sparkles size={12} /> Random Avatar
                    </button>
                    {modalAvatar && (
                      <button
                        type="button"
                        onClick={() => setModalAvatar('')}
                        className="text-[11px] text-rose-400 hover:underline cursor-pointer"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-400 m-0">Generate a unique avatar portrait</p>
                </div>
              </div>

              {/* Form fields */}
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">Full Name</label>
                  <input
                    type="text"
                    required
                    value={modalName}
                    onChange={e => setModalName(e.target.value)}
                    className="form-input w-full"
                    placeholder="Your Name"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">Phone Number</label>
                  <input
                    type="tel"
                    value={modalPhone}
                    onChange={e => setModalPhone(e.target.value)}
                    className="form-input w-full"
                    placeholder="e.g. 9876543210"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Email Address</label>
                  <input
                    type="text"
                    disabled
                    value={currentUser?.email || ''}
                    className="form-input w-full opacity-60 cursor-not-allowed text-xs"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 mt-6 pt-4 border-t" style={{ borderColor: 'var(--border-subtle)' }}>
                <button
                  type="submit"
                  className="btn-gold flex-1 py-2.5 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Check size={15} /> Save Profile Changes
                </button>
                <button
                  type="button"
                  onClick={() => setShowProfileModal(false)}
                  className="px-4 py-2.5 text-xs font-bold uppercase tracking-wider rounded border border-white/20 text-slate-300 hover:bg-white/5 transition-all cursor-pointer"
                >
                  Cancel
                </button>
              </div>

              {modalSuccess && (
                <div className="mt-3 p-2 rounded bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-bold text-center flex items-center justify-center gap-1.5">
                  <Check size={14} /> Profile updated successfully!
                </div>
              )}
            </form>
          </div>
        </div>
      )}
    </>
  );
};
