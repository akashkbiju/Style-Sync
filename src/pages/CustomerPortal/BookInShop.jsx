import React, { useState } from 'react';
import { useSalon } from '../../context/SalonContext';
import { RazorpayModal } from '../../components/RazorpayModal';
import { TicketModal } from '../../components/TicketModal';
import { Calendar, Clock, User, Phone, Scissors, CheckCircle2, Sparkles, Check } from 'lucide-react';

export const BookInShop = () => {
  const { services, staff, addBooking, setCustomerTab, currentUser } = useSalon();

  // Find if any staff is actively logged in
  const loggedInStaff = staff.find(s => s.isLoggedIn) || staff[0];

  const [selectedServiceId, setSelectedServiceId] = useState(services[0]?.id || '');
  const [selectedStylistName, setSelectedStylistName] = useState(loggedInStaff?.name || staff[0]?.name || '');
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

  const selectedService = services.find(s => s.id === selectedServiceId) || services[0];
  const selectedStylist = staff.find(stf => stf.name === selectedStylistName) || staff[0];

  const handleOpenCheckout = (e) => {
    e.preventDefault();
    if (!customerName || !customerPhone) {
      alert('Please fill in your name and contact phone number.');
      return;
    }
    setShowRazorpay(true);
  };

  const handlePaymentSuccess = (paymentDetails) => {
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

    const newBk = addBooking(bookingData, paymentDetails);
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
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <label className="form-label" style={{ margin: 0 }}>
                Select Master Stylist / Specialist
              </label>
              {staff.some(s => s.isLoggedIn) && (
                <span className="badge badge-confirmed" style={{ fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', display: 'inline-block' }}></span>
                  Staff Active in Salon
                </span>
              )}
            </div>

            {/* Stylist Grid Cards for visual selection */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '0.75rem', marginBottom: '0.75rem' }}>
              {staff.map(stf => {
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
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <span style={{ fontWeight: 600, fontSize: '0.9rem', color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {stf.name}
                        </span>
                        {isOnline && (
                          <span title="Currently Online & Active" style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#10b981', display: 'inline-block', flexShrink: 0 }}></span>
                        )}
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
            <select 
              className="form-select" 
              value={selectedStylistName} 
              onChange={(e) => setSelectedStylistName(e.target.value)}
            >
              {staff.map(stf => {
                const isOnline = stf.isLoggedIn || (currentUser?.role === 'staff' && currentUser?.name === stf.name);
                return (
                  <option key={stf.id} value={stf.name}>
                    {isOnline ? '🟢 [ONLINE] ' : '👤 '}{stf.name} — {stf.role} (⭐{stf.rating})
                  </option>
                );
              })}
            </select>
          </div>

          {/* Step 3: Schedule Date & Time Slot */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '1.25rem' }}>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Appointment Date</label>
              <input 
                type="date" 
                className="form-input" 
                value={date} 
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
              <Sparkles size={18} /> Confirm & Pay with Razorpay
            </button>
          </div>

        </form>
      </div>

      {/* Razorpay Simulation Modal */}
      {showRazorpay && (
        <RazorpayModal
          amount={selectedService.price}
          customerName={customerName}
          customerPhone={customerPhone}
          serviceTitle={selectedService.title}
          onSuccess={handlePaymentSuccess}
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
