import React from 'react';
import { Scissors, MapPin, Phone, Mail, Clock, HeartHandshake, ShieldCheck } from 'lucide-react';

export const Footer = () => {
  return (
    <footer 
      className="border-t transition-colors duration-300"
      style={{ 
        marginTop: '5rem', 
        padding: '3.5rem 1.5rem 2rem', 
        backgroundColor: 'var(--bg-secondary)',
        borderColor: 'var(--border-subtle)'
      }}
    >
      <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '2.5rem', marginBottom: '2.5rem' }}>
        
        {/* Brand Info */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
            <div style={{ background: 'var(--accent-red)', padding: '0.45rem', borderRadius: '8px', color: '#ffffff' }}>
              <Scissors size={18} />
            </div>
            <h3 className="font-display font-bold text-2xl tracking-tight" style={{ color: 'var(--text-primary)' }}>
              <span className="text-primary">Style</span> Sync
            </h3>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1.25rem' }}>
            A high-fashion salon management system automating online reservations, verified staff dispatch, Razorpay gateway integration, and specialized at-home elderly care.
          </p>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border"
            style={{ 
              backgroundColor: 'rgba(168, 85, 247, 0.12)', 
              color: 'var(--accent-purple)',
              borderColor: 'rgba(168, 85, 247, 0.3)'
            }}
          >
            <HeartHandshake size={14} /> Senior Citizen Home Care Partner
          </div>
        </div>

        {/* Operating Hours */}
        <div>
          <h4 className="font-display font-bold text-lg mb-3" style={{ color: 'var(--text-primary)' }}>
            Salon & Home Hours
          </h4>
          <ul style={{ listStyle: 'none', padding: 0, fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            <li style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <Clock size={14} className="text-primary" /> Monday – Friday: 09:00 AM – 09:00 PM
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <Clock size={14} className="text-primary" /> Saturday – Sunday: 08:30 AM – 09:30 PM
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'var(--accent-purple)', fontWeight: 600 }}>
              <HeartHandshake size={14} /> Home Service Visits: 10:00 AM – 06:00 PM
            </li>
          </ul>
        </div>

        {/* Location & Contact */}
        <div>
          <h4 className="font-display font-bold text-lg mb-3" style={{ color: 'var(--text-primary)' }}>
            Contact & Location
          </h4>
          <ul style={{ listStyle: 'none', padding: 0, fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            <li style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <MapPin size={14} className="text-primary" /> 124 Luxury Promenade, Indiranagar, Bengaluru
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <Phone size={14} className="text-primary" /> +91 98765 43210 (Senior Helpline)
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <Mail size={14} className="text-primary" /> concierge@stylesync-salon.com
            </li>
          </ul>
        </div>

      </div>

      <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '1.5rem', textAlign: 'center', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
        © 2026 StyleSync Salon Management System. Powered by React, Firebase & Razorpay.
      </div>
    </footer>
  );
};
