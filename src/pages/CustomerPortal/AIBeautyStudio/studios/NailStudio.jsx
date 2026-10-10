import React, { useState } from 'react';
import { 
  Sparkles, 
  Palette, 
  Heart, 
  Check, 
  ArrowRight, 
  Calendar, 
  Info,
  Layers,
  Clock
} from 'lucide-react';
import { NAIL_SHADES, NAIL_DESIGNS } from '../beautyStudioData';

export const NailStudio = ({ 
  userPhoto, 
  onSaveFavorite, 
  isFavorite, 
  onBookStyle 
}) => {
  const [activeShade, setActiveShade] = useState(NAIL_SHADES[0]);
  const [activeDesign, setActiveDesign] = useState(NAIL_DESIGNS[0]);

  return (
    <div className="space-y-8">
      
      {/* Nail Design & Polish Studio Showcase */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left: Design Reference Card */}
        <div className="lg:col-span-6 bg-zinc-950/80 border border-white/10 rounded-3xl p-6 shadow-2xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-primary">
                Selected Nail Art Design
              </span>
              <h3 className="font-display text-xl font-bold text-white mt-0.5">
                {activeDesign.name}
              </h3>
            </div>

            <button
              type="button"
              onClick={() => onSaveFavorite({
                ...activeDesign,
                category: 'Nail',
                colorName: activeShade.name,
                colorHex: activeShade.hex
              })}
              className={`p-2.5 rounded-xl border transition cursor-pointer ${
                isFavorite(activeDesign.id)
                  ? 'border-rose-500 bg-rose-500/20 text-rose-400'
                  : 'border-white/10 bg-zinc-900 text-zinc-400 hover:text-white'
              }`}
            >
              <Heart size={16} className={isFavorite(activeDesign.id) ? 'fill-rose-500' : ''} />
            </button>
          </div>

          {/* Large Image Showcase */}
          <div className="relative aspect-[4/3] bg-zinc-900 rounded-2xl overflow-hidden border border-white/10 shadow-inner">
            <img
              src={activeDesign.image}
              alt={activeDesign.name}
              className="w-full h-full object-cover"
            />

            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
              <span className="bg-black/80 backdrop-blur-md px-3 py-1 rounded-full text-[11px] text-white border border-white/15">
                Category: {activeDesign.serviceCategory}
              </span>
              <div className="flex items-center gap-1.5 bg-black/80 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] text-zinc-300 border border-white/15">
                <span className="w-2.5 h-2.5 rounded-full border border-white/40" style={{ background: activeShade.hex }} />
                <span>{activeShade.name}</span>
              </div>
            </div>
          </div>

          <p className="text-xs text-zinc-400 leading-relaxed">
            {activeDesign.description}
          </p>

          {/* Honest Technical Transparency */}
          <div className="p-3 bg-zinc-900 rounded-2xl border border-white/5 text-[11px] text-zinc-400 leading-relaxed flex items-start gap-2">
            <Info size={14} className="shrink-0 text-primary mt-0.5" />
            <span>
              <strong>Reference Polish Swatch:</strong> Visual shade swatches serve as curated salon color references. Customized nail art layering is performed by hand by our nail artists.
            </span>
          </div>

          <button
            type="button"
            onClick={() => onBookStyle(activeDesign, 'Nail', activeShade)}
            className="w-full py-3.5 rounded-2xl bg-primary hover:bg-primary/90 text-white font-bold text-xs uppercase tracking-widest shadow-[0_0_20px_rgba(225,29,72,0.4)] transition flex items-center justify-center gap-2 cursor-pointer active:scale-95"
          >
            <span>Book Appointment for This Nail Art</span>
            <ArrowRight size={14} />
          </button>
        </div>

        {/* Right: Polish Palette & Design Selector */}
        <div className="lg:col-span-6 space-y-6">
          
          {/* Polish Palette */}
          <div className="bg-zinc-950/80 border border-white/10 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-display text-base font-bold text-white flex items-center gap-2">
                <Palette size={16} className="text-primary" />
                Curated Gel & Lacquer Palette
              </h4>
              <span className="text-xs text-primary font-bold">{activeShade.name}</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {NAIL_SHADES.map(shade => {
                const isSelected = activeShade.id === shade.id;
                return (
                  <button
                    key={shade.id}
                    type="button"
                    onClick={() => setActiveShade(shade)}
                    className={`p-3 rounded-2xl border text-left transition flex flex-col justify-between gap-2 cursor-pointer ${
                      isSelected
                        ? 'border-primary bg-primary/10 shadow ring-1 ring-primary'
                        : 'border-white/10 bg-zinc-900/60 hover:bg-zinc-800'
                    }`}
                  >
                    <div 
                      className="w-full h-8 rounded-xl border border-white/20 shadow-inner flex items-center justify-center"
                      style={{ background: shade.hex }}
                    >
                      {isSelected && <Check size={14} className="text-white drop-shadow" strokeWidth={3} />}
                    </div>
                    <div>
                      <div className="text-[11px] font-bold text-white line-clamp-1">{shade.name}</div>
                      <div className="text-[9px] text-zinc-500">{shade.finish}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Nail Designs Catalog */}
          <div className="bg-zinc-950/80 border border-white/10 rounded-3xl p-6 shadow-2xl space-y-4">
            <h4 className="font-display text-base font-bold text-white flex items-center gap-2">
              <Layers size={16} className="text-primary" />
              Nail Art Lookbook Designs
            </h4>

            <div className="grid grid-cols-2 gap-3">
              {NAIL_DESIGNS.map(design => {
                const isSelected = activeDesign.id === design.id;
                return (
                  <div
                    key={design.id}
                    onClick={() => setActiveDesign(design)}
                    className={`group rounded-2xl overflow-hidden border p-2 transition cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'border-primary bg-primary/10 shadow ring-1 ring-primary'
                        : 'border-white/10 bg-zinc-900/60 hover:bg-zinc-800'
                    }`}
                  >
                    <div className="aspect-[4/3] rounded-xl overflow-hidden bg-black mb-2">
                      <img
                        src={design.image}
                        alt={design.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div>
                      <h5 className="font-display text-xs font-bold text-white line-clamp-1">{design.name}</h5>
                      <span className="text-[10px] text-primary">{design.serviceCategory}</span>
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
