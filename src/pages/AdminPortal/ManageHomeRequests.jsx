import React from 'react';
import { useSalon } from '../../context/SalonContext';
import { HeartHandshake, MapPin, Phone, Calendar, User, CheckCircle2, UserPlus, AlertCircle } from 'lucide-react';

export const ManageHomeRequests = () => {
  const { bookings, staff, updateBookingStatus, assignStylistToBooking } = useSalon();

  // Filter home service bookings only
  const homeRequests = bookings.filter(b => b.type === 'home-service');

  return (
    <div style={{ paddingBottom: '3rem' }}>
      
      <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '2rem', borderLeft: '4px solid #c084fc' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#c084fc', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.3rem' }}>
          <HeartHandshake size={16} /> MCA Special Feature Management
        </div>
        <h1 className="font-serif gold-text" style={{ fontSize: '2rem', margin: 0 }}>Elderly Home Service Requests</h1>
        <p style={{ color: 'var(--text-secondary)', marginTop: '0.4rem' }}>
          Review home visit applications, assign trained specialists, and dispatch home care teams
        </p>
      </div>

      {homeRequests.length === 0 ? (
        <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center' }}>
          <HeartHandshake size={40} color="#c084fc" style={{ margin: '0 auto 1rem' }} />
          <h3 style={{ color: '#fff' }}>No Active Home Requests</h3>
          <p style={{ color: 'var(--text-secondary)' }}>All home service visits for elderly clients have been processed.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '1.25rem' }}>
          {homeRequests.map(req => (
            <div key={req.id} className="glass-card" style={{ border: '1px solid rgba(168, 85, 247, 0.3)' }}>
              
              {/* Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.75rem' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.3rem' }}>
                    <span className="gold-text font-serif" style={{ fontSize: '1.2rem', fontWeight: 800 }}>{req.id}</span>
                    <span className="badge badge-home">🏡 Home Visit</span>
                  </div>
                  <h3 style={{ color: '#fff', margin: 0, fontSize: '1.15rem' }}>{req.serviceTitle}</h3>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <span className={`badge badge-${req.status.toLowerCase().replace('-', '')}`}>
                    Status: {req.status}
                  </span>
                  <div style={{ fontSize: '0.8rem', color: '#10b981', marginTop: '0.3rem' }}>{req.paymentStatus}</div>
                </div>
              </div>

              {/* Customer & Address Details */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem', margin: '0.75rem 0' }}>
                <div>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Customer Name & Contact</span>
                  <div style={{ color: '#fff', fontWeight: 600, marginTop: '0.2rem' }}>{req.customerName}</div>
                  <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Phone: {req.customerPhone}</div>
                </div>

                <div>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Schedule Request</span>
                  <div style={{ color: '#fff', fontWeight: 600, marginTop: '0.2rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <Calendar size={14} color="var(--accent-gold)" /> {req.date} at {req.time}
                  </div>
                </div>

                <div>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Assigned Specialist</span>
                  <div style={{ marginTop: '0.2rem' }}>
                    <select 
                      className="form-select" 
                      value={req.stylistName}
                      onChange={(e) => assignStylistToBooking(req.id, e.target.value)}
                      style={{ padding: '0.35rem 0.6rem', fontSize: '0.825rem' }}
                    >
                      {staff.map(stf => (
                        <option key={stf.id} value={stf.name}>
                          {stf.name} ({stf.specialty})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Full Address */}
              <div style={{ background: 'rgba(168, 85, 247, 0.08)', padding: '0.85rem', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(168, 85, 247, 0.25)', fontSize: '0.875rem' }}>
                <div style={{ color: '#c084fc', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.2rem' }}>
                  <MapPin size={15} /> Delivery Destination Address:
                </div>
                <div style={{ color: '#fff' }}>{req.address}</div>
                {req.landmark && <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginTop: '0.2rem' }}>Landmark: {req.landmark}</div>}
                {req.specialNotes && (
                  <div style={{ color: '#fbbf24', fontSize: '0.825rem', marginTop: '0.4rem', fontStyle: 'italic' }}>
                    ⚠️ Elderly Care Instructions: "{req.specialNotes}"
                  </div>
                )}
              </div>

              {/* Status Controls */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.75rem' }}>
                {req.status === 'Pending' && (
                  <button 
                    onClick={() => updateBookingStatus(req.id, 'In-Progress')}
                    className="btn-gold" 
                    style={{ padding: '0.4rem 0.85rem', fontSize: '0.8rem', background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)', color: '#fff' }}
                  >
                    Dispatch Staff (Mark In-Progress)
                  </button>
                )}

                {req.status === 'In-Progress' && (
                  <button 
                    onClick={() => updateBookingStatus(req.id, 'Completed')}
                    className="btn-gold" 
                    style={{ padding: '0.4rem 0.85rem', fontSize: '0.8rem', background: 'linear-gradient(135deg, #10b981 0%, #047857 100%)', color: '#fff' }}
                  >
                    Mark Visit Completed
                  </button>
                )}
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
};
