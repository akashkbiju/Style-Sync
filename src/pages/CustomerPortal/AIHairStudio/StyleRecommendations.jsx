import React, { useState, useMemo } from 'react';
import { 
  Sparkles, 
  HelpCircle, 
  Check, 
  ArrowRight, 
  Heart, 
  Scissors, 
  Sliders, 
  User, 
  Compass,
  Smile
} from 'lucide-react';
import { HAIRSTYLES, FACE_SHAPES } from './hairStudioData';

export const StyleRecommendations = ({ 
  onSelectStyle, 
  onBookStyle,
  favoriteIds = [],
  onToggleFavorite
}) => {
  // Quiz preferences state
  const [preferredLength, setPreferredLength] = useState('any'); // 'any', 'short', 'medium', 'long'
  const [preferredTexture, setPreferredTexture] = useState('any'); // 'any', 'Straight', 'Wavy', 'Curly'
  const [maintenanceLevel, setMaintenanceLevel] = useState('any'); // 'any', 'Low', 'Medium', 'High'
  const [vibe, setVibe] = useState('any'); // 'any', 'Modern', 'Classic', 'Professional', 'Edgy'
  const [faceShape, setFaceShape] = useState('Oval');

  // Compute recommended styles based on active criteria
  const recommendedResults = useMemo(() => {
    const scored = HAIRSTYLES.map(style => {
      let score = 50; // base score
      const matchReasons = [];

      // 1. Face Shape Match
      if (style.faceShapes.includes(faceShape)) {
        score += 25;
        matchReasons.push(`Flattering contour for ${faceShape} face shape`);
      }

      // 2. Length Match
      if (preferredLength !== 'any') {
        if (style.category === preferredLength) {
          score += 20;
          matchReasons.push(`Matches your ${preferredLength} length preference`);
        }
      }

      // 3. Texture Match
      if (preferredTexture !== 'any') {
        if (style.hairTexture.includes(preferredTexture)) {
          score += 20;
          matchReasons.push(`Works naturally with ${preferredTexture} hair texture`);
        }
      }

      // 4. Maintenance Match
      if (maintenanceLevel !== 'any') {
        if (style.maintenance === maintenanceLevel) {
          score += 15;
          matchReasons.push(`${maintenanceLevel} maintenance routine`);
        }
      }

      // 5. Vibe Match
      if (vibe !== 'any') {
        if (style.tags.some(t => t.toLowerCase().includes(vibe.toLowerCase()))) {
          score += 15;
          matchReasons.push(`Reflects your ${vibe} aesthetic preference`);
        }
      }

      if (style.trending) {
        score += 5;
      }

      return {
        ...style,
        matchScore: Math.min(99, score),
        reasons: matchReasons.length > 0 ? matchReasons : [`Balanced salon look tailored for your criteria`]
      };
    });

    // Sort descending by matchScore
    return scored.sort((a, b) => b.matchScore - a.matchScore).slice(0, 3);
  }, [faceShape, preferredLength, preferredTexture, maintenanceLevel, vibe]);

  const activeFaceObj = FACE_SHAPES.find(f => f.id === faceShape) || FACE_SHAPES[0];

  return (
    <div className="w-full space-y-8">
      
      {/* Consultation Questionnaire Card */}
      <div className="bg-zinc-950/90 border border-white/10 rounded-2xl p-6 sm:p-8 shadow-2xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-primary/20 border border-primary/40 flex items-center justify-center text-primary shadow-lg">
            <Compass size={22} />
          </div>
          <div>
            <h3 className="font-display text-2xl font-bold text-white tracking-wide">
              Personalised Style Consultation
            </h3>
            <p className="text-xs text-zinc-400">
              Customize your lifestyle preferences to generate bespoke salon recommendations
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Question 1: Estimated Face Shape */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-1.5">
              <Smile size={14} className="text-primary" /> 1. Face Silhouette / Shape
            </label>
            <select
              value={faceShape}
              onChange={(e) => setFaceShape(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-zinc-900 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-primary font-medium"
            >
              {FACE_SHAPES.map(f => (
                <option key={f.id} value={f.id}>
                  {f.name}
                </option>
              ))}
            </select>
            <p className="text-[11px] text-zinc-500 line-clamp-2">
              {activeFaceObj.description}
            </p>
          </div>

          {/* Question 2: Preferred Length */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-1.5">
              <Scissors size={14} className="text-primary" /> 2. Desired Length
            </label>
            <div className="grid grid-cols-4 gap-1.5">
              {[
                { id: 'any', label: 'Any' },
                { id: 'short', label: 'Short' },
                { id: 'medium', label: 'Mid' },
                { id: 'long', label: 'Long' },
              ].map(opt => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setPreferredLength(opt.id)}
                  className={`py-2 rounded-lg text-xs font-semibold transition cursor-pointer ${
                    preferredLength === opt.id
                      ? 'bg-primary text-white shadow'
                      : 'bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-800'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Question 3: Hair Texture */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-1.5">
              <Sparkles size={14} className="text-primary" /> 3. Hair Texture
            </label>
            <div className="grid grid-cols-4 gap-1.5">
              {[
                { id: 'any', label: 'Any' },
                { id: 'Straight', label: 'Straight' },
                { id: 'Wavy', label: 'Wavy' },
                { id: 'Curly', label: 'Curly' },
              ].map(opt => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setPreferredTexture(opt.id)}
                  className={`py-2 rounded-lg text-xs font-semibold transition cursor-pointer ${
                    preferredTexture === opt.id
                      ? 'bg-primary text-white shadow'
                      : 'bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-800'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Question 4: Daily Maintenance */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-1.5">
              <Sliders size={14} className="text-primary" /> 4. Daily Styling Effort
            </label>
            <div className="grid grid-cols-4 gap-1.5">
              {[
                { id: 'any', label: 'Any' },
                { id: 'Low', label: 'Low (5m)' },
                { id: 'Medium', label: 'Mid (15m)' },
                { id: 'High', label: 'High (30m)' },
              ].map(opt => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setMaintenanceLevel(opt.id)}
                  className={`py-2 rounded-lg text-xs font-semibold transition cursor-pointer ${
                    maintenanceLevel === opt.id
                      ? 'bg-primary text-white shadow'
                      : 'bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-800'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Question 5: Style Vibe */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-1.5">
              <User size={14} className="text-primary" /> 5. Target Aesthetic
            </label>
            <div className="grid grid-cols-4 gap-1.5">
              {[
                { id: 'any', label: 'Any' },
                { id: 'Modern', label: 'Modern' },
                { id: 'Classic', label: 'Classic' },
                { id: 'Trending', label: 'Edgy' },
              ].map(opt => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setVibe(opt.id)}
                  className={`py-2 rounded-lg text-xs font-semibold transition cursor-pointer ${
                    vibe === opt.id
                      ? 'bg-primary text-white shadow'
                      : 'bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-800'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Pro Recommendation summary box */}
          <div className="p-3.5 bg-primary/10 border border-primary/25 rounded-xl flex flex-col justify-center">
            <div className="text-[11px] font-bold text-primary uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles size={13} /> Tailored Stylist Insight
            </div>
            <p className="text-[11px] text-zinc-300 mt-1 leading-relaxed">
              {activeFaceObj.avoidTips}
            </p>
          </div>

        </div>
      </div>

      {/* Recommended Results Cards */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-display text-xl font-bold text-white tracking-wide flex items-center gap-2">
            <Sparkles size={18} className="text-primary" />
            Top 3 Recommended Cuts For You
          </h4>
          <span className="text-xs text-zinc-400">
            Ranked by biometric harmony & lifestyle compatibility
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {recommendedResults.map((style, idx) => {
            const isFav = favoriteIds.includes(style.id);

            return (
              <div
                key={style.id}
                className="group relative bg-zinc-950 border border-white/10 rounded-2xl overflow-hidden hover:border-primary transition-all duration-300 shadow-xl flex flex-col"
              >
                {/* Ranking Tag */}
                <div className="absolute top-3 left-3 z-10 bg-primary text-white text-[11px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full shadow-lg">
                  #{idx + 1} Best Match ({style.matchScore}%)
                </div>

                {/* Heart Button */}
                <button
                  type="button"
                  onClick={() => onToggleFavorite(style)}
                  className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-black/60 backdrop-blur-md border border-white/15 flex items-center justify-center text-white hover:scale-110 transition cursor-pointer"
                >
                  <Heart size={15} className={isFav ? 'fill-rose-500 text-rose-500' : 'text-zinc-300'} />
                </button>

                {/* Image */}
                <div className="aspect-[4/3] bg-zinc-900 overflow-hidden relative">
                  <img
                    src={style.image}
                    alt={style.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                </div>

                {/* Details */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <h5 className="font-display text-lg font-bold text-white group-hover:text-primary transition-colors">
                      {style.name}
                    </h5>
                    <p className="text-xs text-zinc-400 mt-1 line-clamp-2">
                      {style.description}
                    </p>
                  </div>

                  {/* Why this matches you */}
                  <div className="p-3 bg-zinc-900/80 rounded-xl border border-white/5 space-y-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1">
                      <Check size={11} strokeWidth={3} /> Why This Fits You:
                    </span>
                    <ul className="text-[11px] text-zinc-300 space-y-1">
                      {style.reasons.slice(0, 2).map((r, ri) => (
                        <li key={ri} className="flex items-start gap-1.5">
                          <span className="text-primary">•</span>
                          <span>{r}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2 pt-2 border-t border-white/5">
                    <button
                      type="button"
                      onClick={() => onSelectStyle(style)}
                      className="flex-1 py-2.5 px-3 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold text-xs uppercase tracking-wider shadow-[0_0_15px_rgba(225,29,72,0.3)] transition cursor-pointer active:scale-95 flex items-center justify-center gap-1.5"
                    >
                      <Sparkles size={13} /> Try Look
                    </button>

                    <button
                      type="button"
                      onClick={() => onBookStyle(style)}
                      className="py-2.5 px-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-white/10 hover:border-primary text-zinc-300 hover:text-white font-bold text-xs uppercase tracking-wider transition cursor-pointer"
                    >
                      Book Cut
                    </button>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
