import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  Sliders, 
  Columns, 
  Maximize2, 
  Sparkles, 
  Heart, 
  Download, 
  Trash2, 
  Scissors, 
  RefreshCw, 
  Check, 
  Share2,
  Calendar,
  Layers,
  RotateCcw
} from 'lucide-react';

export const HairstylePreview = ({
  originalPhoto,
  previewPhoto,
  activeStyle,
  activeColor,
  isGenerating,
  generationProgress = 0,
  generationStatusText = '',
  sessionLooks = [],
  activeLookIndex = 0,
  onSelectSessionLook,
  onDeleteSessionLook,
  onToggleFavorite,
  isFavorite = false,
  onBookStyle,
  onRegenerate,
  onResetToOriginal
}) => {
  // View mode: 'slider' (before/after split), 'side-by-side', 'full'
  const [viewMode, setViewMode] = useState('slider');
  const [sliderPosition, setSliderPosition] = useState(50); // percentage 0 to 100
  const [isDraggingSlider, setIsDraggingSlider] = useState(false);
  const containerRef = useRef(null);

  // Drag handlers for split comparison slider
  const handleMove = useCallback((clientX) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    let percentage = (x / rect.width) * 100;
    percentage = Math.max(5, Math.min(95, percentage));
    setSliderPosition(percentage);
  }, []);

  const handleTouchMove = (e) => {
    if (isDraggingSlider && e.touches.length > 0) {
      handleMove(e.touches[0].clientX);
    }
  };

  const handleMouseMove = (e) => {
    if (isDraggingSlider) {
      handleMove(e.clientX);
    }
  };

  const handleMouseUp = () => {
    setIsDraggingSlider(false);
  };

  useEffect(() => {
    if (isDraggingSlider) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('touchmove', handleTouchMove);
      window.addEventListener('touchend', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleMouseUp);
    };
  }, [isDraggingSlider, handleMouseMove]);

  // Download rendered look to user device
  const handleDownload = () => {
    const targetImage = previewPhoto || originalPhoto;
    if (!targetImage) return;

    const link = document.createElement('a');
    link.href = targetImage;
    link.download = `StyleSync-${activeStyle?.name?.replace(/\s+/g, '-') || 'Hairstyle'}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="w-full bg-zinc-950 border border-white/10 rounded-2xl overflow-hidden shadow-2xl flex flex-col">
      
      {/* Top Header & View Controls */}
      <div className="px-6 py-4 border-b border-white/10 bg-zinc-900/60 flex flex-wrap items-center justify-between gap-4">
        
        {/* Active Style Title */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-primary/20 border border-primary/40 flex items-center justify-center text-primary shadow">
            <Sparkles size={18} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-display text-lg font-bold text-white tracking-wide">
                {activeStyle?.name || 'Selected Hairstyle Look'}
              </h3>
              {activeColor && activeColor.id !== 'original' && (
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-zinc-800 border border-white/10 text-primary">
                  {activeColor.name}
                </span>
              )}
            </div>
            <p className="text-xs text-zinc-400">
              Interactive preview & before/after comparison
            </p>
          </div>
        </div>

        {/* View Mode Switcher */}
        <div className="flex items-center gap-1 bg-zinc-900 p-1 rounded-xl border border-white/10">
          <button
            type="button"
            onClick={() => setViewMode('slider')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
              viewMode === 'slider'
                ? 'bg-primary text-white shadow'
                : 'text-zinc-400 hover:text-white'
            }`}
            title="Before & After Split Slider"
          >
            <Sliders size={13} />
            <span className="hidden sm:inline">Split Slider</span>
          </button>

          <button
            type="button"
            onClick={() => setViewMode('side-by-side')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
              viewMode === 'side-by-side'
                ? 'bg-primary text-white shadow'
                : 'text-zinc-400 hover:text-white'
            }`}
            title="Dual Side-by-Side View"
          >
            <Columns size={13} />
            <span className="hidden sm:inline">Side by Side</span>
          </button>

          <button
            type="button"
            onClick={() => setViewMode('full')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
              viewMode === 'full'
                ? 'bg-primary text-white shadow'
                : 'text-zinc-400 hover:text-white'
            }`}
            title="Single Styled View"
          >
            <Maximize2 size={13} />
            <span className="hidden sm:inline">Full Look</span>
          </button>
        </div>

      </div>

      {/* Main Preview Viewport */}
      <div 
        ref={containerRef}
        className="relative w-full aspect-[4/3] sm:aspect-[16/10] md:aspect-[16/9] max-h-[580px] bg-black overflow-hidden select-none flex items-center justify-center"
      >
        {/* Loading Spinner & Progress Bar */}
        {isGenerating && (
          <div className="absolute inset-0 z-40 bg-black/80 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center">
            <div className="w-16 h-16 rounded-full border-4 border-primary/20 border-t-primary animate-spin mb-4" />
            <h4 className="font-display text-xl font-bold text-white mb-2">
              Styling Your Virtual Look...
            </h4>
            <p className="text-xs text-zinc-400 mb-5 max-w-sm">
              {generationStatusText || 'Analyzing facial features, lighting, and hair geometry...'}
            </p>
            <div className="w-64 h-2 bg-zinc-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary transition-all duration-300 rounded-full"
                style={{ width: `${generationProgress}%` }}
              />
            </div>
            <span className="text-[11px] font-bold text-primary mt-2">
              {generationProgress}%
            </span>
          </div>
        )}

        {/* MODE 1: Split Slider View */}
        {viewMode === 'slider' && (
          <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
            
            {/* Background: Styled New Look */}
            <img
              src={previewPhoto || originalPhoto}
              alt="New Hairstyle"
              className="absolute inset-0 w-full h-full object-contain"
            />
            <span className="absolute bottom-4 right-4 z-10 text-[10px] uppercase tracking-widest font-bold bg-primary text-white px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1.5">
              <Sparkles size={11} />
              <span>After: {activeStyle?.name || 'Virtual Style'}</span>
            </span>

            {/* Foreground: Original Photo (Clipped to Slider Position) */}
            <div
              className="absolute inset-0 overflow-hidden"
              style={{ width: `${sliderPosition}%` }}
            >
              <img
                src={originalPhoto}
                alt="Original Photo"
                className="absolute inset-0 w-full h-full object-contain max-w-none"
                style={{
                  width: containerRef.current ? `${containerRef.current.clientWidth}px` : '100%',
                  height: '100%'
                }}
              />
              <span className="absolute bottom-4 left-4 z-10 text-[10px] uppercase tracking-widest font-bold bg-black/80 text-zinc-300 px-2.5 py-1 rounded-full border border-white/10 shadow-lg">
                Before (Original)
              </span>
            </div>

            {/* Draggable Divider Handle */}
            <div
              className="absolute top-0 bottom-0 z-30 flex items-center justify-center cursor-ew-resize"
              style={{ left: `${sliderPosition}%`, transform: 'translateX(-50%)' }}
              onMouseDown={() => setIsDraggingSlider(true)}
              onTouchStart={() => setIsDraggingSlider(true)}
            >
              <div className="w-0.5 h-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.8)]" />
              <div className="absolute w-9 h-9 rounded-full bg-primary text-white border-2 border-white shadow-xl flex items-center justify-center transform hover:scale-110 active:scale-95 transition-transform">
                <Sliders size={14} className="rotate-90" />
              </div>
            </div>
          </div>
        )}

        {/* MODE 2: Side by Side Dual View */}
        {viewMode === 'side-by-side' && (
          <div className="w-full h-full grid grid-cols-2 gap-1 p-2 bg-zinc-950">
            <div className="relative rounded-xl overflow-hidden bg-black flex items-center justify-center border border-white/10">
              <img
                src={originalPhoto}
                alt="Original"
                className="w-full h-full object-contain"
              />
              <span className="absolute bottom-3 left-3 text-[10px] uppercase tracking-widest font-bold bg-black/80 text-zinc-300 px-2.5 py-1 rounded-full border border-white/10">
                Original Photo
              </span>
            </div>

            <div className="relative rounded-xl overflow-hidden bg-black flex items-center justify-center border border-primary/40">
              <img
                src={previewPhoto || originalPhoto}
                alt="New Look"
                className="w-full h-full object-contain"
              />
              <span className="absolute bottom-3 right-3 text-[10px] uppercase tracking-widest font-bold bg-primary text-white px-2.5 py-1 rounded-full shadow flex items-center gap-1">
                <Sparkles size={10} />
                <span>{activeStyle?.name || 'Virtual Styled Look'}</span>
              </span>
            </div>
          </div>
        )}

        {/* MODE 3: Full Styled Look */}
        {viewMode === 'full' && (
          <div className="relative w-full h-full flex items-center justify-center bg-black">
            <img
              src={previewPhoto || originalPhoto}
              alt="Full Styled Look"
              className="w-full h-full object-contain"
            />
            <span className="absolute bottom-4 right-4 text-[10px] uppercase tracking-widest font-bold bg-primary text-white px-3 py-1 rounded-full shadow">
              {activeStyle?.name || 'Virtual Styled Look'}
            </span>
          </div>
        )}

      </div>

      {/* Session Looks Rack (Comparison Shelf) */}
      {sessionLooks.length > 1 && (
        <div className="px-6 py-3 bg-zinc-900/80 border-t border-white/5 flex items-center gap-3 overflow-x-auto scrollbar-thin">
          <div className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider shrink-0 flex items-center gap-1">
            <Layers size={13} className="text-primary" /> Session Looks ({sessionLooks.length}):
          </div>

          <div className="flex items-center gap-2">
            {sessionLooks.map((look, index) => {
              const isActive = index === activeLookIndex;
              return (
                <div
                  key={look.id || index}
                  onClick={() => onSelectSessionLook(index)}
                  className={`group relative w-14 h-14 rounded-lg overflow-hidden border cursor-pointer shrink-0 transition-all ${
                    isActive
                      ? 'border-primary ring-2 ring-primary scale-105 shadow-[0_0_12px_rgba(225,29,72,0.4)]'
                      : 'border-white/15 opacity-70 hover:opacity-100 hover:border-white/40'
                  }`}
                  title={look.title}
                >
                  <img
                    src={look.image}
                    alt={look.title}
                    className="w-full h-full object-cover"
                  />
                  {/* Delete look action */}
                  {sessionLooks.length > 1 && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteSessionLook(index);
                      }}
                      className="absolute top-0.5 right-0.5 w-4 h-4 rounded bg-black/80 text-zinc-400 hover:text-rose-400 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-[10px]"
                      title="Delete look"
                    >
                      ✕
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Bottom Actions Bar */}
      <div className="p-4 sm:p-6 bg-zinc-900/90 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
        
        {/* Left Secondary Actions */}
        <div className="flex items-center gap-2">
          {/* Favorite Button */}
          <button
            type="button"
            onClick={onToggleFavorite}
            className={`px-3.5 py-2.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
              isFavorite
                ? 'bg-rose-500/10 border-rose-500/40 text-rose-400'
                : 'bg-zinc-800/80 border-white/10 text-zinc-300 hover:text-white hover:bg-zinc-800'
            }`}
            title={isFavorite ? 'Remove from favorites' : 'Save to favorites'}
          >
            <Heart size={15} className={isFavorite ? 'fill-rose-500 text-rose-500' : ''} />
            <span className="hidden sm:inline">{isFavorite ? 'Saved Look' : 'Save Favourite'}</span>
          </button>

          {/* Download Button */}
          <button
            type="button"
            onClick={handleDownload}
            className="px-3.5 py-2.5 rounded-xl bg-zinc-800/80 hover:bg-zinc-800 border border-white/10 text-xs font-semibold text-zinc-300 hover:text-white transition flex items-center gap-1.5 cursor-pointer"
            title="Download preview image"
          >
            <Download size={15} />
            <span className="hidden sm:inline">Download</span>
          </button>

          {/* Reset to Original */}
          <button
            type="button"
            onClick={onResetToOriginal}
            className="px-3.5 py-2.5 rounded-xl bg-zinc-800/80 hover:bg-zinc-800 border border-white/10 text-xs font-semibold text-zinc-300 hover:text-white transition flex items-center gap-1.5 cursor-pointer"
            title="Revert to original photo"
          >
            <RotateCcw size={14} />
            <span className="hidden sm:inline">Original</span>
          </button>
        </div>

        {/* Right Primary Actions */}
        <div className="flex items-center gap-3">
          {/* Regenerate with fresh options */}
          <button
            type="button"
            onClick={onRegenerate}
            disabled={isGenerating}
            className="px-4 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-bold uppercase tracking-wider text-white transition flex items-center gap-1.5 cursor-pointer"
          >
            <RefreshCw size={14} className={isGenerating ? 'animate-spin' : ''} />
            <span>Regenerate Look</span>
          </button>

          {/* BOOK THIS STYLE */}
          <button
            type="button"
            onClick={() => onBookStyle(activeStyle)}
            className="px-6 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold text-xs uppercase tracking-widest shadow-[0_0_20px_rgba(225,29,72,0.5)] transition flex items-center gap-2 cursor-pointer active:scale-95"
          >
            <Scissors size={15} />
            <span>Book This Style</span>
          </button>
        </div>

      </div>

    </div>
  );
};
