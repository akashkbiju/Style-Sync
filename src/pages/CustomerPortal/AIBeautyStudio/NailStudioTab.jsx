import React, { useState } from 'react';
import { 
  Sparkles, 
  Heart, 
  Calendar, 
  Upload, 
  Check, 
  Info, 
  ArrowRight,
  ShieldCheck,
  Palette
} from 'lucide-react';
import { 
  NAIL_SHAPES, 
  NAIL_COLORS, 
  NAIL_DESIGNS, 
  NAIL_SERVICES 
} from './beautyStudioData';

export const NailStudioTab = ({
  onBookNailService,
  favorites = [],
  onToggleFavorite
}) => {
  const [selectedShape, setSelectedShape] = useState(NAIL_SHAPES[0]);
  const [selectedColor, setSelectedColor] = useState(NAIL_COLORS[0]);
  const [selectedDesign, setSelectedDesign] = useState(NAIL_DESIGNS[0]);
  const [handPhoto, setHandPhoto] = useState(null);

  const handleHandPhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setHandPhoto(ev.target.result);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-8">
      
      {/* ─── VIRTUAL NAIL DESIGNER WORKBENCH ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left: Hand & Swatch Visualization */}
        <div className="lg:col-span-6 bg-zinc-950/80 border border-white/10 rounded-2xl p-5 shadow-2xl space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Palette size={14} className="text-primary" />
              <span>Nail Art & Swatch Canvas</span>
            </span>

            <button
              type="button"
              onClick={() => onBookNailService(selectedDesign, selectedColor)}
              className="px-4 py-2 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold text-xs uppercase tracking-wider shadow-[0_0_15px_rgba(225,29,72,0.4)] transition cursor-pointer active:scale-95"
            >
              Book Nail Service
            </button>
          </div>

          {/* Reference Canvas */}
          <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-black border border-white/15">
            <img 
              src={handPhoto || selectedDesign.image} 
              alt={selectedDesign.name} 
              className="w-full h-full object-cover" 
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent flex flex-col justify-end p-5">
              <div className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 rounded-full border border-white/40 shadow" style={{ backgroundColor: selectedColor.hex }} />
                <span className="text-xs font-bold text-white">
                  {selectedColor.name} ({selectedColor.finish} Finish)
                </span>
              </div>
              <h4 className="font-display text-lg font-bold text-white mt-1">
                {selectedShape.name} Shape • {selectedDesign.name}
              </h4>
              <p className="text-[11px] text-zinc-300 mt-0.5 line-clamp-1">
                {selectedDesign.description}
              </p>
            </div>
          </div>

          {/* Hand Photo Upload Option */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-900 border border-white/10 text-xs">
            <span className="text-zinc-400">
              {handPhoto ? 'Custom hand reference loaded' : 'Upload your own hand photo for technician reference:'}
            </span>
            <label className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white font-semibold cursor-pointer transition flex items-center gap-1.5">
              <Upload size={13} />
              <span>{handPhoto ? 'Change Hand Photo' : 'Upload Photo'}</span>
              <input type="file" accept="image/*" className="hidden" onChange={handleHandPhotoUpload} />
            </label>
          </div>

          {/* Honest Capability Disclaimer */}
          <div className="p-3 rounded-xl bg-zinc-900/60 border border-white/10 flex items-start gap-2.5 text-xs text-zinc-400">
            <Info size={15} className="shrink-0 text-primary mt-0.5" />
            <p className="leading-relaxed text-[11px]">
              <strong>Technician Reference Mode:</strong> Your chosen nail shape, color code ({selectedColor.hex}), and design specifications are saved as digital salon references and directly attached to your booking ticket.
            </p>
          </div>
        </div>

        {/* Right: Shape & Polish Palette Selection */}
        <div className="lg:col-span-6 space-y-5">
          
          {/* Nail Shape Selector */}
          <div className="bg-zinc-950/80 border border-white/10 rounded-2xl p-5 shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-sm text-white">
                1. Select Nail Silhouette & Shape
              </h4>
              <span className="text-xs font-bold text-primary">
                {selectedShape.name}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {NAIL_SHAPES.map(shape => {
                const isSelected = selectedShape.id === shape.id;
                return (
                  <button
                    key={shape.id}
                    type="button"
                    onClick={() => setSelectedShape(shape)}
                    className={`p-3 rounded-xl border text-left transition cursor-pointer ${
                      isSelected 
                        ? 'border-primary bg-primary/10 ring-1 ring-primary' 
                        : 'border-white/10 bg-zinc-900 hover:bg-zinc-800'
                    }`}
                  >
                    <div className="text-xs font-bold text-white">{shape.name}</div>
                    <div className="text-[10px] text-zinc-400 line-clamp-1 mt-0.5">{shape.description}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Nail Polish Palette */}
          <div className="bg-zinc-950/80 border border-white/10 rounded-2xl p-5 shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-sm text-white">
                2. Gel Lacquer & Polish Swatches
              </h4>
              <span className="text-xs font-bold text-primary">
                {selectedColor.name}
              </span>
            </div>

            <div className="grid grid-cols-5 gap-2.5">
              {NAIL_COLORS.map(c => {
                const isSelected = selectedColor.id === c.id;
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setSelectedColor(c)}
                    className={`p-2 rounded-xl border flex flex-col items-center gap-1.5 transition cursor-pointer ${
                      isSelected 
                        ? 'border-primary bg-primary/10 ring-1 ring-primary' 
                        : 'border-white/10 bg-zinc-900 hover:bg-zinc-800'
                    }`}
                  >
                    <span 
                      className="w-6 h-6 rounded-full border border-white/40 shadow-inner"
                      style={{ backgroundColor: c.hex }}
                    />
                    <span className="text-[9px] text-zinc-300 font-medium truncate w-full text-center">
                      {c.name.split(' ')[0]}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

        </div>

      </div>

      {/* ─── POPULAR NAIL ART INSPIRATIONS ─── */}
      <div className="space-y-4 pt-4 border-t border-white/10">
        <div>
          <h3 className="font-display text-2xl font-bold text-white tracking-wide">
            Curated Nail Art Catalog
          </h3>
          <p className="text-xs text-zinc-400 mt-1">
            Browse trending chrome, ombré, and minimalist hand aesthetics
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {NAIL_DESIGNS.map(design => {
            const isSelected = selectedDesign.id === design.id;
            return (
              <div
                key={design.id}
                onClick={() => setSelectedDesign(design)}
                className={`group rounded-2xl overflow-hidden border transition-all duration-300 bg-zinc-950/80 cursor-pointer ${
                  isSelected 
                    ? 'border-primary ring-1 ring-primary shadow-[0_0_20px_rgba(225,29,72,0.4)]' 
                    : 'border-white/10 hover:border-white/30'
                }`}
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-black">
                  <img src={design.image} alt={design.name} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                  <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded bg-black/70 backdrop-blur text-[10px] font-bold text-white border border-white/10">
                    {design.style}
                  </div>
                </div>

                <div className="p-4 space-y-1.5">
                  <h4 className="font-bold text-white text-sm group-hover:text-primary transition">
                    {design.name}
                  </h4>
                  <p className="text-[11px] text-zinc-400 line-clamp-2">
                    {design.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ─── SALON MANICURE & PEDICURE SERVICES ─── */}
      <div className="space-y-4 pt-4 border-t border-white/10">
        <h3 className="font-display text-2xl font-bold text-white tracking-wide">
          Salon Manicure & Pedicure Services
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {NAIL_SERVICES.map(srv => (
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
                onClick={() => onBookNailService(srv, selectedColor)}
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
