import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Heart, 
  Calendar, 
  Sliders, 
  Eye, 
  Smile, 
  Check, 
  ArrowRight,
  Info,
  Palette
} from 'lucide-react';
import { 
  MAKEUP_LOOKS, 
  LIP_SHADES, 
  BLUSH_SHADES, 
  EYE_SHADES, 
  MAKEUP_SERVICES 
} from './beautyStudioData';
import { renderMakeupPreview } from './faceMakeupEngine';

export const MakeupStudioTab = ({
  photo,
  onBookMakeupService,
  favorites = [],
  onToggleFavorite
}) => {
  const [activeLook, setActiveLook] = useState(MAKEUP_LOOKS[0]);
  const [selectedLip, setSelectedLip] = useState(LIP_SHADES[0]);
  const [selectedBlush, setSelectedBlush] = useState(BLUSH_SHADES[0]);
  const [selectedEye, setSelectedEye] = useState(EYE_SHADES[0]);
  
  // Custom makeup preview on uploaded photo
  const [makeupPhoto, setMakeupPhoto] = useState(photo);

  useEffect(() => {
    if (!photo) {
      setMakeupPhoto(null);
      return;
    }

    renderMakeupPreview({
      imageSrc: photo,
      lip: selectedLip,
      blush: selectedBlush,
      eyeshadow: selectedEye
    }).then(res => {
      setMakeupPhoto(res);
    }).catch(() => {
      setMakeupPhoto(photo);
    });
  }, [photo, selectedLip, selectedBlush, selectedEye]);

  const handleApplyPresetLook = (look) => {
    setActiveLook(look);
    const matchedLip = LIP_SHADES.find(l => l.hex.toLowerCase() === look.lipColor?.toLowerCase()) || LIP_SHADES[0];
    const matchedBlush = BLUSH_SHADES.find(b => b.hex.toLowerCase() === look.blushColor?.toLowerCase()) || BLUSH_SHADES[0];
    setSelectedLip(matchedLip);
    setSelectedBlush(matchedBlush);
  };

  return (
    <div className="space-y-8">
      
      {/* ─── VIRTUAL MAKEUP WORKBENCH ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left: Viewport with Face Tinting */}
        <div className="lg:col-span-7 bg-zinc-950/80 border border-white/10 rounded-2xl p-5 shadow-2xl space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Sparkles size={14} className="text-primary" />
              <span>Virtual Shade Tester & Makeover Canvas</span>
            </span>

            <button
              type="button"
              onClick={() => onBookMakeupService(activeLook, selectedLip)}
              className="px-4 py-2 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold text-xs uppercase tracking-wider shadow-[0_0_15px_rgba(225,29,72,0.4)] transition cursor-pointer active:scale-95"
            >
              Book Makeover
            </button>
          </div>

          {/* Photo Viewport */}
          <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-black border border-white/15">
            {photo ? (
              <img 
                src={makeupPhoto || photo} 
                alt="Makeup simulation" 
                className="w-full h-full object-cover" 
              />
            ) : (
              <div className="relative w-full h-full">
                <img 
                  src={activeLook.image} 
                  alt={activeLook.name} 
                  className="w-full h-full object-cover" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent flex flex-col justify-end p-5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-primary">
                    {activeLook.occasion}
                  </span>
                  <h4 className="font-display text-xl font-bold text-white">
                    {activeLook.name}
                  </h4>
                  <p className="text-xs text-zinc-300 mt-1 line-clamp-2">
                    {activeLook.description}
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="p-3 rounded-xl bg-zinc-900/60 border border-white/10 flex items-start gap-2.5 text-xs text-zinc-400">
            <Info size={15} className="shrink-0 text-primary mt-0.5" />
            <p className="leading-relaxed text-[11px]">
              <strong>Live Canvas Colorimetry:</strong> Lip shades, cheek flush, and eyeshadow tones blend directly onto your portrait with natural highlights and texture retention.
            </p>
          </div>
        </div>

        {/* Right: Shade Bar (Lips, Blush, Eyes) */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Lipstick Shade Bar */}
          <div className="bg-zinc-950/80 border border-white/10 rounded-2xl p-4 shadow-xl space-y-2.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-white flex items-center gap-1.5">
                <Smile size={13} className="text-rose-400" /> Lipstick Shade
              </span>
              <span className="text-primary font-bold">{selectedLip.name}</span>
            </div>
            <div className="grid grid-cols-6 gap-2">
              {LIP_SHADES.map(lip => (
                <button
                  key={lip.id}
                  type="button"
                  onClick={() => setSelectedLip(lip)}
                  className={`p-1.5 rounded-xl border flex flex-col items-center gap-1 transition cursor-pointer ${
                    selectedLip.id === lip.id ? 'border-primary bg-primary/20 ring-1 ring-primary' : 'border-white/10 bg-zinc-900'
                  }`}
                  title={lip.name}
                >
                  <span className="w-5 h-5 rounded-full border border-white/30" style={{ backgroundColor: lip.hex }} />
                </button>
              ))}
            </div>
          </div>

          {/* Blush Shade Bar */}
          <div className="bg-zinc-950/80 border border-white/10 rounded-2xl p-4 shadow-xl space-y-2.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-white flex items-center gap-1.5">
                <Sparkles size={13} className="text-amber-400" /> Cheek Blush
              </span>
              <span className="text-amber-400 font-bold">{selectedBlush.name}</span>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {BLUSH_SHADES.map(blush => (
                <button
                  key={blush.id}
                  type="button"
                  onClick={() => setSelectedBlush(blush)}
                  className={`p-2 rounded-xl border flex flex-col items-center gap-1 transition cursor-pointer ${
                    selectedBlush.id === blush.id ? 'border-primary bg-primary/20 ring-1 ring-primary' : 'border-white/10 bg-zinc-900'
                  }`}
                >
                  <span className="w-5 h-5 rounded-full border border-white/30" style={{ backgroundColor: blush.hex }} />
                  <span className="text-[9px] text-zinc-300 truncate w-full text-center">{blush.name.split(' ')[0]}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Eyeshadow Shade Bar */}
          <div className="bg-zinc-950/80 border border-white/10 rounded-2xl p-4 shadow-xl space-y-2.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-white flex items-center gap-1.5">
                <Eye size={13} className="text-sky-400" /> Eyeshadow Wash
              </span>
              <span className="text-sky-400 font-bold">{selectedEye.name}</span>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {EYE_SHADES.map(eye => (
                <button
                  key={eye.id}
                  type="button"
                  onClick={() => setSelectedEye(eye)}
                  className={`p-2 rounded-xl border flex flex-col items-center gap-1 transition cursor-pointer ${
                    selectedEye.id === eye.id ? 'border-primary bg-primary/20 ring-1 ring-primary' : 'border-white/10 bg-zinc-900'
                  }`}
                >
                  <span className="w-5 h-5 rounded-full border border-white/30" style={{ backgroundColor: eye.hex }} />
                  <span className="text-[9px] text-zinc-300 truncate w-full text-center">{eye.name.split(' ')[0]}</span>
                </button>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* ─── MAKEUP INSPIRATION LOOKS ─── */}
      <div className="space-y-4 pt-4 border-t border-white/10">
        <div>
          <h3 className="font-display text-2xl font-bold text-white tracking-wide">
            Signature Makeup Inspiration Looks
          </h3>
          <p className="text-xs text-zinc-400 mt-1">
            Click any signature look to auto-apply its curated cosmetic palette
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {MAKEUP_LOOKS.map(look => {
            const isSelected = activeLook.id === look.id;
            return (
              <div
                key={look.id}
                onClick={() => handleApplyPresetLook(look)}
                className={`group rounded-2xl overflow-hidden border transition-all duration-300 bg-zinc-950/80 cursor-pointer ${
                  isSelected ? 'border-primary ring-1 ring-primary shadow-[0_0_20px_rgba(225,29,72,0.4)]' : 'border-white/10 hover:border-white/30'
                }`}
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-black">
                  <img src={look.image} alt={look.name} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                  <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded bg-primary text-white text-[10px] font-bold uppercase tracking-wider">
                    {look.occasion}
                  </div>
                </div>

                <div className="p-4 space-y-1.5">
                  <h4 className="font-bold text-white text-sm group-hover:text-primary transition">
                    {look.name}
                  </h4>
                  <p className="text-[11px] text-zinc-400 line-clamp-2">
                    {look.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ─── SALON MAKEUP SERVICES ─── */}
      <div className="space-y-4 pt-4 border-t border-white/10">
        <h3 className="font-display text-2xl font-bold text-white tracking-wide">
          Salon Makeup Artist Packages
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {MAKEUP_SERVICES.map(srv => (
            <div key={srv.id} className="p-5 rounded-2xl bg-zinc-950/80 border border-white/10 flex flex-col justify-between space-y-4">
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-primary">₹{srv.price}</span>
                  <span className="text-zinc-500">{srv.duration}</span>
                </div>
                <h4 className="font-bold text-white text-base">{srv.title}</h4>
                <p className="text-xs text-zinc-400 leading-relaxed">{srv.description}</p>
              </div>

              <button
                type="button"
                onClick={() => onBookMakeupService(srv, selectedLip)}
                className="w-full py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold text-xs uppercase tracking-wider transition shadow flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
              >
                <Calendar size={13} /> Book Service
              </button>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
