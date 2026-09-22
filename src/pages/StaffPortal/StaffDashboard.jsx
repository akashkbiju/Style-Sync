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
  AlertCircle
} from 'lucide-react';

export const StaffDashboard = () => {
  const { bookings, updateBookingStatus } = useSalon();
  
  const [activeSideTab, setActiveSideTab] = useState('schedule'); // 'schedule' | 'tasks' | 'customers' | 'support'
  const [selectedBookingForUpdate, setSelectedBookingForUpdate] = useState(null);
  const [newStatusValue, setNewStatusValue] = useState('Active');

  // Hardcoded items matching Screenshot 1 + combined dynamic bookings
  const scheduleItems = [
    {
      id: 'sch-1',
      time: '9:00 AM',
      serviceTitle: 'Haircut',
      customerName: 'Sarah Jenkins',
      status: 'Active',
      specialNotes: 'Prefers layered fade haircut'
    },
    {
      id: 'sch-2',
      time: '10:30 AM',
      serviceTitle: 'Coloring',
      customerName: 'Jessica Lee',
      status: 'Scheduled',
      specialNotes: 'Highlights consultation'
    },
    {
      id: 'sch-3',
      time: '1:00 PM',
      serviceTitle: 'Styling',
      customerName: 'Emily Davis',
      status: 'Scheduled',
      specialNotes: 'Blowout and curls'
    },
    {
      id: 'sch-4',
      time: '3:00 PM',
      serviceTitle: 'Spa',
      customerName: 'Olivia White',
      status: 'Scheduled',
      specialNotes: 'Relief head massage'
    }
  ];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: '2.5rem', minHeight: '80vh', padding: '1rem 0' }}>
      
      {/* Left Sidebar (Matching Screenshot 1 Left Navigation) */}
      <aside className="neon-panel" style={{ padding: '1.5rem 1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', background: 'rgba(10, 10, 15, 0.9)' }}>
        
        {/* Style Sync Logo */}
        <div style={{ marginBottom: '1.5rem', paddingLeft: '0.5rem' }}>
          <div className="brand-logo-text">
            <span className="brand-logo-style" style={{ fontSize: '1.4rem' }}>Style</span>
            <span className="brand-logo-sync" style={{ fontSize: '1.25rem' }}>Sync</span>
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
          <Calendar size={18} /> My Schedule
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
          <CheckSquare size={18} /> Task List
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
          <Users size={18} /> Customer Details
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

      {/* Main Content Area (Matching Screenshot 1 Schedule View) */}
      <main style={{ width: '100%' }}>
        
        {activeSideTab === 'schedule' ? (
          <div>
            
            {/* Header: YOUR SCHEDULE FOR TODAY */}
            <h1 className="font-serif" style={{
              fontSize: '2.4rem',
              fontWeight: 700,
              color: '#ffffff',
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
              marginBottom: '2.5rem'
            }}>
              YOUR SCHEDULE FOR TODAY
            </h1>

            {/* Vertical Timeline Structure (Matching Screenshot 1) */}
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

              {/* Schedule Item 1 (Active Item matching Screenshot 1) */}
              <div style={{ position: 'relative' }}>
                {/* Glowing Red Dot Indicator on timeline line */}
                <div style={{
                  position: 'absolute',
                  left: '-28px',
                  top: '25px',
                  width: '12px',
                  height: '12px',
                  borderRadius: '50%',
                  background: 'var(--accent-red)',
                  boxShadow: '0 0 12px rgba(255, 0, 60, 0.9)'
                }} />

                <div className="neon-card" style={{
                  borderLeft: '8px solid var(--accent-red)',
                  borderColor: 'var(--accent-red)',
                  boxShadow: '0 0 25px rgba(255, 0, 60, 0.3)',
                  padding: '1.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem',
                  maxWidth: '520px'
                }}>
                  <div style={{ fontSize: '1.15rem', color: '#ffffff', fontWeight: 500, lineHeight: 1.5 }}>
                    {scheduleItems[0].time} - {scheduleItems[0].serviceTitle} -<br />
                    {scheduleItems[0].customerName} -<br />
                    [Status: <span style={{ color: '#34d399', fontWeight: 700 }}>Active</span>]
                  </div>

                  <button 
                    onClick={() => {
                      setSelectedBookingForUpdate(scheduleItems[0]);
                      setNewStatusValue('Active');
                    }}
                    className="btn-red-neon"
                    style={{
                      width: '100%',
                      padding: '0.85rem',
                      fontSize: '0.9rem',
                      letterSpacing: '0.08em'
                    }}
                  >
                    UPDATE STATUS
                  </button>
                </div>
              </div>

              {/* Schedule Item 2 */}
              <div style={{ position: 'relative' }}>
                <div className="neon-card" style={{
                  borderLeft: '8px solid var(--accent-red)',
                  padding: '1.4rem 1.5rem',
                  maxWidth: '520px'
                }}>
                  <div style={{ fontSize: '1.15rem', color: '#ffffff', fontWeight: 500, lineHeight: 1.5 }}>
                    {scheduleItems[1].time} - {scheduleItems[1].serviceTitle} -<br />
                    {scheduleItems[1].customerName}
                  </div>
                </div>
              </div>

              {/* Schedule Item 3 */}
              <div style={{ position: 'relative' }}>
                <div className="neon-card" style={{
                  borderLeft: '8px solid var(--accent-red)',
                  padding: '1.4rem 1.5rem',
                  maxWidth: '520px'
                }}>
                  <div style={{ fontSize: '1.15rem', color: '#ffffff', fontWeight: 500, lineHeight: 1.5 }}>
                    {scheduleItems[2].time} - {scheduleItems[2].serviceTitle} -<br />
                    {scheduleItems[2].customerName}
                  </div>
                </div>
              </div>

              {/* Schedule Item 4 */}
              <div style={{ position: 'relative' }}>
                <div className="neon-card" style={{
                  borderLeft: '8px solid var(--accent-red)',
                  padding: '1.4rem 1.5rem',
                  maxWidth: '520px'
                }}>
                  <div style={{ fontSize: '1.15rem', color: '#ffffff', fontWeight: 500, lineHeight: 1.5 }}>
                    {scheduleItems[3].time} - {scheduleItems[3].serviceTitle} -<br />
                    {scheduleItems[3].customerName}
                  </div>
                </div>
              </div>

              {/* Dynamic Bookings added from customer requests */}
              {bookings.filter(b => b.type === 'home-service').map(b => (
                <div key={b.id} style={{ position: 'relative' }}>
                  <div className="neon-card" style={{
                    borderLeft: '8px solid var(--accent-red)',
                    padding: '1.4rem 1.5rem',
                    maxWidth: '520px'
                  }}>
                    <div style={{ fontSize: '1.05rem', color: '#ffffff', fontWeight: 500 }}>
                      {b.time} - {b.serviceTitle} (Elderly Home Service) -<br />
                      {b.customerName} -<br />
                      [Status: <span style={{ color: '#38bdf8' }}>{b.status}</span>]
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.4rem' }}>
                      📍 {b.address}
                    </div>
                    <button 
                      onClick={() => {
                        setSelectedBookingForUpdate(b);
                        setNewStatusValue(b.status);
                      }}
                      className="btn-red-outline"
                      style={{ marginTop: '0.75rem', width: '100%', padding: '0.5rem', fontSize: '0.8rem' }}
                    >
                      UPDATE STATUS
                    </button>
                  </div>
                </div>
              ))}

            </div>

          </div>
        ) : activeSideTab === 'tasks' ? (
          <div className="neon-panel" style={{ padding: '2rem' }}>
            <h2 className="font-serif" style={{ fontSize: '1.75rem', color: '#fff', marginBottom: '1.5rem' }}>
              Stylist Daily Task Checklist
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {['Sanitize hair cutting scissors and hot tools', 'Prepare Elderly Home Visit Care kit', 'Review afternoon appointment notes', 'Check stock of gold hydration masks'].map((task, idx) => (
                <div key={idx} className="neon-card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <input type="checkbox" defaultChecked={idx < 2} style={{ width: '18px', height: '18px', accentColor: 'var(--accent-red)' }} />
                  <span style={{ color: '#fff', fontSize: '1rem' }}>{task}</span>
                </div>
              ))}
            </div>
          </div>
        ) : activeSideTab === 'customers' ? (
          <div className="neon-panel" style={{ padding: '2rem' }}>
            <h2 className="font-serif" style={{ fontSize: '1.75rem', color: '#fff', marginBottom: '1.5rem' }}>
              Assigned Customer Profiles
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1.25rem' }}>
              {['Sarah Jenkins', 'Jessica Lee', 'Emily Davis', 'Olivia White', 'Robert Vance (Elderly Client)'].map((cName, idx) => (
                <div key={idx} className="neon-card">
                  <h4 className="font-serif" style={{ fontSize: '1.15rem', color: '#fff' }}>{cName}</h4>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                    Preferred Stylist: Anna / Senior Roster
                  </p>
                  <span className="badge badge-confirmed" style={{ marginTop: '0.75rem' }}>Regular Client</span>
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
              <textarea className="form-textarea" rows={4} placeholder="Describe issue for Salon Admin..." />
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
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '420px' }}>
            <h3 className="font-serif" style={{ fontSize: '1.5rem', color: '#fff', marginBottom: '0.5rem' }}>
              Update Service Status
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginBottom: '1.25rem' }}>
              Service: <strong>{selectedBookingForUpdate.serviceTitle}</strong> ({selectedBookingForUpdate.customerName})
            </p>

            <div className="form-group">
              <label className="form-label">Select New Status</label>
              <select 
                className="form-select"
                value={newStatusValue}
                onChange={e => setNewStatusValue(e.target.value)}
              >
                <option value="Active">Active (In Service)</option>
                <option value="In-Progress">In-Progress</option>
                <option value="Completed">Completed</option>
                <option value="Scheduled">Scheduled / Pending</option>
              </select>
            </div>

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
              <button className="btn-secondary" onClick={() => setSelectedBookingForUpdate(null)}>
                Cancel
              </button>
              <button 
                className="btn-red-neon"
                onClick={() => {
                  if(selectedBookingForUpdate.id.startsWith('BK-')) {
                    updateBookingStatus(selectedBookingForUpdate.id, newStatusValue);
                  }
                  setSelectedBookingForUpdate(null);
                  alert(`Status successfully updated to ${newStatusValue}`);
                }}
              >
                Save Status
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
