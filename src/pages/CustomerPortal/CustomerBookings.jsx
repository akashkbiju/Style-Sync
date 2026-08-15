import React, { useState } from 'react';
import { useSalon } from '../../context/SalonContext';
import { TicketModal } from '../../components/TicketModal';
import { FeedbackModal } from '../../components/FeedbackModal';
import { Clock, Calendar, MapPin, Ticket, Star, XCircle, HeartHandshake, Scissors, CheckCircle2 } from 'lucide-react';

export const CustomerBookings = () => {
  const { bookings, updateBookingStatus } = useSalon();

  const [selectedBookingForTicket, setSelectedBookingForTicket] = useState(null);
  const [selectedBookingForFeedback, setSelectedBookingForFeedback] = useState(null);
  const [filter, setFilter] = useState('All');

  const filteredBookings = bookings.filter(b => {
    if (filter === 'All') return true;
    return b.status.toLowerCase() === filter.toLowerCase();
  });

  return (
    <div>
      <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 className="font-serif gold-text" style={{ fontSize: '2rem', marginBottom: '0.4rem' }}>My Salon Bookings & Requests</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Track status, view official tickets, and submit service feedback</p>
        </div>

        {/* Filter Pills */}
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {['All', 'Pending', 'In-Progress', 'Completed'].map(st => (
            <button
              key={st}
              onClick={() => setFilter(st)}
              className={filter === st ? 'btn-red-solid' : 'btn-secondary'}
              style={{ padding: '0.45rem 1rem', fontSize: '0.75rem' }}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {filteredBookings.length === 0 ? (
        <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center' }}>
          <Clock size={40} color="var(--text-muted)" style={{ margin: '0 auto 1rem' }} />
          <h3 style={{ color: '#fff', marginBottom: '0.5rem' }}>No Bookings Found</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>You don't have any appointments under this status filter.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '1.25rem' }}>
          {filteredBookings.map(bk => (
            <div key={bk.id} className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              
              {/* Header row */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.75rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.75rem' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.2rem' }}>
                    <span className="gold-text font-serif" style={{ fontSize: '1.2rem', fontWeight: 800 }}>{bk.id}</span>
                    <span className={`badge ${bk.type === 'home-service' ? 'badge-home' : 'badge-inshop'}`}>
                      {bk.type === 'home-service' ? '🏡 Elderly Home Visit' : '✂️ In-Shop'}
                    </span>
                  </div>
                  <h3 style={{ color: '#fff', margin: 0, fontSize: '1.1rem' }}>{bk.serviceTitle}</h3>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <span className={`badge badge-${bk.status.toLowerCase().replace('-', '')}`}>
                    Status: {bk.status}
                  </span>
                  <div style={{ fontSize: '0.8rem', color: '#10b981', marginTop: '0.3rem' }}>
                    {bk.paymentStatus}
                  </div>
                </div>
              </div>

              {/* Body Details */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', fontSize: '0.875rem' }}>
                <div>
                  <span style={{ color: 'var(--text-muted)' }}>Scheduled Date & Time:</span>
                  <div style={{ color: '#fff', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.3rem', marginTop: '0.2rem' }}>
                    <Calendar size={14} color="var(--accent-gold)" /> {bk.date} at {bk.time}
                  </div>
                </div>

                <div>
                  <span style={{ color: 'var(--text-muted)' }}>Assigned Specialist:</span>
                  <div style={{ color: '#fff', fontWeight: 600, marginTop: '0.2rem' }}>
                    {bk.stylistName || 'Pending Assignment'}
                  </div>
                </div>

                <div>
                  <span style={{ color: 'var(--text-muted)' }}>Amount Paid:</span>
                  <div className="gold-text font-serif" style={{ fontSize: '1.15rem', fontWeight: 800 }}>
                    ₹{bk.amount}
                  </div>
                </div>
              </div>

              {bk.type === 'home-service' && (
                <div style={{ background: 'rgba(168, 85, 247, 0.08)', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(168, 85, 247, 0.2)', fontSize: '0.85rem' }}>
                  <span style={{ color: '#c084fc', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <MapPin size={14} /> Destination Address:
                  </span>
                  <div style={{ color: '#fff', marginTop: '0.2rem' }}>{bk.address}</div>
                  {bk.specialNotes && <div style={{ color: '#fbbf24', fontSize: '0.8rem', marginTop: '0.25rem' }}>Notes: "{bk.specialNotes}"</div>}
                </div>
              )}

              {/* Action Buttons */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.75rem', flexWrap: 'wrap' }}>
                
                <button 
                  onClick={() => setSelectedBookingForTicket(bk)} 
                  className="btn-red-outline" 
                  style={{ padding: '0.45rem 1rem', fontSize: '0.75rem' }}
                >
                  <Ticket size={14} /> View Digital Pass
                </button>

                {bk.status === 'Completed' && (
                  <button 
                    onClick={() => setSelectedBookingForFeedback(bk)} 
                    className="btn-red-neon" 
                    style={{ padding: '0.45rem 1rem', fontSize: '0.75rem' }}
                  >
                    <Star size={14} /> Rate & Review Service
                  </button>
                )}

                {bk.status === 'Pending' && (
                  <button 
                    onClick={() => {
                      if(window.confirm('Are you sure you want to cancel this booking?')) {
                        updateBookingStatus(bk.id, 'Cancelled');
                      }
                    }} 
                    className="btn-secondary" 
                    style={{ padding: '0.45rem 1rem', fontSize: '0.75rem', color: '#f87171', borderColor: 'rgba(239, 68, 68, 0.4)' }}
                  >
                    <XCircle size={14} /> Cancel Booking
                  </button>
                )}

              </div>

            </div>
          ))}
        </div>
      )}

      {/* Ticket Modal */}
      {selectedBookingForTicket && (
        <TicketModal 
          booking={selectedBookingForTicket} 
          onClose={() => setSelectedBookingForTicket(null)} 
        />
      )}

      {/* Feedback Modal */}
      {selectedBookingForFeedback && (
        <FeedbackModal 
          booking={selectedBookingForFeedback} 
          onClose={() => setSelectedBookingForFeedback(null)} 
        />
      )}

    </div>
  );
};
