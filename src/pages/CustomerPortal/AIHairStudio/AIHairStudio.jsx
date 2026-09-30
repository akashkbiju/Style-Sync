import React, { useState, useEffect, useCallback } from 'react';
import { useSalon } from '../../../context/SalonContext';
import { 
  Sparkles, 
  Camera, 
  Upload, 
  Palette, 
  Scissors, 
  Heart, 
  Compass, 
  Settings, 
  ShieldCheck, 
  AlertCircle, 
  CheckCircle2, 
  Sliders, 
  ArrowRight,
  Info
} from 'lucide-react';

import { HAIRSTYLES, HAIR_COLORS, FACE_SHAPES } from './hairStudioData';
import { 
  getAIServiceConfig, 
  requestAIHairstyleGeneration, 
  applyCanvasHairTint 
} from './aiHairstyleService';
import { PhotoUploader } from './PhotoUploader';
import { HairstyleGallery } from './HairstyleGallery';
import { HairColourSelector } from './HairColourSelector';
import { StyleRecommendations } from './StyleRecommendations';
import { HairstylePreview } from './HairstylePreview';
import { FavouriteStyles } from './FavouriteStyles';
import { BookThisStyleModal } from './BookThisStyleModal';
import { AIServiceConfigModal } from './AIServiceConfigModal';

export const AIHairStudio = () => {
  const { 
    currentUser, 
    setCustomerTab, 
    hairFavorites = [], 
    addHairFavorite, 
    removeHairFavorite,
    setPrefilledBookingStyle 
  } = useSalon();

  // Active top tab in the Studio: 'tryon' | 'gallery' | 'color' | 'recommendations' | 'favorites'
  const [activeTab, setActiveTab] = useState('tryon');

  // Customer photo state (Base64 data URL)
  const [userPhoto, setUserPhoto] = useState(() => {
    return localStorage.getItem('stylesync_hair_photo') || null;
  });

  // Active hairstyle and hair color
  const [activeStyle, setActiveStyle] = useState(HAIRSTYLES[0]);
  const [activeColor, setActiveColor] = useState(HAIR_COLORS[0]);
  const [colorIntensity, setColorIntensity] = useState(0.55);

  // Rendered look preview
  const [previewPhoto, setPreviewPhoto] = useState(null);

  // Session history rack of looks
  const [sessionLooks, setSessionLooks] = useState([]);
  const [activeLookIndex, setActiveLookIndex] = useState(0);

  // AI Generation status & loading
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [generationStatusText, setGenerationStatusText] = useState('');
  const [aiError, setAiError] = useState(null);

  // Modals
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [bookingModalStyle, setBookingModalStyle] = useState(null);

  // Check if AI service is configured
  const [aiConfig, setAiConfig] = useState(() => getAIServiceConfig());

  const refreshAiConfig = () => {
    setAiConfig(getAIServiceConfig());
  };

  // Sync photo to localStorage
  const handlePhotoChange = (newPhoto) => {
    setUserPhoto(newPhoto);
    setPreviewPhoto(newPhoto);
    if (newPhoto) {
      try {
        localStorage.setItem('stylesync_hair_photo', newPhoto);
      } catch (e) {
        // quota limit
      }
      // Add as first look in session
      setSessionLooks([{
        id: `look-${Date.now()}`,
        title: 'Original Portrait',
        image: newPhoto,
        style: activeStyle,
        color: activeColor
      }]);
      setActiveLookIndex(0);
    }
  };

  const handleResetPhoto = () => {
    setUserPhoto(null);
    setPreviewPhoto(null);
    setSessionLooks([]);
    localStorage.removeItem('stylesync_hair_photo');
  };

  // Run virtual styling / color try-on
  const handleApplyStyleAndColor = useCallback(async (targetStyle = activeStyle, targetColor = activeColor) => {
    if (!userPhoto) {
      alert('Please upload a photo or select a salon demo model first!');
      setActiveTab('tryon');
      return;
    }

    setIsGenerating(true);
    setAiError(null);
    setGenerationProgress(10);
    setGenerationStatusText('Initiating style transformation...');

    try {
      // Step 1: If AI service is configured, attempt generative rendering
      if (aiConfig.isConfigured || aiConfig.endpoint) {
        const result = await requestAIHairstyleGeneration({
          userImageBase64: userPhoto,
          hairstyle: targetStyle,
          hairColor: targetColor,
          onProgress: (p, text) => {
            setGenerationProgress(p);
            setGenerationStatusText(text);
          }
        });

        if (result.success && result.resultImageUrl) {
          setPreviewPhoto(result.resultImageUrl);
          const newLook = {
            id: `look-${Date.now()}`,
            title: `${targetStyle.name} (${targetColor.name})`,
            image: result.resultImageUrl,
            style: targetStyle,
            color: targetColor,
            isAIGenerated: true
          };
          setSessionLooks(prev => [newLook, ...prev]);
          setActiveLookIndex(0);
          setIsGenerating(false);
          setActiveTab('tryon');
          return;
        } else if (result.error) {
          console.warn('AI API error, falling back to Canvas engine:', result.error);
          setAiError(result.error);
        }
      }

      // Step 2: Client-side Realistic Canvas Tinting Engine
      setGenerationProgress(50);
      setGenerationStatusText('Rendering photographic hair tint & cut simulation on canvas...');
      
      const tintedImage = await applyCanvasHairTint(userPhoto, targetColor.hex, colorIntensity);
      
      setGenerationProgress(100);
      setGenerationStatusText('Complete!');
      setPreviewPhoto(tintedImage);

      const newLook = {
        id: `look-${Date.now()}`,
        title: `${targetStyle.name} (${targetColor.name})`,
        image: tintedImage,
        style: targetStyle,
        color: targetColor,
        isAIGenerated: false
      };
      setSessionLooks(prev => [newLook, ...prev]);
      setActiveLookIndex(0);
      setIsGenerating(false);
      setActiveTab('tryon');

    } catch (err) {
      console.error('Styling error:', err);
      setIsGenerating(false);
      setAiError(err.message || 'Error processing hairstyle preview');
    }
  }, [userPhoto, activeStyle, activeColor, colorIntensity, aiConfig]);

  // When customer selects a hairstyle from the gallery or recommendations
  const handleSelectStyle = (style) => {
    setActiveStyle(style);
    if (userPhoto) {
      handleApplyStyleAndColor(style, activeColor);
    } else {
      setActiveTab('tryon');
    }
  };

  // When customer selects a color from the color studio
  const handleSelectColor = (color) => {
    setActiveColor(color);
  };

  const handleApplyColorPreview = () => {
    if (userPhoto) {
      handleApplyStyleAndColor(activeStyle, activeColor);
    } else {
      alert('Please upload a photo or choose a salon demo model first!');
      setActiveTab('tryon');
    }
  };

  // Favorites handling
  const favoriteIds = hairFavorites.map(f => f.id || f.styleId);

  const handleToggleFavorite = (style) => {
    const isFav = favoriteIds.includes(style.id);
    if (isFav) {
      removeHairFavorite?.(style.id);
    } else {
      addHairFavorite?.({
        id: style.id,
        styleId: style.id,
        name: style.name,
        category: style.category,
        gender: style.gender,
        description: style.description,
        image: style.image,
        colorName: activeColor?.name,
        colorHex: activeColor?.hex,
        savedAt: new Date().toISOString()
      });
    }
  };

  // Booking Flow Connection
  const handleInitiateBooking = (style) => {
    setBookingModalStyle(style || activeStyle);
  };

  const handleConfirmBooking = (bookingData) => {
    // Prefill data for BookInShop
    if (setPrefilledBookingStyle) {
      setPrefilledBookingStyle({
        hairstyleId: bookingData.hairstyle.id,
        hairstyleTitle: bookingData.hairstyle.name,
        hairstyleRef: previewPhoto || bookingData.hairstyle.image,
        hairstyleColor: bookingData.color?.name || 'Natural',
        hairstyleColorHex: bookingData.color?.hex || '',
        serviceId: bookingData.service.id,
        serviceTitle: bookingData.service.title,
        servicePrice: bookingData.service.price,
        stylistName: bookingData.stylistName,
        notes: `AI Hair Studio Look: ${bookingData.hairstyle.name} with ${bookingData.color?.name || 'Natural'} shade.`
      });
    }

    setBookingModalStyle(null);
    // Navigate customer directly to In-Shop Salon Booking!
    setCustomerTab('book-inshop');
  };

  return (
    <div className="w-full pb-16 space-y-8">
      
      {/* ── 1. LUXURY HERO BANNER ────────────────────────────────────────── */}
      <section className="relative rounded-3xl overflow-hidden border border-white/10 bg-gradient-to-br from-zinc-950 via-zinc-900 to-black p-8 sm:p-12 shadow-2xl">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-80 h-80 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/15 border border-primary/30 text-primary text-xs font-bold uppercase tracking-widest shadow-sm">
            <Sparkles size={14} /> AI Hair Studio • Virtual Try-On
          </div>

          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-black uppercase tracking-tight text-white leading-tight">
            Discover Your Next <span className="text-primary text-glow">Signature Look</span>
          </h1>

          <p className="text-sm sm:text-base text-zinc-300 leading-relaxed font-light">
            Upload your portrait or open your live camera to preview designer haircuts, clean fades, bouncy butterfly layers, and salon-grade highlights before setting foot in the salon.
          </p>

          {/* Quick Badges */}
          <div className="flex flex-wrap items-center gap-3 pt-2 text-xs">
            <span className="bg-zinc-900/80 border border-white/10 px-3 py-1 rounded-full text-zinc-300 flex items-center gap-1.5">
              <Scissors size={13} className="text-primary" /> Boys & Girls Styles
            </span>
            <span className="bg-zinc-900/80 border border-white/10 px-3 py-1 rounded-full text-zinc-300 flex items-center gap-1.5">
              <Camera size={13} className="text-primary" /> Live Camera Framing
            </span>
            <span className="bg-zinc-900/80 border border-white/10 px-3 py-1 rounded-full text-zinc-300 flex items-center gap-1.5">
              <Sliders size={13} className="text-primary" /> Split Comparison Slider
            </span>
            <span className="bg-zinc-900/80 border border-white/10 px-3 py-1 rounded-full text-zinc-300 flex items-center gap-1.5">
              <Palette size={13} className="text-primary" /> Hair Colour Studio
            </span>
          </div>
        </div>

        {/* AI Service Status Pill & Settings Button */}
        <div className="absolute top-6 right-6 flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowConfigModal(true)}
            className="px-3.5 py-1.5 rounded-full bg-zinc-900/80 hover:bg-zinc-800 border border-white/10 text-zinc-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition shadow cursor-pointer"
            title="Configure AI API Credentials"
          >
            <Settings size={13} />
            <span className="hidden sm:inline">AI Service Settings</span>
            {aiConfig.isConfigured ? (
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
            ) : (
              <span className="w-2 h-2 rounded-full bg-amber-400" />
            )}
          </button>
        </div>
      </section>

      {/* AI Error Alert if any */}
      {aiError && (
        <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-2xl flex items-center gap-3 text-xs text-amber-300">
          <AlertCircle size={18} className="shrink-0 text-amber-400" />
          <div className="flex-1">
            <strong>AI Notice:</strong> {aiError} (Falling back smoothly to our interactive canvas color tinting simulator).
          </div>
          <button
            onClick={() => setAiError(null)}
            className="text-amber-400 hover:text-white font-bold px-2"
          >
            ✕
          </button>
        </div>
      )}

      {/* ── 2. STUDIO NAVIGATION TABS ────────────────────────────────────── */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-white/10 scrollbar-thin">
        {[
          { id: 'tryon', label: 'Try-On Studio', icon: <Sparkles size={16} /> },
          { id: 'gallery', label: 'Hairstyle Catalog', icon: <Scissors size={16} /> },
          { id: 'color', label: 'Hair Colour Studio', icon: <Palette size={16} /> },
          { id: 'recommendations', label: 'Personalised Quiz', icon: <Compass size={16} /> },
          { id: 'favorites', label: `Saved Favourites (${hairFavorites.length})`, icon: <Heart size={16} /> },
        ].map(tab => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold uppercase tracking-wider transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
              activeTab === tab.id
                ? 'bg-primary text-white shadow-[0_0_20px_rgba(225,29,72,0.4)] scale-[1.02]'
                : 'bg-zinc-900/80 text-zinc-400 hover:text-white hover:bg-zinc-800'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* ── 3. DYNAMIC TAB CONTENT ────────────────────────────────────────── */}

      {/* TAB 1: Main Try-On Studio (Photo + Before/After Preview + Quick Triggers) */}
      {activeTab === 'tryon' && (
        <div className="space-y-8">
          
          {/* Top Section: Photo Uploader */}
          <PhotoUploader
            photo={userPhoto}
            onPhotoChange={handlePhotoChange}
            onReset={handleResetPhoto}
          />

          {/* If photo is loaded: Show the Full Interactive Preview Studio */}
          {userPhoto && (
            <div className="space-y-6">
              
              <HairstylePreview
                originalPhoto={userPhoto}
                previewPhoto={previewPhoto}
                activeStyle={activeStyle}
                activeColor={activeColor}
                isGenerating={isGenerating}
                generationProgress={generationProgress}
                generationStatusText={generationStatusText}
                sessionLooks={sessionLooks}
                activeLookIndex={activeLookIndex}
                onSelectSessionLook={(idx) => {
                  setActiveLookIndex(idx);
                  if (sessionLooks[idx]) {
                    setPreviewPhoto(sessionLooks[idx].image);
                    if (sessionLooks[idx].style) setActiveStyle(sessionLooks[idx].style);
                    if (sessionLooks[idx].color) setActiveColor(sessionLooks[idx].color);
                  }
                }}
                onDeleteSessionLook={(idx) => {
                  setSessionLooks(prev => prev.filter((_, i) => i !== idx));
                }}
                onToggleFavorite={() => handleToggleFavorite(activeStyle)}
                isFavorite={favoriteIds.includes(activeStyle?.id)}
                onBookStyle={handleInitiateBooking}
                onRegenerate={() => handleApplyStyleAndColor(activeStyle, activeColor)}
                onResetToOriginal={() => setPreviewPhoto(userPhoto)}
              />

              {/* Quick Hair Colour Bar attached to Preview Studio */}
              <HairColourSelector
                selectedColor={activeColor}
                onSelectColor={handleSelectColor}
                colorIntensity={colorIntensity}
                onChangeIntensity={setColorIntensity}
                onApplyColor={handleApplyColorPreview}
              />

            </div>
          )}

          {/* Quick Browse Catalog Highlight */}
          <div className="pt-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-display text-xl font-bold text-white tracking-wide">
                  Explore Designer Styles
                </h3>
                <p className="text-xs text-zinc-400">
                  Select any haircut to instantly preview it on your photo
                </p>
              </div>

              <button
                type="button"
                onClick={() => setActiveTab('gallery')}
                className="text-xs text-primary font-bold hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>View All 20+ Styles</span>
                <ArrowRight size={14} />
              </button>
            </div>

            <HairstyleGallery
              selectedStyle={activeStyle}
              onSelectStyle={handleSelectStyle}
              onBookStyle={handleInitiateBooking}
              favoriteIds={favoriteIds}
              onToggleFavorite={handleToggleFavorite}
            />
          </div>

        </div>
      )}

      {/* TAB 2: Full Hairstyle Gallery */}
      {activeTab === 'gallery' && (
        <HairstyleGallery
          selectedStyle={activeStyle}
          onSelectStyle={handleSelectStyle}
          onBookStyle={handleInitiateBooking}
          favoriteIds={favoriteIds}
          onToggleFavorite={handleToggleFavorite}
        />
      )}

      {/* TAB 3: Hair Colour Studio */}
      {activeTab === 'color' && (
        <div className="space-y-6">
          <HairColourSelector
            selectedColor={activeColor}
            onSelectColor={handleSelectColor}
            colorIntensity={colorIntensity}
            onChangeIntensity={setColorIntensity}
            onApplyColor={handleApplyColorPreview}
          />

          {userPhoto ? (
            <div className="p-6 bg-zinc-950 border border-white/10 rounded-2xl">
              <h4 className="font-display text-lg font-bold text-white mb-3">
                Live Studio Comparison
              </h4>
              <HairstylePreview
                originalPhoto={userPhoto}
                previewPhoto={previewPhoto}
                activeStyle={activeStyle}
                activeColor={activeColor}
                isGenerating={isGenerating}
                generationProgress={generationProgress}
                generationStatusText={generationStatusText}
                sessionLooks={sessionLooks}
                activeLookIndex={activeLookIndex}
                onSelectSessionLook={(idx) => {
                  setActiveLookIndex(idx);
                  if (sessionLooks[idx]) setPreviewPhoto(sessionLooks[idx].image);
                }}
                onDeleteSessionLook={(idx) => {
                  setSessionLooks(prev => prev.filter((_, i) => i !== idx));
                }}
                onToggleFavorite={() => handleToggleFavorite(activeStyle)}
                isFavorite={favoriteIds.includes(activeStyle?.id)}
                onBookStyle={handleInitiateBooking}
                onRegenerate={() => handleApplyStyleAndColor(activeStyle, activeColor)}
                onResetToOriginal={() => setPreviewPhoto(userPhoto)}
              />
            </div>
          ) : (
            <div className="p-8 text-center bg-zinc-950 border border-white/10 rounded-2xl max-w-md mx-auto">
              <Camera size={32} className="mx-auto text-primary mb-3" />
              <h4 className="text-base font-bold text-white mb-1">Upload Portrait First</h4>
              <p className="text-xs text-zinc-400 mb-4">
                To test color shades on your actual hair, please upload a photo or use your live camera.
              </p>
              <button
                onClick={() => setActiveTab('tryon')}
                className="px-5 py-2.5 rounded-xl bg-primary text-white text-xs font-bold uppercase tracking-wider"
              >
                Go to Photo Uploader
              </button>
            </div>
          )}
        </div>
      )}

      {/* TAB 4: Personalised Recommendations */}
      {activeTab === 'recommendations' && (
        <StyleRecommendations
          onSelectStyle={handleSelectStyle}
          onBookStyle={handleInitiateBooking}
          favoriteIds={favoriteIds}
          onToggleFavorite={handleToggleFavorite}
        />
      )}

      {/* TAB 5: Saved Favourites */}
      {activeTab === 'favorites' && (
        <FavouriteStyles
          favorites={hairFavorites}
          onSelectFavorite={(fav) => {
            const matched = HAIRSTYLES.find(h => h.id === (fav.id || fav.styleId)) || fav;
            handleSelectStyle(matched);
            setActiveTab('tryon');
          }}
          onRemoveFavorite={(id) => removeHairFavorite?.(id)}
          onBookStyle={handleInitiateBooking}
          onBrowseGallery={() => setActiveTab('gallery')}
        />
      )}

      {/* ── 4. MODALS ─────────────────────────────────────────────────────── */}
      
      {/* Book This Style Modal */}
      {bookingModalStyle && (
        <BookThisStyleModal
          style={bookingModalStyle}
          color={activeColor}
          isOpen={!!bookingModalStyle}
          onClose={() => setBookingModalStyle(null)}
          onConfirmBooking={handleConfirmBooking}
        />
      )}

      {/* AI Credentials Configuration Modal */}
      {showConfigModal && (
        <AIServiceConfigModal
          isOpen={showConfigModal}
          onClose={() => setShowConfigModal(false)}
          onConfigSaved={refreshAiConfig}
        />
      )}

    </div>
  );
};
