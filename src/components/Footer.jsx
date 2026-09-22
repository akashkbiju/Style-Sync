import React from 'react';
import { Scissors, MapPin, Phone, Mail, Clock, ShieldCheck, HeartHandshake } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="glass-panel" style={{ borderRadius: 0, borderBottom: 0, borderLeft: 0, borderRight: 0, marginTop: '4rem', padding: '3rem 1.5rem 1.5rem', background: '#0a0a0e' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '2rem', marginBottom: '2.5rem' }}>
        
        {/* Brand Info */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.85rem' }}>
            <div style={{ background: 'linear-gradient(135deg, #d4af37 0%, #aa820a 100%)', padding: '0.5rem', borderRadius: '10px', color: '#0b0b0e' }}>
              <Scissors size={20} />
            </div>
            <h3 className="font-serif gold-text" style={{ fontSize: '1.4rem', margin: 0 }}>StyleSync</h3>
          </div>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1rem' }}>
            A comprehensive, digital Salon Management System automating appointments, Razorpay online payments, staff scheduling, and elderly at-home care services.
          </p>
          <span className="badge badge-home">
            <HeartHandshake size={14} /> Senior Citizen Home Care Partner
          </span>
        </div>

        {/* Operating Hours */}
        <div>
          <h4 className="font-serif" style={{ color: '#fff', fontSize: '1.1rem', marginBottom: '1rem' }}>Salon Hours</h4>
          <ul style={{ listStyle: 'none', padding: 0, fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Clock size={14} color="var(--accent-gold)" /> Monday – Friday: 09:00 AM – 09:00 PM
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Clock size={14} color="var(--accent-gold)" /> Saturday – Sunday: 08:30 AM – 09:30 PM
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#c084fc' }}>
              <HeartHandshake size={14} /> Home Service Visits: 10:00 AM – 06:00 PM
            </li>
          </ul>
        </div>

        {/* Location & Contact */}
        <div>
          <h4 className="font-serif" style={{ color: '#fff', fontSize: '1.1rem', marginBottom: '1rem' }}>Contact & Location</h4>
          <ul style={{ listStyle: 'none', padding: 0, fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <MapPin size={14} color="var(--accent-gold)" /> 124 Luxury Promenade, Indiranagar, Bengaluru
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Phone size={14} color="var(--accent-gold)" /> +91 98765 43210 / +91 80 2345 6789
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Mail size={14} color="var(--accent-gold)" /> support@stylesync-salon.com
            </li>
          </ul>
        </div>

      </div>

      <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '1.25rem', textAlign: 'center', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
        © 2026 StyleSync Salon Management System — MCA Mini Project Submission. Built with React.js, Firebase Cloud Firestore, Razorpay Test Mode & Recharts.
      </div>
    </footer>
  );
};
