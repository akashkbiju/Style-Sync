import React, { useState } from 'react';
import { useSalon } from '../../context/SalonContext';
import { RazorpayModal } from '../../components/RazorpayModal';
import { TicketModal } from '../../components/TicketModal';
import { Calendar, Clock, User, Phone, Scissors, CheckCircle2, Sparkles } from 'lucide-react';

export const BookInShop = () => {
  const { services, staff, addBooking, setCustomerTab } = useSalon();

  const [selectedServiceId, setSelectedServiceId] = useState(services[0]?.id || '');
  const [selectedStylistName, setSelectedStylistName] = useState(staff[0]?.name || '');
  const [date, setDate] = useState('2026-07-23');
  const [time, setTime] = useState('11:00 AM');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [specialNotes, setSpecialNotes] = useState('');

  const [showRazorpay, setShowRazorpay] = useState(false);
  const [createdBooking, setCreatedBooking] = useState(null);

  const selectedService = services.find(s => s.id === selectedServiceId) || services[0];

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
    <div style={{ maxWidth: '780px', margin: '0 auto', paddingBottom: '3rem' }}>
      
      {/* Page Header */}
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <span className="badge badge-inshop" style={{ marginBottom: '0.5rem' }}>
          <Scissors size={14} /> In-Shop Salon Appointment
        </span>
        <h1 className="font-serif gold-text" style={{ fontSize: '2.2rem', margin: '0.4rem 0' }}>
          Schedule Your Luxury Salon Visit
        </h1>
        <p style={{ color: 'var(--text-secondary)' }}>Select your desired service, master stylist, and time slot</p>
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
                  {s.title} — ₹{s.price} ({s.duration})
                </option>
              ))}
            </select>
          </div>

          {/* Step 2: Select Master Stylist */}
          <div className="form-group">
            <label className="form-label">Preferred Master Stylist / Specialist</label>
            <select 
              className="form-select" 
              value={selectedStylistName} 
              onChange={(e) => setSelectedStylistName(e.target.value)}
            >
              {staff.map(stf => (
                <option key={stf.id} value={stf.name}>
                  {stf.name} ({stf.role} — Rating: ⭐{stf.rating})
                </option>
              ))}
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
                placeholder="e.g. Adarsh Sharma" 
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

          <div className="form-group">
            <label className="form-label">Special Haircut / Styling Instructions (Optional)</label>
            <textarea 
              className="form-textarea" 
              rows={2} 
              placeholder="e.g. Low fade cut, sensitive skin facial..." 
              value={specialNotes} 
              onChange={(e) => setSpecialNotes(e.target.value)} 
            />
          </div>

          {/* Pricing Summary Box */}
          <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Selected Service Price</div>
              <div style={{ fontWeight: 600, color: '#fff' }}>{selectedService?.title}</div>
            </div>
            <div className="gold-text font-serif" style={{ fontSize: '1.6rem', fontWeight: 800 }}>
              ₹{selectedService?.price}
            </div>
          </div>

          {/* Submit Action */}
          <button type="submit" className="btn-gold" style={{ width: '100%', justifyContent: 'center', padding: '0.9rem', fontSize: '1.05rem' }}>
            <Sparkles size={18} /> Proceed to Razorpay Test Payment (₹{selectedService?.price})
          </button>

        </form>
      </div>

      {/* Razorpay Test Modal */}
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

      {/* Ticket Confirmation Modal */}
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
