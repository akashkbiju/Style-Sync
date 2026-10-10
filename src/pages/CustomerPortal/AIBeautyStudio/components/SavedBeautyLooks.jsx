import React, { useState } from 'react';
import { Heart, Trash2, Calendar, Sparkles, ArrowRight, Tag } from 'lucide-react';

export const SavedBeautyLooks = ({ 
  favorites = [], 
  onRemoveFavorite, 
  onBookLook,
  onBrowseCategory 
}) => {
  const [selectedFilter, setSelectedFilter] = useState('All');

  const categories = ['All', 'Hair', 'Skin', 'Nail', 'Makeup', 'Grooming'];

  const filteredFavorites = selectedFilter === 'All'
    ? favorites
    : favorites.filter(f => (f.category || 'Hair') === selectedFilter);

  if (favorites.length === 0) {
    return (
      <div className="bg-zinc-950/80 border border-white/10 rounded-3xl p-12 text-center shadow-2xl max-w-xl mx-auto space-y-4 my-8">
        <div className="w-16 h-16 rounded-full bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 mx-auto shadow-[0_0_20px_rgba(244,63,94,0.2)]">
          <Heart size={28} />
        </div>
        <h3 className="font-display text-2xl font-bold text-white">
          No Saved Beauty Looks Yet
        </h3>
        <p className="text-xs text-zinc-400 leading-relaxed max-w-sm mx-auto">
          Explore our Hair, Skin, Nail, Makeup, and Grooming studios and click the heart icon on any style or shade to save it to your personal StyleSync Lookbook.
        </p>
        <button
          type="button"
          onClick={() => onBrowseCategory('hair')}
          className="px-6 py-3 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold text-xs uppercase tracking-widest shadow-[0_0_20px_rgba(225,29,72,0.4)] transition inline-flex items-center gap-2 cursor-pointer active:scale-95"
        >
          <Sparkles size={14} /> Start Exploring Studios
        </button>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      
      {/* Header and Filter Pills */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-display text-2xl font-bold text-white tracking-wide flex items-center gap-2.5">
            <Heart size={22} className="text-rose-500 fill-rose-500" />
            My Saved Beauty Lookbook
          </h3>
          <p className="text-xs text-zinc-400 mt-0.5">
            {favorites.length} saved salon look{favorites.length !== 1 ? 's' : ''} ready for booking
          </p>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {categories.map(cat => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedFilter(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer whitespace-nowrap ${
                selectedFilter === cat
                  ? 'bg-primary text-white shadow ring-1 ring-primary'
                  : 'bg-zinc-900 border border-white/10 text-zinc-400 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Saved Looks */}
      {filteredFavorites.length === 0 ? (
        <div className="p-8 text-center bg-zinc-900/50 border border-white/10 rounded-2xl text-xs text-zinc-400">
          No saved looks found under the <strong>{selectedFilter}</strong> category.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {filteredFavorites.map(fav => (
            <div
              key={fav.id || fav.styleId}
              className="group relative bg-zinc-950 border border-white/10 hover:border-primary rounded-2xl overflow-hidden transition-all duration-300 shadow-xl flex flex-col justify-between"
            >
              {/* Image Preview */}
              <div className="relative aspect-[3/4] bg-zinc-900 overflow-hidden">
                <img
                  src={fav.image || fav.previewImage}
                  alt={fav.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />

                {/* Category Badge */}
                <span className="absolute top-3 left-3 bg-black/80 backdrop-blur-md text-[10px] font-bold text-primary px-2.5 py-0.5 rounded-full border border-primary/30 uppercase tracking-wider">
                  {fav.category || 'Hair'}
                </span>

                {/* Delete Button */}
                <button
                  type="button"
                  onClick={() => onRemoveFavorite(fav.id || fav.styleId)}
                  className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/75 backdrop-blur-md border border-white/15 text-zinc-400 hover:text-rose-400 flex items-center justify-center transition cursor-pointer"
                  title="Remove from lookbook"
                >
                  <Trash2 size={13} />
                </button>
              </div>

              {/* Information */}
              <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="font-display text-base font-bold text-white group-hover:text-primary transition-colors">
                    {fav.name}
                  </h4>
                  <p className="text-xs text-zinc-400 mt-1 line-clamp-2">
                    {fav.description}
                  </p>

                  {fav.colorName && (
                    <div className="flex items-center gap-1.5 mt-2 text-xs text-zinc-300">
                      {fav.colorHex && (
                        <span 
                          className="w-3 h-3 rounded-full border border-white/30"
                          style={{ background: fav.colorHex }}
                        />
                      )}
                      <span className="text-[11px] text-zinc-400">Shade: <strong className="text-white">{fav.colorName}</strong></span>
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t border-white/5 flex items-center justify-between gap-2">
                  <span className="text-[10px] text-zinc-500 flex items-center gap-1">
                    <Calendar size={11} /> {fav.savedAt ? new Date(fav.savedAt).toLocaleDateString() : 'Saved'}
                  </span>

                  <button
                    type="button"
                    onClick={() => onBookLook(fav)}
                    className="px-3.5 py-1.5 rounded-xl bg-primary hover:bg-primary/90 text-white text-[11px] font-bold uppercase tracking-wider shadow transition inline-flex items-center gap-1 cursor-pointer active:scale-95"
                  >
                    <span>Book</span>
                    <ArrowRight size={11} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
