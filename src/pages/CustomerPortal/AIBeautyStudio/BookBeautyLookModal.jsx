import React, { useState, useEffect } from 'react';
import { 
  Scissors, 
  Sparkles, 
  Calendar, 
  Clock, 
  User, 
  X, 
  Check, 
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { useSalon } from '../../../context/SalonContext';

export const BookBeautyLookModal = ({
  isOpen,
  onClose,
  category = 'hair', // 'hair' | 'skin' | 'nail' | 'makeup' | 'grooming'
  item = null,
  color = null,
  onConfirmBooking
}) => {
  const { services, staff } = useSalon();

  if (!isOpen || !item) return null;

  // Filter services matching the current beauty category
  const filteredServices = services.filter(s => {
    if (s.status === 'Pending') return false;
    const title = (s.title || '').toLowerCase();
    const cat = (s.category || '').toLowerCase();

    if (category === 'hair') {
      return title.includes('hair') || title.includes('cut') || title.includes('style') || cat.includes('hair');
    }
    if (category === 'skin') {
      return title.includes('facial') || title.includes('skin') || title.includes('detox') || title.includes('clean') || cat.includes('skin');
    }
    if (category === 'nail') {
      return title.includes('mani') || title.includes('pedi') || title.includes('nail') || cat.includes('nail');
    }
    if (category === 'makeup') {
      return title.includes('make') || title.includes('bridal') || title.includes('glam') || cat.includes('makeup');
    }
    if (category === 'grooming') {
      return title.includes('shave') || title.includes('beard') || title.includes('groom') || cat.includes('groom');
    }
    return true;
  });

  const availableServices = filteredServices.length > 0 ? filteredServices : services.filter(s => s.status !== 'Pending');
  const [selectedServiceId, setSelectedServiceId] = useState(availableServices[0]?.id || '');
  const [selectedStylistName, setSelectedStylistName] = useState(staff[0]?.name || '');

  const chosenService = availableServices.find(s => s.id === selectedServiceId) || availableServices[0];

  const handleProceed = () => {
    if (!chosenService) {
      alert('Please select an available salon service.');
      return;
    }

    onConfirmBooking({
      category,
      item,
      color,
      service: chosenService,
      stylistName: selectedStylistName
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className="relative w-full max-w-xl bg-zinc-950 border border-white/15 rounded-2xl overflow-hidden shadow-2xl flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-zinc-900/60">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-primary/20 border border-primary/40 flex items-center justify-center text-primary shadow">
              <Sparkles size={18} />
            </div>
            <div>
              <h3 className="font-display text-lg font-bold text-white tracking-wide">
                Book Salon Appointment With This Look
              </h3>
              <p className="text-xs text-zinc-400">
                Confirm your service, stylist & reference specifications
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 overflow-y-auto max-h-[75vh]">
          
          {/* Selected Look Summary Banner */}
          <div className="flex items-center gap-4 p-4 rounded-xl bg-zinc-900 border border-white/10">
            {item.image && (
              <img 
                src={item.image} 
                alt={item.name || item.title} 
                className="w-16 h-16 rounded-lg object-cover border border-white/20 shrink-0" 
              />
            )}
            <div className="flex-1 min-w-0">
              <span className="text-[10px] font-bold uppercase tracking-wider text-primary">
                Selected {category.toUpperCase()} Style Reference
              </span>
              <h4 className="text-white font-bold text-base truncate">
                {item.name || item.title}
              </h4>
              <p className="text-xs text-zinc-400 line-clamp-1 mt-0.5">
                {item.description || item.stylistTip}
              </p>
              {color && (
                <div className="flex items-center gap-1.5 mt-1 text-[11px] text-zinc-300">
                  <span className="w-2.5 h-2.5 rounded-full border border-white/40" style={{ backgroundColor: color.hex }} />
                  <span>Color Choice: <strong>{color.name}</strong></span>
                </div>
              )}
            </div>
          </div>

          {/* Service Selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-zinc-300">
              Select Salon Service
            </label>
            <select
              value={selectedServiceId}
              onChange={(e) => setSelectedServiceId(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-white/15 text-xs text-white focus:outline-none focus:border-primary cursor-pointer"
            >
              {availableServices.map(s => (
                <option key={s.id} value={s.id}>
                  {s.title} — ₹{s.price} ({s.duration || '45 mins'})
                </option>
              ))}
            </select>
          </div>

          {/* Stylist Selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-zinc-300">
              Choose Specialist / Stylist
            </label>
            <select
              value={selectedStylistName}
              onChange={(e) => setSelectedStylistName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-white/15 text-xs text-white focus:outline-none focus:border-primary cursor-pointer"
            >
              {staff.map((stf, idx) => (
                <option key={stf.id || idx} value={stf.name}>
                  {stf.name} {stf.role ? `(${stf.role})` : ''}
                </option>
              ))}
            </select>
          </div>

          {/* Price & Guarantee Notice */}
          <div className="p-4 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-between text-xs">
            <div>
              <div className="text-zinc-400 text-[11px]">Estimated Service Total:</div>
              <div className="text-lg font-bold text-white font-display">
                ₹{chosenService?.price || 60}
              </div>
            </div>
            <div className="text-right text-[11px] text-zinc-400">
              <div>Duration: <strong>{chosenService?.duration || '45 mins'}</strong></div>
              <div className="text-emerald-400 font-semibold flex items-center gap-1 justify-end mt-0.5">
                <ShieldCheck size={12} /> Reference Attached
              </div>
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-zinc-900/80 border-t border-white/10 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs text-zinc-400 hover:text-white transition cursor-pointer"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleProceed}
            className="px-6 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold text-xs uppercase tracking-wider shadow-[0_0_15px_rgba(225,29,72,0.5)] transition flex items-center gap-2 cursor-pointer active:scale-95"
          >
            <span>Proceed to Booking</span>
            <ArrowRight size={14} />
          </button>
        </div>

      </div>
    </div>
  );
};
