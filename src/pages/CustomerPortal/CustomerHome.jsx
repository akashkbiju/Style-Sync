import React, { useState } from 'react';
import { useSalon } from '../../context/SalonContext';
import { 
  Calendar, 
  Home, 
  CreditCard, 
  MessageSquare, 
  Clock, 
  CheckCircle,
  PlusCircle,
  HeartHandshake
} from 'lucide-react';
import { BookInShop } from './BookInShop';
import { BookHomeService } from './BookHomeService';
import { CustomerBookings } from './CustomerBookings';
import { ServiceCatalog } from './ServiceCatalog';

export const CustomerHome = () => {
  const { 
    customerTab, 
    setCustomerTab, 
    bookings, 
    payments, 
    feedback,
    addFeedback
  } = useSalon();

  const [activeSideTab, setActiveSideTab] = useState('bookings'); // 'bookings' | 'home-service' | 'payments' | 'feedback' | 'catalog'
  const [newFeedbackComment, setNewFeedbackComment] = useState('');
  const [newRating, setNewRating] = useState(5);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: '2rem', minHeight: '80vh', padding: '1rem 0' }}>
      
      {/* Left Sidebar (Matching Screenshot 3 Left Menu) */}
      <aside className="neon-panel" style={{ padding: '1.5rem 1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', background: 'rgba(10, 10, 15, 0.9)' }}>
        
        {/* Style Sync Mini Logo inside sidebar */}
        <div style={{ marginBottom: '1.5rem', paddingLeft: '0.5rem' }}>
          <div className="brand-logo-text">
            <span className="brand-logo-style" style={{ fontSize: '1.4rem' }}>Style</span>
            <span className="brand-logo-sync" style={{ fontSize: '1.25rem' }}>Sync</span>
          </div>
        </div>

        {/* Menu Items */}
        <button
          onClick={() => { setActiveSideTab('bookings'); setCustomerTab('home'); }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            padding: '0.85rem 1rem',
            borderRadius: 'var(--radius-sm)',
            border: activeSideTab === 'bookings' && customerTab === 'home' ? '1px solid var(--accent-red)' : 'none',
            background: activeSideTab === 'bookings' && customerTab === 'home' ? 'rgba(255, 0, 60, 0.12)' : 'transparent',
            color: activeSideTab === 'bookings' && customerTab === 'home' ? 'var(--accent-red)' : 'var(--text-secondary)',
            boxShadow: activeSideTab === 'bookings' && customerTab === 'home' ? 'inset 0 0 10px rgba(255, 0, 60, 0.2)' : 'none',
            fontFamily: 'var(--font-sans)',
            fontSize: '0.95rem',
            fontWeight: 600,
            cursor: 'pointer',
            textAlign: 'left',
            transition: 'all 0.2s ease'
          }}
        >
          <Calendar size={18} /> My Bookings
        </button>

        <button
          onClick={() => { setActiveSideTab('home-service'); setCustomerTab('book-home'); }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            padding: '0.85rem 1rem',
            borderRadius: 'var(--radius-sm)',
            border: activeSideTab === 'home-service' || customerTab === 'book-home' ? '1px solid var(--accent-red)' : 'none',
            background: activeSideTab === 'home-service' || customerTab === 'book-home' ? 'rgba(255, 0, 60, 0.12)' : 'transparent',
            color: activeSideTab === 'home-service' || customerTab === 'book-home' ? 'var(--accent-red)' : 'var(--text-secondary)',
            boxShadow: activeSideTab === 'home-service' || customerTab === 'book-home' ? 'inset 0 0 10px rgba(255, 0, 60, 0.2)' : 'none',
            fontFamily: 'var(--font-sans)',
            fontSize: '0.95rem',
            fontWeight: 600,
            cursor: 'pointer',
            textAlign: 'left',
            transition: 'all 0.2s ease'
          }}
        >
          <Home size={18} /> Home Service
        </button>

        <button
          onClick={() => { setActiveSideTab('payments'); setCustomerTab('payments'); }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            padding: '0.85rem 1rem',
            borderRadius: 'var(--radius-sm)',
            border: activeSideTab === 'payments' ? '1px solid var(--accent-red)' : 'none',
            background: activeSideTab === 'payments' ? 'rgba(255, 0, 60, 0.12)' : 'transparent',
            color: activeSideTab === 'payments' ? 'var(--accent-red)' : 'var(--text-secondary)',
            boxShadow: activeSideTab === 'payments' ? 'inset 0 0 10px rgba(255, 0, 60, 0.2)' : 'none',
            fontFamily: 'var(--font-sans)',
            fontSize: '0.95rem',
            fontWeight: 600,
            cursor: 'pointer',
            textAlign: 'left',
            transition: 'all 0.2s ease'
          }}
        >
          <CreditCard size={18} /> Payments
        </button>

        <button
          onClick={() => { setActiveSideTab('feedback'); setCustomerTab('feedback'); }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            padding: '0.85rem 1rem',
            borderRadius: 'var(--radius-sm)',
            border: activeSideTab === 'feedback' ? '1px solid var(--accent-red)' : 'none',
            background: activeSideTab === 'feedback' ? 'rgba(255, 0, 60, 0.12)' : 'transparent',
            color: activeSideTab === 'feedback' ? 'var(--accent-red)' : 'var(--text-secondary)',
            boxShadow: activeSideTab === 'feedback' ? 'inset 0 0 10px rgba(255, 0, 60, 0.2)' : 'none',
            fontFamily: 'var(--font-sans)',
            fontSize: '0.95rem',
            fontWeight: 600,
            cursor: 'pointer',
            textAlign: 'left',
            transition: 'all 0.2s ease'
          }}
        >
          <MessageSquare size={18} /> Feedback
        </button>

      </aside>

      {/* Main Content Pane */}
      <main style={{ width: '100%' }}>
        
        {/* Dynamic Views based on sub tab */}
        {customerTab === 'book-inshop' ? (
          <BookInShop />
        ) : customerTab === 'book-home' ? (
          <BookHomeService />
        ) : customerTab === 'catalog' ? (
          <ServiceCatalog />
        ) : customerTab === 'payments' || activeSideTab === 'payments' ? (
          <div className="neon-panel" style={{ padding: '2rem' }}>
            <h2 className="font-serif" style={{ fontSize: '1.75rem', color: '#fff', marginBottom: '1.5rem' }}>
              Online Payment Records
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {payments.map(pay => (
                <div key={pay.id} className="neon-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontWeight: 700, color: '#fff', fontSize: '1.05rem' }}>{pay.customerName}</div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>ID: {pay.id} | {pay.method}</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{pay.date}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--accent-red)' }}>₹{pay.amount}</div>
                    <span className="badge badge-completed">{pay.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : customerTab === 'feedback' || activeSideTab === 'feedback' ? (
          <div className="neon-panel" style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 className="font-serif" style={{ fontSize: '1.75rem', color: '#fff' }}>
                Customer Ratings & Reviews
              </h2>
              <button 
                onClick={() => setShowFeedbackModal(true)} 
                className="btn-red-neon"
                style={{ padding: '0.6rem 1.2rem', fontSize: '0.85rem' }}
              >
                Submit Feedback
              </button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.25rem' }}>
              {feedback.map(fb => (
                <div key={fb.id} className="neon-card">
                  <div style={{ color: 'var(--accent-red)', fontWeight: 700, marginBottom: '0.3rem' }}>
                    {'★'.repeat(fb.rating)}
                  </div>
                  <p style={{ color: '#fff', fontStyle: 'italic', fontSize: '0.9rem', marginBottom: '0.75rem' }}>
                    "{fb.comment}"
                  </p>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    — {fb.customerName} ({fb.serviceTitle})
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* Default Dashboard View (Exact Screenshot 3 Main Content) */
          <div>
            <h1 className="font-serif" style={{ fontSize: '2.5rem', fontWeight: 600, color: '#ffffff', marginBottom: '2rem' }}>
              Hello, Sarah Jenkins
            </h1>

            {/* 2 Big Red Glowing Action Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
              
              {/* Card 1: Book a New Service */}
              <div 
                className="neon-card" 
                style={{
                  padding: '2rem',
                  border: '1.5px solid var(--accent-red)',
                  boxShadow: '0 0 25px rgba(255, 0, 60, 0.4), inset 0 0 15px rgba(255, 0, 60, 0.15)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1.25rem'
                }}
              >
                <Calendar size={32} color="var(--accent-red)" />
                <h3 className="font-serif" style={{ fontSize: '1.5rem', color: '#fff', margin: 0 }}>
                  Book a New Service
                </h3>
                <button 
                  onClick={() => setCustomerTab('book-inshop')}
                  className="btn-red-neon"
                  style={{ alignSelf: 'flex-start', padding: '0.7rem 1.6rem', fontSize: '0.85rem' }}
                >
                  BOOK NOW
                </button>
              </div>

              {/* Card 2: Request Home Service */}
              <div 
                className="neon-card" 
                style={{
                  padding: '2rem',
                  border: '1.5px solid var(--accent-red)',
                  boxShadow: '0 0 25px rgba(255, 0, 60, 0.4), inset 0 0 15px rgba(255, 0, 60, 0.15)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1.25rem'
                }}
              >
                <Home size={32} color="var(--accent-red)" />
                <h3 className="font-serif" style={{ fontSize: '1.5rem', color: '#fff', margin: 0 }}>
                  Request Home Service
                </h3>
                <button 
                  onClick={() => setCustomerTab('book-home')}
                  className="btn-red-neon"
                  style={{ alignSelf: 'flex-start', padding: '0.7rem 1.6rem', fontSize: '0.85rem' }}
                >
                  REQUEST NOW
                </button>
              </div>

            </div>

            {/* Upcoming Appointments List (Matching Screenshot 3) */}
            <div style={{ marginTop: '1rem' }}>
              <h2 className="font-serif" style={{ fontSize: '1.75rem', color: '#ffffff', marginBottom: '1.25rem', fontWeight: 600 }}>
                Upcoming Appointments
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                
                {/* Appointment 1 */}
                <div 
                  style={{
                    display: 'flex',
                    justify: 'space-between',
                    alignItems: 'center',
                    padding: '1.25rem 0',
                    borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
                  }}
                >
                  <div>
                    <h4 style={{ color: '#fff', fontSize: '1.15rem', margin: 0, fontWeight: 500 }}>
                      Haircut with Stylist Anna
                    </h4>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginTop: '0.2rem' }}>
                      Oct 26, 2023 - 10:00 AM
                    </p>
                  </div>
                  <span className="badge badge-confirmed" style={{ padding: '0.4rem 1.1rem', fontSize: '0.85rem' }}>
                    Confirmed
                  </span>
                </div>

                {/* Appointment 2 */}
                <div 
                  style={{
                    display: 'flex',
                    justify: 'space-between',
                    alignItems: 'center',
                    padding: '1.25rem 0',
                    borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
                  }}
                >
                  <div>
                    <h4 style={{ color: '#fff', fontSize: '1.15rem', margin: 0, fontWeight: 500 }}>
                      Manicure
                    </h4>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginTop: '0.2rem' }}>
                      Nov 2, 2023 - 2:00 PM
                    </p>
                  </div>
                  <span className="badge badge-scheduled" style={{ padding: '0.4rem 1.1rem', fontSize: '0.85rem' }}>
                    Scheduled
                  </span>
                </div>

                {/* Additional User Bookings from State */}
                {bookings.map(b => (
                  <div 
                    key={b.id}
                    style={{
                      display: 'flex',
                      justify: 'space-between',
                      alignItems: 'center',
                      padding: '1.25rem 0',
                      borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
                    }}
                  >
                    <div>
                      <h4 style={{ color: '#fff', fontSize: '1.15rem', margin: 0, fontWeight: 500 }}>
                        {b.serviceTitle} {b.stylistName ? `with ${b.stylistName}` : ''} {b.type === 'home-service' ? '(Home Visit)' : ''}
                      </h4>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginTop: '0.2rem' }}>
                        {b.date} - {b.time} {b.address ? `| ${b.address}` : ''}
                      </p>
                    </div>
                    <span className={`badge ${b.status === 'Completed' ? 'badge-completed' : 'badge-confirmed'}`} style={{ padding: '0.4rem 1.1rem', fontSize: '0.85rem' }}>
                      {b.status}
                    </span>
                  </div>
                ))}

              </div>
            </div>

          </div>
        )}

      </main>

      {/* Submit Feedback Modal */}
      {showFeedbackModal && (
        <div className="modal-overlay" onClick={() => setShowFeedbackModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h3 className="font-serif" style={{ fontSize: '1.5rem', color: '#fff', marginBottom: '1rem' }}>
              Submit Rating & Feedback
            </h3>
            
            <div className="form-group">
              <label className="form-label">Service Rating</label>
              <select className="form-select" value={newRating} onChange={e => setNewRating(Number(e.target.value))}>
                <option value={5}>⭐⭐⭐⭐⭐ (5/5) Excellent</option>
                <option value={4}>⭐⭐⭐⭐ (4/5) Very Good</option>
                <option value={3}>⭐⭐⭐ (3/5) Average</option>
                <option value={2}>⭐⭐ (2/5) Poor</option>
                <option value={1}>⭐ (1/5) Very Poor</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Your Review / Comments</label>
              <textarea 
                className="form-textarea" 
                rows={4} 
                placeholder="Share your experience with Style Sync salon or home service..."
                value={newFeedbackComment}
                onChange={e => setNewFeedbackComment(e.target.value)}
              />
            </div>

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
              <button className="btn-secondary" onClick={() => setShowFeedbackModal(false)}>Cancel</button>
              <button 
                className="btn-red-neon" 
                onClick={() => {
                  if(!newFeedbackComment.trim()) return alert('Please enter your review');
                  addFeedback({
                    customerName: 'Sarah Jenkins',
                    serviceTitle: 'Haircut & Styling',
                    rating: newRating,
                    comment: newFeedbackComment
                  });
                  setNewFeedbackComment('');
                  setShowFeedbackModal(false);
                  alert('Thank you! Your feedback has been recorded.');
                }}
              >
                Submit Feedback
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
