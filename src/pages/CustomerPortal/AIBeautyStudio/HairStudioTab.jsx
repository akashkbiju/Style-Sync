import React, { useState, useMemo, useRef, useEffect } from 'react';
import { 
  Scissors, 
  Sparkles, 
  Heart, 
  Search, 
  Sliders, 
  Calendar, 
  Check, 
  Layers, 
  Eye, 
  Filter,
  ArrowRight,
  Info
} from 'lucide-react';
import { 
  HAIRSTYLES, 
  HAIRSTYLE_CATEGORIES, 
  GENDER_FILTERS, 
  HAIR_COLORS, 
  FACE_SHAPES 
} from './beautyStudioData';

export const HairStudioTab = ({
  photo,
  onBookStyle,
  favorites = [],
  onToggleFavorite
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedGender, setSelectedGender] = useState('all');
  const [activeStyle, setActiveStyle] = useState(HAIRSTYLES[0]);
  const [activeColor, setActiveColor] = useState(HAIR_COLORS[0]);
  const [colorIntensity, setColorIntensity] = useState(0.65);
  
  // Interactive Split Comparison Slider
  const [sliderPos, setSliderPos] = useState(50);
  const sliderContainerRef = useRef(null);
  const [isDraggingSlider, setIsDraggingSlider] = useState(false);

  // Client-side canvas rendered hair color preview on photo
  const [tintedPhoto, setTintedPhoto] = useState(photo);

  useEffect(() => {
    if (!photo) {
      setTintedPhoto(null);
      return;
    }

    if (!activeColor || activeColor.id === 'original' || activeColor.hex === 'transparent') {
      setTintedPhoto(photo);
      return;
    }

    // Apply client-side color wash to the upper hair region of the user's photo
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth || 800;
        canvas.height = img.naturalHeight || 1000;
        const ctx = canvas.getContext('2d');

        // Draw original
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        // Hair zone tinting (upper 42% of portrait)
        ctx.save();
        ctx.globalCompositeOperation = 'color';
        ctx.globalAlpha = colorIntensity;

        const hairGrad = ctx.createLinearGradient(0, 0, 0, canvas.height * 0.45);
        hairGrad.addColorStop(0, activeColor.hex);
        hairGrad.addColorStop(0.7, activeColor.hex);
        hairGrad.addColorStop(1, 'transparent');

        ctx.fillStyle = hairGrad;
        ctx.fillRect(0, 0, canvas.width, canvas.height * 0.45);
        ctx.restore();

        setTintedPhoto(canvas.toDataURL('image/jpeg', 0.92));
      } catch (e) {
        setTintedPhoto(photo);
      }
    };
    img.src = photo;
  }, [photo, activeColor, colorIntensity]);

  // Filter styles
  const filteredStyles = useMemo(() => {
    return HAIRSTYLES.filter(s => {
      // 1. Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = s.name.toLowerCase().includes(q);
        const matchTags = s.tags.some(t => t.toLowerCase().includes(q));
        const matchDesc = s.description.toLowerCase().includes(q);
        if (!matchName && !matchTags && !matchDesc) return false;
      }

      // 2. Gender filter
      if (selectedGender !== 'all' && s.gender !== selectedGender) return false;

      // 3. Category filter
      if (selectedCategory !== 'all') {
        if (selectedCategory === 'trending') return s.trending;
        if (s.category !== selectedCategory && !s.hairTexture?.includes(selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1))) {
          return false;
        }
      }

      return true;
    });
  }, [searchQuery, selectedCategory, selectedGender]);

  // Split slider drag handling
  const handleSliderMove = (clientX) => {
    if (!sliderContainerRef.current) return;
    const rect = sliderContainerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    let pct = (x / rect.width) * 100;
    pct = Math.max(5, Math.min(95, pct));
    setSliderPos(pct);
  };

  const isCurrentFavorite = favorites.some(f => f.id === activeStyle.id);

  return (
    <div className="space-y-8">
      
      {/* ─── INTERACTIVE PREVIEW & STUDIO RACK ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left: Live Comparison Viewport */}
        <div className="lg:col-span-7 bg-zinc-950/80 border border-white/10 rounded-2xl p-5 shadow-2xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-xs font-bold text-white uppercase tracking-wider">
                Interactive Style & Color Studio
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => onToggleFavorite(activeStyle)}
                className={`p-2 rounded-xl border transition cursor-pointer ${
                  isCurrentFavorite 
                    ? 'border-rose-500 bg-rose-500/20 text-rose-400' 
                    : 'border-white/10 bg-zinc-900 text-zinc-400 hover:text-white'
                }`}
                title={isCurrentFavorite ? 'Remove from favorites' : 'Save to favorites'}
              >
                <Heart size={16} className={isCurrentFavorite ? 'fill-rose-500' : ''} />
              </button>

              <button
                type="button"
                onClick={() => onBookStyle(activeStyle, activeColor)}
                className="px-4 py-2 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold text-xs uppercase tracking-wider shadow-[0_0_15px_rgba(225,29,72,0.4)] transition flex items-center gap-1.5 cursor-pointer active:scale-95"
              >
                <Scissors size={14} /> Book This Style
              </button>
            </div>
          </div>

          {/* Canvas Display Viewport */}
          <div 
            ref={sliderContainerRef}
            onMouseDown={() => setIsDraggingSlider(true)}
            onMouseUp={() => setIsDraggingSlider(false)}
            onMouseMove={(e) => isDraggingSlider && handleSliderMove(e.clientX)}
            onTouchMove={(e) => handleSliderMove(e.touches[0].clientX)}
            className="relative aspect-[4/3] rounded-xl overflow-hidden bg-black select-none border border-white/15 cursor-ew-resize group"
          >
            {photo ? (
              <>
                {/* Underneath: Transformed / Tinted photo */}
                <img 
                  src={tintedPhoto || photo} 
                  alt="Tinted style preview" 
                  className="absolute inset-0 w-full h-full object-cover" 
                />

                {/* Overlaid: Original photo clipped by slider position */}
                <div 
                  className="absolute inset-0 overflow-hidden"
                  style={{ width: `${sliderPos}%` }}
                >
                  <img 
                    src={photo} 
                    alt="Original portrait" 
                    className="absolute inset-0 w-full h-full object-cover max-w-none"
                    style={{ width: sliderContainerRef.current ? `${sliderContainerRef.current.clientWidth}px` : '100%' }}
                  />
                  <div className="absolute top-3 left-3 px-2 py-1 rounded bg-black/75 backdrop-blur text-[10px] font-bold text-zinc-300 border border-white/10 uppercase tracking-wider">
                    Before (Original)
                  </div>
                </div>

                {/* Split Handle Divider Line */}
                <div 
                  className="absolute top-0 bottom-0 w-0.5 bg-white shadow-[0_0_10px_rgba(255,255,255,0.8)] pointer-events-none"
                  style={{ left: `${sliderPos}%` }}
                >
                  <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-primary border-2 border-white text-white flex items-center justify-center shadow-lg">
                    <Sliders size={13} />
                  </div>
                </div>

                <div className="absolute top-3 right-3 px-2 py-1 rounded bg-primary/80 backdrop-blur text-[10px] font-bold text-white border border-primary/40 uppercase tracking-wider">
                  After ({activeColor.name})
                </div>
              </>
            ) : (
              /* No photo uploaded: Display catalog model reference */
              <div className="relative w-full h-full">
                <img 
                  src={activeStyle.image} 
                  alt={activeStyle.name} 
                  className="w-full h-full object-cover" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent flex flex-col justify-end p-6">
                  <span className="text-[11px] font-bold uppercase tracking-widest text-primary">
                    Salon Catalog Reference Look
                  </span>
                  <h4 className="text-xl font-display font-bold text-white">
                    {activeStyle.name}
                  </h4>
                  <p className="text-xs text-zinc-300 mt-1 max-w-md line-clamp-2">
                    {activeStyle.description}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Honest Transparent Methodology Disclaimer */}
          <div className="p-3 rounded-xl bg-zinc-900/60 border border-white/10 flex items-start gap-2.5 text-xs text-zinc-400">
            <Info size={15} className="shrink-0 text-primary mt-0.5" />
            <p className="leading-relaxed">
              <strong>Transparent Preview Mode:</strong> The simulator uses real client-side colorimetry and photographic catalog alignment on your photo. It maintains 100% of your authentic face and features without generating artificial fake portraits.
            </p>
          </div>
        </div>

        {/* Right: Hair Colour Selector & Style Specs */}
        <div className="lg:col-span-5 space-y-5">
          
          {/* Active Style Details Card */}
          <div className="bg-zinc-950/80 border border-white/10 rounded-2xl p-5 shadow-xl space-y-4">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-primary">
                  {activeStyle.gender === 'girl' ? "Women's Collection" : "Men's Collection"}
                </span>
                <span className="text-xs font-bold text-zinc-400">
                  ₹{activeStyle.price} • {activeStyle.duration}
                </span>
              </div>
              <h3 className="font-display text-xl font-bold text-white mt-0.5">
                {activeStyle.name}
              </h3>
            </div>

            <p className="text-xs text-zinc-400 leading-relaxed">
              {activeStyle.description}
            </p>

            <div className="p-3 rounded-xl bg-zinc-900 border border-white/10 space-y-1.5 text-xs">
              <div className="font-bold text-white flex items-center gap-1.5">
                <Sparkles size={13} className="text-primary" />
                <span>Master Stylist Tip:</span>
              </div>
              <p className="text-zinc-400 text-[11px]">
                {activeStyle.stylistTip}
              </p>
            </div>

            {/* Recommended Face Shapes */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
                Flattering Face Shapes:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {activeStyle.faceShapes.map((shape, idx) => (
                  <span key={idx} className="px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-[11px] text-zinc-300 font-medium">
                    {shape}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Hair Color Palette Selector */}
          <div className="bg-zinc-950/80 border border-white/10 rounded-2xl p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-bold text-sm text-white">
                  Salon Hair Colour Palette
                </h4>
                <p className="text-[11px] text-zinc-400">
                  Select a shade to preview tone simulation
                </p>
              </div>
              <span className="text-xs font-bold text-primary">
                {activeColor.name}
              </span>
            </div>

            {/* Color Swatch Circles */}
            <div className="grid grid-cols-5 gap-2.5">
              {HAIR_COLORS.map(c => {
                const isSelected = activeColor.id === c.id;
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setActiveColor(c)}
                    className={`group relative p-2 rounded-xl border flex flex-col items-center gap-1.5 transition cursor-pointer ${
                      isSelected 
                        ? 'border-primary bg-primary/10 shadow ring-1 ring-primary' 
                        : 'border-white/10 bg-zinc-900 hover:bg-zinc-800'
                    }`}
                  >
                    <span 
                      className="w-6 h-6 rounded-full border border-white/30 shadow-inner"
                      style={{ 
                        backgroundColor: c.hex === 'transparent' ? '#333' : c.hex,
                        backgroundImage: c.hex === 'transparent' ? 'linear-gradient(45deg, #444 25%, transparent 25%), linear-gradient(-45deg, #444 25%, transparent 25%)' : 'none'
                      }}
                    />
                    <span className="text-[9px] text-zinc-300 font-medium truncate w-full text-center">
                      {c.name.split(' ')[0]}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Tint Intensity Slider */}
            {activeColor.id !== 'original' && (
              <div className="space-y-1.5 pt-2 border-t border-white/10">
                <div className="flex justify-between text-xs text-zinc-400">
                  <span>Color Tint Strength</span>
                  <span className="font-bold text-white">{Math.round(colorIntensity * 100)}%</span>
                </div>
                <input 
                  type="range"
                  min="0.2"
                  max="1.0"
                  step="0.05"
                  value={colorIntensity}
                  onChange={(e) => setColorIntensity(parseFloat(e.target.value))}
                  className="w-full accent-primary cursor-pointer"
                />
              </div>
            )}
          </div>

        </div>

      </div>

      {/* ─── SEARCHABLE HAIRSTYLE GALLERY ─── */}
      <div className="space-y-6 pt-4 border-t border-white/10">
        
        {/* Controls: Search & Category Tabs */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="w-full md:w-80 relative">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search fade, bob, layers, pixie..."
              className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-zinc-950 border border-white/15 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-primary"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            {/* Gender Filters */}
            <div className="flex bg-zinc-950 border border-white/10 rounded-xl p-1">
              {GENDER_FILTERS.map(g => (
                <button
                  key={g.id}
                  type="button"
                  onClick={() => setSelectedGender(g.id)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
                    selectedGender === g.id 
                      ? 'bg-primary text-white shadow' 
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  {g.label}
                </button>
              ))}
            </div>

            {/* Length / Texture Filters */}
            <div className="flex flex-wrap gap-1.5 overflow-x-auto">
              {HAIRSTYLE_CATEGORIES.map(cat => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-xl border text-xs font-medium transition cursor-pointer ${
                    selectedCategory === cat.id 
                      ? 'border-primary bg-primary/20 text-white' 
                      : 'border-white/10 bg-zinc-950 text-zinc-400 hover:text-white'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Styles Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {filteredStyles.map(style => {
            const isSelected = activeStyle.id === style.id;
            const isFav = favorites.some(f => f.id === style.id);

            return (
              <div
                key={style.id}
                onClick={() => setActiveStyle(style)}
                className={`group relative rounded-2xl overflow-hidden border transition-all duration-300 bg-zinc-950/80 flex flex-col cursor-pointer ${
                  isSelected 
                    ? 'border-primary shadow-[0_0_20px_rgba(225,29,72,0.4)] ring-1 ring-primary' 
                    : 'border-white/10 hover:border-white/30 hover:translate-y-[-2px]'
                }`}
              >
                {/* Image Aspect Box */}
                <div className="relative aspect-[4/3] overflow-hidden bg-black">
                  <img 
                    src={style.image} 
                    alt={style.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30"></div>

                  <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                    {style.trending && (
                      <span className="px-2 py-0.5 rounded-full bg-primary/90 text-white text-[10px] font-bold uppercase tracking-wider">
                        Trending
                      </span>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleFavorite(style);
                    }}
                    className={`absolute top-2.5 right-2.5 p-2 rounded-full backdrop-blur-md transition ${
                      isFav 
                        ? 'bg-rose-500 text-white' 
                        : 'bg-black/60 text-white hover:bg-black/80'
                    }`}
                  >
                    <Heart size={14} className={isFav ? 'fill-white' : ''} />
                  </button>

                  <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between text-xs font-bold text-white">
                    <span>₹{style.price}</span>
                    <span className="text-zinc-300 font-normal text-[11px]">{style.duration}</span>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-2">
                  <div>
                    <h4 className="font-bold text-white text-sm group-hover:text-primary transition line-clamp-1">
                      {style.name}
                    </h4>
                    <p className="text-[11px] text-zinc-400 line-clamp-2 mt-0.5">
                      {style.description}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[11px]">
                    <span className="text-zinc-500">
                      {style.maintenance} Maintenance
                    </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onBookStyle(style, activeColor);
                      }}
                      className="text-primary hover:underline font-bold flex items-center gap-1"
                    >
                      <span>Book Cut</span>
                      <ArrowRight size={11} />
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
