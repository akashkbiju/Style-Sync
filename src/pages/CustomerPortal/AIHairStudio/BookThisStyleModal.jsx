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
  AlertCircle 
} from 'lucide-react';
import { useSalon } from '../../../context/SalonContext';

export const BookThisStyleModal = ({ 
  style, 
  color, 
  isOpen, 
  onClose,
  onConfirmBooking 
}) => {
  const { services, staff } = useSalon();

  if (!isOpen || !style) return null;

  // Filter existing salon services matching haircut, styling, or coloring
  const matchedServices = services.filter(s => {
    if (s.status === 'Pending') return false;
    const title = s.title.toLowerCase();
    const category = s.category ? s.category.toLowerCase() : '';
    return (
      title.includes('hair') || 
      title.includes('cut') || 
      title.includes('style') || 
      title.includes('color') ||
      category.includes('hair') ||
      category.includes('styling')
    );
  });

  // Default to first matched service or fallback to first available service
  const fallbackServices = matchedServices.length > 0 ? matchedServices : services.filter(s => s.status !== 'Pending');
  const [selectedServiceId, setSelectedServiceId] = useState(fallbackServices[0]?.id || '');
  const [selectedStylistName, setSelectedStylistName] = useState(staff[0]?.name || '');

  const chosenService = fallbackServices.find(s => s.id === selectedServiceId) || fallbackServices[0];

  const handleProceed = () => {
    if (!chosenService) {
      alert('Please select a salon service.');
      return;
    }

    onConfirmBooking({
      hairstyle: style,
      color: color,
      service: chosenService,
      stylistName: selectedStylistName
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-2xl bg-zinc-950 border border-white/15 rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-zinc-900/60">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-primary/20 border border-primary/40 flex items-center justify-center text-primary shadow">
              <Scissors size={18} />
            </div>
            <div>
              <h3 className="font-display text-lg font-bold text-white tracking-wide">
                Book Hairstyle Appointment
              </h3>
              <p className="text-xs text-zinc-400">
                Connect your AI styled look directly to our salon specialists
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

        {/* Modal Body */}
        <div className="p-6 space-y-6 overflow-y-auto">
          
          {/* Selected Hairstyle Card Preview */}
          <div className="flex items-center gap-4 p-4 bg-zinc-900/80 border border-white/10 rounded-2xl">
            <div className="w-20 h-24 rounded-xl overflow-hidden bg-black shrink-0 border border-primary/40">
              <img
                src={style.image || style.previewImage}
                alt={style.name}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex-1 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-widest text-primary">
                Selected Reference Look
              </span>
              <h4 className="font-display text-lg font-bold text-white">
                {style.name}
              </h4>
              <p className="text-xs text-zinc-400 line-clamp-1">
                {style.description}
              </p>
              {color && color.id !== 'original' && (
                <div className="flex items-center gap-2 pt-1 text-xs text-zinc-300">
                  <span 
                    className="w-3 h-3 rounded-full border border-white/40"
                    style={{ background: color.hex }}
                  />
                  <span>Selected Shade: <strong className="text-white">{color.name}</strong></span>
                </div>
              )}
            </div>
          </div>

          {/* Step 1: Select Salon Service from Database */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-zinc-300 flex items-center justify-between">
              <span>1. Choose Salon Service</span>
              <span className="text-zinc-500 font-normal">Real prices & catalog records</span>
            </label>

            {fallbackServices.length === 0 ? (
              <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-xs text-rose-300 flex items-center gap-2">
                <AlertCircle size={15} /> No matching salon services found in current catalog.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {fallbackServices.map(service => {
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
                        <div className="font-bold text-xs text-white">{service.title}</div>
                        {isSelected && (
                          <div className="w-4 h-4 rounded-full bg-primary flex items-center justify-center text-white shrink-0">
                            <Check size={11} strokeWidth={3} />
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center justify-between text-xs mt-3 pt-2 border-t border-white/5">
                        <span className="text-zinc-400">{service.duration || '45 mins'}</span>
                        <span className="font-extrabold text-primary">₹{service.price}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Step 2: Select Specialist Stylist */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-zinc-300">
              2. Select Master Stylist
            </label>

            <select
              value={selectedStylistName}
              onChange={(e) => setSelectedStylistName(e.target.value)}
              className="w-full px-4 py-3 bg-zinc-900 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-primary font-medium"
            >
              {staff.map(stf => (
                <option key={stf.id || stf.name} value={stf.name}>
                  {stf.name} — {stf.role || stf.specialty || 'Master Stylist'} (Rating: {stf.rating || 5.0}★)
                </option>
              ))}
            </select>
          </div>

          {/* Stylist Notice */}
          <div className="p-3.5 bg-zinc-900 rounded-xl border border-white/5 text-xs text-zinc-400 space-y-1">
            <span className="font-bold text-white flex items-center gap-1.5">
              <Sparkles size={13} className="text-primary" /> Digital Style Reference Included
            </span>
            <p className="leading-relaxed text-[11px]">
              This AI hairstyle preview image and color specification will be attached to your official booking ticket and visible to your assigned stylist before you arrive.
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
            <span>Continue to Booking Schedule</span>
            <ArrowRight size={14} />
          </button>
        </div>

      </div>
    </div>
  );
};
