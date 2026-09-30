import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Sparkles, 
  Heart, 
  Clock, 
  Scissors, 
  Info, 
  Check, 
  ArrowRight,
  Filter
} from 'lucide-react';
import { 
  HAIRSTYLES, 
  HAIRSTYLE_CATEGORIES, 
  GENDER_FILTERS 
} from './hairStudioData';

export const HairstyleGallery = ({ 
  selectedStyle, 
  onSelectStyle, 
  onBookStyle, 
  favoriteIds = [], 
  onToggleFavorite 
}) => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedGender, setSelectedGender] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [detailModalStyle, setDetailModalStyle] = useState(null);

  // Filter styles based on category, gender, and search text
  const filteredStyles = useMemo(() => {
    return HAIRSTYLES.filter(style => {
      // 1. Gender Filter
      if (selectedGender !== 'all' && style.gender !== selectedGender) {
        return false;
      }

      // 2. Category Filter
      if (selectedCategory === 'trending' && !style.trending) {
        return false;
      } else if (selectedCategory !== 'all' && selectedCategory !== 'trending' && style.category !== selectedCategory) {
        return false;
      }

      // 3. Search Query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = style.name.toLowerCase().includes(query);
        const matchesDesc = style.description.toLowerCase().includes(query);
        const matchesTags = style.tags.some(t => t.toLowerCase().includes(query));
        const matchesFaces = style.faceShapes.some(f => f.toLowerCase().includes(query));
        return matchesName || matchesDesc || matchesTags || matchesFaces;
      }

      return true;
    });
  }, [selectedCategory, selectedGender, searchQuery]);

  return (
    <div className="w-full space-y-6">
      
      {/* Search & Filter Header Bar */}
      <div className="bg-zinc-950/80 border border-white/10 rounded-2xl p-5 shadow-xl">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
          
          {/* Search Input */}
          <div className="relative flex-1">
            <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by haircut (e.g. Fade, Butterfly, Bob, Wolf, Curly, Bangs)..."
              className="w-full pl-10 pr-4 py-3 bg-zinc-900 border border-white/10 rounded-xl text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-primary transition"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-zinc-400 hover:text-white"
              >
                Clear
              </button>
            )}
          </div>

          {/* Gender Filter Segmented Controls */}
          <div className="flex items-center gap-1 bg-zinc-900 p-1.5 rounded-xl border border-white/10 shrink-0">
            {GENDER_FILTERS.map(g => (
              <button
                key={g.id}
                type="button"
                onClick={() => setSelectedGender(g.id)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  selectedGender === g.id
                    ? 'bg-primary text-white shadow-[0_0_15px_rgba(225,29,72,0.4)]'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                {g.label}
              </button>
            ))}
          </div>

        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pt-4 border-t border-white/5 mt-4 scrollbar-thin">
          {HAIRSTYLE_CATEGORIES.map(cat => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-white text-zinc-950 font-bold shadow-lg scale-105'
                  : 'bg-zinc-900/80 text-zinc-400 hover:text-white hover:bg-zinc-800'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between text-xs text-zinc-400 px-1">
        <span>Showing <strong className="text-white">{filteredStyles.length}</strong> designer hairstyles</span>
        {selectedStyle && (
          <span className="flex items-center gap-1.5 text-primary font-semibold">
            <Check size={13} /> Active Selection: <strong>{selectedStyle.name}</strong>
          </span>
        )}
      </div>

      {/* Hairstyles Grid */}
      {filteredStyles.length === 0 ? (
        <div className="p-12 text-center bg-zinc-950/40 border border-white/10 rounded-2xl">
          <Scissors size={36} className="mx-auto text-zinc-600 mb-3" />
          <h4 className="text-base font-bold text-white mb-1">No hairstyles matched your search</h4>
          <p className="text-xs text-zinc-400 mb-4">Try clearing filters or search for another cut.</p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
              setSelectedGender('all');
            }}
            className="px-4 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs font-bold text-white uppercase tracking-wider"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {filteredStyles.map(style => {
            const isSelected = selectedStyle?.id === style.id;
            const isFavorite = favoriteIds.includes(style.id);

            return (
              <div
                key={style.id}
                className={`group relative rounded-2xl overflow-hidden border transition-all duration-300 flex flex-col bg-zinc-950/80 ${
                  isSelected
                    ? 'border-primary shadow-[0_0_25px_rgba(225,29,72,0.35)] ring-1 ring-primary scale-[1.02]'
                    : 'border-white/10 hover:border-white/30 hover:shadow-xl'
                }`}
              >
                {/* Image Container */}
                <div className="relative aspect-[3/4] overflow-hidden bg-zinc-900">
                  <img
                    src={style.image}
                    alt={style.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />

                  {/* Top Badges */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {style.trending && (
                        <span className="bg-primary text-white text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full shadow">
                          Trending 🔥
                        </span>
                      )}
                      <span className="bg-black/70 backdrop-blur-md text-zinc-300 text-[10px] font-semibold px-2 py-0.5 rounded-full border border-white/10">
                        {style.category}
                      </span>
                    </div>

                    {/* Favorite Heart Button */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleFavorite(style);
                      }}
                      className="pointer-events-auto w-8 h-8 rounded-full bg-black/60 backdrop-blur-md border border-white/15 flex items-center justify-center text-white hover:scale-110 transition cursor-pointer"
                      title={isFavorite ? 'Remove from favorites' : 'Save to favorites'}
                    >
                      <Heart
                        size={15}
                        className={isFavorite ? 'fill-rose-500 text-rose-500' : 'text-zinc-300'}
                      />
                    </button>
                  </div>

                  {/* Bottom Gradient Overlay with Price */}
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/40 to-transparent p-3 flex items-end justify-between">
                    <span className="text-[10px] font-semibold text-zinc-300 flex items-center gap-1">
                      <Clock size={11} /> {style.duration}
                    </span>
                    <span className="text-xs font-bold text-primary">
                      ${style.price}
                    </span>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <h4 className="font-display text-base font-bold text-white group-hover:text-primary transition-colors">
                      {style.name}
                    </h4>
                    <p className="text-xs text-zinc-400 mt-1 line-clamp-2 leading-relaxed">
                      {style.description}
                    </p>
                  </div>

                  {/* Face Shapes Compatibility */}
                  <div className="flex flex-wrap gap-1">
                    {style.faceShapes.map(f => (
                      <span
                        key={f}
                        className="text-[9px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded bg-zinc-900 border border-white/5 text-zinc-400"
                      >
                        {f}
                      </span>
                    ))}
                  </div>

                  {/* Actions */}
                  <div className="pt-2 border-t border-white/5 flex items-center gap-2">
                    {/* Try On Button */}
                    <button
                      type="button"
                      onClick={() => onSelectStyle(style)}
                      className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 ${
                        isSelected
                          ? 'bg-emerald-600 text-white shadow-[0_0_15px_rgba(16,185,129,0.4)]'
                          : 'bg-primary hover:bg-primary/90 text-white shadow-[0_0_15px_rgba(225,29,72,0.3)]'
                      }`}
                    >
                      {isSelected ? (
                        <>
                          <Check size={13} strokeWidth={3} /> Selected
                        </>
                      ) : (
                        <>
                          <Sparkles size={13} /> Try Style
                        </>
                      )}
                    </button>

                    {/* Book This Style Button */}
                    <button
                      type="button"
                      onClick={() => onBookStyle(style)}
                      className="py-2.5 px-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-white/10 hover:border-primary text-zinc-300 hover:text-white text-xs font-bold uppercase tracking-wider transition cursor-pointer"
                      title="Book this salon style"
                    >
                      Book
                    </button>

                    {/* Info Modal Trigger */}
                    <button
                      type="button"
                      onClick={() => setDetailModalStyle(style)}
                      className="p-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-white/10 text-zinc-400 hover:text-white transition cursor-pointer"
                      title="View style details & tips"
                    >
                      <Info size={14} />
                    </button>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* Style Details Modal */}
      {detailModalStyle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-lg bg-zinc-950 border border-white/15 rounded-2xl overflow-hidden shadow-2xl p-6 space-y-5">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-primary">
                  {detailModalStyle.category} • {detailModalStyle.gender === 'boy' ? 'Gentlemen' : 'Ladies'}
                </span>
                <h3 className="font-display text-2xl font-bold text-white mt-1">
                  {detailModalStyle.name}
                </h3>
              </div>
              <button
                onClick={() => setDetailModalStyle(null)}
                className="text-zinc-400 hover:text-white p-1"
              >
                ✕
              </button>
            </div>

            <div className="aspect-[16/9] rounded-xl overflow-hidden bg-zinc-900 border border-white/10">
              <img
                src={detailModalStyle.image}
                alt={detailModalStyle.name}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="space-y-3 text-xs">
              <p className="text-zinc-300 leading-relaxed">
                {detailModalStyle.description}
              </p>

              <div className="p-3.5 bg-zinc-900/80 rounded-xl border border-white/5 space-y-2">
                <div className="flex justify-between">
                  <span className="text-zinc-400">Maintenance Level:</span>
                  <span className="font-bold text-white">{detailModalStyle.maintenance}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Best Face Shapes:</span>
                  <span className="font-bold text-white">{detailModalStyle.faceShapes.join(', ')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Recommended Salon Service:</span>
                  <span className="font-bold text-primary">{detailModalStyle.recommendedService}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Duration & Investment:</span>
                  <span className="font-bold text-white">{detailModalStyle.duration} (${detailModalStyle.price})</span>
                </div>
              </div>

              {detailModalStyle.stylistTip && (
                <div className="p-3 bg-primary/10 border border-primary/30 rounded-xl text-primary text-xs">
                  <strong>Master Stylist Tip:</strong> {detailModalStyle.stylistTip}
                </div>
              )}
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => {
                  onSelectStyle(detailModalStyle);
                  setDetailModalStyle(null);
                }}
                className="flex-1 py-3 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold text-xs uppercase tracking-wider shadow-[0_0_15px_rgba(225,29,72,0.4)] transition"
              >
                Try This Style On My Photo
              </button>
              <button
                onClick={() => {
                  onBookStyle(detailModalStyle);
                  setDetailModalStyle(null);
                }}
                className="py-3 px-5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-xs uppercase tracking-wider border border-white/10 transition"
              >
                Book Appointment
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
