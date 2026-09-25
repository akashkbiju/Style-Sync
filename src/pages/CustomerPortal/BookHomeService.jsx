import React, { useState } from 'react';
import { useSalon } from '../../context/SalonContext';
import { RazorpayModal } from '../../components/RazorpayModal';
import { TicketModal } from '../../components/TicketModal';
import { 
  HeartHandshake, 
  MapPin, 
  Calendar, 
  Clock, 
  User, 
  Phone, 
  ShieldCheck, 
  Sparkles, 
  Check,
  Award,
  AlertCircle,
  HelpCircle,
  Activity,
  Bed,
  Smile,
  VolumeX,
  UserCheck
} from 'lucide-react';

export const BookHomeService = () => {
  const { services, staff, addBooking, setCustomerTab, currentUser } = useSalon();

  // All home services
  const homeServices = services.filter(s => s.homeServiceAvailable);

  // Category filter state: 'all' | 'senior' | 'hair' | 'body'
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('senior');

  const filteredServices = homeServices.filter(s => {
    if (selectedCategoryFilter === 'senior') return s.seniorCare || s.category === 'Senior Care';
    if (selectedCategoryFilter === 'hair') return s.category === 'Hair' || s.category === 'Grooming';
    if (selectedCategoryFilter === 'body') return s.category === 'Skincare' || s.category === 'Nails';
    return true; // 'all'
  });

  const [selectedServiceId, setSelectedServiceId] = useState(
    homeServices.find(s => s.seniorCare)?.id || homeServices[0]?.id || ''
  );
  
  // Prefer currently active / logged in staff member if present
  const activeStaff = staff.find(s => s.isLoggedIn) || staff[0];
  const [selectedStylistName, setSelectedStylistName] = useState(activeStaff?.name || '');
  const [date, setDate] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().substring(0, 10);
  });
  const [time, setTime] = useState('11:00 AM');
  
  const [customerName, setCustomerName] = useState(currentUser?.name || '');
  const [customerPhone, setCustomerPhone] = useState(currentUser?.phone || '');
  const [address, setAddress] = useState('');
  const [landmark, setLandmark] = useState('');
  
  // Senior citizen specific assistance toggles
  const [assistanceTags, setAssistanceTags] = useState(['Gentle Scalp Care', 'Quiet Session']);
  const [customCareNotes, setCustomCareNotes] = useState('');

  const [showRazorpay, setShowRazorpay] = useState(false);
  const [createdBooking, setCreatedBooking] = useState(null);

  const selectedService = services.find(s => s.id === selectedServiceId) || homeServices[0] || services[0];
  const selectedStylist = staff.find(stf => stf.name === selectedStylistName) || staff[0];

  const availableAssistanceOptions = [
    { id: 'wheelchair', label: 'Wheelchair / Limited Mobility', icon: '🦽' },
    { id: 'bedside', label: 'In-Bed / Bedside Assisted Grooming', icon: '🛏️' },
    { id: 'gentle', label: 'Gentle Scalp Care & Soft Handling', icon: '🌿' },
    { id: 'quiet', label: 'Quiet & Calming Environment', icon: '🤫' },
    { id: 'female-stylist', label: 'Female Stylist Preferred', icon: '👩' },
    { id: 'medical-aware', label: 'Oxygen / Medical Device Awareness', icon: '🫁' },
  ];

  const toggleAssistance = (label) => {
    setAssistanceTags(prev => 
      prev.includes(label) ? prev.filter(t => t !== label) : [...prev, label]
    );
  };

  const handleOpenCheckout = (e) => {
    e.preventDefault();
    if (!customerName.trim() || !customerPhone.trim() || !address.trim()) {
      alert('Please provide the client name, contact phone, and complete home address.');
      return;
    }
    setShowRazorpay(true);
  };

  const handlePaymentSuccess = (paymentDetails) => {
    setShowRazorpay(false);
    
    // Compile assistance requirements
    const notesSummary = [
      assistanceTags.length > 0 ? `[Special Needs: ${assistanceTags.join(', ')}]` : '',
      customCareNotes.trim() ? `Note: ${customCareNotes}` : ''
    ].filter(Boolean).join(' | ') || 'Home visit requested for senior citizen / wellness client.';

    const bookingData = {
      customerName: selectedService.seniorCare 
        ? `${customerName} (Senior Home Care)` 
        : `${customerName} (Home Service)`,
      customerPhone,
      serviceTitle: selectedService.title,
      serviceId: selectedService.id,
      stylistName: selectedStylistName,
      type: 'home-service',
      date,
      time,
      address,
      landmark,
      specialNotes: notesSummary,
      amount: selectedService.price
    };

    const newBk = addBooking(bookingData, paymentDetails);
    setCreatedBooking(newBk);
  };

  return (
    <div className="max-w-7xl mx-auto pb-16">
      
      {/* ── Senior Care Banner Header ─────────────────────────────────────── */}
      <section 
        className="relative overflow-hidden rounded-xl border p-6 md:p-10 mb-10 transition-colors duration-300"
        style={{
          background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.15) 0%, rgba(225, 29, 72, 0.08) 50%, var(--bg-card) 100%)',
          borderColor: 'rgba(168, 85, 247, 0.3)'
        }}
      >
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-4 border"
            style={{ 
              backgroundColor: 'rgba(168, 85, 247, 0.15)', 
              color: 'var(--accent-purple)',
              borderColor: 'rgba(168, 85, 247, 0.3)'
            }}
          >
            <HeartHandshake size={15} /> Dedicated Senior Citizen & Home Service Program
          </div>
          
          <h1 className="font-display text-3xl md:text-5xl font-bold tracking-tight mb-3" style={{ color: 'var(--text-primary)' }}>
            Gentle Luxury Grooming <span className="text-primary">At Your Doorstep</span>
          </h1>
          
          <p className="text-sm md:text-base leading-relaxed mb-6" style={{ color: 'var(--text-secondary)' }}>
            Specialized in-home styling and therapeutic salon treatments designed with deep empathy for senior citizens, 
            bedridden elders, and clients who cherish hospital-grade hygiene in their own living room.
          </p>

          {/* Value Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="flex items-center gap-2 p-2.5 rounded bg-black/20 dark:bg-white/5 border border-white/10">
              <ShieldCheck size={16} className="text-emerald-400 shrink-0" />
              <span>100% Background-Verified Staff</span>
            </div>
            <div className="flex items-center gap-2 p-2.5 rounded bg-black/20 dark:bg-white/5 border border-white/10">
              <Sparkles size={16} className="text-purple-400 shrink-0" />
              <span>Sanitized Tool Kit & Sheets</span>
            </div>
            <div className="flex items-center gap-2 p-2.5 rounded bg-black/20 dark:bg-white/5 border border-white/10">
              <Bed size={16} className="text-blue-400 shrink-0" />
              <span>In-Bed / Bedside Capable</span>
            </div>
            <div className="flex items-center gap-2 p-2.5 rounded bg-black/20 dark:bg-white/5 border border-white/10">
              <Smile size={16} className="text-rose-400 shrink-0" />
              <span>Zero Travel Surcharge</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Category Filter Switcher ────────────────────────────────────── */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-xl font-bold font-display" style={{ color: 'var(--text-primary)' }}>
            Step 1: Choose Your Home Treatment
          </h2>
          <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
            All packages include complete sanitized equipment and post-service clean-up.
          </p>
        </div>

        <div className="flex items-center gap-1.5 p-1 rounded-lg border" style={{ backgroundColor: 'var(--bg-glass)', borderColor: 'var(--border-subtle)' }}>
          {[
            { key: 'senior', label: '👴 Senior Specials', count: homeServices.filter(s => s.seniorCare).length },
            { key: 'hair', label: '✂️ Hair & Shave', count: homeServices.filter(s => s.category === 'Hair' || s.category === 'Grooming').length },
            { key: 'body', label: '✨ Spa & Nails', count: homeServices.filter(s => s.category === 'Skincare' || s.category === 'Nails').length },
            { key: 'all', label: 'All Services', count: homeServices.length }
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setSelectedCategoryFilter(tab.key)}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5
                ${selectedCategoryFilter === tab.key
                  ? 'bg-primary text-white shadow-[0_0_10px_rgba(225,29,72,0.4)]'
                  : 'text-slate-400 hover:text-[var(--text-primary)]'
                }`}
            >
              {tab.label}
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${selectedCategoryFilter === tab.key ? 'bg-black/30 text-white' : 'bg-white/10 text-slate-400'}`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* ── Services Cards Grid ────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {filteredServices.map(service => {
          const isSelected = selectedServiceId === service.id;
          return (
            <div
              key={service.id}
              onClick={() => setSelectedServiceId(service.id)}
              className={`group relative rounded-xl border p-5 transition-all duration-300 cursor-pointer flex flex-col justify-between
                ${isSelected 
                  ? 'border-primary ring-2 ring-primary/40 shadow-[0_0_25px_rgba(225,29,72,0.25)]' 
                  : 'border-[var(--border-subtle)] hover:border-primary/50'
                }`}
              style={{ backgroundColor: 'var(--bg-card)' }}
            >
              {/* Top image & Tag */}
              <div>
                <div className="relative h-44 rounded-lg overflow-hidden mb-4">
                  <img 
                    src={service.image} 
                    alt={service.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                  
                  {/* Category / Senior Tag */}
                  <div className="absolute top-3 left-3 flex gap-1.5 flex-wrap">
                    {service.seniorCare ? (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-purple-950/90 text-purple-300 border border-purple-500/40 shadow-sm">
                        👴 Senior Citizen Care
                      </span>
                    ) : (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-black/70 text-slate-300 border border-white/20">
                        {service.category}
                      </span>
                    )}
                    {service.tag && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-rose-950/90 text-rose-300 border border-rose-500/40">
                        {service.tag}
                      </span>
                    )}
                  </div>

                  {/* Selected Indicator Ribbon */}
                  {isSelected && (
                    <div className="absolute top-3 right-3 w-7 h-7 rounded-full bg-primary text-white flex items-center justify-center shadow-lg">
                      <Check size={16} />
                    </div>
                  )}

                  {/* Price & Duration Overlay */}
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white">
                    <span className="font-display text-2xl font-bold text-primary">
                      ₹{service.price}
                    </span>
                    <span className="text-xs bg-black/60 backdrop-blur-sm px-2.5 py-1 rounded border border-white/10 flex items-center gap-1">
                      <Clock size={12} /> {service.duration}
                    </span>
                  </div>
                </div>

                <h3 className="font-display text-lg font-bold mb-1.5 group-hover:text-primary transition-colors" style={{ color: 'var(--text-primary)' }}>
                  {service.title}
                </h3>
                <p className="text-xs leading-relaxed mb-3" style={{ color: 'var(--text-secondary)' }}>
                  {service.description}
                </p>

                {/* Benefits Pills */}
                {service.benefits && (
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {service.benefits.map((benefit, idx) => (
                      <span 
                        key={idx} 
                        className="text-[10px] px-2 py-0.5 rounded border"
                        style={{ 
                          backgroundColor: 'var(--bg-glass)', 
                          borderColor: 'var(--border-subtle)',
                          color: 'var(--text-secondary)'
                        }}
                      >
                        ✓ {benefit}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Select Button Indicator */}
              <div className="pt-3 border-t flex items-center justify-between" style={{ borderColor: 'var(--border-subtle)' }}>
                <span className="text-[11px] font-medium" style={{ color: 'var(--text-muted)' }}>
                  {isSelected ? '✓ Selected for booking' : 'Click to select this service'}
                </span>
                <span className={`text-xs font-bold uppercase tracking-wider ${isSelected ? 'text-primary' : 'text-slate-400 group-hover:text-white'}`}>
                  {isSelected ? 'Selected' : 'Select'} →
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Booking Form & Summary Section (2-Column Split) ─────────────── */}
      <form onSubmit={handleOpenCheckout} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Form: Details, Schedule, Assistance (7 Columns) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Step 2: Senior Assistance & Special Needs Card */}
          <div className="p-6 rounded-xl border" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'rgba(168, 85, 247, 0.3)' }}>
            <div className="flex items-center gap-2 mb-3">
              <HeartHandshake size={18} className="text-purple-400" />
              <h2 className="text-lg font-bold font-display" style={{ color: 'var(--text-primary)' }}>
                Step 2: Senior Citizen Special Assistance
              </h2>
            </div>
            <p className="text-xs mb-4" style={{ color: 'var(--text-secondary)' }}>
              Select any special needs to help our visiting stylist prepare the appropriate gentle tools and setup:
            </p>

            {/* Assistance Option Chips */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-4">
              {availableAssistanceOptions.map(opt => {
                const isActive = assistanceTags.includes(opt.label);
                return (
                  <button
                    type="button"
                    key={opt.id}
                    onClick={() => toggleAssistance(opt.label)}
                    className={`p-3 rounded-lg border text-left flex items-center gap-3 transition-all cursor-pointer
                      ${isActive 
                        ? 'border-purple-500 bg-purple-950/30 text-purple-200 shadow-[0_0_12px_rgba(168,85,247,0.25)]' 
                        : 'border-[var(--border-subtle)] bg-[var(--bg-glass)] text-slate-400 hover:text-[var(--text-primary)]'
                      }`}
                  >
                    <span className="text-lg">{opt.icon}</span>
                    <div className="flex-1 text-xs font-semibold leading-tight">
                      {opt.label}
                    </div>
                    {isActive && <Check size={14} className="text-purple-400 shrink-0" />}
                  </button>
                );
              })}
            </div>

            {/* Custom Notes */}
            <div className="form-group mb-0">
              <label className="form-label text-xs">Additional Care Instructions (Optional)</label>
              <textarea
                rows={2}
                className="form-textarea text-xs"
                placeholder="e.g. Please ring bell softly, client has hearing sensitivity, prefers extra gentle massage on right shoulder..."
                value={customCareNotes}
                onChange={(e) => setCustomCareNotes(e.target.value)}
              />
            </div>
          </div>

          {/* Step 3: Stylist & Schedule */}
          <div className="p-6 rounded-xl border" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-subtle)' }}>
            <h2 className="text-lg font-bold font-display mb-4" style={{ color: 'var(--text-primary)' }}>
              Step 3: Specialist & Schedule
            </h2>

            {/* Stylist Selector */}
            <div className="form-group mb-5">
              <div className="flex items-center justify-between mb-2">
                <label className="form-label text-xs mb-0">Certified Home Visit Specialist</label>
                {staff.some(s => s.isLoggedIn) && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-950/80 text-emerald-400 border border-emerald-500/30 flex items-center gap-1 font-bold">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    Stylist Online in Salon
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {staff.map(stf => {
                  const isSelected = selectedStylistName === stf.name;
                  const isOnline = stf.isLoggedIn || (currentUser?.role === 'staff' && currentUser?.name === stf.name);
                  return (
                    <div
                      key={stf.id}
                      onClick={() => setSelectedStylistName(stf.name)}
                      className={`p-3 rounded-lg border flex items-center gap-3 cursor-pointer transition-all relative
                        ${isSelected 
                          ? 'border-primary bg-primary/10 text-white ring-1 ring-primary' 
                          : 'border-[var(--border-subtle)] bg-[var(--bg-glass)] text-slate-300 hover:border-white/30'
                        }`}
                    >
                      <div className="relative shrink-0">
                        <img src={stf.avatar} alt={stf.name} className="w-11 h-11 rounded-full object-cover" />
                        {isOnline && (
                          <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-black" title="Staff Logged In & Available"></span>
                        )}
                      </div>
                      <div className="flex-1 overflow-hidden">
                        <div className="flex items-center gap-1.5">
                          <p className="text-xs font-bold truncate" style={{ color: 'var(--text-primary)' }}>{stf.name}</p>
                          {isOnline && (
                            <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">ONLINE</span>
                          )}
                        </div>
                        <p className="text-[10px] truncate" style={{ color: 'var(--text-secondary)' }}>{stf.specialty}</p>
                        <span className="text-[10px] text-amber-400 font-semibold">★ {stf.rating} ({stf.experience})</span>
                      </div>
                      {isSelected && <Check size={16} className="text-primary shrink-0" />}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Date & Time Slot */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="form-group mb-0">
                <label className="form-label text-xs flex items-center gap-1.5">
                  <Calendar size={13} /> Visit Date
                </label>
                <input 
                  type="date" 
                  className="form-input" 
                  value={date} 
                  onChange={(e) => setDate(e.target.value)} 
                  required 
                />
              </div>

              <div className="form-group mb-0">
                <label className="form-label text-xs flex items-center gap-1.5">
                  <Clock size={13} /> Preferred Time Slot
                </label>
                <select className="form-select" value={time} onChange={(e) => setTime(e.target.value)}>
                  <option value="10:00 AM">🌅 10:00 AM (Morning Calm)</option>
                  <option value="01:00 PM">☀️ 01:00 PM (Afternoon)</option>
                  <option value="04:00 PM">☕ 04:00 PM (Evening)</option>
                  <option value="06:00 PM">🌆 06:00 PM (Sunset Visit)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Step 4: Contact & Home Address */}
          <div className="p-6 rounded-xl border" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-subtle)' }}>
            <h2 className="text-lg font-bold font-display mb-4" style={{ color: 'var(--text-primary)' }}>
              Step 4: Client Contact & Address
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div className="form-group mb-0">
                <label className="form-label text-xs">Senior Citizen / Client Name</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="e.g. Robert Vance (Age 74)" 
                  value={customerName} 
                  onChange={(e) => setCustomerName(e.target.value)} 
                  required 
                />
              </div>

              <div className="form-group mb-0">
                <label className="form-label text-xs">Contact Phone / Guardian Phone</label>
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

            <div className="form-group mb-4">
              <label className="form-label text-xs flex items-center gap-1.5">
                <MapPin size={13} /> Complete Home Address
              </label>
              <textarea 
                className="form-textarea" 
                rows={2} 
                placeholder="House/Flat No, Apartment Name, Street, Locality, City & Pincode..." 
                value={address} 
                onChange={(e) => setAddress(e.target.value)} 
                required 
              />
            </div>

            <div className="form-group mb-0">
              <label className="form-label text-xs">Nearby Landmark (Optional)</label>
              <input 
                type="text" 
                className="form-input" 
                placeholder="e.g. Next to Apollo Clinic / Opposite Green Valley Park" 
                value={landmark} 
                onChange={(e) => setLandmark(e.target.value)} 
              />
            </div>
          </div>

        </div>

        {/* Right Sticky Column: Order Summary & Checkout (5 Columns) */}
        <div className="lg:col-span-5">
          <div 
            className="sticky top-28 p-6 rounded-xl border shadow-xl"
            style={{ 
              backgroundColor: 'var(--bg-card)', 
              borderColor: 'var(--border-strong)'
            }}
          >
            <div className="flex items-center justify-between pb-4 border-b mb-4" style={{ borderColor: 'var(--border-subtle)' }}>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-primary">Booking Summary</span>
                <h3 className="text-xl font-bold font-display" style={{ color: 'var(--text-primary)' }}>Home Visit Order</h3>
              </div>
              <span className="px-2.5 py-1 rounded bg-purple-500/20 text-purple-300 text-xs font-bold border border-purple-500/30">
                Senior Care
              </span>
            </div>

            {/* Selected Service Card */}
            <div className="flex gap-3.5 p-3.5 rounded-lg border mb-5" style={{ backgroundColor: 'var(--bg-glass)', borderColor: 'var(--border-subtle)' }}>
              <img 
                src={selectedService.image} 
                alt={selectedService.title} 
                className="w-16 h-16 rounded-md object-cover shrink-0" 
              />
              <div className="flex-1 overflow-hidden">
                <h4 className="text-sm font-bold truncate leading-tight" style={{ color: 'var(--text-primary)' }}>
                  {selectedService.title}
                </h4>
                <p className="text-xs text-primary font-bold mt-1 font-display text-base">
                  ₹{selectedService.price}
                </p>
                <div className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-2">
                  <span>⏱️ {selectedService.duration}</span>
                  <span>•</span>
                  <span>✂️ {selectedStylistName}</span>
                </div>
              </div>
            </div>

            {/* Schedule Preview */}
            <div className="space-y-2 text-xs mb-5 p-3.5 rounded-lg" style={{ backgroundColor: 'var(--bg-glass)' }}>
              <div className="flex justify-between">
                <span style={{ color: 'var(--text-secondary)' }}>Scheduled Date:</span>
                <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>{date}</span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: 'var(--text-secondary)' }}>Time Slot:</span>
                <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>{time}</span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: 'var(--text-secondary)' }}>Assigned Specialist:</span>
                <span className="font-semibold text-primary">{selectedStylistName}</span>
              </div>
              {assistanceTags.length > 0 && (
                <div className="pt-2 border-t mt-2" style={{ borderColor: 'var(--border-subtle)' }}>
                  <span className="text-[11px] font-semibold text-purple-400 block mb-1">Special Assistance Included:</span>
                  <div className="flex flex-wrap gap-1">
                    {assistanceTags.map((t, idx) => (
                      <span key={idx} className="text-[10px] px-1.5 py-0.5 bg-purple-500/10 text-purple-300 rounded border border-purple-500/20">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Price Calculations */}
            <div className="space-y-2 text-xs mb-6 pb-4 border-b" style={{ borderColor: 'var(--border-subtle)' }}>
              <div className="flex justify-between">
                <span style={{ color: 'var(--text-secondary)' }}>Service Treatment:</span>
                <span style={{ color: 'var(--text-primary)' }}>₹{selectedService.price}</span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: 'var(--text-secondary)' }}>Home Visit Travel & Convenience:</span>
                <span className="text-emerald-400 font-bold">FREE (Senior Promo)</span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: 'var(--text-secondary)' }}>Sterilized Tool Kit & Floor Cape:</span>
                <span className="text-emerald-400 font-bold">INCLUDED</span>
              </div>
              <div className="flex justify-between pt-2 text-sm font-bold">
                <span style={{ color: 'var(--text-primary)' }}>Total Amount to Pay:</span>
                <span className="text-primary font-display text-2xl">₹{selectedService.price}</span>
              </div>
            </div>

            {/* Checkout Action Button */}
            <button
              type="submit"
              className="w-full btn-red-neon py-4 text-sm font-bold uppercase tracking-widest cursor-pointer shadow-lg flex items-center justify-center gap-2"
            >
              <HeartHandshake size={18} />
              Book Home Visit (₹{selectedService.price})
            </button>

            {/* Trust Badges */}
            <div className="mt-5 space-y-2 text-[11px]" style={{ color: 'var(--text-muted)' }}>
              <div className="flex items-center gap-2">
                <ShieldCheck size={14} className="text-emerald-400" />
                <span>Safe 100% Razorpay encrypted transaction</span>
              </div>
              <div className="flex items-center gap-2">
                <UserCheck size={14} className="text-blue-400" />
                <span>ID verified & health-screened visiting stylists</span>
              </div>
            </div>

          </div>
        </div>

      </form>

      {/* Razorpay Gateway Modal */}
      {showRazorpay && (
        <RazorpayModal 
          bookingDetails={{
            serviceTitle: selectedService.title + ' (Senior Home Service)',
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
