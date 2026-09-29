import React, { useState, useEffect } from 'react';
import { useSalon } from '../../context/SalonContext';
import { fetchStaffFromDB } from '../../firebase/staffService';
import { RazorpayModal } from '../../components/RazorpayModal';
import { TicketModal } from '../../components/TicketModal';
import { Calendar, Clock, User, Phone, Scissors, CheckCircle2, Sparkles, Check } from 'lucide-react';

export const BookInShop = () => {
  const { services, staff: contextStaff, bookings, addBooking, setCustomerTab, currentUser, feedback } = useSalon();
  const todayDateStr = new Date().toISOString().substring(0, 10);

  const [staff, setStaff] = useState(contextStaff);
  const [selectedServiceId, setSelectedServiceId] = useState(services.filter(s => s.status !== 'Pending')[0]?.id || '');
  const [selectedStylistName, setSelectedStylistName] = useState('');
  const [preferredGender, setPreferredGender] = useState('No Preference');

  // Fetch the absolute latest staff from DB whenever the booking page is opened
  useEffect(() => {
    let isMounted = true;
    const loadLatestStaff = async () => {
      try {
        const latestStaff = await fetchStaffFromDB();
        if (isMounted && latestStaff && latestStaff.length > 0) {
          setStaff(latestStaff);
        }
      } catch (err) {
        console.error("Failed to fetch latest staff", err);
      }
    };
    loadLatestStaff();
    return () => { isMounted = false; };
  }, []);

  const filteredStaff = staff.filter(s => {
    if (preferredGender === 'No Preference') return true;
    return s.gender === preferredGender;
  });

  const loggedInStaff = filteredStaff.find(s => s.isLoggedIn) || filteredStaff[0];

  useEffect(() => {
    if (filteredStaff.length > 0) {
      // Only auto-select if the currently selected stylist is not in the filtered list
      if (!filteredStaff.some(s => s.name === selectedStylistName)) {
        setSelectedStylistName(loggedInStaff?.name || filteredStaff[0]?.name || '');
      }
    } else {
      setSelectedStylistName('');
    }
  }, [filteredStaff, loggedInStaff, selectedStylistName]);

  const [date, setDate] = useState(() => {
    const today = new Date();
    today.setDate(today.getDate() + 1);
    return today.toISOString().substring(0, 10);
  });
  const [time, setTime] = useState('11:00 AM');
  const [customerName, setCustomerName] = useState(currentUser?.name || '');
  const [customerPhone, setCustomerPhone] = useState(currentUser?.phone || '');
  const [specialNotes, setSpecialNotes] = useState('');

  const [showRazorpay, setShowRazorpay] = useState(false);
  const [createdBooking, setCreatedBooking] = useState(null);

  const selectedService = services.find(s => s.id === selectedServiceId) || services.filter(s => s.status !== 'Pending')[0];
  const selectedStylist = staff.find(stf => stf.name === selectedStylistName);

  const handleOpenCheckout = (e) => {
    e.preventDefault();
    if (!customerName || !customerPhone) {
      alert('Please fill in your name and contact phone number.');
      return;
    }
    
    // Check for double booking
    const isConflict = bookings.some(b => 
      b.stylistName === selectedStylistName &&
      b.date === date &&
      b.time === time &&
      b.status !== 'Cancelled' &&
      b.status !== 'Rejected'
    );

    if (isConflict) {
      alert(`Sorry, ${selectedStylistName} is already booked on ${date} at ${time}. Please select a different time or stylist.`);
      return;
    }

    setShowRazorpay(true);
  };

  const handlePaymentSuccess = async (paymentDetails) => {
    setShowRazorpay(false);
    const bookingData = {
      customerName,
      customerPhone,
      serviceTitle: selectedService.title,
      serviceId: selectedService.id,
      stylistName: selectedStylistName,
      type: 'in-shop',
      date,
      time,
      address: 'N/A (In-Shop Salon Visit)',
      landmark: '',
      specialNotes,
      amount: selectedService.price
    };

    const newBk = await addBooking(bookingData, paymentDetails);
    setCreatedBooking(newBk);
  };

  return (
    <div style={{ maxWidth: '840px', margin: '0 auto', paddingBottom: '3rem' }}>
      
      {/* Page Header */}
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <span className="badge badge-inshop" style={{ marginBottom: '0.5rem' }}>
          <Scissors size={14} /> In-Shop Luxury Salon Appointment
        </span>
        <h1 className="font-serif gold-text" style={{ fontSize: '2.2rem', margin: '0.4rem 0' }}>
          Schedule Your Luxury Salon Visit
        </h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          Select your desired service, master stylist, and time slot
        </p>
      </div>

      <div className="glass-panel" style={{ padding: '2rem' }}>
        <form onSubmit={handleOpenCheckout}>
          
          {/* Step 1: Select Service */}
          <div className="form-group">
            <label className="form-label">Select Salon Service</label>
            <select 
              className="form-select" 
              value={selectedServiceId} 
              onChange={(e) => setSelectedServiceId(e.target.value)}
            >
              {services.map(s => (
                <option key={s.id} value={s.id}>
                  {s.title} — ₹{s.price} ({s.duration}) {s.seniorCare ? '• Senior Care Available' : ''}
                </option>
              ))}
            </select>
          </div>

          {/* Step 2: Select Master Stylist / Specialist */}
          <div className="form-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
              <label className="form-label" style={{ margin: 0 }}>
                Select Master Stylist / Specialist
              </label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <select 
                  className="form-select" 
                  style={{ width: 'auto', padding: '0.25rem 2rem 0.25rem 0.5rem', fontSize: '0.8rem', background: 'rgba(0,0,0,0.3)', minHeight: 'auto' }}
                  value={preferredGender}
                  onChange={(e) => setPreferredGender(e.target.value)}
                >
                  <option value="No Preference">Any Gender</option>
                  <option value="Male">Male Stylist</option>
                  <option value="Female">Female Stylist</option>
                </select>
                {staff.some(s => s.isLoggedIn) && (
                  <span className="badge badge-confirmed" style={{ fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', display: 'inline-block' }}></span>
                    Staff Active in Salon
                  </span>
                )}
              </div>
            </div>

            {filteredStaff.length === 0 && (
              <div style={{ padding: '1rem', background: 'rgba(244,63,94,0.1)', color: '#f43f5e', borderRadius: '4px', border: '1px solid rgba(244,63,94,0.2)', marginBottom: '1rem' }}>
                No specialists found matching your preference.
              </div>
            )}

            {/* Stylist Grid Cards for visual selection */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '0.75rem', marginBottom: '0.75rem' }}>
              {filteredStaff.map(stf => {
                const isSelected = selectedStylistName === stf.name;
                const isOnline = stf.isLoggedIn || (currentUser?.role === 'staff' && currentUser?.name === stf.name);
                return (
                  <div
                    key={stf.id}
                    onClick={() => setSelectedStylistName(stf.name)}
                    style={{
                      padding: '0.85rem',
                      borderRadius: 'var(--radius-sm)',
                      border: isSelected ? '2px solid var(--accent-gold)' : '1px solid var(--border-subtle)',
                      background: isSelected ? 'rgba(217, 119, 6, 0.12)' : 'var(--bg-glass)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      position: 'relative',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <img 
                      src={stf.avatar} 
                      alt={stf.name} 
                      style={{ width: '44px', height: '44px', borderRadius: '50%', objectFit: 'cover', border: isOnline ? '2px solid #10b981' : '1px solid var(--border-subtle)' }}
                    />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ fontWeight: 600, fontSize: '0.9rem', color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {stf.name}
                        </span>
                        {isOnline && (
                          <span title="Currently Online & Active" style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#10b981', display: 'inline-block', flexShrink: 0 }}></span>
                        )}
                        <span style={{
                          fontSize: '0.65rem',
                          fontWeight: 700,
                          padding: '0.05rem 0.45rem',
                          borderRadius: '9999px',
                          background: stf.level === 'Lead' ? 'rgba(236,72,153,0.15)' : stf.level === 'Senior' ? 'rgba(245,158,11,0.15)' : stf.level === 'Mid-Level' ? 'rgba(16,185,129,0.15)' : 'rgba(59,130,246,0.15)',
                          color: stf.level === 'Lead' ? '#f472b6' : stf.level === 'Senior' ? '#fbbf24' : stf.level === 'Mid-Level' ? '#34d399' : '#60a5fa',
                          border: `1px solid ${stf.level === 'Lead' ? 'rgba(236,72,153,0.3)' : stf.level === 'Senior' ? 'rgba(245,158,11,0.3)' : stf.level === 'Mid-Level' ? 'rgba(16,185,129,0.3)' : 'rgba(59,130,246,0.3)'}`
                        }}>
                          {stf.level || 'Junior'}
                        </span>
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {stf.role}
                      </div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--accent-gold)', fontWeight: 600 }}>
                        ⭐ {stf.rating} ({stf.experience}) {isOnline ? '• Active' : ''}
                      </div>
                    </div>
                    {isSelected && (
                      <Check size={16} color="var(--accent-gold)" style={{ flexShrink: 0 }} />
                    )}
                  </div>
                );
              })}
            </div>

            {/* Fallback Dropdown */}
            {filteredStaff.length > 0 && (
              <select 
                className="form-select" 
                value={selectedStylistName} 
                onChange={(e) => setSelectedStylistName(e.target.value)}
              >
                {filteredStaff.map(stf => {
                  const isOnline = stf.isLoggedIn || (currentUser?.role === 'staff' && currentUser?.name === stf.name);
                  return (
                    <option key={stf.id} value={stf.name}>
                      {isOnline ? '🟢 [ONLINE] ' : '👤 '}{stf.name} — {stf.role} (⭐{stf.rating})
                    </option>
                  );
                })}
              </select>
            )}
            
            {/* Selected Stylist Profile & Reviews Details */}
            {selectedStylist && (
              <div style={{ padding: '1.25rem', marginTop: '1rem', borderRadius: 'var(--radius-sm)', background: 'var(--bg-glass)', border: '1px solid var(--border-subtle)' }}>
                <h4 style={{ margin: '0 0 0.5rem 0', color: 'var(--accent-gold)' }}>Specialist Profile: {selectedStylist.name}</h4>
                {selectedStylist.workingHistory && (
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem', lineHeight: '1.4' }}>
                    <strong style={{ color: 'var(--text-primary)' }}>Working History & Experience:</strong> {selectedStylist.workingHistory}
                  </div>
                )}
                
                {(() => {
                  const recentReviews = feedback ? feedback.filter(f => f.stylistName === selectedStylist.name).slice(0, 4) : [];
                  if (recentReviews.length === 0) return null;
                  return (
                    <div>
                      <strong style={{ fontSize: '0.85rem', color: 'var(--text-primary)' }}>Recent Customer Reviews:</strong>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '0.75rem', marginTop: '0.75rem' }}>
                        {recentReviews.map((rev, idx) => (
                          <div key={idx} style={{ padding: '0.75rem', background: 'rgba(0,0,0,0.2)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                              <span style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-primary)' }}>{rev.customerName}</span>
                              <span style={{ fontSize: '0.75rem', color: 'var(--accent-gold)' }}>{'⭐'.repeat(rev.rating)}</span>
                            </div>
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontStyle: 'italic' }}>"{rev.comment}"</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}
          </div>

          {/* Step 3: Schedule Date & Time Slot */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '1.25rem' }}>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Appointment Date</label>
              <input 
                type="date" 
                className="form-input" 
                value={date} 
                min={todayDateStr}
                onChange={(e) => setDate(e.target.value)} 
                required 
              />
            </div>

            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Time Slot</label>
              <select className="form-select" value={time} onChange={(e) => setTime(e.target.value)}>
                <option>09:00 AM</option>
                <option>10:30 AM</option>
                <option>11:00 AM</option>
                <option>02:00 PM</option>
                <option>04:00 PM</option>
                <option>06:00 PM</option>
                <option>08:00 PM</option>
              </select>
            </div>
          </div>

          {/* Step 4: Customer Details */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '1.25rem' }}>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Customer Full Name</label>
              <input 
                type="text" 
                className="form-input" 
                placeholder="e.g. Akash Sharma" 
                value={customerName} 
                onChange={(e) => setCustomerName(e.target.value)} 
                required 
              />
            </div>

            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Contact Phone Number</label>
              <input 
                type="tel" 
                className="form-input" 
                placeholder="+91 98765 43210" 
                value={customerPhone} 
                onChange={(e) => setCustomerPhone(e.target.value)} 
                required 
              />
            </div>
          </div>

          {/* Step 5: Special Notes */}
          <div className="form-group">
            <label className="form-label">Special Hair / Styling Requests (Optional)</label>
            <textarea 
              className="form-textarea" 
              rows={2}
              placeholder="e.g. Low fade taper, sensitive skin on scalp, organic hair wash only..."
              value={specialNotes}
              onChange={(e) => setSpecialNotes(e.target.value)}
            />
          </div>

          {/* Summary & Price */}
          <div style={{ 
            background: 'rgba(217, 119, 6, 0.08)', 
            border: '1px solid rgba(217, 119, 6, 0.25)', 
            padding: '1.25rem', 
            borderRadius: 'var(--radius-sm)',
            marginBottom: '1.5rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1rem'
          }}>
            <div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Estimated Appointment Fee</div>
              <div style={{ color: 'var(--accent-gold)', fontSize: '1.8rem', fontWeight: 'bold' }}>
                ₹{selectedService.price}
              </div>
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
                Assigned Specialist: <strong>{selectedStylistName}</strong>
              </div>
            </div>

            <button type="submit" className="btn-gold" style={{ padding: '0.9rem 2rem', fontSize: '1rem' }}>
              <Sparkles size={18} /> Pay ₹{selectedService.price}
            </button>
          </div>

        </form>
      </div>

      {/* Razorpay Live Gateway Modal */}
      {showRazorpay && (
        <RazorpayModal
          bookingDetails={{
            serviceTitle: selectedService.title,
            amount: selectedService.price,
            type: 'in-shop'
          }}
          onPaymentSuccess={handlePaymentSuccess}
          onClose={() => setShowRazorpay(false)}
        />
      )}

      {/* Booking Confirmation Ticket Modal */}
      {createdBooking && (
        <TicketModal 
          booking={createdBooking} 
          onClose={() => {
            setCreatedBooking(null);
            setCustomerTab('my-bookings');
          }} 
        />
      )}

    </div>
  );
};
