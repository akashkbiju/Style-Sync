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
    setActiveRole,
    setCustomerTab
  } = useSalon();

  const [activeSideNav, setActiveSideNav] = useState('overview'); // 'overview' | 'staff' | 'services' | 'reports' | 'home-requests'

  // Revenue chart data matching Screenshot 4 ($0 to $2500, Jan-Aug)
  const revenueChartData = [
    { month: 'Jan', amount: 150 },
    { month: 'Feb', amount: 650 },
    { month: 'Mar', amount: 500 },
    { month: 'Apr', amount: 800 },
    { month: 'May', amount: 1100 },
    { month: 'Jun', amount: 1650 },
    { month: 'Jul', amount: 1600 },
    { month: 'Aug', amount: 2350 }
  ];

  // Hardcoded recent bookings matching Screenshot 4 list
  const recentBookingsList = [
    { name: 'Arina Barnt', service: 'Services Manicure', time: '10:00 PM' },
    { name: 'Jerry Shewm', service: 'Services Haircut', time: '10:00 PM' },
    { name: 'Ericia Staw', service: 'Services Manicure', time: '18:00 PM' },
    { name: 'Klath Witherson', service: 'Services Styling', time: '10:30 PM' },
    { name: 'David William', service: 'Services Haircut', time: '13:00 PM' },
    { name: 'Jonn Shows', service: 'Services Manicure', time: '13:30 PM' },
    { name: 'Dook Ella', service: 'Services Manicure', time: '12:30 PM' },
    { name: 'Elven Black', service: 'Services Styling', time: '10:30 PM' },
    { name: 'Jennry Maria', service: 'Services Styling', time: '8:00 PM' }
  ];

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
                onClick={() => { setActiveRole('customer'); setCustomerTab('landing'); }}
                style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}
                title="Exit Admin View"
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
                  
                  {/* Stat Card 1: Active Staff 24 */}
                  <div className="neon-card" style={{
                    padding: '1.5rem',
                    textAlign: 'center',
                    border: '1.5px solid var(--accent-red)',
                    boxShadow: '0 0 20px rgba(255, 0, 60, 0.4), inset 0 0 10px rgba(255, 0, 60, 0.15)'
                  }}>
                    <h4 className="font-serif" style={{ fontSize: '1.3rem', color: '#ffffff', marginBottom: '0.5rem', fontWeight: 500 }}>
                      Active Staff
                    </h4>
                    <div style={{ fontSize: '3.2rem', fontWeight: 700, color: 'var(--accent-red)', lineHeight: 1 }}>
                      24
                    </div>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
                      Active Members
                    </p>
                  </div>

                  {/* Stat Card 2: New Customers 150 */}
                  <div className="neon-card" style={{
                    padding: '1.5rem',
                    textAlign: 'center',
                    border: '1.5px solid var(--accent-red)',
                    boxShadow: '0 0 20px rgba(255, 0, 60, 0.4), inset 0 0 10px rgba(255, 0, 60, 0.15)'
                  }}>
                    <h4 className="font-serif" style={{ fontSize: '1.3rem', color: '#ffffff', marginBottom: '0.5rem', fontWeight: 500 }}>
                      New Customers
                    </h4>
                    <div style={{ fontSize: '3.2rem', fontWeight: 700, color: 'var(--accent-red)', lineHeight: 1 }}>
                      150
                    </div>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
                      New Customers
                    </p>
                  </div>

                </div>

              </div>

              {/* Right Column: Recent Bookings Feed (Matching Screenshot 4 Sidebar) */}
              <div className="neon-card" style={{ padding: '1.25rem', background: 'rgba(16, 16, 24, 0.85)', display: 'flex', flexDirection: 'column' }}>
                <h3 className="font-serif" style={{ fontSize: '1.4rem', color: '#ffffff', marginBottom: '1rem', fontWeight: 500 }}>
                  Recent Bookings
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', overflowY: 'auto', maxHeight: '420px', paddingRight: '0.25rem' }}>
                  {recentBookingsList.map((item, idx) => (
                    <div 
                      key={idx}
                      style={{
                        display: 'flex',
                        justify: 'space-between',
                        alignItems: 'center',
                        paddingBottom: '0.65rem',
                        borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
                      }}
                    >
                      <div>
                        <div style={{ color: '#ffffff', fontWeight: 600, fontSize: '0.9rem' }}>
                          {item.name}
                        </div>
                        <div style={{ color: 'var(--text-secondary)', fontSize: '0.78rem' }}>
                          {item.service}
                        </div>
                      </div>
                      <div style={{ color: 'var(--text-muted)', fontSize: '0.78rem', fontWeight: 500 }}>
                        {item.time}
                      </div>
                    </div>
                  ))}
                </div>

              </div>

            </div>

          </div>
        )}

      </main>

    </div>
  );
};
