import React, { useState } from 'react';
import { useSalon } from '../context/SalonContext';
import { 
  User, 
  UserCheck, 
  ShieldCheck, 
  RotateCcw
} from 'lucide-react';

export const Navbar = () => {
  const { 
    activeRole, 
    setActiveRole, 
    customerTab, 
    setCustomerTab, 
    resetDemoData 
  } = useSalon();

  const [showLoginModal, setShowLoginModal] = useState(false);

  return (
    <>
      <nav className="fixed w-full z-50 bg-background-dark/90 backdrop-blur-md border-b border-white/10 top-0 left-0">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          
          {/* Logo matching user template */}
          <div 
            className="flex items-center space-x-1 cursor-pointer"
            onClick={() => { setActiveRole('customer'); setCustomerTab('landing'); }}
          >
            <span className="font-display text-2xl font-bold tracking-tight text-white">
              <span className="text-primary">Style</span> Sync
            </span>
          </div>

          {/* Navigation Links matching user template */}
          <div className="hidden md:flex items-center space-x-12 text-sm font-medium tracking-widest uppercase">
            <button 
              onClick={() => { setActiveRole('customer'); setCustomerTab('landing'); }}
              className={`transition-colors cursor-pointer ${activeRole === 'customer' && customerTab === 'landing' ? 'text-primary font-bold' : 'text-slate-300 hover:text-primary'}`}
            >
              Home
            </button>
            <button 
              onClick={() => { setActiveRole('customer'); setCustomerTab('catalog'); }}
              className={`transition-colors cursor-pointer ${activeRole === 'customer' && customerTab === 'catalog' ? 'text-primary font-bold' : 'text-slate-300 hover:text-primary'}`}
            >
              Services
            </button>
            <button 
              onClick={() => { setActiveRole('customer'); setCustomerTab('book-home'); }}
              className={`transition-colors cursor-pointer ${activeRole === 'customer' && customerTab === 'book-home' ? 'text-primary font-bold' : 'text-slate-300 hover:text-primary'}`}
            >
              Home Booking
            </button>
          </div>

          {/* Right Action & Quick Role Switcher Pill */}
          <div className="flex items-center space-x-4">
            
            {/* Quick Role Selector */}
            <div className="flex bg-white/5 p-1 rounded-full border border-white/10 text-xs">
              <button 
                onClick={() => { setActiveRole('customer'); setCustomerTab('home'); }}
                className={`px-3 py-1 rounded-full font-medium transition-all ${activeRole === 'customer' && customerTab !== 'landing' ? 'bg-primary text-white' : 'text-slate-400 hover:text-white'}`}
                title="Customer Portal"
              >
                Customer
              </button>
              <button 
                onClick={() => setActiveRole('staff')}
                className={`px-3 py-1 rounded-full font-medium transition-all ${activeRole === 'staff' ? 'bg-primary text-white' : 'text-slate-400 hover:text-white'}`}
                title="Staff Portal"
              >
                Staff
              </button>
              <button 
                onClick={() => setActiveRole('admin')}
                className={`px-3 py-1 rounded-full font-medium transition-all ${activeRole === 'admin' ? 'bg-primary text-white' : 'text-slate-400 hover:text-white'}`}
                title="Admin Portal"
              >
                Admin
              </button>
            </div>

            {/* Login / Register Button matching user template */}
            <button 
              onClick={() => setShowLoginModal(true)}
              className="px-6 py-2 border border-white text-xs font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-all cursor-pointer text-white"
            >
              Login / Register
            </button>

          </div>
        </div>
      </nav>

      {/* Login / Portal Selection Modal */}
      {showLoginModal && (
        <div className="modal-overlay" onClick={() => setShowLoginModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '440px', textAlign: 'center' }}>
            <h2 className="font-display" style={{ fontSize: '2rem', marginBottom: '0.5rem', color: '#fff' }}>
              <span className="text-primary">Style</span> Sync Access
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
              Select a portal module to log in securely:
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <button 
                onClick={() => { setActiveRole('customer'); setCustomerTab('home'); setShowLoginModal(false); }}
                className="btn-red-outline"
                style={{ justifyContent: 'space-between', padding: '0.9rem 1.2rem' }}
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}><User size={18} /> Customer Account</span>
                <span>Portal &rarr;</span>
              </button>

              <button 
                onClick={() => { setActiveRole('staff'); setShowLoginModal(false); }}
                className="btn-red-outline"
                style={{ justifyContent: 'space-between', padding: '0.9rem 1.2rem' }}
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}><UserCheck size={18} /> Stylist / Staff</span>
                <span>Schedule &rarr;</span>
              </button>

              <button 
                onClick={() => { setActiveRole('admin'); setShowLoginModal(false); }}
                className="btn-red-outline"
                style={{ justifyContent: 'space-between', padding: '0.9rem 1.2rem' }}
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}><ShieldCheck size={18} /> Administrator</span>
                <span>Dashboard &rarr;</span>
              </button>
            </div>

            <div style={{ marginTop: '1.5rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <button 
                onClick={() => { resetDemoData(); setShowLoginModal(false); }}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.3rem' }}
              >
                <RotateCcw size={13} /> Reset Demo State
              </button>
              <button 
                onClick={() => setShowLoginModal(false)}
                className="btn-secondary"
                style={{ padding: '0.35rem 0.9rem', fontSize: '0.8rem' }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
