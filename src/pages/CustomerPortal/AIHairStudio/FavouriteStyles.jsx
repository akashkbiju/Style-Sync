import React from 'react';
import { Heart, Trash2, Scissors, Sparkles, Clock, Calendar, ArrowRight } from 'lucide-react';

export const FavouriteStyles = ({ 
  favorites = [], 
  onSelectFavorite, 
  onRemoveFavorite, 
  onBookStyle,
  onBrowseGallery 
}) => {
  if (favorites.length === 0) {
    return (
      <div className="bg-zinc-950/80 border border-white/10 rounded-2xl p-12 text-center shadow-xl max-w-xl mx-auto space-y-4">
        <div className="w-16 h-16 rounded-full bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 mx-auto">
          <Heart size={28} />
        </div>
        <h3 className="font-display text-2xl font-bold text-white">
          No Saved Favourites Yet
        </h3>
        <p className="text-xs text-zinc-400 leading-relaxed max-w-sm mx-auto">
          Explore the Hairstyle Gallery or Personalized Recommendations and click the heart icon to save looks you love for future bookings.
        </p>
        <button
          type="button"
          onClick={onBrowseGallery}
          className="px-6 py-3 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold text-xs uppercase tracking-widest shadow-[0_0_20px_rgba(225,29,72,0.4)] transition inline-flex items-center gap-2 cursor-pointer active:scale-95"
        >
          <Sparkles size={14} /> Browse Hairstyle Catalog
        </button>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-display text-2xl font-bold text-white tracking-wide flex items-center gap-2.5">
            <Heart size={22} className="text-rose-500 fill-rose-500" />
            My Saved Favourite Hairstyles
          </h3>
          <p className="text-xs text-zinc-400 mt-0.5">
            {favorites.length} saved salon look{favorites.length !== 1 ? 's' : ''} in your StyleSync lookbook
          </p>
        </div>

        <button
          type="button"
          onClick={onBrowseGallery}
          className="text-xs text-zinc-400 hover:text-white transition flex items-center gap-1 font-semibold"
        >
          <span>Explore More Styles</span>
          <ArrowRight size={13} />
        </button>
      </div>

      {/* Favorites Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {favorites.map((fav) => (
          <div
            key={fav.id || fav.styleId}
            className="group relative bg-zinc-950 border border-white/10 hover:border-primary rounded-2xl overflow-hidden transition-all duration-300 shadow-xl flex flex-col justify-between"
          >
            {/* Thumbnail */}
            <div className="relative aspect-[3/4] bg-zinc-900 overflow-hidden">
              <img
                src={fav.image || fav.previewImage}
                alt={fav.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />

              {/* Remove Favorite Button */}
              <button
                type="button"
                onClick={() => onRemoveFavorite(fav.id || fav.styleId)}
                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/70 backdrop-blur-md border border-white/15 text-zinc-400 hover:text-rose-400 flex items-center justify-center transition cursor-pointer"
                title="Remove from favorites"
              >
                <Trash2 size={14} />
              </button>

              {/* Date Saved Pill */}
              {fav.savedAt && (
                <span className="absolute bottom-3 left-3 bg-black/80 backdrop-blur-md text-[10px] text-zinc-400 px-2 py-0.5 rounded-full border border-white/10 flex items-center gap-1">
                  <Calendar size={10} /> {new Date(fav.savedAt).toLocaleDateString()}
                </span>
              )}
            </div>

            {/* Info */}
            <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
              <div>
                <h4 className="font-display text-base font-bold text-white group-hover:text-primary transition-colors">
                  {fav.name}
                </h4>
                <p className="text-xs text-zinc-400 mt-1 line-clamp-2">
                  {fav.description}
                </p>
                {fav.colorName && (
                  <div className="mt-2 text-[11px] font-semibold text-primary flex items-center gap-1.5">
                    <span 
                      className="w-2.5 h-2.5 rounded-full border border-white/30 inline-block"
                      style={{ background: fav.colorHex || '#d4af37' }} 
                    />
                    <span>Color: {fav.colorName}</span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-2 border-t border-white/5">
                <button
                  type="button"
                  onClick={() => onSelectFavorite(fav)}
                  className="flex-1 py-2 px-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-white/10 text-white text-xs font-bold uppercase tracking-wider transition flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Sparkles size={13} /> Try On
                </button>

                <button
                  type="button"
                  onClick={() => onBookStyle(fav)}
                  className="py-2 px-3 rounded-xl bg-primary hover:bg-primary/90 text-white text-xs font-bold uppercase tracking-wider shadow-[0_0_12px_rgba(225,29,72,0.3)] transition flex items-center gap-1 cursor-pointer active:scale-95"
                  title="Book this style with salon specialist"
                >
                  <Scissors size={13} /> Book
                </button>
              </div>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
};
