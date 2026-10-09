import React, { useState, useEffect } from 'react';
import { 
  Scissors, 
  Sparkles, 
  Droplets, 
  Heart, 
  Palette, 
  User, 
  ArrowLeft, 
  Calendar, 
  Info,
  Check,
  Smile
} from 'lucide-react';
import { useSalon } from '../../../context/SalonContext';
import { BeautyPhotoManager } from './BeautyPhotoManager';
import { HairStudioTab } from './HairStudioTab';
import { SkinStudioTab } from './SkinStudioTab';
import { NailStudioTab } from './NailStudioTab';
import { MakeupStudioTab } from './MakeupStudioTab';
import { GroomingStudioTab } from './GroomingStudioTab';
import { BookBeautyLookModal } from './BookBeautyLookModal';

const CATEGORIES = [
  { id: 'hair', label: 'Hair Studio', icon: Scissors, badge: 'Styles & Colors' },
  { id: 'skin', label: 'Skin Studio', icon: Droplets, badge: 'Health & Facials' },
  { id: 'nail', label: 'Nail Studio', icon: Palette, badge: 'Art & Manicure' },
  { id: 'makeup', label: 'Makeup Studio', icon: Sparkles, badge: 'Virtual Swatches' },
  { id: 'grooming', label: 'Grooming Studio', icon: User, badge: 'Beard & Shave' },
];

export const AIBeautyStudio = () => {
  const { setCustomerTab, setPrefilledBookingStyle, currentUser } = useSalon();

  // Active Category Tab
  const [activeTab, setActiveTab] = useState('hair');

  // Customer photo state (shared across all beauty modules)
  const [customerPhoto, setCustomerPhoto] = useState(null);

  // Saved Favorites Lookbook (persisted in localStorage)
  const [favorites, setFavorites] = useState(() => {
    try {
      const saved = localStorage.getItem('stylesync_beauty_favorites');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('stylesync_beauty_favorites', JSON.stringify(favorites));
    } catch (e) {}
  }, [favorites]);

  const toggleFavorite = (item) => {
    setFavorites(prev => {
      const exists = prev.some(f => f.id === item.id);
      if (exists) {
        return prev.filter(f => f.id !== item.id);
      } else {
        return [...prev, item];
      }
    });
  };

  // Booking Modal State
  const [bookingModalData, setBookingModalData] = useState({
    isOpen: false,
    category: 'hair',
    item: null,
    color: null
  });

  const handleOpenBooking = (item, color = null, cat = activeTab) => {
    setBookingModalData({
      isOpen: true,
      category: cat,
      item,
      color
    });
  };

  const handleConfirmBooking = ({ category, item, color, service, stylistName }) => {
    setBookingModalData({ isOpen: false, category: 'hair', item: null, color: null });

    // Populate prefilled booking style state in SalonContext
    if (setPrefilledBookingStyle) {
      setPrefilledBookingStyle({
        serviceId: service.id,
        stylistName: stylistName,
        notes: `AI Beauty Studio Reference [${category.toUpperCase()}]: ${item.name || item.title}${color ? ` (Color: ${color.name})` : ''}`,
        hairstyleRef: item.image || null,
        hairstyleTitle: item.name || item.title,
        hairstyleColor: color ? color.name : null
      });
    }

    // Direct routing to existing In-Shop appointment booking flow
    setCustomerTab('book-inshop');
  };

  return (
    <div className="min-h-screen bg-black text-slate-100 py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      
      {/* ─── STUDIO HEADER & NAVIGATION ─── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setCustomerTab('home')}
              className="text-xs text-zinc-400 hover:text-white transition flex items-center gap-1 cursor-pointer"
            >
              <ArrowLeft size={13} />
              <span>Back to Portal</span>
            </button>
            <span className="text-zinc-600">•</span>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-primary/20 text-primary text-[11px] font-bold uppercase tracking-wider">
              <Sparkles size={11} /> Next-Gen AI Beauty Experience
            </span>
          </div>

          <h1 className="font-display text-3xl sm:text-4xl font-bold uppercase tracking-wide text-white mt-1">
            StyleSync <span className="text-primary text-glow">AI Beauty Studio</span>
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-2xl mt-1">
            Explore 5 specialized studios: Haircut simulations, visible skin health analysis, nail art designer, virtual makeup tester, and beard grooming.
          </p>
        </div>

        {/* Lookbook Favourites Counter */}
        <div className="flex items-center gap-3">
          <div className="px-3.5 py-2 rounded-xl bg-zinc-950 border border-white/10 flex items-center gap-2 text-xs">
            <Heart size={14} className="text-rose-500 fill-rose-500" />
            <span className="font-bold text-white">{favorites.length}</span>
            <span className="text-zinc-400">Saved Looks</span>
          </div>
        </div>
      </div>

      {/* ─── PERSISTENT PHOTO UPLOADER / CAMERA BAR ─── */}
      <div className="bg-zinc-950/60 border border-white/10 rounded-2xl p-5 shadow-2xl">
        <BeautyPhotoManager
          photo={customerPhoto}
          onPhotoChange={setCustomerPhoto}
          onReset={() => setCustomerPhoto(null)}
          label={
            activeTab === 'skin' ? 'Portrait for Visible Skin Analysis' :
            activeTab === 'nail' ? 'Hand or Portrait Reference' :
            activeTab === 'makeup' ? 'Portrait for Virtual Makeup Tester' :
            activeTab === 'grooming' ? 'Portrait for Beard & Jawline Recommendations' :
            'Portrait for Hairstyle & Hair Color Preview'
          }
          sublabel="Upload once to simulate hairstyles, analyze skin health, test makeup swatches, and explore grooming styles."
        />
      </div>

      {/* ─── 5-CATEGORY STUDIO NAVIGATION TABS ─── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {CATEGORIES.map(cat => {
          const Icon = cat.icon;
          const isActive = activeTab === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => setActiveTab(cat.id)}
              className={`relative p-4 rounded-2xl border text-left transition-all duration-300 flex flex-col justify-between cursor-pointer ${
                isActive 
                  ? 'border-primary bg-primary/10 shadow-[0_0_20px_rgba(225,29,72,0.3)] ring-1 ring-primary' 
                  : 'border-white/10 bg-zinc-950/80 hover:bg-zinc-900 hover:border-white/20'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center transition ${
                  isActive ? 'bg-primary text-white' : 'bg-zinc-900 text-zinc-400'
                }`}>
                  <Icon size={18} />
                </div>
                {isActive && (
                  <span className="w-2 h-2 rounded-full bg-primary shadow-[0_0_8px_rgba(225,29,72,1)]" />
                )}
              </div>

              <div className="mt-3">
                <h3 className="font-bold text-sm text-white">{cat.label}</h3>
                <p className="text-[11px] text-zinc-400 mt-0.5">{cat.badge}</p>
              </div>
            </button>
          );
        })}
      </div>

      {/* ─── CATEGORY CONTENT WORKSPACE ─── */}
      <div className="pt-2">
        {activeTab === 'hair' && (
          <HairStudioTab
            photo={customerPhoto}
            onBookStyle={(style, color) => handleOpenBooking(style, color, 'hair')}
            favorites={favorites}
            onToggleFavorite={toggleFavorite}
          />
        )}

        {activeTab === 'skin' && (
          <SkinStudioTab
            photo={customerPhoto}
            onBookTreatment={(treatment) => handleOpenBooking(treatment, null, 'skin')}
          />
        )}

        {activeTab === 'nail' && (
          <NailStudioTab
            onBookNailService={(service, color) => handleOpenBooking(service, color, 'nail')}
            favorites={favorites}
            onToggleFavorite={toggleFavorite}
          />
        )}

        {activeTab === 'makeup' && (
          <MakeupStudioTab
            photo={customerPhoto}
            onBookMakeupService={(look, lip) => handleOpenBooking(look, lip, 'makeup')}
            favorites={favorites}
            onToggleFavorite={toggleFavorite}
          />
        )}

        {activeTab === 'grooming' && (
          <GroomingStudioTab
            photo={customerPhoto}
            onBookGroomingService={(grooming) => handleOpenBooking(grooming, null, 'grooming')}
            favorites={favorites}
            onToggleFavorite={toggleFavorite}
          />
        )}
      </div>

      {/* ─── BOOKING MODAL (Connects directly into SalonContext & BookInShop) ─── */}
      <BookBeautyLookModal
        isOpen={bookingModalData.isOpen}
        onClose={() => setBookingModalData({ isOpen: false, category: 'hair', item: null, color: null })}
        category={bookingModalData.category}
        item={bookingModalData.item}
        color={bookingModalData.color}
        onConfirmBooking={handleConfirmBooking}
      />

    </div>
  );
};
