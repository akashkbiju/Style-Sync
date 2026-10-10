import React, { useState } from 'react';
import { useSalon } from '../../../context/SalonContext';
import { 
  Sparkles, 
  Scissors, 
  Droplets, 
  Palette, 
  Smile, 
  ShieldCheck, 
  Heart,
  Calendar,
  Layers,
  ArrowRight
} from 'lucide-react';

import { StudioPhotoUploader } from './components/StudioPhotoUploader';
import { HairStudio } from './studios/HairStudio';
import { SkinStudio } from './studios/SkinStudio';
import { NailStudio } from './studios/NailStudio';
import { MakeupStudio } from './studios/MakeupStudio';
import { GroomingStudio } from './studios/GroomingStudio';
import { SavedBeautyLooks } from './components/SavedBeautyLooks';
import { BookBeautyModal } from './components/BookBeautyModal';

export const AIBeautyStudio = () => {
  const { 
    currentUser, 
    setCustomerTab,
    hairFavorites = [], 
    addHairFavorite, 
    removeHairFavorite,
    setPrefilledBookingStyle 
  } = useSalon();

  // Active Category: 'hair' | 'skin' | 'nail' | 'makeup' | 'grooming' | 'lookbook'
  const [activeCategory, setActiveCategory] = useState('hair');

  // Shared user photo (local state only, never uploaded to Firebase without booking consent)
  const [userPhoto, setUserPhoto] = useState(null);

  // Booking Modal State
  const [bookingModalData, setBookingModalData] = useState(null);

  const categories = [
    { id: 'hair', label: 'Hair Studio', icon: <Scissors size={15} />, badge: 'Try-On' },
    { id: 'skin', label: 'Skin Studio', icon: <Droplets size={15} />, badge: 'Skin-Scan' },
    { id: 'nail', label: 'Nail Studio', icon: <Palette size={15} />, badge: 'Palette' },
    { id: 'makeup', label: 'Makeup Studio', icon: <Sparkles size={15} />, badge: 'Landmarks' },
    { id: 'grooming', label: 'Grooming Studio', icon: <Smile size={15} />, badge: 'Barber' },
    { id: 'lookbook', label: 'My Lookbook', icon: <Heart size={15} />, badge: hairFavorites.length ? `${hairFavorites.length}` : null }
  ];

  const handleSaveFavorite = (item) => {
    addHairFavorite?.({
      ...item,
      id: item.id || `fav-${Date.now()}`,
      category: item.category || 'Hair',
      savedAt: new Date().toISOString()
    });
  };

  const isFavorite = (id) => {
    return hairFavorites.some(f => (f.id || f.styleId) === id);
  };

  const handleBookStyle = (item, cat = 'Hair', colorDetail = null) => {
    setBookingModalData({
      lookItem: item,
      category: cat,
      colorDetail
    });
  };

  return (
    <div className="space-y-8 animate-fadeIn pb-16">
      
      {/* ── Studio Hero Header ────────────────────────────────────────────── */}
      <div className="relative rounded-3xl overflow-hidden border border-white/10 bg-gradient-to-r from-zinc-950 via-zinc-900 to-black p-8 sm:p-10 shadow-2xl">
        <div className="space-y-3 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 text-primary text-xs font-bold uppercase tracking-widest border border-primary/30">
            <Sparkles size={13} /> StyleSync AI Beauty & Grooming Studio
          </div>
          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold uppercase text-white tracking-tight">
            Virtual Try-On & <span className="text-primary text-glow">Cosmetic Studio</span>
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed font-light">
            Upload your portrait or open your live camera to test haircuts, color highlights, skin characteristics, nail designs, and grooming aesthetics on your real face.
          </p>
        </div>
      </div>

      {/* ── STEP 4: Master Reusable Photo Component ────────────────────────── */}
      <StudioPhotoUploader
        photo={userPhoto}
        onPhotoChange={(newPhoto) => setUserPhoto(newPhoto)}
        onRemovePhoto={() => setUserPhoto(null)}
        studioTitle="Studio"
        studioSubtitle="Used across all 5 studios for virtual preview and analysis"
      />

      {/* ── 5 Studios Category Switcher ─────────────────────────────────────── */}
      <div className="sticky top-20 z-30 bg-zinc-950/90 backdrop-blur-xl border border-white/10 rounded-2xl p-2 shadow-2xl">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
          {categories.map(cat => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveCategory(cat.id)}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer whitespace-nowrap active:scale-95 ${
                  isActive
                    ? 'bg-primary text-white shadow-[0_0_20px_rgba(225,29,72,0.4)] ring-1 ring-primary'
                    : 'text-zinc-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {cat.icon}
                <span>{cat.label}</span>
                {cat.badge && (
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    isActive ? 'bg-white/20 text-white' : 'bg-zinc-800 text-zinc-300'
                  }`}>
                    {cat.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Studio Body ────────────────────────────────────────────────────── */}
      <div className="min-h-[500px]">
        {activeCategory === 'hair' && (
          <HairStudio
            userPhoto={userPhoto}
            onSaveFavorite={handleSaveFavorite}
            isFavorite={isFavorite}
            onBookStyle={handleBookStyle}
          />
        )}

        {activeCategory === 'skin' && (
          <SkinStudio
            userPhoto={userPhoto}
            onSaveFavorite={handleSaveFavorite}
            onBookService={handleBookStyle}
          />
        )}

        {activeCategory === 'nail' && (
          <NailStudio
            userPhoto={userPhoto}
            onSaveFavorite={handleSaveFavorite}
            isFavorite={isFavorite}
            onBookStyle={handleBookStyle}
          />
        )}

        {activeCategory === 'makeup' && (
          <MakeupStudio
            userPhoto={userPhoto}
            onSaveFavorite={handleSaveFavorite}
            isFavorite={isFavorite}
            onBookStyle={handleBookStyle}
          />
        )}

        {activeCategory === 'grooming' && (
          <GroomingStudio
            userPhoto={userPhoto}
            onSaveFavorite={handleSaveFavorite}
            isFavorite={isFavorite}
            onBookStyle={handleBookStyle}
          />
        )}

        {activeCategory === 'lookbook' && (
          <SavedBeautyLooks
            favorites={hairFavorites}
            onRemoveFavorite={(id) => removeHairFavorite?.(id)}
            onBookLook={(item) => handleBookStyle(item, item.category || 'Hair')}
            onBrowseCategory={(cat) => setActiveCategory(cat)}
          />
        )}
      </div>

      {/* ── Booking Modal (Step 7: Connect to Firebase & Real Booking) ─────── */}
      {bookingModalData && (
        <BookBeautyModal
          isOpen={!!bookingModalData}
          onClose={() => setBookingModalData(null)}
          lookItem={bookingModalData.lookItem}
          category={bookingModalData.category}
          colorDetail={bookingModalData.colorDetail}
          onConfirmBooking={(bookingPayload) => {
            setPrefilledBookingStyle?.(bookingPayload);
            setCustomerTab('book-inshop');
            setBookingModalData(null);
          }}
        />
      )}

    </div>
  );
};
