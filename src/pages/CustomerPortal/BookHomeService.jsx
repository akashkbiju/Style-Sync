import React, { useState } from 'react';
import { useSalon } from '../../context/SalonContext';
import { RazorpayModal } from '../../components/RazorpayModal';
import { TicketModal } from '../../components/TicketModal';
import { HeartHandshake, MapPin, Calendar, Clock, User, Phone, ShieldCheck, Sparkles, AlertCircle } from 'lucide-react';

export const BookHomeService = () => {
  const { services, staff, addBooking, setCustomerTab } = useSalon();

  // Filter home-service available items
  const homeServices = services.filter(s => s.homeServiceAvailable);

  const [selectedServiceId, setSelectedServiceId] = useState(homeServices[0]?.id || services[0]?.id || '');
  const [selectedStylistName, setSelectedStylistName] = useState(staff[1]?.name || staff[0]?.name || '');
  const [date, setDate] = useState('2026-07-23');
  const [time, setTime] = useState('11:00 AM');
  
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [address, setAddress] = useState('');
  const [landmark, setLandmark] = useState('');
  const [elderlyCareNotes, setElderlyCareNotes] = useState('');

  const [showRazorpay, setShowRazorpay] = useState(false);
  const [createdBooking, setCreatedBooking] = useState(null);

  const selectedService = services.find(s => s.id === selectedServiceId) || services[0];

  const handleOpenCheckout = (e) => {
    e.preventDefault();
    if (!customerName || !customerPhone || !address) {
      alert('Please fill in customer name, contact phone, and full delivery home address.');
      return;
    }
    setShowRazorpay(true);
  };

  const handlePaymentSuccess = (paymentDetails) => {
    setShowRazorpay(false);
    const bookingData = {
      customerName: customerName + ' (Elderly/Home Visit)',
      customerPhone,
      serviceTitle: selectedService.title,
      serviceId: selectedService.id,
      stylistName: selectedStylistName,
      type: 'home-service',
      date,
      time,
      address,
      landmark,
      specialNotes: elderlyCareNotes || 'Home visit requested for senior citizen / elderly client.',
      amount: selectedService.price
    };

    const newBk = addBooking(bookingData, paymentDetails);
    setCreatedBooking(newBk);
  };

  return (
    <div style={{ maxWidth: '820px', margin: '0 auto', paddingBottom: '3rem' }}>
      
      {/* Feature Title Banner */}
      <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem', borderLeft: '4px solid #c084fc', background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.12) 0%, rgba(19, 19, 26, 0.9) 100%)' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(168, 85, 247, 0.2)', color: '#c084fc', padding: '0.35rem 0.85rem', borderRadius: 'var(--radius-full)', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.75rem' }}>
          <HeartHandshake size={15} /> MCA Key Feature: Senior Citizen & At-Home Care
        </div>
        <h1 className="font-serif" style={{ color: '#fff', fontSize: '2rem', margin: 0 }}>
          Home Service Request Portal
        </h1>
        <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem', fontSize: '0.95rem' }}>
          Designed specifically for elderly citizens, persons with mobility challenges, and clients who prefer high-hygiene salon treatments in the comfort of their home.
        </p>
      </div>

      <div className="glass-panel" style={{ padding: '2rem' }}>
        <form onSubmit={handleOpenCheckout}>
          
          {/* Service Selection */}
          <div className="form-group">
            <label className="form-label">Select Home Salon Service</label>
            <select 
              className="form-select" 
              value={selectedServiceId} 
              onChange={(e) => setSelectedServiceId(e.target.value)}
            >
              {homeServices.map(s => (
                <option key={s.id} value={s.id}>
                  🏡 {s.title} — ₹{s.price} ({s.duration})
                </option>
              ))}
            </select>
          </div>

          {/* Assigned Specialist */}
          <div className="form-group">
            <label className="form-label">Assigned Home Visit Stylist / Specialist</label>
            <select 
              className="form-select" 
              value={selectedStylistName} 
              onChange={(e) => setSelectedStylistName(e.target.value)}
            >
              {staff.map(stf => (
                <option key={stf.id} value={stf.name}>
                  {stf.name} ({stf.specialty})
                </option>
              ))}
            </select>
          </div>

          {/* Customer & Address Details */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '1.25rem' }}>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Customer / Senior Citizen Name</label>
              <input 
                type="text" 
                className="form-input" 
                placeholder="e.g. Robert Vance (Age 76)" 
                value={customerName} 
                onChange={(e) => setCustomerName(e.target.value)} 
                required 
              />
            </div>

            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Contact Phone / Attendant Phone</label>
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

          {/* Full Home Address & Landmark */}
          <div className="form-group">
            <label className="form-label">Full Home Address (Door No, Apartment, Street, City)</label>
            <textarea 
              className="form-textarea" 
              rows={2} 
              placeholder="e.g. Flat 402, Sunshine Heights, M.G. Road, Bengaluru..." 
              value={address} 
              onChange={(e) => setAddress(e.target.value)} 
              required 
            />
          </div>

          <div className="form-group">
            <label className="form-label">Nearby Landmark (For Visiting Stylist)</label>
            <input 
              type="text" 
              className="form-input" 
              placeholder="e.g. Opposite Metro Station / Near Apollo Pharmacy" 
              value={landmark} 
              onChange={(e) => setLandmark(e.target.value)} 
            />
          </div>

          {/* Elderly / Special Requirements */}
          <div className="form-group">
            <label className="form-label" style={{ color: '#c084fc', fontWeight: 600 }}>
              Special Assistance & Elderly Care Instructions
            </label>
            <textarea 
              className="form-textarea" 
              rows={2} 
              placeholder="e.g. Customer uses wheelchair, requires extra gentle handling, gentle scalp trim..." 
              value={elderlyCareNotes} 
              onChange={(e) => setElderlyCareNotes(e.target.value)} 
            />
          </div>

          {/* Schedule Date & Time */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '1.5rem' }}>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Home Visit Date</label>
              <input 
                type="date" 
                className="form-input" 
                value={date} 
                onChange={(e) => setDate(e.target.value)} 
                required 
              />
            </div>

            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Preferred Time Slot</label>
              <select className="form-select" value={time} onChange={(e) => setTime(e.target.value)}>
                <option>10:00 AM (Morning Visit)</option>
                <option>01:00 PM (Afternoon Visit)</option>
                <option>04:00 PM (Evening Visit)</option>
              </select>
            </div>
          </div>

          {/* Price Box */}
          <div style={{ background: 'rgba(168, 85, 247, 0.1)', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(168, 85, 247, 0.3)', marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: '0.8rem', color: '#c084fc', fontWeight: 600 }}>Home Visit Service Charge</div>
              <div style={{ fontWeight: 600, color: '#fff' }}>{selectedService?.title}</div>
            </div>
            <div className="gold-text font-serif" style={{ fontSize: '1.6rem', fontWeight: 800 }}>
              ₹{selectedService?.price}
            </div>
          </div>

          {/* Action Button */}
          <button 
            type="submit" 
            className="btn-red-neon" 
            style={{ 
              width: '100%', 
              justifyContent: 'center', 
              padding: '0.9rem', 
              fontSize: '1.05rem'
            }}
          >
            <HeartHandshake size={18} /> Request Home Visit via Razorpay (₹{selectedService?.price})
          </button>

        </form>
      </div>

      {/* Razorpay Test Gateway Modal */}
      {showRazorpay && (
        <RazorpayModal 
          bookingDetails={{
            serviceTitle: selectedService.title + ' (Home Service)',
            amount: selectedService.price,
            type: 'home-service'
          }}
          onPaymentSuccess={handlePaymentSuccess}
          onClose={() => setShowRazorpay(false)}
        />
      )}

      {/* Ticket Modal */}
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
