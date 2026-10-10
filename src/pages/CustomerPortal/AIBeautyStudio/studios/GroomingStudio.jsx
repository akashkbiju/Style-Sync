import React, { useState } from 'react';
import { 
  Sparkles, 
  Heart, 
  ArrowRight, 
  Check, 
  Layers, 
  User, 
  Info,
  Scissors
} from 'lucide-react';
import { GROOMING_STYLES, FACE_SHAPES } from '../beautyStudioData';

export const GroomingStudio = ({ 
  userPhoto, 
  onSaveFavorite, 
  isFavorite, 
  onBookStyle 
}) => {
  const [activeGrooming, setActiveGrooming] = useState(GROOMING_STYLES[0]);
  const [selectedFaceShape, setSelectedFaceShape] = useState('Oval');

  const selectedShapeData = FACE_SHAPES.find(f => f.id === selectedFaceShape) || FACE_SHAPES[0];
  const matchedGroomingStyles = GROOMING_STYLES.filter(g => g.faceShapes.includes(selectedFaceShape));

  return (
    <div className="space-y-8">
      
      {/* Inclusive Policy Notice */}
      <div className="p-4 bg-zinc-950/80 border border-white/10 rounded-2xl flex items-center justify-between text-xs text-zinc-400">
        <div className="flex items-center gap-2">
          <Sparkles size={15} className="text-primary" />
          <span className="font-semibold text-white">Universal Grooming & Barber Lounge</span>
          <span className="hidden sm:inline text-zinc-500">•</span>
          <span className="hidden sm:inline">All grooming styles and services are accessible to all clients</span>
        </div>
        <span className="text-[11px] text-primary font-bold">Gender-Inclusive</span>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left: Selected Grooming Style Display */}
        <div className="lg:col-span-6 bg-zinc-950/80 border border-white/10 rounded-3xl p-6 shadow-2xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-primary">
                Selected Barber Sculpt Look
              </span>
              <h3 className="font-display text-xl font-bold text-white mt-0.5">
                {activeGrooming.name}
              </h3>
            </div>

            <button
              type="button"
              onClick={() => onSaveFavorite({
                ...activeGrooming,
                category: 'Grooming'
              })}
              className={`p-2.5 rounded-xl border transition cursor-pointer ${
                isFavorite(activeGrooming.id)
                  ? 'border-rose-500 bg-rose-500/20 text-rose-400'
                  : 'border-white/10 bg-zinc-900 text-zinc-400 hover:text-white'
              }`}
            >
              <Heart size={16} className={isFavorite(activeGrooming.id) ? 'fill-rose-500' : ''} />
            </button>
          </div>

          <div className="relative aspect-[3/4] max-h-[440px] bg-zinc-900 rounded-2xl overflow-hidden border border-white/10 shadow-inner">
            <img
              src={activeGrooming.image}
              alt={activeGrooming.name}
              className="w-full h-full object-cover"
            />

            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
              <span className="bg-black/80 backdrop-blur-md px-3 py-1 rounded-full text-[11px] text-white border border-white/15">
                Target: {activeGrooming.serviceName}
              </span>
              <span className="bg-primary/90 text-white px-2.5 py-1 rounded-full text-[10px] font-bold">
                Barber Specialist
              </span>
            </div>
          </div>

          <p className="text-xs text-zinc-400 leading-relaxed">
            {activeGrooming.description}
          </p>

          <div className="p-3.5 bg-zinc-900 rounded-2xl border border-white/5 text-xs text-zinc-300 space-y-1">
            <strong className="text-primary block text-[11px] uppercase tracking-wider">Barber Maintenance Tip:</strong>
            <p className="text-zinc-400 leading-relaxed text-[11px]">
              {activeGrooming.stylistAdvice}
            </p>
          </div>

          <button
            type="button"
            onClick={() => onBookStyle(activeGrooming, 'Grooming')}
            className="w-full py-3.5 rounded-2xl bg-primary hover:bg-primary/90 text-white font-bold text-xs uppercase tracking-widest shadow-[0_0_20px_rgba(225,29,72,0.4)] transition flex items-center justify-center gap-2 cursor-pointer active:scale-95"
          >
            <span>Book Appointment for This Grooming Service</span>
            <ArrowRight size={14} />
          </button>
        </div>

        {/* Right: Jawline Matching & Grooming Catalog */}
        <div className="lg:col-span-6 space-y-6">
          
          {/* Jawline & Face Shape Matching */}
          <div className="bg-zinc-950/80 border border-white/10 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-display text-base font-bold text-white flex items-center gap-2">
                <Layers size={16} className="text-primary" />
                Jawline Contouring Match
              </h4>
              <span className="text-xs text-primary font-bold">{selectedFaceShape} Shape</span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {FACE_SHAPES.map(shape => {
                const isSelected = selectedFaceShape === shape.id;
                return (
                  <button
                    key={shape.id}
                    type="button"
                    onClick={() => setSelectedFaceShape(shape.id)}
                    className={`p-2.5 rounded-xl border text-center transition cursor-pointer ${
                      isSelected
                        ? 'border-primary bg-primary/10 ring-1 ring-primary'
                        : 'border-white/10 bg-zinc-900/60 hover:bg-zinc-800'
                    }`}
                  >
                    <span className="text-xs font-bold text-white block">{shape.name.split(' ')[0]}</span>
                  </button>
                );
              })}
            </div>

            <div className="p-3 bg-zinc-900 rounded-xl border border-white/5 text-[11px] text-zinc-300">
              <strong className="text-emerald-400 block mb-0.5">Recommended Beard Shape:</strong>
              {selectedShapeData.groomingAdvice}
            </div>
          </div>

          {/* Grooming Styles Catalog */}
          <div className="bg-zinc-950/80 border border-white/10 rounded-3xl p-6 shadow-2xl space-y-4">
            <h4 className="font-display text-base font-bold text-white flex items-center gap-2">
              <Scissors size={16} className="text-primary" />
              Barber Grooming Catalogue
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {GROOMING_STYLES.map(style => {
                const isSelected = activeGrooming.id === style.id;
                return (
                  <div
                    key={style.id}
                    onClick={() => setActiveGrooming(style)}
                    className={`rounded-2xl border p-3 transition cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'border-primary bg-primary/10 ring-1 ring-primary'
                        : 'border-white/10 bg-zinc-900/60 hover:bg-zinc-800'
                    }`}
                  >
                    <div className="aspect-[4/3] rounded-xl overflow-hidden bg-black mb-2">
                      <img
                        src={style.image}
                        alt={style.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h5 className="font-display text-xs font-bold text-white line-clamp-1">{style.name}</h5>
                      <p className="text-[10px] text-primary mt-0.5">{style.serviceName}</p>
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
