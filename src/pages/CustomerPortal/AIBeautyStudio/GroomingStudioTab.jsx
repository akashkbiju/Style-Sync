import React, { useState } from 'react';
import { 
  Sparkles, 
  Heart, 
  Calendar, 
  Scissors, 
  Check, 
  Info, 
  ArrowRight,
  ShieldCheck,
  UserCheck
} from 'lucide-react';
import { 
  GROOMING_STYLES, 
  GROOMING_SERVICES, 
  FACE_SHAPES 
} from './beautyStudioData';

export const GroomingStudioTab = ({
  photo,
  onBookGroomingService,
  favorites = [],
  onToggleFavorite
}) => {
  const [activeStyle, setActiveStyle] = useState(GROOMING_STYLES[0]);
  const [selectedShapeFilter, setSelectedShapeFilter] = useState('All');

  const filteredGrooming = selectedShapeFilter === 'All' 
    ? GROOMING_STYLES 
    : GROOMING_STYLES.filter(s => s.faceShapes.includes(selectedShapeFilter));

  const isFav = favorites.some(f => f.id === activeStyle.id);

  return (
    <div className="space-y-8">
      
      {/* ─── GROOMING STUDIO SPOTLIGHT ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left: Reference Look Viewport */}
        <div className="lg:col-span-7 bg-zinc-950/80 border border-white/10 rounded-2xl p-5 shadow-2xl space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Scissors size={14} className="text-primary" />
              <span>Beard Sculpting & Grooming Reference</span>
            </span>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => onToggleFavorite(activeStyle)}
                className={`p-2 rounded-xl border transition cursor-pointer ${
                  isFav ? 'border-rose-500 bg-rose-500/20 text-rose-400' : 'border-white/10 bg-zinc-900 text-zinc-400'
                }`}
              >
                <Heart size={16} className={isFav ? 'fill-rose-500' : ''} />
              </button>

              <button
                type="button"
                onClick={() => onBookGroomingService(activeStyle)}
                className="px-4 py-2 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold text-xs uppercase tracking-wider shadow transition cursor-pointer active:scale-95"
              >
                Book Grooming
              </button>
            </div>
          </div>

          <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-black border border-white/15">
            <img 
              src={activeStyle.image} 
              alt={activeStyle.name} 
              className="w-full h-full object-cover" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent flex flex-col justify-end p-5">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-primary text-white text-[10px] font-bold uppercase tracking-wider">
                  {activeStyle.maintenance} Maintenance
                </span>
              </div>
              <h4 className="font-display text-xl font-bold text-white mt-1">
                {activeStyle.name}
              </h4>
              <p className="text-xs text-zinc-300 mt-0.5 line-clamp-2">
                {activeStyle.description}
              </p>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-zinc-900/60 border border-white/10 flex items-start gap-2.5 text-xs text-zinc-400">
            <Info size={15} className="shrink-0 text-primary mt-0.5" />
            <p className="leading-relaxed text-[11px]">
              <strong>Inclusive Exploration:</strong> Every client is welcome to explore any grooming style, beard shape, or haircut regardless of gender. Save your favorite look as a reference for our master stylists.
            </p>
          </div>
        </div>

        {/* Right: Master Stylist Recommendations */}
        <div className="lg:col-span-5 space-y-4">
          
          <div className="bg-zinc-950/80 border border-white/10 rounded-2xl p-5 shadow-xl space-y-3.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-primary">
              Stylist Recommendation Note
            </span>
            <h4 className="font-bold text-white text-base">
              {activeStyle.name}
            </h4>
            <p className="text-xs text-zinc-400 leading-relaxed">
              {activeStyle.description}
            </p>

            <div className="p-3 rounded-xl bg-zinc-900 border border-white/10 space-y-1 text-xs">
              <span className="font-bold text-white flex items-center gap-1.5">
                <Sparkles size={12} className="text-primary" /> Maintenance Advice:
              </span>
              <p className="text-zinc-400 text-[11px]">
                {activeStyle.stylistTip}
              </p>
            </div>

            <div className="space-y-1.5 pt-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
                Flattering Jawline Shapes:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {activeStyle.faceShapes.map((shape, idx) => (
                  <span key={idx} className="px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-[11px] text-zinc-300">
                    {shape}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Jawline / Face Shape Quick Filter */}
          <div className="bg-zinc-950/80 border border-white/10 rounded-2xl p-4 shadow-xl space-y-2.5">
            <span className="text-xs font-bold text-white uppercase tracking-wider">
              Filter By Face Shape:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {['All', 'Round', 'Square', 'Oval', 'Heart', 'Diamond'].map(f => (
                <button
                  key={f}
                  type="button"
                  onClick={() => setSelectedShapeFilter(f)}
                  className={`px-3 py-1 rounded-xl text-xs font-semibold transition cursor-pointer ${
                    selectedShapeFilter === f ? 'bg-primary text-white shadow' : 'bg-zinc-900 text-zinc-400 hover:text-white'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* ─── GROOMING STYLE CATALOG ─── */}
      <div className="space-y-4 pt-4 border-t border-white/10">
        <div>
          <h3 className="font-display text-2xl font-bold text-white tracking-wide">
            Beard & Precision Grooming Catalog
          </h3>
          <p className="text-xs text-zinc-400 mt-1">
            Choose a signature aesthetic to explore styling details
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredGrooming.map(style => {
            const isSelected = activeStyle.id === style.id;
            return (
              <div
                key={style.id}
                onClick={() => setActiveStyle(style)}
                className={`group rounded-2xl overflow-hidden border transition-all duration-300 bg-zinc-950/80 cursor-pointer ${
                  isSelected ? 'border-primary ring-1 ring-primary shadow-[0_0_20px_rgba(225,29,72,0.4)]' : 'border-white/10 hover:border-white/30'
                }`}
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-black">
                  <img src={style.image} alt={style.name} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                  <div className="absolute top-2.5 left-2.5 flex gap-1">
                    {style.tags.map((t, idx) => (
                      <span key={idx} className="px-2 py-0.5 rounded bg-black/70 backdrop-blur text-[10px] font-bold text-white border border-white/10">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-4 space-y-1.5">
                  <h4 className="font-bold text-white text-sm group-hover:text-primary transition">
                    {style.name}
                  </h4>
                  <p className="text-[11px] text-zinc-400 line-clamp-2">
                    {style.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ─── SALON GROOMING SERVICES ─── */}
      <div className="space-y-4 pt-4 border-t border-white/10">
        <h3 className="font-display text-2xl font-bold text-white tracking-wide">
          Salon Beard Grooming & Shaving Services
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {GROOMING_SERVICES.map(srv => (
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
                onClick={() => onBookGroomingService(srv)}
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
