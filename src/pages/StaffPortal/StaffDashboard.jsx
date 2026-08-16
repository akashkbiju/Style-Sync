import React, { useState } from 'react';
import { useSalon } from '../../context/SalonContext';
import { 
  Calendar, 
  CheckSquare, 
  Users, 
  HelpCircle,
  Clock,
  MapPin,
  CheckCircle,
  AlertCircle,
  Phone,
  Scissors,
  Home,
  Check
} from 'lucide-react';

export const StaffDashboard = () => {
  const { bookings, updateBookingStatus, currentUser, staff } = useSalon();
  
  const [activeSideTab, setActiveSideTab] = useState('schedule'); // 'schedule' | 'tasks' | 'customers' | 'support'
  const [selectedBookingForUpdate, setSelectedBookingForUpdate] = useState(null);
  const [newStatusValue, setNewStatusValue] = useState('In-Progress');

  // Find staff profile
  const staffProfile = staff.find(s => s.name === currentUser?.name || s.email === currentUser?.email) || {
    name: currentUser?.name || 'Stylist Specialist',
    role: currentUser?.staffRole || 'Senior Master Stylist',
    rating: 5.0,
    specialty: 'Hair Styling & Senior Citizen Home Care'
  };

  // Filter bookings for this logged in staff or all salon bookings if unassigned
  const staffBookings = bookings.filter(b => 
    !b.stylistName || b.stylistName === staffProfile.name || b.stylistName.toLowerCase().includes(staffProfile.name.toLowerCase().split(' ')[0])
  );
  const displayBookings = staffBookings.length > 0 ? staffBookings : bookings;

  // Extract unique customers from actual bookings
  const uniqueCustomers = Array.from(
    new Map(bookings.map(b => [b.customerName, b])).values()
  );

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: '2.5rem', minHeight: '80vh', padding: '1rem 0' }}>
      
      {/* Left Sidebar */}
      <aside className="neon-panel" style={{ padding: '1.5rem 1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', background: 'rgba(10, 10, 15, 0.9)' }}>
        
        {/* Style Sync Logo */}
        <div style={{ marginBottom: '1.5rem', paddingLeft: '0.5rem' }}>
          <div className="brand-logo-text">
            <span className="brand-logo-style" style={{ fontSize: '1.4rem' }}>Style</span>
            <span className="brand-logo-sync" style={{ fontSize: '1.25rem' }}>Sync</span>
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--accent-gold)', marginTop: '0.2rem' }}>
            Staff Portal: <strong>{staffProfile.name}</strong>
          </div>
        </div>

        {/* Sidebar Nav Items */}
        <button
          onClick={() => setActiveSideTab('schedule')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            padding: '0.85rem 1rem',
            borderRadius: 'var(--radius-sm)',
            border: activeSideTab === 'schedule' ? '1px solid var(--accent-red)' : 'none',
            background: activeSideTab === 'schedule' ? 'rgba(255, 0, 60, 0.12)' : 'transparent',
            color: activeSideTab === 'schedule' ? 'var(--accent-red)' : 'var(--text-secondary)',
            boxShadow: activeSideTab === 'schedule' ? 'inset 0 0 10px rgba(255, 0, 60, 0.2)' : 'none',
            fontFamily: 'var(--font-sans)',
            fontSize: '0.95rem',
            fontWeight: 600,
            cursor: 'pointer',
            textAlign: 'left',
            transition: 'all 0.2s ease'
          }}
        >
          <Calendar size={18} /> My Schedule ({displayBookings.length})
        </button>

        <button
          onClick={() => setActiveSideTab('tasks')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            padding: '0.85rem 1rem',
            borderRadius: 'var(--radius-sm)',
            border: activeSideTab === 'tasks' ? '1px solid var(--accent-red)' : 'none',
            background: activeSideTab === 'tasks' ? 'rgba(255, 0, 60, 0.12)' : 'transparent',
            color: activeSideTab === 'tasks' ? 'var(--accent-red)' : 'var(--text-secondary)',
            boxShadow: activeSideTab === 'tasks' ? 'inset 0 0 10px rgba(255, 0, 60, 0.2)' : 'none',
            fontFamily: 'var(--font-sans)',
            fontSize: '0.95rem',
            fontWeight: 600,
            cursor: 'pointer',
            textAlign: 'left',
            transition: 'all 0.2s ease'
          }}
        >
          <CheckSquare size={18} /> Task Checklist
        </button>

        <button
          onClick={() => setActiveSideTab('customers')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            padding: '0.85rem 1rem',
            borderRadius: 'var(--radius-sm)',
            border: activeSideTab === 'customers' ? '1px solid var(--accent-red)' : 'none',
            background: activeSideTab === 'customers' ? 'rgba(255, 0, 60, 0.12)' : 'transparent',
            color: activeSideTab === 'customers' ? 'var(--accent-red)' : 'var(--text-secondary)',
            boxShadow: activeSideTab === 'customers' ? 'inset 0 0 10px rgba(255, 0, 60, 0.2)' : 'none',
            fontFamily: 'var(--font-sans)',
            fontSize: '0.95rem',
            fontWeight: 600,
            cursor: 'pointer',
            textAlign: 'left',
            transition: 'all 0.2s ease'
          }}
        >
          <Users size={18} /> Clients ({uniqueCustomers.length})
        </button>

        <button
          onClick={() => setActiveSideTab('support')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            padding: '0.85rem 1rem',
            borderRadius: 'var(--radius-sm)',
            border: activeSideTab === 'support' ? '1px solid var(--accent-red)' : 'none',
            background: activeSideTab === 'support' ? 'rgba(255, 0, 60, 0.12)' : 'transparent',
            color: activeSideTab === 'support' ? 'var(--accent-red)' : 'var(--text-secondary)',
            boxShadow: activeSideTab === 'support' ? 'inset 0 0 10px rgba(255, 0, 60, 0.2)' : 'none',
            fontFamily: 'var(--font-sans)',
            fontSize: '0.95rem',
            fontWeight: 600,
            cursor: 'pointer',
            textAlign: 'left',
            transition: 'all 0.2s ease'
          }}
        >
          <HelpCircle size={18} /> Support
        </button>

      </aside>

      {/* Main Content Area */}
      <main style={{ width: '100%' }}>
        
        {activeSideTab === 'schedule' ? (
          <div>
            
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <h1 className="font-serif" style={{
                  fontSize: '2.2rem',
                  fontWeight: 700,
                  color: '#ffffff',
                  letterSpacing: '0.04em',
                  textTransform: 'uppercase',
                  margin: 0
                }}>
                  YOUR APPOINTMENT SCHEDULE
                </h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.3rem' }}>
                  Live appointments assigned to <strong>{staffProfile.name}</strong> • Real-time synchronization
                </p>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <span className="badge badge-confirmed" style={{ fontSize: '0.8rem' }}>
                  Total: {displayBookings.length}
                </span>
                <span className="badge badge-inshop" style={{ fontSize: '0.8rem' }}>
                  In-Shop: {displayBookings.filter(b => b.type === 'in-shop').length}
                </span>
                <span className="badge badge-home" style={{ fontSize: '0.8rem' }}>
                  Home Care: {displayBookings.filter(b => b.type === 'home-service').length}
                </span>
              </div>
            </div>

            {/* Vertical Timeline Structure */}
            <div style={{ position: 'relative', paddingLeft: '2rem', display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
              
              {/* Red Vertical Timeline Guide Line */}
              <div style={{
                position: 'absolute',
                left: '7px',
                top: '15px',
                bottom: '15px',
                width: '2px',
                background: 'rgba(255, 0, 60, 0.4)'
              }} />

              {displayBookings.length === 0 ? (
                <div className="neon-card" style={{ padding: '2rem', textAlign: 'center' }}>
                  <p style={{ color: 'var(--text-secondary)' }}>No scheduled appointments at this moment.</p>
                </div>
              ) : (
                displayBookings.map((b, idx) => {
                  const isHome = b.type === 'home-service';
                  const isCompleted = b.status === 'Completed';
                  const isInProgress = b.status === 'In-Progress' || b.status === 'Active';

                  return (
                    <div key={b.id} style={{ position: 'relative' }}>
                      
                      {/* Glowing Dot Indicator on timeline */}
                      <div style={{
                        position: 'absolute',
                        left: '-28px',
                        top: '25px',
                        width: '12px',
                        height: '12px',
                        borderRadius: '50%',
                        background: isCompleted ? '#10b981' : isInProgress ? '#38bdf8' : 'var(--accent-red)',
                        boxShadow: `0 0 12px ${isCompleted ? 'rgba(16, 185, 129, 0.9)' : isInProgress ? 'rgba(56, 189, 248, 0.9)' : 'rgba(255, 0, 60, 0.9)'}`
                      }} />

                      <div className="neon-card" style={{
                        borderLeft: `8px solid ${isCompleted ? '#10b981' : isInProgress ? '#38bdf8' : 'var(--accent-red)'}`,
                        borderColor: isCompleted ? '#10b981' : isInProgress ? '#38bdf8' : 'var(--accent-red)',
                        boxShadow: `0 0 20px ${isCompleted ? 'rgba(16, 185, 129, 0.15)' : isInProgress ? 'rgba(56, 189, 248, 0.15)' : 'rgba(255, 0, 60, 0.2)'}`,
                        padding: '1.5rem',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.85rem',
                        maxWidth: '620px'
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem' }}>
                          <div>
                            <div style={{ fontSize: '1.2rem', color: '#ffffff', fontWeight: 600 }}>
                              {b.time} — {b.serviceTitle}
                            </div>
                            <div style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                              Client: <strong style={{ color: '#fff' }}>{b.customerName}</strong> {b.customerPhone ? `(${b.customerPhone})` : ''}
                            </div>
                          </div>

                          <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                            {isHome ? (
                              <span className="badge badge-home" style={{ fontSize: '0.75rem' }}>
                                <Home size={12} /> Senior Home Care
                              </span>
                            ) : (
                              <span className="badge badge-inshop" style={{ fontSize: '0.75rem' }}>
                                <Scissors size={12} /> In-Shop
                              </span>
                            )}
                            <span className={`badge ${isCompleted ? 'badge-completed' : isInProgress ? 'badge-scheduled' : 'badge-confirmed'}`} style={{ fontSize: '0.75rem' }}>
                              {b.status}
                            </span>
                          </div>
                        </div>

                        {/* Home Care Address Details */}
                        {isHome && b.address && b.address !== 'N/A (In-Shop Salon Visit)' && (
                          <div style={{ background: 'rgba(168, 85, 247, 0.1)', border: '1px solid rgba(168, 85, 247, 0.3)', padding: '0.75rem', borderRadius: '4px', fontSize: '0.85rem' }}>
                            <div style={{ color: '#c084fc', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <MapPin size={14} /> Client Address:
                            </div>
                            <div style={{ color: '#e2e8f0', marginTop: '0.2rem' }}>
                              {b.address} {b.landmark ? `(Landmark: ${b.landmark})` : ''}
                            </div>
                          </div>
                        )}

                        {/* Special Care Notes */}
                        {b.specialNotes && (
                          <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', background: 'rgba(255,255,255,0.03)', padding: '0.5rem 0.75rem', borderRadius: '4px' }}>
                            📝 <em>{b.specialNotes}</em>
                          </div>
                        )}

                        {/* Stylist & Payment Info */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem', color: 'var(--text-muted)', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '0.6rem' }}>
                          <span>Assigned: <strong>{b.stylistName || staffProfile.name}</strong></span>
                          <span>Fee: <strong style={{ color: 'var(--accent-gold)' }}>₹{b.amount}</strong> ({b.paymentStatus || 'Paid'})</span>
                        </div>

                        {/* Action Button */}
                        <button 
                          onClick={() => {
                            setSelectedBookingForUpdate(b);
                            setNewStatusValue(b.status === 'Pending' ? 'In-Progress' : b.status === 'In-Progress' ? 'Completed' : 'In-Progress');
                          }}
                          className="btn-red-neon"
                          style={{
                            width: '100%',
                            padding: '0.75rem',
                            fontSize: '0.85rem',
                            letterSpacing: '0.08em',
                            marginTop: '0.4rem'
                          }}
                        >
                          UPDATE STATUS
                        </button>
                      </div>
                    </div>
                  );
                })
              )}

            </div>

          </div>
        ) : activeSideTab === 'tasks' ? (
          <div className="neon-panel" style={{ padding: '2rem' }}>
            <h2 className="font-serif" style={{ fontSize: '1.75rem', color: '#fff', marginBottom: '1.5rem' }}>
              Stylist Daily Sanitization & Care Checklist
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {[
                'Sanitize all hair trimming scissors, clippers & combs in UV sterilizer',
                'Prepare Senior Home Visit kit: inflatable shampoo basin, disposable gowns & towels',
                'Check stock of organic Gold glow hydration packs and herbal massage oils',
                'Verify temperature and emergency contact for elderly client home visits',
                'Inspect Razorpay electronic transaction tokens on completed appointments'
              ].map((task, idx) => (
                <div key={idx} className="neon-card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <input type="checkbox" defaultChecked={idx < 2} style={{ width: '18px', height: '18px', accentColor: 'var(--accent-red)', cursor: 'pointer' }} />
                  <span style={{ color: '#fff', fontSize: '0.95rem' }}>{task}</span>
                </div>
              ))}
            </div>
          </div>
        ) : activeSideTab === 'customers' ? (
          <div className="neon-panel" style={{ padding: '2rem' }}>
            <h2 className="font-serif" style={{ fontSize: '1.75rem', color: '#fff', marginBottom: '1.5rem' }}>
              Client Directory & History
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.25rem' }}>
              {uniqueCustomers.map((c, idx) => (
                <div key={idx} className="neon-card">
                  <h4 className="font-serif" style={{ fontSize: '1.15rem', color: '#fff' }}>{c.customerName}</h4>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.3rem' }}>
                    📞 {c.customerPhone || 'Contact on file'}
                  </p>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                    Latest Service: {c.serviceTitle}
                  </p>
                  <div style={{ marginTop: '0.75rem', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <span className="badge badge-confirmed" style={{ fontSize: '0.7rem' }}>
                      {c.type === 'home-service' ? 'Senior Care Client' : 'In-Shop Client'}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--accent-gold)' }}>
                      ₹{c.amount}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="neon-panel" style={{ padding: '2rem' }}>
            <h2 className="font-serif" style={{ fontSize: '1.75rem', color: '#fff', marginBottom: '1rem' }}>
              Staff Helpdesk & Salon Manager Support
            </h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
              Need assistance with equipment, home visit travel allowance, or client re-scheduling?
            </p>
            <div className="form-group">
              <label className="form-label">Support Ticket Details</label>
              <textarea className="form-textarea" rows={4} placeholder="Describe issue for Salon Admin or Manager..." />
            </div>
            <button className="btn-red-neon" onClick={() => alert('Support ticket dispatched to Admin!')}>
              Submit Staff Ticket
            </button>
          </div>
        )}

      </main>

      {/* UPDATE STATUS Modal */}
      {selectedBookingForUpdate && (
        <div className="modal-overlay" onClick={() => setSelectedBookingForUpdate(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '440px' }}>
            <h3 className="font-serif" style={{ fontSize: '1.5rem', color: '#fff', marginBottom: '0.5rem' }}>
              Update Service Status
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginBottom: '1.25rem' }}>
              Booking: <strong>{selectedBookingForUpdate.serviceTitle}</strong> for <strong>{selectedBookingForUpdate.customerName}</strong>
            </p>

            <div className="form-group">
              <label className="form-label">Select Current Status</label>
              <select 
                className="form-select"
                value={newStatusValue}
                onChange={e => setNewStatusValue(e.target.value)}
              >
                <option value="Pending">Pending (Scheduled)</option>
                <option value="In-Progress">In-Progress (Stylist Assigned / In Service)</option>
                <option value="Completed">Completed (Finished & Satisfied)</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
              <button className="btn-secondary" onClick={() => setSelectedBookingForUpdate(null)}>
                Cancel
              </button>
              <button 
                className="btn-red-neon"
                onClick={() => {
                  updateBookingStatus(selectedBookingForUpdate.id, newStatusValue);
                  setSelectedBookingForUpdate(null);
                }}
              >
                Save & Synchronize
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
