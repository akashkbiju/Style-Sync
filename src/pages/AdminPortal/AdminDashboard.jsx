import React, { useState } from 'react';
import { useSalon } from '../../context/SalonContext';
import { 
  Home, 
  Users, 
  Scissors, 
  BarChart2, 
  HeartHandshake, 
  LogOut,
  TrendingUp,
  CreditCard,
  MessageSquare
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid 
} from 'recharts';

import { ManageStaff } from './ManageStaff';
import { ManageServices } from './ManageServices';
import { ManageHomeRequests } from './ManageHomeRequests';
import { PaymentRecords } from './PaymentRecords';
import { CustomerFeedback } from './CustomerFeedback';

export const AdminDashboard = () => {
  const { 
    adminTab, 
    setAdminTab, 
    bookings, 
    staff, 
    services, 
    payments, 
    feedback,
    logoutUser,
    currentUser
  } = useSalon();

  const [activeSideNav, setActiveSideNav] = useState('overview'); // 'overview' | 'staff' | 'services' | 'reports' | 'home-requests'

  // Revenue chart data matching INR currency
  const revenueChartData = [
    { month: 'Jan', amount: 15000 },
    { month: 'Feb', amount: 32000 },
    { month: 'Mar', amount: 28000 },
    { month: 'Apr', amount: 45000 },
    { month: 'May', amount: 58000 },
    { month: 'Jun', amount: 72000 },
    { month: 'Jul', amount: 84000 },
    { month: 'Aug', amount: 96000 }
  ];

  // Calculate live statistics
  const totalRevenue = payments.reduce((sum, p) => sum + (Number(p.amount) || 0), 0);
  const activeStaffCount = staff.filter(s => s.status === 'Available').length;

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: '2rem', minHeight: '82vh', padding: '1rem 0' }}>
      
      {/* Left Sidebar Navigation (Matching Screenshot 4 Left Menu) */}
      <aside className="neon-panel" style={{ padding: '1.5rem 1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', background: 'rgba(10, 10, 15, 0.95)' }}>
        
        {/* Logo */}
        <div style={{ marginBottom: '1.5rem', paddingLeft: '0.5rem' }}>
          <div className="brand-logo-text">
            <span className="brand-logo-style" style={{ fontSize: '1.4rem' }}>Style</span>
            <span className="brand-logo-sync" style={{ fontSize: '1.25rem' }}>Sync</span>
          </div>
        </div>

        {/* Sidebar Links */}
        <button
          onClick={() => { setActiveSideNav('overview'); setAdminTab('dashboard'); }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            padding: '0.85rem 1rem',
            borderRadius: 'var(--radius-sm)',
            border: activeSideNav === 'overview' && adminTab === 'dashboard' ? '1px solid var(--accent-red)' : 'none',
            background: activeSideNav === 'overview' && adminTab === 'dashboard' ? 'rgba(255, 0, 60, 0.12)' : 'transparent',
            color: activeSideNav === 'overview' && adminTab === 'dashboard' ? 'var(--accent-red)' : 'var(--text-secondary)',
            boxShadow: activeSideNav === 'overview' && adminTab === 'dashboard' ? 'inset 0 0 10px rgba(255, 0, 60, 0.2)' : 'none',
            fontFamily: 'var(--font-sans)',
            fontSize: '0.95rem',
            fontWeight: 600,
            cursor: 'pointer',
            textAlign: 'left',
            transition: 'all 0.2s ease'
          }}
        >
          <Home size={18} /> Overview
        </button>

        <button
          onClick={() => { setActiveSideNav('staff'); setAdminTab('staff'); }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            padding: '0.85rem 1rem',
            borderRadius: 'var(--radius-sm)',
            border: activeSideNav === 'staff' || adminTab === 'staff' ? '1px solid var(--accent-red)' : 'none',
            background: activeSideNav === 'staff' || adminTab === 'staff' ? 'rgba(255, 0, 60, 0.12)' : 'transparent',
            color: activeSideNav === 'staff' || adminTab === 'staff' ? 'var(--accent-red)' : 'var(--text-secondary)',
            boxShadow: activeSideNav === 'staff' || adminTab === 'staff' ? 'inset 0 0 10px rgba(255, 0, 60, 0.2)' : 'none',
            fontFamily: 'var(--font-sans)',
            fontSize: '0.95rem',
            fontWeight: 600,
            cursor: 'pointer',
            textAlign: 'left',
            transition: 'all 0.2s ease'
          }}
        >
          <Users size={18} /> Staff
        </button>

        <button
          onClick={() => { setActiveSideNav('services'); setAdminTab('services'); }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            padding: '0.85rem 1rem',
            borderRadius: 'var(--radius-sm)',
            border: activeSideNav === 'services' || adminTab === 'services' ? '1px solid var(--accent-red)' : 'none',
            background: activeSideNav === 'services' || adminTab === 'services' ? 'rgba(255, 0, 60, 0.12)' : 'transparent',
            color: activeSideNav === 'services' || adminTab === 'services' ? 'var(--accent-red)' : 'var(--text-secondary)',
            boxShadow: activeSideNav === 'services' || adminTab === 'services' ? 'inset 0 0 10px rgba(255, 0, 60, 0.2)' : 'none',
            fontFamily: 'var(--font-sans)',
            fontSize: '0.95rem',
            fontWeight: 600,
            cursor: 'pointer',
            textAlign: 'left',
            transition: 'all 0.2s ease'
          }}
        >
          <Scissors size={18} /> Services
        </button>

        <button
          onClick={() => { setActiveSideNav('reports'); setAdminTab('payments'); }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            padding: '0.85rem 1rem',
            borderRadius: 'var(--radius-sm)',
            border: activeSideNav === 'reports' || adminTab === 'payments' ? '1px solid var(--accent-red)' : 'none',
            background: activeSideNav === 'reports' || adminTab === 'payments' ? 'rgba(255, 0, 60, 0.12)' : 'transparent',
            color: activeSideNav === 'reports' || adminTab === 'payments' ? 'var(--accent-red)' : 'var(--text-secondary)',
            boxShadow: activeSideNav === 'reports' || adminTab === 'payments' ? 'inset 0 0 10px rgba(255, 0, 60, 0.2)' : 'none',
            fontFamily: 'var(--font-sans)',
            fontSize: '0.95rem',
            fontWeight: 600,
            cursor: 'pointer',
            textAlign: 'left',
            transition: 'all 0.2s ease'
          }}
        >
          <BarChart2 size={18} /> Reports
        </button>

        <button
          onClick={() => { setActiveSideNav('home-requests'); setAdminTab('home-requests'); }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            padding: '0.85rem 1rem',
            borderRadius: 'var(--radius-sm)',
            border: activeSideNav === 'home-requests' || adminTab === 'home-requests' ? '1px solid var(--accent-red)' : 'none',
            background: activeSideNav === 'home-requests' || adminTab === 'home-requests' ? 'rgba(255, 0, 60, 0.12)' : 'transparent',
            color: activeSideNav === 'home-requests' || adminTab === 'home-requests' ? 'var(--accent-red)' : 'var(--text-secondary)',
            boxShadow: activeSideNav === 'home-requests' || adminTab === 'home-requests' ? 'inset 0 0 10px rgba(255, 0, 60, 0.2)' : 'none',
            fontFamily: 'var(--font-sans)',
            fontSize: '0.95rem',
            fontWeight: 600,
            cursor: 'pointer',
            textAlign: 'left',
            transition: 'all 0.2s ease'
          }}
        >
          <HeartHandshake size={18} /> Home Service Requests
        </button>

      </aside>

      {/* Main Content Area */}
      <main style={{ width: '100%' }}>
        
        {/* Dynamic sub pages */}
        {adminTab === 'staff' ? (
          <ManageStaff />
        ) : adminTab === 'services' ? (
          <ManageServices />
        ) : adminTab === 'home-requests' ? (
          <ManageHomeRequests />
        ) : adminTab === 'payments' ? (
          <PaymentRecords />
        ) : adminTab === 'feedback' ? (
          <CustomerFeedback />
        ) : (
          /* Default Overview Dashboard (Exact Screenshot 4 Layout) */
          <div>
            
            {/* Header: Admin Dashboard with exit icon on top right */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '0.75rem' }}>
              <h1 className="font-serif" style={{ fontSize: '2.4rem', fontWeight: 500, color: '#ffffff' }}>
                Admin Dashboard
              </h1>

              <button 
                onClick={() => { if(window.confirm('Sign out of admin panel?')) logoutUser(); }}
                style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}
                title="Sign Out"
              >
                <LogOut size={18} />
              </button>
            </div>

            {/* Dashboard Grid (Matching Screenshot 4 layout) */}
            <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1fr', gap: '1.5rem' }}>
              
              {/* Left Column: Revenue Chart + 2 Bottom Stat Cards */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                
                {/* Revenue Line Chart Panel */}
                <div className="neon-card" style={{ padding: '1.5rem', borderRadius: '14px', background: 'rgba(16, 16, 24, 0.85)' }}>
                  <h3 className="font-serif" style={{ fontSize: '1.5rem', color: '#ffffff', marginBottom: '1rem', fontWeight: 500 }}>
                    Total Revenue
                  </h3>

                  <div style={{ width: '100%', height: 250 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={revenueChartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                        <defs>
                          <linearGradient id="redAreaGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#ff003c" stopOpacity={0.4} />
                            <stop offset="95%" stopColor="#ff003c" stopOpacity={0.0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                        <XAxis dataKey="month" stroke="#9ca3af" fontSize={11} />
                        <YAxis stroke="#9ca3af" fontSize={11} tickFormatter={(val) => `$${val}`} domain={[0, 2500]} ticks={[0, 500, 1000, 1500, 2000, 2500]} />
                        <Tooltip contentStyle={{ background: '#0a0a0f', border: '1px solid #ff003c', color: '#fff' }} formatter={(v) => [`$${v}`, 'Revenue']} />
                        <Area type="monotone" dataKey="amount" stroke="#ff003c" strokeWidth={3} fillOpacity={1} fill="url(#redAreaGrad)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Bottom Row: 2 Big Stat Cards (Matching Screenshot 4) */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                  
                  {/* Stat Card 1: Active Staff */}
                  <div className="neon-card" style={{
                    padding: '1.5rem',
                    textAlign: 'center',
                    border: '1.5px solid var(--accent-red)',
                    boxShadow: '0 0 20px rgba(255, 0, 60, 0.4), inset 0 0 10px rgba(255, 0, 60, 0.15)'
                  }}>
                    <h4 className="font-serif" style={{ fontSize: '1.3rem', color: '#ffffff', marginBottom: '0.5rem', fontWeight: 500 }}>
                      Active Staff Roster
                    </h4>
                    <div style={{ fontSize: '3.2rem', fontWeight: 700, color: 'var(--accent-red)', lineHeight: 1 }}>
                      {staff.length}
                    </div>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
                      Certified Specialists Available
                    </p>
                  </div>

                  {/* Stat Card 2: Total Bookings */}
                  <div className="neon-card" style={{
                    padding: '1.5rem',
                    textAlign: 'center',
                    border: '1.5px solid var(--accent-red)',
                    boxShadow: '0 0 20px rgba(255, 0, 60, 0.4), inset 0 0 10px rgba(255, 0, 60, 0.15)'
                  }}>
                    <h4 className="font-serif" style={{ fontSize: '1.3rem', color: '#ffffff', marginBottom: '0.5rem', fontWeight: 500 }}>
                      Total Bookings
                    </h4>
                    <div style={{ fontSize: '3.2rem', fontWeight: 700, color: 'var(--accent-red)', lineHeight: 1 }}>
                      {bookings.length}
                    </div>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
                      Live Appointments Recorded
                    </p>
                  </div>

                </div>

              </div>

              {/* Right Column: Recent Bookings Feed (Live Data) */}
              <div className="neon-card" style={{ padding: '1.25rem', background: 'rgba(16, 16, 24, 0.85)', display: 'flex', flexDirection: 'column' }}>
                <h3 className="font-serif" style={{ fontSize: '1.4rem', color: '#ffffff', marginBottom: '1rem', fontWeight: 500 }}>
                  Recent Bookings Feed
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', overflowY: 'auto', maxHeight: '420px', paddingRight: '0.25rem' }}>
                  {bookings.length === 0 ? (
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>No bookings found.</p>
                  ) : (
                    bookings.slice(0, 10).map((b, idx) => (
                      <div 
                        key={b.id || idx}
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          paddingBottom: '0.65rem',
                          borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
                        }}
                      >
                        <div>
                          <div style={{ color: '#ffffff', fontWeight: 600, fontSize: '0.9rem' }}>
                            {b.customerName}
                          </div>
                          <div style={{ color: 'var(--text-secondary)', fontSize: '0.78rem' }}>
                            {b.serviceTitle} {b.type === 'home-service' ? '🏡 (Home Visit)' : '✂️ (In-Shop)'}
                          </div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ color: 'var(--text-muted)', fontSize: '0.78rem', fontWeight: 500 }}>
                            {b.time}
                          </div>
                          <div style={{ color: 'var(--accent-gold)', fontSize: '0.75rem', fontWeight: 600 }}>
                            ₹{b.amount}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>

              </div>

            </div>

          </div>
        )}

      </main>

    </div>
  );
};
