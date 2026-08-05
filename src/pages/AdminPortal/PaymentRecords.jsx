import React, { useState } from 'react';
import { useSalon } from '../../context/SalonContext';
import { CreditCard, Search, DollarSign, CheckCircle2, ShieldCheck } from 'lucide-react';

export const PaymentRecords = () => {
  const { payments } = useSalon();
  const [search, setSearch] = useState('');

  const filteredPayments = payments.filter(p => 
    p.customerName.toLowerCase().includes(search.toLowerCase()) ||
    p.bookingId.toLowerCase().includes(search.toLowerCase()) ||
    p.id.toLowerCase().includes(search.toLowerCase())
  );

  const totalAmount = filteredPayments.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);

  return (
    <div style={{ paddingBottom: '3rem' }}>
      
      <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 className="font-serif gold-text" style={{ fontSize: '2rem', margin: 0 }}>Payment & Billing Records</h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.2rem' }}>Ledger of all digital online Razorpay payments & cash transactions</p>
        </div>

        <div style={{ textAlign: 'right' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Filtered Ledger Total</span>
          <div className="gold-text font-serif" style={{ fontSize: '1.8rem', fontWeight: 800 }}>₹{totalAmount}</div>
        </div>
      </div>

      {/* Search Input */}
      <div className="glass-panel" style={{ padding: '1rem', marginBottom: '1.5rem' }}>
        <div style={{ position: 'relative' }}>
          <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input 
            type="text" 
            className="form-input" 
            placeholder="Search transaction by customer name, Razorpay ID, or booking reference..." 
            value={search} 
            onChange={(e) => setSearch(e.target.value)}
            style={{ paddingLeft: '2.75rem' }}
          />
        </div>
      </div>

      {/* Ledger Table */}
      <div className="glass-panel" style={{ padding: '1.5rem' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-muted)' }}>
                <th style={{ padding: '0.75rem' }}>Transaction ID</th>
                <th style={{ padding: '0.75rem' }}>Booking ID</th>
                <th style={{ padding: '0.75rem' }}>Customer Name</th>
                <th style={{ padding: '0.75rem' }}>Payment Gateway / Method</th>
                <th style={{ padding: '0.75rem' }}>Amount</th>
                <th style={{ padding: '0.75rem' }}>Date & Time</th>
                <th style={{ padding: '0.75rem' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredPayments.map(p => (
                <tr key={p.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                  <td style={{ padding: '0.75rem', fontWeight: 700, color: 'var(--accent-gold)' }}>{p.id}</td>
                  <td style={{ padding: '0.75rem', color: '#fff' }}>{p.bookingId}</td>
                  <td style={{ padding: '0.75rem', color: '#fff' }}>{p.customerName}</td>
                  <td style={{ padding: '0.75rem', color: 'var(--text-secondary)' }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                      <CreditCard size={14} color="#60a5fa" /> {p.method}
                    </span>
                  </td>
                  <td style={{ padding: '0.75rem', fontWeight: 800, color: '#fff' }}>₹{p.amount}</td>
                  <td style={{ padding: '0.75rem', color: 'var(--text-muted)' }}>{p.date}</td>
                  <td style={{ padding: '0.75rem' }}>
                    <span className="badge badge-completed" style={{ fontSize: '0.7rem' }}>
                      <CheckCircle2 size={12} /> {p.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
