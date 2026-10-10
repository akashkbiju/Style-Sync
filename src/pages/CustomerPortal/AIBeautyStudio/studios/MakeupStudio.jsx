import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Palette, 
  Heart, 
  Check, 
  ArrowRight, 
  Layers, 
  User, 
  RefreshCw,
  Info
} from 'lucide-react';
import { MAKEUP_LOOKS, LIPSTICK_SHADES, BLUSH_SHADES } from '../beautyStudioData';
import { applyMakeupEffects } from '../services/beautyCanvasService';

export const MakeupStudio = ({ 
  userPhoto, 
  onSaveFavorite, 
  isFavorite, 
  onBookStyle 
}) => {
  const [activeLook, setActiveLook] = useState(MAKEUP_LOOKS[0]);
  const [activeLipstick, setActiveLipstick] = useState(LIPSTICK_SHADES[0]);
  const [activeBlush, setActiveBlush] = useState(BLUSH_SHADES[0]);
  const [previewImage, setPreviewImage] = useState(null);
  const [isRendering, setIsRendering] = useState(false);

  // Update canvas makeup overlay on userPhoto when lipstick or blush changes
  useEffect(() => {
    if (!userPhoto) {
      setPreviewImage(null);
      return;
    }

    let isCancelled = false;
    setIsRendering(true);

    applyMakeupEffects({
      imageSrc: userPhoto,
      lipstickHex: activeLipstick.hex,
      blushHex: activeBlush.hex,
      intensity: 0.70
    }).then(res => {
      if (!isCancelled) {
        setPreviewImage(res);
        setIsRendering(false);
      }
    });

    return () => { isCancelled = true; };
  }, [userPhoto, activeLipstick, activeBlush]);

  return (
    <div className="space-y-8">
      
      {/* Top Banner */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left: Live Canvas Makeup Try-On */}
        <div className="lg:col-span-6 bg-zinc-950/80 border border-white/10 rounded-3xl p-6 shadow-2xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-primary">
                Facial Landmark Studio
              </span>
              <h3 className="font-display text-lg font-bold text-white mt-0.5">
                Lip & Cheek Virtual Tinting
              </h3>
            </div>

            <button
              type="button"
              onClick={() => onSaveFavorite({
                ...activeLook,
                category: 'Makeup',
                colorName: `${activeLipstick.name} & ${activeBlush.name}`,
                colorHex: activeLipstick.hex,
                previewImage: previewImage || activeLook.image
              })}
              className={`p-2.5 rounded-xl border transition cursor-pointer ${
                isFavorite(activeLook.id)
                  ? 'border-rose-500 bg-rose-500/20 text-rose-400'
                  : 'border-white/10 bg-zinc-900 text-zinc-400 hover:text-white'
              }`}
            >
              <Heart size={16} className={isFavorite(activeLook.id) ? 'fill-rose-500' : ''} />
            </button>
          </div>

          {/* Photo Preview Container */}
          <div className="relative aspect-[3/4] max-h-[440px] bg-zinc-900 rounded-2xl overflow-hidden border border-white/10 flex items-center justify-center mx-auto shadow-inner">
            {isRendering && (
              <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-20 flex flex-col items-center justify-center gap-2 text-white text-xs font-semibold">
                <RefreshCw size={22} className="animate-spin text-primary" />
                <span>Applying facial landmark tints...</span>
              </div>
            )}

            {userPhoto ? (
              <img
                src={previewImage || userPhoto}
                alt="Makeup Preview"
                className="w-full h-full object-cover"
              />
            ) : (
              <img
                src={activeLook.image}
                alt={activeLook.name}
                className="w-full h-full object-cover"
              />
            )}

            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between pointer-events-none">
              <span className="bg-black/80 backdrop-blur-md px-3 py-1 rounded-full text-[11px] text-white border border-white/15">
                Lips: {activeLipstick.name.split(' ')[0]} • Blush: {activeBlush.name.split(' ')[0]}
              </span>
              <span className="bg-emerald-950/80 text-emerald-400 border border-emerald-500/30 px-2.5 py-1 rounded-full text-[10px] font-bold">
                {userPhoto ? 'On Your Face' : 'Reference Model'}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onBookStyle(activeLook, 'Makeup', activeLipstick)}
            className="w-full py-3.5 rounded-2xl bg-primary hover:bg-primary/90 text-white font-bold text-xs uppercase tracking-widest shadow-[0_0_20px_rgba(225,29,72,0.4)] transition flex items-center justify-center gap-2 cursor-pointer active:scale-95"
          >
            <span>Book Salon Makeup for This Look</span>
            <ArrowRight size={14} />
          </button>
        </div>

        {/* Right: Lipstick & Blush Controls & Catalog */}
        <div className="lg:col-span-6 space-y-6">
          
          {/* Lipstick Shades */}
          <div className="bg-zinc-950/80 border border-white/10 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-display text-base font-bold text-white flex items-center gap-2">
                <Palette size={16} className="text-primary" />
                Lipstick Shade Selection
              </h4>
              <span className="text-xs text-primary font-bold">{activeLipstick.name}</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
              {LIPSTICK_SHADES.map(shade => {
                const isSelected = activeLipstick.id === shade.id;
                return (
                  <button
                    key={shade.id}
                    type="button"
                    onClick={() => setActiveLipstick(shade)}
                    className={`p-2.5 rounded-2xl border text-center transition flex flex-col items-center gap-1.5 cursor-pointer ${
                      isSelected
                        ? 'border-primary bg-primary/10 shadow ring-1 ring-primary'
                        : 'border-white/10 bg-zinc-900/60 hover:bg-zinc-800'
                    }`}
                  >
                    <div
                      className="w-8 h-8 rounded-full border border-white/30 shadow-inner flex items-center justify-center"
                      style={{ background: shade.hex }}
                    >
                      {isSelected && <Check size={13} className="text-white drop-shadow" strokeWidth={3} />}
                    </div>
                    <span className="text-[10px] font-bold text-white line-clamp-1">{shade.name.split(' ')[0]}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Blush Shades */}
          <div className="bg-zinc-950/80 border border-white/10 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-display text-base font-bold text-white flex items-center gap-2">
                <Sparkles size={16} className="text-primary" />
                Cheek Blush Contour
              </h4>
              <span className="text-xs text-primary font-bold">{activeBlush.name}</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {BLUSH_SHADES.map(blush => {
                const isSelected = activeBlush.id === blush.id;
                return (
                  <button
                    key={blush.id}
                    type="button"
                    onClick={() => setActiveBlush(blush)}
                    className={`p-2.5 rounded-2xl border text-center transition flex flex-col items-center gap-1.5 cursor-pointer ${
                      isSelected
                        ? 'border-primary bg-primary/10 shadow ring-1 ring-primary'
                        : 'border-white/10 bg-zinc-900/60 hover:bg-zinc-800'
                    }`}
                  >
                    <div
                      className="w-7 h-7 rounded-full border border-white/30 shadow-inner flex items-center justify-center"
                      style={{ background: blush.hex }}
                    >
                      {isSelected && <Check size={12} className="text-white drop-shadow" strokeWidth={3} />}
                    </div>
                    <span className="text-[10px] font-bold text-white line-clamp-1">{blush.name.split(' ')[0]}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Full Makeup Lookbook Reference Gallery */}
          <div className="bg-zinc-950/80 border border-white/10 rounded-3xl p-6 shadow-2xl space-y-4">
            <h4 className="font-display text-base font-bold text-white flex items-center gap-2">
              <Layers size={16} className="text-primary" />
              Signature Bridal & Glam Lookbook
            </h4>

            <div className="grid grid-cols-2 gap-3">
              {MAKEUP_LOOKS.map(look => {
                const isSelected = activeLook.id === look.id;
                return (
                  <div
                    key={look.id}
                    onClick={() => setActiveLook(look)}
                    className={`rounded-2xl border p-2.5 transition cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'border-primary bg-primary/10 ring-1 ring-primary'
                        : 'border-white/10 bg-zinc-900/60 hover:bg-zinc-800'
                    }`}
                  >
                    <div className="aspect-[4/3] rounded-xl overflow-hidden bg-black mb-2">
                      <img
                        src={look.image}
                        alt={look.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h5 className="font-display text-xs font-bold text-white line-clamp-1">{look.name}</h5>
                      <p className="text-[10px] text-zinc-400 line-clamp-1 mt-0.5">{look.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
