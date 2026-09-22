import React, { useState } from 'react';
import { useSalon } from '../context/SalonContext';
import { 
  User, 
  UserCheck, 
  ShieldCheck, 
  RotateCcw,
  Sparkles,
  LogOut,
  Sliders,
  ChevronDown
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
      <header className="neon-panel" style={{ borderRadius: 0, borderTop: 0, borderLeft: 0, borderRight: 0, position: 'sticky', top: 0, zIndex: 900, background: 'rgba(6, 6, 9, 0.92)' }}>
        
        {/* Main Navbar Bar */}
        <div style={{ maxWidth: '1350px', margin: '0 auto', padding: '1rem 2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1.5rem' }}>
          
          {/* Style Sync Logo - Exact match to screenshots */}
          <div 
            style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
            onClick={() => { setActiveRole('customer'); setCustomerTab('landing'); }}
          >
            <div className="brand-logo-text">
              <span className="brand-logo-style">Style</span>
              <span className="brand-logo-sync">Sync</span>
            </div>
          </div>

          {/* Center Navigation Links (Matching Screenshot 2: HOME, SERVICES, HOME BOOKING) */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: '2.5rem' }}>
            <button 
              onClick={() => { setActiveRole('customer'); setCustomerTab('landing'); }}
              style={{
                background: 'none',
                border: 'none',
                color: activeRole === 'customer' && customerTab === 'landing' ? 'var(--accent-red)' : '#d1d5db',
                fontFamily: 'var(--font-serif)',
                fontSize: '0.95rem',
                letterSpacing: '0.1em',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                textTransform: 'uppercase'
              }}
            >
              HOME
            </button>

            <button 
              onClick={() => { setActiveRole('customer'); setCustomerTab('catalog'); }}
              style={{
                background: 'none',
                border: 'none',
                color: activeRole === 'customer' && customerTab === 'catalog' ? 'var(--accent-red)' : '#d1d5db',
                fontFamily: 'var(--font-serif)',
                fontSize: '0.95rem',
                letterSpacing: '0.1em',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                textTransform: 'uppercase'
              }}
            >
              SERVICES
            </button>

            <button 
              onClick={() => { setActiveRole('customer'); setCustomerTab('book-home'); }}
              style={{
                background: 'none',
                border: 'none',
                color: activeRole === 'customer' && customerTab === 'book-home' ? 'var(--accent-red)' : '#d1d5db',
                fontFamily: 'var(--font-serif)',
                fontSize: '0.95rem',
                letterSpacing: '0.1em',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                textTransform: 'uppercase'
              }}
            >
              HOME BOOKING
            </button>
          </nav>

          {/* Right Action & Quick Role Switcher Pill */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            
            {/* Direct Switcher Pill for Evaluation */}
            <div style={{ display: 'flex', background: 'rgba(255, 255, 255, 0.04)', padding: '0.2rem', borderRadius: 'var(--radius-full)', border: '1px solid rgba(255, 0, 60, 0.3)' }}>
              <button 
                onClick={() => { setActiveRole('customer'); setCustomerTab('home'); }}
                title="View Customer Dashboard (Screenshot 3)"
                style={{
                  padding: '0.35rem 0.85rem',
                  borderRadius: 'var(--radius-full)',
                  border: 'none',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  background: activeRole === 'customer' && customerTab !== 'landing' ? 'var(--accent-red)' : 'transparent',
                  color: activeRole === 'customer' && customerTab !== 'landing' ? '#fff' : 'var(--text-secondary)'
                }}
              >
                Customer
              </button>
              
              <button 
                onClick={() => setActiveRole('staff')}
                title="View Staff Schedule (Screenshot 1)"
                style={{
                  padding: '0.35rem 0.85rem',
                  borderRadius: 'var(--radius-full)',
                  border: 'none',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  background: activeRole === 'staff' ? 'var(--accent-red)' : 'transparent',
                  color: activeRole === 'staff' ? '#fff' : 'var(--text-secondary)'
                }}
              >
                Staff
              </button>

              <button 
                onClick={() => setActiveRole('admin')}
                title="View Admin Dashboard (Screenshot 4)"
                style={{
                  padding: '0.35rem 0.85rem',
                  borderRadius: 'var(--radius-full)',
                  border: 'none',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  background: activeRole === 'admin' ? 'var(--accent-red)' : 'transparent',
                  color: activeRole === 'admin' ? '#fff' : 'var(--text-secondary)'
                }}
              >
                Admin
              </button>
            </div>

            {/* Login/Register Pill Button (Matching Screenshot 2) */}
            <button 
              onClick={() => setShowLoginModal(true)}
              style={{
                background: 'transparent',
                color: '#ffffff',
                border: '1px solid rgba(255, 255, 255, 0.8)',
                padding: '0.5rem 1.4rem',
                borderRadius: 'var(--radius-full)',
                fontFamily: 'var(--font-serif)',
                fontSize: '0.85rem',
                letterSpacing: '0.08em',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                textTransform: 'uppercase'
              }}
              onMouseEnter={(e) => e.target.style.borderColor = 'var(--accent-red)'}
              onMouseLeave={(e) => e.target.style.borderColor = 'rgba(255, 255, 255, 0.8)'}
            >
              LOGIN / REGISTER
            </button>

          </div>
        </div>
      </header>

      {/* Login / Role Selection Modal */}
      {showLoginModal && (
        <div className="modal-overlay" onClick={() => setShowLoginModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '440px', textAlign: 'center' }}>
            <h2 className="font-serif" style={{ fontSize: '1.75rem', marginBottom: '0.5rem', color: '#fff' }}>
              <span style={{ color: 'var(--accent-red)', italic: 'true' }}>Style</span> Sync Access
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
