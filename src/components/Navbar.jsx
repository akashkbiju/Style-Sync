import React, { useState } from 'react';
import { useSalon } from '../context/SalonContext';
import { 
  User, 
  UserCheck, 
  ShieldCheck, 
  RotateCcw,
  LogOut,
  ChevronDown,
  Scissors
} from 'lucide-react';

export const Navbar = () => {
  const { 
    activeRole, 
    setActiveRole, 
    customerTab, 
    setCustomerTab, 
    resetDemoData,
    currentUser,
    logoutUser
  } = useSalon();

  const [showUserMenu, setShowUserMenu] = useState(false);

  const roleLabel = activeRole === 'admin' ? 'Admin' : activeRole === 'staff' ? 'Staff' : 'Customer';
  const roleBadgeClass =
    activeRole === 'admin'
      ? 'bg-rose-900/60 text-rose-300 border-rose-700/50'
      : activeRole === 'staff'
      ? 'bg-violet-900/60 text-violet-300 border-violet-700/50'
      : 'bg-primary/10 text-primary border-primary/30';

  return (
    <>
      <nav className="fixed w-full z-50 bg-background-dark/90 backdrop-blur-md border-b border-white/10 top-0 left-0">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          
          {/* Logo */}
          <div 
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => { setActiveRole('customer'); setCustomerTab('home'); }}
          >
            <Scissors size={22} className="text-primary" />
            <span className="font-display text-2xl font-bold tracking-tight text-white">
              <span className="text-primary">Style</span> Sync
            </span>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-10 text-sm font-medium tracking-widest uppercase">
            {activeRole === 'customer' && (
              <>
                <button 
                  onClick={() => setCustomerTab('home')}
                  className={`transition-colors cursor-pointer ${customerTab === 'home' ? 'text-primary font-bold' : 'text-slate-300 hover:text-primary'}`}
                >
                  Home
                </button>
                <button 
                  onClick={() => setCustomerTab('catalog')}
                  className={`transition-colors cursor-pointer ${customerTab === 'catalog' ? 'text-primary font-bold' : 'text-slate-300 hover:text-primary'}`}
                >
                  Services
                </button>
                <button 
                  onClick={() => setCustomerTab('book-inshop')}
                  className={`transition-colors cursor-pointer ${customerTab === 'book-inshop' ? 'text-primary font-bold' : 'text-slate-300 hover:text-primary'}`}
                >
                  Book
                </button>
                <button 
                  onClick={() => setCustomerTab('book-home')}
                  className={`transition-colors cursor-pointer ${customerTab === 'book-home' ? 'text-primary font-bold' : 'text-slate-300 hover:text-primary'}`}
                >
                  Home Booking
                </button>
                <button 
                  onClick={() => setCustomerTab('my-bookings')}
                  className={`transition-colors cursor-pointer ${customerTab === 'my-bookings' ? 'text-primary font-bold' : 'text-slate-300 hover:text-primary'}`}
                >
                  My Bookings
                </button>
              </>
            )}

            {activeRole === 'staff' && (
              <span className="text-slate-300">Staff Dashboard</span>
            )}

            {activeRole === 'admin' && (
              <span className="text-slate-300">Admin Dashboard</span>
            )}
          </div>

          {/* Right: Role badge + User dropdown */}
          <div className="flex items-center gap-4">

            {/* Role Badge */}
            <span className={`hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${roleBadgeClass}`}>
              {activeRole === 'admin' && <ShieldCheck size={12} />}
              {activeRole === 'staff' && <UserCheck size={12} />}
              {activeRole === 'customer' && <User size={12} />}
              {roleLabel}
            </span>

            {/* User Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 px-3 py-2 border border-white/10 hover:border-primary/50 rounded transition-all cursor-pointer text-sm text-white"
              >
                {/* Avatar circle */}
                <div className="w-7 h-7 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center text-xs font-bold text-primary uppercase">
                  {currentUser?.name?.charAt(0) || 'U'}
                </div>
                <span className="hidden sm:inline max-w-[120px] truncate text-sm text-slate-200">
                  {currentUser?.name || 'User'}
                </span>
                <ChevronDown size={14} className={`text-slate-400 transition-transform ${showUserMenu ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown Menu */}
              {showUserMenu && (
                <div className="absolute right-0 top-full mt-2 w-56 bg-zinc-900 border border-white/10 rounded shadow-xl z-50">
                  {/* User info */}
                  <div className="px-4 py-3 border-b border-white/10">
                    <p className="text-white text-sm font-semibold truncate">{currentUser?.name}</p>
                    <p className="text-slate-500 text-xs truncate">{currentUser?.email}</p>
                    <span className={`mt-1.5 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold border ${roleBadgeClass}`}>
                      {roleLabel}
                    </span>
                  </div>

                  {/* Reset demo (dev tool) */}
                  <button
                    onClick={() => { resetDemoData(); setShowUserMenu(false); }}
                    className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-slate-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
                  >
                    <RotateCcw size={14} />
                    Reset Demo Data
                  </button>

                  {/* Logout */}
                  <button
                    onClick={() => { logoutUser(); setShowUserMenu(false); }}
                    className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-rose-400 hover:text-white hover:bg-primary/20 transition-colors cursor-pointer border-t border-white/5"
                  >
                    <LogOut size={14} />
                    Sign Out
                  </button>
                </div>
              )}
            </div>

          </div>
        </div>
      </nav>

      {/* Backdrop to close dropdown */}
      {showUserMenu && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowUserMenu(false)}
        />
      )}
    </>
  );
};
