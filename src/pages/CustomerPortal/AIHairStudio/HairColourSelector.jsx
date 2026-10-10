import React, { useState } from 'react';
import { Palette, Check, Sparkles, Sliders, RotateCcw } from 'lucide-react';
import { HAIR_COLORS } from './hairStudioData';

export const HairColourSelector = ({ 
  selectedColor, 
  onSelectColor, 
  colorIntensity, 
  onChangeIntensity,
  onApplyColor 
}) => {
  const [activeFamily, setActiveFamily] = useState('All');

  const families = ['All', 'Natural', 'Black & Brown', 'Blondes', 'Reds & Coppers', 'Highlights & Balayage', 'Fashion'];

  const filteredColors = HAIR_COLORS.filter(color => {
    if (activeFamily === 'All') return true;
    return color.family === activeFamily;
  });

  return (
    <div className="w-full bg-zinc-950/80 border border-white/10 rounded-2xl p-6 shadow-xl">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/20 border border-primary/40 flex items-center justify-center text-primary shadow-lg">
            <Palette size={20} />
          </div>
          <div>
            <h3 className="font-display text-xl font-bold text-white tracking-wide">
              Hair Colour Studio
            </h3>
            <p className="text-xs text-zinc-400">
              Try salon-grade highlights, balayage, natural hues, and vibrant fashion shades
            </p>
          </div>
        </div>

        {/* Selected Shade Pill */}
        <div className="flex items-center gap-2 self-start sm:self-auto bg-zinc-900 border border-white/10 px-3 py-1.5 rounded-full">
          <div 
            className="w-4 h-4 rounded-full border border-white/40 shadow"
            style={{ 
              background: selectedColor?.hex === 'transparent' ? 'linear-gradient(135deg, #444, #888)' : selectedColor?.hex 
            }}
          />
          <span className="text-xs font-bold text-white">
            {selectedColor?.name || 'Natural Hair'}
          </span>
        </div>
      </div>

      {/* Family Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-3 mb-5 border-b border-white/5 scrollbar-thin">
        {families.map(family => (
          <button
            key={family}
            type="button"
            onClick={() => setActiveFamily(family)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              activeFamily === family
                ? 'bg-primary text-white shadow-[0_0_15px_rgba(225,29,72,0.4)]'
                : 'bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-800'
            }`}
          >
            {family}
          </button>
        ))}
      </div>

      {/* Swatches Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3 mb-6">
        {filteredColors.map(color => {
          const isSelected = selectedColor?.id === color.id;
          const isOriginal = color.id === 'original';

          return (
            <button
              key={color.id}
              type="button"
              onClick={() => onSelectColor(color)}
              className={`group relative p-3 rounded-xl border text-left transition-all duration-200 cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? 'border-primary bg-primary/10 shadow-[0_0_18px_rgba(225,29,72,0.35)] ring-1 ring-primary'
                  : 'border-white/10 bg-zinc-900/60 hover:border-white/30 hover:bg-zinc-900'
              }`}
            >
              <div className="flex items-center justify-between mb-2.5">
                {/* Swatch Circle */}
                <div 
                  className="w-8 h-8 rounded-full border-2 border-white/30 shadow-md relative overflow-hidden group-hover:scale-105 transition-transform"
                  style={{
                    background: isOriginal 
                      ? 'conic-gradient(#111, #4a2e1b, #c99a4c, #111)' 
                      : `linear-gradient(135deg, ${color.hex} 0%, ${color.accentHex || color.hex} 100%)`
                  }}
                />

                {isSelected && (
                  <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center text-white shadow">
                    <Check size={12} strokeWidth={3} />
                  </div>
                )}
              </div>

              <div>
                <div className="text-xs font-bold text-white line-clamp-1 group-hover:text-primary transition-colors">
                  {color.name}
                </div>
                <div className="text-[10px] text-zinc-400 mt-0.5 line-clamp-1">
                  {color.family}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Controls & Intensity */}
      <div className="p-4 bg-zinc-900/70 border border-white/5 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4">
        
        {/* Intensity Range */}
        <div className="w-full sm:w-72 space-y-1.5">
          <div className="flex items-center justify-between text-xs font-semibold">
            <span className="text-zinc-300 flex items-center gap-1.5">
              <Sliders size={13} className="text-primary" /> Tint Saturation / Depth
            </span>
            <span className="text-primary font-bold">
              {Math.round(colorIntensity * 100)}%
            </span>
          </div>
          <input
            type="range"
            min="0.2"
            max="1.0"
            step="0.05"
            value={colorIntensity}
            onChange={(e) => onChangeIntensity(parseFloat(e.target.value))}
            className="w-full accent-primary h-1.5 bg-zinc-800 rounded-lg cursor-pointer"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5 self-end sm:self-auto w-full sm:w-auto justify-end">
          {selectedColor?.id !== 'original' && (
            <button
              type="button"
              onClick={() => onSelectColor(HAIR_COLORS[0])}
              className="px-3.5 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-zinc-300 transition flex items-center gap-1.5 cursor-pointer"
            >
              <RotateCcw size={13} /> Reset Natural
            </button>
          )}

          <button
            type="button"
            onClick={onApplyColor}
            className="px-5 py-2 rounded-lg bg-primary hover:bg-primary/90 text-xs font-bold uppercase tracking-wider text-white shadow-[0_0_15px_rgba(225,29,72,0.4)] transition flex items-center gap-2 cursor-pointer active:scale-95"
          >
            <Sparkles size={14} /> Preview Colour Tint
          </button>
        </div>

      </div>

    </div>
  );
};
