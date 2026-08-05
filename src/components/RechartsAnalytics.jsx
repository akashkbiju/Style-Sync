import React from 'react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  PieChart, 
  Pie, 
  Cell, 
  Legend 
} from 'recharts';

export const RechartsAnalytics = ({ bookings, payments }) => {
  
  // Revenue Trend Data
  const revenueData = [
    { day: 'Mon', Revenue: 4500, Bookings: 6 },
    { day: 'Tue', Revenue: 6200, Bookings: 8 },
    { day: 'Wed', Revenue: 5100, Bookings: 7 },
    { day: 'Thu', Revenue: 8400, Bookings: 11 },
    { day: 'Fri', Revenue: 9800, Bookings: 14 },
    { day: 'Sat', Revenue: 14500, Bookings: 20 },
    { day: 'Sun', Revenue: 16200, Bookings: 22 }
  ];

  // Service Type Breakdown (In-Shop vs Home Service for Elderly)
  const homeCount = bookings.filter(b => b.type === 'home-service').length;
  const inShopCount = bookings.filter(b => b.type === 'in-shop').length;

  const distributionData = [
    { name: 'In-Shop Appointments', value: inShopCount || 2, color: '#38bdf8' },
    { name: 'Home Service Visits (Elderly)', value: homeCount || 1, color: '#c084fc' }
  ];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
      
      {/* Revenue Trend Graph */}
      <div className="glass-panel" style={{ padding: '1.5rem' }}>
        <h4 className="font-serif gold-text" style={{ fontSize: '1.15rem', marginBottom: '0.25rem' }}>Weekly Revenue & Volume Trends</h4>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>Financial earnings across peak salon business days</p>

        <div style={{ width: '100%', height: 260 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={revenueData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="day" stroke="#9ca3af" fontSize={12} />
              <YAxis stroke="#9ca3af" fontSize={12} />
              <Tooltip 
                contentStyle={{ background: '#13131a', border: '1px solid #d4af37', borderRadius: '8px', color: '#fff' }} 
              />
              <Bar dataKey="Revenue" fill="url(#goldGradient)" radius={[4, 4, 0, 0]} />
              <defs>
                <linearGradient id="goldGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#d4af37" stopOpacity={0.9} />
                  <stop offset="100%" stopColor="#aa820a" stopOpacity={0.4} />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Booking Type Distribution */}
      <div className="glass-panel" style={{ padding: '1.5rem' }}>
        <h4 className="font-serif gold-text" style={{ fontSize: '1.15rem', marginBottom: '0.25rem' }}>Service Mode Ratio</h4>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>In-Shop Appointments vs. Elderly Home Visits</p>

        <div style={{ width: '100%', height: 260 }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={distributionData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={5}
                dataKey="value"
              >
                {distributionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ background: '#13131a', border: '1px solid var(--border-glass)', borderRadius: '8px', color: '#fff' }} />
              <Legend verticalAlign="bottom" height={36} iconType="circle" />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
};
