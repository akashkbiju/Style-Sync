import React, { useState } from 'react';
import { 
  Scissors, 
  Calendar, 
  Clock, 
  User, 
  X, 
  Check, 
  Sparkles, 
  ArrowRight,
  AlertCircle,
  Tag,
  ShieldCheck
} from 'lucide-react';
import { useSalon } from '../../../../context/SalonContext';

export const BookBeautyModal = ({ 
  lookItem,
  category = 'Hair',
  colorDetail = null,
  isOpen, 
  onClose,
  onConfirmBooking 
}) => {
  const { services = [], staff = [], setCustomerTab, setPrefilledBookingStyle } = useSalon();

  if (!isOpen || !lookItem) return null;

  // Filter actual salon services matching this beauty category
  const matchedServices = services.filter(s => {
    if (s.status === 'Pending') return false;
    const cat = (s.category || '').toLowerCase();
    const title = (s.title || '').toLowerCase();

    if (category === 'Hair') {
      return cat.includes('hair') || title.includes('hair') || title.includes('cut') || title.includes('style') || title.includes('color');
    }
    if (category === 'Skin') {
      return cat.includes('skin') || cat.includes('facial') || title.includes('facial') || title.includes('skin') || title.includes('peel') || title.includes('glow');
    }
    if (category === 'Nail') {
      return cat.includes('nail') || title.includes('nail') || title.includes('manicure') || title.includes('pedicure');
    }
    if (category === 'Makeup') {
      return cat.includes('makeup') || title.includes('makeup') || title.includes('bridal') || title.includes('glam') || title.includes('lash');
    }
    if (category === 'Grooming') {
      return cat.includes('groom') || cat.includes('beard') || title.includes('beard') || title.includes('shave') || title.includes('fade');
    }
    return true;
  });

  // Fallback to active catalog services if no exact keyword match
  const availableServices = matchedServices.length > 0 ? matchedServices : services.filter(s => s.status !== 'Pending');
  const [selectedServiceId, setSelectedServiceId] = useState(availableServices[0]?.id || '');
  const [selectedStylistName, setSelectedStylistName] = useState(staff[0]?.name || 'Akash K Biju');

  const chosenService = availableServices.find(s => s.id === selectedServiceId) || availableServices[0];

  const handleProceed = () => {
    if (!chosenService) {
      alert('Please select a salon service from the catalog.');
      return;
    }

    const bookingPayload = {
      category,
      styleName: lookItem.name || lookItem.title,
      styleImage: lookItem.image || lookItem.previewImage,
      colorDetail,
      service: chosenService,
      stylistName: selectedStylistName,
      timestamp: new Date().toISOString()
    };

    if (onConfirmBooking) {
      onConfirmBooking(bookingPayload);
    } else {
      // Connect to existing booking flow via context
      setPrefilledBookingStyle?.(bookingPayload);
      setCustomerTab('book-inshop');
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className="relative w-full max-w-2xl bg-zinc-950 border border-white/15 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-zinc-900/60">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-primary/20 border border-primary/40 flex items-center justify-center text-primary shadow">
              <Sparkles size={18} />
            </div>
            <div>
              <h3 className="font-display text-lg font-bold text-white tracking-wide">
                Book {category} Appointment
              </h3>
              <p className="text-xs text-zinc-400">
                Seamlessly attach your selected AI style reference to our salon booking system
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 space-y-6 overflow-y-auto">
          
          {/* Selected Style Reference Card */}
          <div className="flex items-center gap-4 p-4 bg-zinc-900/80 border border-white/10 rounded-2xl">
            <div className="w-20 h-24 rounded-xl overflow-hidden bg-black shrink-0 border border-primary/40 shadow">
              <img
                src={lookItem.image || lookItem.previewImage}
                alt={lookItem.name || 'Selected Look'}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex-1 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-widest text-primary">
                {category} Studio Reference Look
              </span>
              <h4 className="font-display text-lg font-bold text-white">
                {lookItem.name || lookItem.title}
              </h4>
              <p className="text-xs text-zinc-400 line-clamp-1">
                {lookItem.description || lookItem.stylistTip || 'Bespoke custom salon look'}
              </p>
              {colorDetail && (
                <div className="flex items-center gap-2 pt-1 text-xs text-zinc-300">
                  <span 
                    className="w-3.5 h-3.5 rounded-full border border-white/40 shrink-0"
                    style={{ background: colorDetail.hex }}
                  />
                  <span>Selected Shade: <strong className="text-white">{colorDetail.name}</strong></span>
                </div>
              )}
            </div>
          </div>

          {/* Step 1: Real Salon Services from Catalog */}
          <div className="space-y-2.5">
            <label className="text-xs font-bold uppercase tracking-wider text-zinc-300 flex items-center justify-between">
              <span>1. Choose Salon Service</span>
              <span className="text-zinc-500 font-normal">Real prices & catalog records</span>
            </label>

            {availableServices.length === 0 ? (
              <div className="p-4 bg-zinc-900 border border-white/10 rounded-xl text-xs text-zinc-400">
                No services currently listed. You can proceed with standard consultation.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-56 overflow-y-auto pr-1">
                {availableServices.map(service => {
                  const isSelected = selectedServiceId === service.id;
                  return (
                    <div
                      key={service.id}
                      onClick={() => setSelectedServiceId(service.id)}
                      className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all flex flex-col justify-between ${
                        isSelected
                          ? 'border-primary bg-primary/10 shadow-[0_0_15px_rgba(225,29,72,0.3)] ring-1 ring-primary'
                          : 'border-white/10 bg-zinc-900/60 hover:bg-zinc-900'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="font-bold text-xs text-white leading-tight">
                          {service.title}
                        </div>
                        {isSelected && (
                          <div className="w-4 h-4 rounded-full bg-primary flex items-center justify-center text-white shrink-0">
                            <Check size={11} strokeWidth={3} />
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center justify-between text-xs mt-3 pt-2 border-t border-white/5">
                        <span className="text-zinc-400 flex items-center gap-1">
                          <Clock size={11} /> {service.duration || '45 mins'}
                        </span>
                        <span className="font-extrabold text-primary">₹{service.price}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Step 2: Stylist Selection */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-zinc-300 flex items-center justify-between">
              <span>2. Select Specialist / Stylist</span>
              <span className="text-zinc-500 font-normal">Certified StyleSync team</span>
            </label>

            <select
              value={selectedStylistName}
              onChange={(e) => setSelectedStylistName(e.target.value)}
              className="w-full px-4 py-3 bg-zinc-900 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-primary font-medium"
            >
              {staff.length === 0 ? (
                <option value="Akash K Biju">Akash K Biju — Master Specialist</option>
              ) : (
                staff.map(stf => (
                  <option key={stf.id || stf.name} value={stf.name}>
                    {stf.name} — {stf.role || stf.specialty || 'Master Specialist'} (⭐ {stf.rating || 5.0})
                  </option>
                ))
              )}
            </select>
          </div>

          {/* Notice Banner */}
          <div className="p-3.5 bg-zinc-900/80 rounded-xl border border-white/5 text-xs text-zinc-400 space-y-1">
            <span className="font-bold text-white flex items-center gap-1.5">
              <ShieldCheck size={14} className="text-emerald-400" /> Digital Look Reference Included
            </span>
            <p className="leading-relaxed text-[11px]">
              This AI preview and shade swatch will be linked to your appointment ticket in Firestore so your specialist can review your exact visual reference before your arrival.
            </p>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-white/10 bg-zinc-900/60 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-zinc-400 hover:text-white transition"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleProceed}
            className="px-6 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold text-xs uppercase tracking-wider shadow-[0_0_20px_rgba(225,29,72,0.4)] transition flex items-center gap-2 cursor-pointer active:scale-95"
          >
            <span>Continue to Appointment Schedule</span>
            <ArrowRight size={14} />
          </button>
        </div>

      </div>
    </div>
  );
};
