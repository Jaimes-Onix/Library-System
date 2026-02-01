
import React, { useState } from 'react';
import { Plus, Trash2, X, Check, Heart, Briefcase, GraduationCap, User, Palette, Sparkles } from 'lucide-react';
import { LibraryBook, Theme, Category } from '../types';

interface LibraryProps {
  books: LibraryBook[];
  onSelectBook: (book: LibraryBook) => void;
  onAddNew: () => void;
  onRemoveBook: (id: string) => void;
  onToggleFavorite: (id: string) => void;
  theme: Theme;
  activeFilter: string;
}

const CategoryTag: React.FC<{ category?: Category }> = ({ category }) => {
  if (!category || category === 'Uncategorized') return null;

  const styles = {
    Professional: { bg: 'bg-blue-50', text: 'text-blue-600', icon: Briefcase },
    Academic: { bg: 'bg-purple-50', text: 'text-purple-600', icon: GraduationCap },
    Personal: { bg: 'bg-orange-50', text: 'text-orange-600', icon: User },
    Creative: { bg: 'bg-pink-50', text: 'text-pink-600', icon: Palette },
  }[category];

  if (!styles) return null;
  const Icon = styles.icon;

  return (
    <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider ${styles.bg} ${styles.text} border border-current opacity-70`}>
      <Icon size={12} />
      {category}
    </div>
  );
};

const Library: React.FC<LibraryProps> = ({
  books,
  onSelectBook,
  onAddNew,
  onRemoveBook,
  onToggleFavorite,
  theme,
  activeFilter
}) => {
  const [openingBookId, setOpeningBookId] = useState<string | null>(null);
  const [confirmingDeleteId, setConfirmingDeleteId] = useState<string | null>(null);
  const isDark = theme === 'dark';

  const handleBookClick = (book: LibraryBook) => {
    if (!book || openingBookId || confirmingDeleteId) return;
    setOpeningBookId(book.id);
    setTimeout(() => {
      onSelectBook(book);
      setOpeningBookId(null);
    }, 400);
  };

  const getLibraryTitle = () => {
    switch (activeFilter) {
      case 'favorites':
        return 'Favorite Books';
      case 'Professional':
        return 'Professional Books';
      case 'Academic':
        return 'Academic Library';
      case 'Personal':
        return 'Personal Shelf';
      case 'Creative':
        return 'Creative Works';
      case 'all':
      default:
        return 'Your Library';
    }
  };

  return (
    <div className="relative min-h-full w-full overflow-hidden">
      {/* Aesthetic Background Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div className={`absolute top-[-10%] right-[-5%] w-[60%] h-[60%] rounded-full blur-[140px] opacity-20 animate-pulse transition-colors duration-1000 ${isDark ? 'bg-orange-900/40' : 'bg-orange-200'}`} style={{ animationDuration: '8s' }} />
        <div className={`absolute bottom-[-10%] left-[-5%] w-[50%] h-[50%] rounded-full blur-[120px] opacity-15 animate-pulse transition-colors duration-1000 ${isDark ? 'bg-red-900/30' : 'bg-red-100'}`} style={{ animationDuration: '12s', animationDelay: '2s' }} />
        <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} />
      </div>

      <div className={`relative z-10 w-full max-w-[1600px] mx-auto px-12 pb-40 transition-all duration-700 ${openingBookId ? 'opacity-40 grayscale-[0.3] pointer-events-none' : 'opacity-100'}`}>
        <div className="flex items-center justify-between mt-16 mb-20">
          <div className="space-y-2">
            <h2 className={`text-6xl font-black tracking-tight ${isDark ? 'text-white' : 'text-[#1D1D1F]'}`}>
              {getLibraryTitle()}
            </h2>
            <div className="flex items-center gap-2.5 text-xs font-black uppercase tracking-[0.25em] opacity-40">
              <Sparkles size={14} className="text-orange-500" />
              <span>{activeFilter === 'all' ? 'Curated Collection' : `Collection • ${activeFilter}`}</span>
            </div>
          </div>

          <button
            onClick={onAddNew}
            className={`group relative flex items-center gap-3 px-10 py-5 rounded-[22px] transition-all active:scale-95 shadow-2xl text-base font-bold overflow-hidden ${isDark ? 'bg-orange-600 text-white hover:bg-orange-500' : 'bg-[#1D1D1F] text-white hover:bg-gray-800'}`}
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
            <Plus size={24} className="relative z-10" />
            <span className="relative z-10">Import Files</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-14 gap-y-20">
          {books.map((book) => {
            if (!book || !book.id) return null;

            const isOpening = openingBookId === book.id;
            const isConfirming = confirmingDeleteId === book.id;
            const isFav = book.isFavorite;

            return (
              <div
                key={book.id}
                className="group cursor-pointer relative animate-in fade-in slide-in-from-bottom-4 duration-500"
                onClick={() => handleBookClick(book)}
              >
                <div className={`relative aspect-[3/4.2] mb-6 transition-all duration-500 ease-out 
                  ${!isOpening && !isConfirming ? 'hover:-translate-y-4 hover:shadow-[0_50px_100px_-25px_rgba(0,0,0,0.45)]' : ''} 
                  shadow-[0_20px_45px_-12px_rgba(0,0,0,0.2)] rounded-[10px] overflow-hidden border
                  ${isDark ? 'bg-zinc-800 border-white/5' : 'bg-white border-white/80 backdrop-blur-sm'}`}
                >
                  <img
                    src={book.coverUrl || ""}
                    alt={book.name || "Book Cover"}
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                  />

                  <div className="absolute inset-y-0 left-0 w-[12px] bg-black/10 backdrop-blur-[2px] z-20 pointer-events-none" />
                  <div className="absolute inset-y-0 left-[12px] w-px bg-white/10 z-20 pointer-events-none" />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  {!isOpening && !isConfirming && (
                    <div className="absolute top-4 right-4 flex flex-col gap-3 opacity-0 group-hover:opacity-100 transition-all duration-300 z-30 translate-x-4 group-hover:translate-x-0">
                      <button
                        onClick={(e) => { e.stopPropagation(); onToggleFavorite(book.id); }}
                        className={`p-3.5 backdrop-blur-md rounded-full transition-all duration-300 active:scale-90 shadow-2xl border border-white/20
                          ${isFav ? 'bg-white text-red-500' : 'bg-black/40 text-white hover:bg-black/60'}
                        `}
                      >
                        <Heart size={18} className={isFav ? 'fill-red-500' : ''} />
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); setConfirmingDeleteId(book.id); }}
                        className="p-3.5 bg-black/40 hover:bg-red-600 backdrop-blur-md text-white rounded-full transition-all duration-300 shadow-2xl border border-white/20"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  )}

                  {isConfirming && (
                    <div className="absolute inset-0 bg-black/95 backdrop-blur-md z-40 flex flex-col items-center justify-center p-6 text-center animate-in zoom-in duration-300">
                      <span className="text-white text-xs font-black mb-8 uppercase tracking-[0.25em] opacity-70">Remove Book?</span>
                      <div className="flex gap-5">
                        <button
                          onClick={(e) => { e.stopPropagation(); onRemoveBook(book.id); setConfirmingDeleteId(null); }}
                          className="w-14 h-14 bg-red-600 text-white rounded-[20px] flex items-center justify-center active:scale-90 transition-transform shadow-lg"
                        >
                          <Check size={24} strokeWidth={3} />
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); setConfirmingDeleteId(null); }}
                          className="w-14 h-14 bg-white/10 text-white rounded-[20px] flex items-center justify-center active:scale-90 transition-transform"
                        >
                          <X size={24} strokeWidth={3} />
                        </button>
                      </div>
                    </div>
                  )}

                  {isOpening && (
                    <div className="absolute inset-0 bg-white/10 backdrop-blur-md z-50 flex items-center justify-center">
                      <div className="w-24 h-1.5 bg-orange-600 rounded-full animate-pulse shadow-[0_0_25px_rgba(249,115,22,0.7)]" />
                    </div>
                  )}
                </div>

                <div className="px-2 space-y-3">
                  <h3 className={`text-[17px] font-extrabold truncate leading-tight tracking-tight transition-all duration-300 ${isDark ? 'text-white' : 'text-[#1D1D1F] group-hover:text-orange-600 group-hover:translate-x-1.5'}`}>
                    {(book.name || "Untitled").replace('.pdf', '')}
                  </h3>
                  <div className="flex flex-wrap items-center gap-3">
                    <p className={`text-[10px] font-black uppercase tracking-widest ${isDark ? 'text-zinc-500' : 'text-gray-500'}`}>
                      {book.totalPages || 0} PAGES
                    </p>
                    <CategoryTag category={book.category} />
                  </div>
                </div>
              </div>
            );
          })}

          {books.length === 0 && (
            <button
              onClick={onAddNew}
              className={`group aspect-[3/4.2] border-2 border-dashed rounded-[20px] flex flex-col items-center justify-center gap-5 transition-all duration-500 shadow-inner ${isDark ? 'border-white/10 hover:border-orange-500 hover:bg-orange-500/5 text-zinc-600' : 'border-gray-200 hover:border-orange-400 hover:bg-white hover:shadow-2xl text-gray-400'}`}
            >
              <div className="p-7 rounded-full bg-gray-100 group-hover:bg-orange-100 transition-all duration-500 group-hover:scale-110">
                <Plus size={40} strokeWidth={2} className="group-hover:text-orange-600" />
              </div>
              <span className="text-xs font-black uppercase tracking-widest group-hover:text-orange-600 transition-colors">Import PDF Library</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Library;
