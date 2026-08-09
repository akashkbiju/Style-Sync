import React from 'react';
import { Scissors, Printer, X, QrCode, CheckCircle2, MapPin, Calendar, Clock, User, ShieldCheck } from 'lucide-react';

export const TicketModal = ({ booking, onClose }) => {
  if (!booking) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '540px', padding: 0, overflow: 'hidden' }}>
        
        {/* Top Header */}
        <div style={{ background: 'linear-gradient(135deg, #181824 0%, #0b0b0e 100%)', padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border-glass)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Scissors size={20} color="var(--accent-gold)" />
            <h3 className="font-serif gold-text" style={{ margin: 0, fontSize: '1.25rem' }}>StyleSync Official Ticket</h3>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <button onClick={() => window.print()} className="btn-secondary" style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}>
              <Printer size={14} /> Print Ticket
            </button>
            <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Ticket Container */}
        <div style={{ padding: '1.75rem', background: '#0f0f16' }}>
          
          {/* Booking ID Banner */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(212, 175, 55, 0.08)', border: '1px dashed var(--accent-gold)', padding: '1rem', borderRadius: 'var(--radius-sm)', marginBottom: '1.5rem' }}>
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Booking Reference</span>
              <div className="gold-text font-serif" style={{ fontSize: '1.5rem', fontWeight: 800 }}>{booking.id}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span className={`badge ${booking.type === 'home-service' ? 'badge-home' : 'badge-inshop'}`}>
                {booking.type === 'home-service' ? '🏡 Home Visit' : '✂️ In-Shop'}
              </span>
              <div style={{ fontSize: '0.78rem', color: '#10b981', marginTop: '0.3rem', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                <CheckCircle2 size={13} /> {booking.paymentStatus}
              </div>
            </div>
          </div>

          {/* Details Table */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '1.5rem' }}>
            <div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Customer Name</div>
              <div style={{ fontWeight: 600, color: '#fff', fontSize: '0.95rem' }}>{booking.customerName}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{booking.customerPhone}</div>
            </div>

            <div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Service Requested</div>
              <div style={{ fontWeight: 600, color: 'var(--accent-gold-light)', fontSize: '0.95rem' }}>{booking.serviceTitle}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Stylist: {booking.stylistName || 'Assigned Specialist'}</div>
            </div>

            <div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Appointment Schedule</div>
              <div style={{ fontWeight: 600, color: '#fff', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <Calendar size={14} color="var(--accent-gold)" /> {booking.date}
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <Clock size={14} /> {booking.time}
              </div>
            </div>

            <div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Total Amount Paid</div>
              <div style={{ fontWeight: 800, color: '#fff', fontSize: '1.3rem' }}>₹{booking.amount}</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>ID: {booking.paymentId}</div>
            </div>
          </div>

          {/* Home Service Address details if applicable */}
          {booking.type === 'home-service' && (
            <div style={{ background: 'rgba(168, 85, 247, 0.08)', border: '1px solid rgba(168, 85, 247, 0.25)', padding: '1rem', borderRadius: 'var(--radius-sm)', marginBottom: '1.5rem' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#c084fc', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <MapPin size={15} /> Home Service Destination
              </div>
              <div style={{ fontSize: '0.875rem', color: '#fff', marginBottom: '0.2rem' }}>{booking.address}</div>
              {booking.landmark && <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Landmark: {booking.landmark}</div>}
              {booking.specialNotes && <div style={{ fontSize: '0.8rem', color: '#fbbf24', marginTop: '0.4rem', fontStyle: 'italic' }}>Special Request: "{booking.specialNotes}"</div>}
            </div>
          )}

          {/* Verification QR Placeholder */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--border-subtle)', paddingTop: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
              <div style={{ background: '#fff', padding: '0.4rem', borderRadius: '6px' }}>
                <QrCode size={40} color="#000" />
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Scan QR code at entry or show to home visiting specialist for instant check-in verification.
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
