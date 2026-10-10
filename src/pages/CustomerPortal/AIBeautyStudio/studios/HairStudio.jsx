import React, { useState, useEffect } from 'react';
import { 
  Scissors, 
  Search, 
  Filter, 
  Sparkles, 
  Heart, 
  Check, 
  Palette, 
  Layers, 
  User, 
  ArrowRight,
  Sliders,
  CheckCircle2,
  Info
} from 'lucide-react';
import { HAIRSTYLES, HAIR_COLORS, FACE_SHAPES } from '../beautyStudioData';
import { applyCanvasHairTint, blendPhotographicHairstyle } from '../services/beautyCanvasService';

export const HairStudio = ({ 
  userPhoto, 
  onSaveFavorite, 
  isFavorite, 
  onBookStyle 
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGender, setSelectedGender] = useState('all');
  const [selectedLength, setSelectedLength] = useState('all');
  const [selectedTexture, setSelectedTexture] = useState('all');
  const [selectedFaceShape, setSelectedFaceShape] = useState('Oval');

  const [activeStyle, setActiveStyle] = useState(HAIRSTYLES[0]);
  const [activeColor, setActiveColor] = useState(HAIR_COLORS[0]);
  const [previewImage, setPreviewImage] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeViewMode, setActiveViewMode] = useState('gallery'); // 'gallery' | 'preview' | 'recommendations'

  // Update canvas preview whenever userPhoto, activeStyle, or activeColor changes
  useEffect(() => {
    let isCancelled = false;

    const renderPreview = async () => {
      if (!userPhoto) {
        setPreviewImage(null);
        return;
      }

      setIsProcessing(true);
      try {
        let result = userPhoto;

        if (activeStyle) {
          result = await blendPhotographicHairstyle({
            userImageSrc: userPhoto,
            styleImageSrc: activeStyle.image,
            colorHex: activeColor?.hex || 'transparent'
          });
        } else if (activeColor && activeColor.id !== 'original') {
          result = await applyCanvasHairTint(userPhoto, activeColor.hex, 0.65);
        }

        if (!isCancelled) {
          setPreviewImage(result);
          setIsProcessing(false);
        }
      } catch (err) {
        if (!isCancelled) {
          setPreviewImage(userPhoto);
          setIsProcessing(false);
        }
      }
    };

    renderPreview();

    return () => {
      isCancelled = true;
    };
  }, [userPhoto, activeStyle, activeColor]);

  // Filter hairstyles based on criteria
  const filteredHairstyles = HAIRSTYLES.filter(style => {
    const matchesSearch = 
      style.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      style.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      style.tags?.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesGender = selectedGender === 'all' || style.gender === selectedGender;
    const matchesLength = selectedLength === 'all' || style.length === selectedLength;
    const matchesTexture = selectedTexture === 'all' || style.texture === selectedTexture;

    return matchesSearch && matchesGender && matchesLength && matchesTexture;
  });

  const selectedFaceShapeData = FACE_SHAPES.find(f => f.id === selectedFaceShape) || FACE_SHAPES[0];
  const recommendedStyles = HAIRSTYLES.filter(h => h.faceShapes.includes(selectedFaceShape));

  return (
    <div className="space-y-8">
      
      {/* Studio Sub-Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-2 bg-zinc-950/80 border border-white/10 rounded-2xl">
        <div className="flex items-center gap-1.5 overflow-x-auto">
          {[
            { id: 'gallery', label: 'Hairstyle Catalog', icon: <Scissors size={14} /> },
            { id: 'preview', label: 'Virtual Hair Try-On', icon: <Sparkles size={14} />, badge: userPhoto ? 'Photo Loaded' : null },
            { id: 'recommendations', label: 'Face Shape Match', icon: <Layers size={14} /> }
          ].map(tab => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveViewMode(tab.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer whitespace-nowrap ${
                activeViewMode === tab.id
                  ? 'bg-primary text-white shadow ring-1 ring-primary'
                  : 'text-zinc-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
              {tab.badge && (
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              )}
            </button>
          ))}
        </div>

        {/* Selected Style Indicator */}
        <div className="text-xs text-zinc-400 hidden sm:flex items-center gap-2 pr-2">
          <span>Active Cut:</span>
          <strong className="text-white">{activeStyle?.name}</strong>
        </div>
      </div>

      {/* ── VIEW 1: VIRTUAL TRY-ON CANVAS (If selected or user has photo) ───────── */}
      {activeViewMode === 'preview' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left: Canvas Preview Box */}
          <div className="lg:col-span-7 bg-zinc-950/80 border border-white/10 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-display text-lg font-bold text-white flex items-center gap-2">
                  <Sparkles size={17} className="text-primary" />
                  Photographic Hairstyle Transformation
                </h3>
                <p className="text-xs text-zinc-400">
                  Preserving your real facial identity, skin tone, and features
                </p>
              </div>

              {previewImage && (
                <button
                  type="button"
                  onClick={() => onSaveFavorite({
                    ...activeStyle,
                    category: 'Hair',
                    colorName: activeColor.name,
                    colorHex: activeColor.hex,
                    previewImage
                  })}
                  className={`p-2.5 rounded-xl border transition cursor-pointer ${
                    isFavorite(activeStyle.id)
                      ? 'border-rose-500 bg-rose-500/20 text-rose-400'
                      : 'border-white/10 bg-zinc-900 text-zinc-400 hover:text-white'
                  }`}
                  title="Save to favorites"
                >
                  <Heart size={16} className={isFavorite(activeStyle.id) ? 'fill-rose-500' : ''} />
                </button>
              )}
            </div>

            {/* Display Area */}
            <div className="relative aspect-[3/4] max-h-[480px] bg-zinc-900 rounded-2xl overflow-hidden border border-white/10 flex items-center justify-center mx-auto shadow-inner">
              {isProcessing && (
                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-20 flex flex-col items-center justify-center gap-2 text-white text-xs font-semibold">
                  <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                  <span>Compositing hair geometry...</span>
                </div>
              )}

              {userPhoto ? (
                <img
                  src={previewImage || userPhoto}
                  alt="Transformation Preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="p-8 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400 mx-auto">
                    <User size={22} />
                  </div>
                  <p className="text-xs text-zinc-400 max-w-xs">
                    Please upload or snap a portrait photo in the section above to see this haircut on your face.
                  </p>
                </div>
              )}

              {/* Bottom Tag */}
              {userPhoto && (
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between pointer-events-none">
                  <span className="bg-black/80 backdrop-blur-md px-3 py-1 rounded-full text-[11px] text-white border border-white/15">
                    {activeStyle.name} • {activeColor.name}
                  </span>
                  <span className="bg-emerald-950/80 text-emerald-400 border border-emerald-500/30 px-2.5 py-1 rounded-full text-[10px] font-bold">
                    Face Preserved
                  </span>
                </div>
              )}
            </div>

            {/* Book Style Button */}
            <button
              type="button"
              onClick={() => onBookStyle(activeStyle, 'Hair', activeColor)}
              className="w-full py-3.5 rounded-2xl bg-primary hover:bg-primary/90 text-white font-bold text-xs uppercase tracking-widest shadow-[0_0_25px_rgba(225,29,72,0.4)] transition flex items-center justify-center gap-2 cursor-pointer active:scale-95"
            >
              <span>Book Appointment with This Hairstyle</span>
              <ArrowRight size={14} />
            </button>
          </div>

          {/* Right: Hair Color Picker & Style Info */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Color Palette Rack */}
            <div className="bg-zinc-950/80 border border-white/10 rounded-3xl p-6 shadow-2xl space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-display text-base font-bold text-white flex items-center gap-2">
                  <Palette size={16} className="text-primary" />
                  Salon Hair Color & Tint
                </h4>
                <span className="text-xs text-primary font-semibold">{activeColor.name}</span>
              </div>

              <div className="grid grid-cols-4 gap-3">
                {HAIR_COLORS.map(color => {
                  const isSelected = activeColor.id === color.id;
                  return (
                    <button
                      key={color.id}
                      type="button"
                      onClick={() => setActiveColor(color)}
                      className={`p-2 rounded-2xl border text-center transition flex flex-col items-center gap-2 cursor-pointer ${
                        isSelected
                          ? 'border-primary bg-primary/10 shadow ring-1 ring-primary'
                          : 'border-white/10 bg-zinc-900/60 hover:bg-zinc-800'
                      }`}
                    >
                      <div 
                        className="w-8 h-8 rounded-full border border-white/30 shadow-inner flex items-center justify-center"
                        style={{ background: color.hex === 'transparent' ? '#27272a' : color.hex }}
                      >
                        {isSelected && <Check size={14} className="text-white drop-shadow" />}
                      </div>
                      <span className="text-[10px] font-bold text-white line-clamp-1">
                        {color.name.split(' ')[0]}
                      </span>
                    </button>
                  );
                })}
              </div>

              <p className="text-[11px] text-zinc-400 leading-relaxed border-t border-white/5 pt-3">
                {activeColor.description}
              </p>
            </div>

            {/* Active Style Details */}
            <div className="bg-zinc-950/80 border border-white/10 rounded-3xl p-6 shadow-2xl space-y-3">
              <span className="text-[10px] font-bold uppercase tracking-widest text-primary">
                Selected Salon Cut
              </span>
              <h4 className="font-display text-xl font-bold text-white">
                {activeStyle.name}
              </h4>
              <p className="text-xs text-zinc-400 leading-relaxed">
                {activeStyle.description}
              </p>

              <div className="p-3 bg-zinc-900 rounded-xl border border-white/5 text-xs text-zinc-300 space-y-1">
                <strong className="text-primary block text-[11px] uppercase tracking-wider">Master Stylist Tip:</strong>
                <p className="text-zinc-400 leading-relaxed text-[11px]">
                  {activeStyle.stylistTip}
                </p>
              </div>

              <div className="text-[11px] text-zinc-500 pt-1">
                Maintenance: {activeStyle.maintenance}
              </div>
            </div>

          </div>

        </div>
      )}

      {/* ── VIEW 2: HAIRSTYLE CATALOG & FILTERS ────────────────────────────────── */}
      {activeViewMode === 'gallery' && (
        <div className="space-y-6">
          
          {/* Search and Filters Bar */}
          <div className="bg-zinc-950/80 border border-white/10 rounded-3xl p-5 shadow-2xl space-y-4">
            
            {/* Search Input */}
            <div className="relative">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search haircuts (e.g., Butterfly Layers, French Bob, Pompadour, Crop Fade)..."
                className="w-full pl-11 pr-4 py-3 bg-zinc-900 border border-white/10 rounded-2xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-primary transition"
              />
            </div>

            {/* Multi-Filter Row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              
              {/* Gender Preference */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                  Target Preference
                </label>
                <select
                  value={selectedGender}
                  onChange={(e) => setSelectedGender(e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-900 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-primary"
                >
                  <option value="all">All Styles (Universal)</option>
                  <option value="women">Women's Collection</option>
                  <option value="men">Men's Collection</option>
                </select>
              </div>

              {/* Length */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                  Hair Length
                </label>
                <select
                  value={selectedLength}
                  onChange={(e) => setSelectedLength(e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-900 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-primary"
                >
                  <option value="all">All Lengths</option>
                  <option value="short">Short Cuts</option>
                  <option value="medium">Medium Length</option>
                  <option value="long">Long Flowing</option>
                </select>
              </div>

              {/* Texture */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                  Texture Pattern
                </label>
                <select
                  value={selectedTexture}
                  onChange={(e) => setSelectedTexture(e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-900 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-primary"
                >
                  <option value="all">All Textures</option>
                  <option value="straight">Straight & Smooth</option>
                  <option value="wavy">Wavy & Textured</option>
                  <option value="curly">Curly & Coily</option>
                </select>
              </div>

            </div>

          </div>

          {/* Hairstyles Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
            {filteredHairstyles.map(style => {
              const isSelected = activeStyle?.id === style.id;
              const isFav = isFavorite(style.id);

              return (
                <div
                  key={style.id}
                  onClick={() => {
                    setActiveStyle(style);
                    setActiveViewMode('preview');
                  }}
                  className={`group relative bg-zinc-950 border rounded-3xl overflow-hidden transition-all duration-300 shadow-xl flex flex-col justify-between cursor-pointer ${
                    isSelected
                      ? 'border-primary ring-1 ring-primary shadow-[0_0_25px_rgba(225,29,72,0.3)]'
                      : 'border-white/10 hover:border-white/30'
                  }`}
                >
                  {/* Photo Container */}
                  <div className="relative aspect-[3/4] bg-zinc-900 overflow-hidden">
                    <img
                      src={style.image}
                      alt={style.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />

                    {/* Gender & Length Badges */}
                    <div className="absolute top-3 left-3 flex items-center gap-1.5">
                      <span className="bg-black/80 backdrop-blur-md text-[10px] font-bold text-white px-2.5 py-0.5 rounded-full border border-white/10 uppercase">
                        {style.length}
                      </span>
                      <span className="bg-primary/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                        {style.texture}
                      </span>
                    </div>

                    {/* Favorite Heart Button */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSaveFavorite({
                          ...style,
                          category: 'Hair',
                          colorName: activeColor.name,
                          colorHex: activeColor.hex
                        });
                      }}
                      className={`absolute top-3 right-3 w-8 h-8 rounded-full border backdrop-blur-md flex items-center justify-center transition cursor-pointer ${
                        isFav
                          ? 'border-rose-500 bg-rose-500/30 text-rose-400'
                          : 'border-white/20 bg-black/60 text-zinc-400 hover:text-white'
                      }`}
                    >
                      <Heart size={14} className={isFav ? 'fill-rose-500' : ''} />
                    </button>
                  </div>

                  {/* Info Body */}
                  <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="font-display text-base font-bold text-white group-hover:text-primary transition-colors">
                        {style.name}
                      </h4>
                      <p className="text-xs text-zinc-400 mt-1 line-clamp-2">
                        {style.description}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs">
                      <span className="text-zinc-500 text-[11px]">
                        Suitable: {style.faceShapes.slice(0, 2).join(', ')}
                      </span>
                      <span className="text-primary font-bold text-[11px] group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
                        Try On <ArrowRight size={11} />
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      )}

      {/* ── VIEW 3: FACE SHAPE RECOMMENDATIONS ─────────────────────────────────── */}
      {activeViewMode === 'recommendations' && (
        <div className="space-y-6">
          
          {/* Face Shape Selector Header */}
          <div className="bg-zinc-950/80 border border-white/10 rounded-3xl p-6 shadow-2xl space-y-4">
            <div>
              <h3 className="font-display text-lg font-bold text-white flex items-center gap-2">
                <Layers size={18} className="text-primary" />
                Biometric Face Shape Matching Engine
              </h3>
              <p className="text-xs text-zinc-400">
                Select your facial geometry to reveal tailor-made architectural haircut recommendations
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-6 gap-2.5">
              {FACE_SHAPES.map(shape => {
                const isSelected = selectedFaceShape === shape.id;
                return (
                  <button
                    key={shape.id}
                    type="button"
                    onClick={() => setSelectedFaceShape(shape.id)}
                    className={`p-3 rounded-2xl border text-center transition cursor-pointer ${
                      isSelected
                        ? 'border-primary bg-primary/10 shadow ring-1 ring-primary'
                        : 'border-white/10 bg-zinc-900/60 hover:bg-zinc-800'
                    }`}
                  >
                    <div className="text-xs font-bold text-white">{shape.name.split(' ')[0]}</div>
                    <div className="text-[10px] text-zinc-500 mt-0.5">{shape.ratio}</div>
                  </button>
                );
              })}
            </div>

            {/* Selected Shape Detail Card */}
            <div className="p-4 bg-zinc-900 rounded-2xl border border-white/5 space-y-2 text-xs">
              <div className="flex items-center justify-between text-primary font-bold">
                <span>{selectedFaceShapeData.name} Analysis</span>
                <span>{selectedFaceShapeData.ratio}</span>
              </div>
              <p className="text-zinc-300 leading-relaxed">
                {selectedFaceShapeData.description}
              </p>
              <div className="pt-2 border-t border-white/5 flex flex-col sm:flex-row gap-2 text-zinc-400 text-[11px]">
                <div><strong className="text-emerald-400">Recommended:</strong> {selectedFaceShapeData.bestStyles.join(', ')}</div>
                <div><strong className="text-rose-400">Caution:</strong> {selectedFaceShapeData.avoidTips}</div>
              </div>
            </div>
          </div>

          {/* Recommended Cuts Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {recommendedStyles.map(style => (
              <div
                key={style.id}
                onClick={() => {
                  setActiveStyle(style);
                  setActiveViewMode('preview');
                }}
                className="group relative bg-zinc-950 border border-white/10 hover:border-primary rounded-3xl overflow-hidden transition-all duration-300 shadow-xl flex flex-col justify-between cursor-pointer"
              >
                <div className="relative aspect-[3/4] bg-zinc-900 overflow-hidden">
                  <img
                    src={style.image}
                    alt={style.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-3 left-3 bg-emerald-950/80 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase">
                    Optimal Match for {selectedFaceShape}
                  </span>
                </div>
                <div className="p-4 space-y-2">
                  <h4 className="font-display text-base font-bold text-white group-hover:text-primary transition-colors">
                    {style.name}
                  </h4>
                  <p className="text-xs text-zinc-400 line-clamp-2">
                    {style.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

        </div>
      )}

    </div>
  );
};
