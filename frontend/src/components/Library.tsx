
import React, { useState } from 'react';
import { Plus, Trash2, X, Check, Heart, Briefcase, GraduationCap, User, Palette } from 'lucide-react';
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

const CategoryTag: React.FC<{ category?: Category; isDark?: boolean }> = ({ category, isDark }) => {
  if (!category || category === 'Uncategorized') return null;

  const styles = {
    Professional: { bg: isDark ? 'bg-blue-500/10' : 'bg-blue-50', text: 'text-blue-500', icon: Briefcase },
    Academic: { bg: isDark ? 'bg-purple-500/10' : 'bg-purple-50', text: 'text-purple-500', icon: GraduationCap },
    Personal: { bg: isDark ? 'bg-orange-500/10' : 'bg-orange-50', text: 'text-orange-500', icon: User },
    Creative: { bg: isDark ? 'bg-pink-500/10' : 'bg-pink-50', text: 'text-pink-500', icon: Palette },
  }[category];

  if (!styles) return null;
  const Icon = styles.icon;

  return (
    <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider ${styles.bg} ${styles.text}`}>
      <Icon size={10} />
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
        return 'Professional';
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

  const getLibrarySubtitle = () => {
    if (activeFilter === 'all') return 'Curated Collection';
    if (activeFilter === 'favorites') return 'Your Saved Picks';
    return `Collection`;
  };

  return (
    <div className="relative min-h-full w-full overflow-hidden">
      {/* Subtle background effects */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div className={`absolute top-[-10%] right-[-5%] w-[40%] h-[40%] rounded-full blur-[180px] opacity-[0.06] transition-colors duration-1000 ${isDark ? 'bg-gray-400' : 'bg-gray-200'}`} />
        <div className={`absolute bottom-[-10%] left-[-5%] w-[30%] h-[30%] rounded-full blur-[160px] opacity-[0.04] transition-colors duration-1000 ${isDark ? 'bg-gray-500' : 'bg-gray-100'}`} />
      </div>

      <div className={`relative z-10 w-full max-w-[1400px] mx-auto px-10 pb-32 transition-all duration-500 ${openingBookId ? 'opacity-40 pointer-events-none' : 'opacity-100'}`}>
        {/* Header */}
        <div className="flex items-end justify-between mt-12 mb-14">
          <div className="space-y-1">
            <h2 className={`text-4xl font-black tracking-tight ${isDark ? 'text-white' : 'text-[#1D1D1F]'}`}>
              {getLibraryTitle()}
              {['Professional', 'Academic', 'Personal', 'Creative'].includes(activeFilter) && (
                <span className={`${isDark ? 'text-gray-500' : 'text-gray-400'}`}> Flipbooks</span>
              )}
            </h2>
            <p className={`text-xs font-bold uppercase tracking-[0.2em] ${isDark ? 'text-zinc-600' : 'text-gray-400'}`}>
              {getLibrarySubtitle()}
            </p>
          </div>

          <button
            onClick={onAddNew}
            className={`group flex items-center gap-2 px-6 py-3 rounded-2xl transition-all active:scale-95 text-sm font-bold border ${
              isDark 
                ? 'bg-white/[0.06] border-white/[0.08] text-white hover:bg-white/[0.1]' 
                : 'bg-white border-gray-200 text-gray-900 hover:bg-gray-50 shadow-sm'
            }`}
          >
            <Plus size={18} className="group-hover:rotate-90 transition-transform duration-300" />
            Add PDF
          </button>
        </div>

        {/* Book Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-8 gap-y-12">
          {books.map((book) => {
            if (!book || !book.id) return null;

            const isOpening = openingBookId === book.id;
            const isConfirming = confirmingDeleteId === book.id;
            const isFav = book.isFavorite;

            return (
              <div
                key={book.id}
                className="group cursor-pointer relative animate-in fade-in slide-in-from-bottom-3 duration-500"
                onClick={() => handleBookClick(book)}
              >
                {/* Book Cover */}
                <div className={`relative aspect-[3/4] mb-4 transition-all duration-500 ease-out 
                  ${!isOpening && !isConfirming ? 'hover:-translate-y-2 hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.35)]' : ''} 
                  shadow-[0_12px_30px_-8px_rgba(0,0,0,0.15)] rounded-lg overflow-hidden border
                  ${isDark ? 'bg-zinc-800 border-white/5' : 'bg-white border-gray-100'}`}
                >
                  <img
                    src={book.coverUrl || ""}
                    alt={book.name || "Book Cover"}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />

                  {/* Book spine effect */}
                  <div className="absolute inset-y-0 left-0 w-[8px] bg-black/10 z-20 pointer-events-none" />
                  <div className="absolute inset-y-0 left-[8px] w-px bg-white/5 z-20 pointer-events-none" />

                  {/* Hover gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  {/* Action buttons */}
                  {!isOpening && !isConfirming && (
                    <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-200 z-30 translate-y-1 group-hover:translate-y-0">
                      <button
                        onClick={(e) => { e.stopPropagation(); onToggleFavorite(book.id); }}
                        className={`p-2 backdrop-blur-md rounded-full transition-all duration-200 active:scale-90 shadow-lg border border-white/20
                          ${isFav ? 'bg-white text-red-500' : 'bg-black/40 text-white hover:bg-black/60'}
                        `}
                      >
                        <Heart size={14} className={isFav ? 'fill-red-500' : ''} />
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); setConfirmingDeleteId(book.id); }}
                        className="p-2 bg-black/40 hover:bg-red-600 backdrop-blur-md text-white rounded-full transition-all duration-200 shadow-lg border border-white/20"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  )}

                  {/* Delete confirmation */}
                  {isConfirming && (
                    <div className="absolute inset-0 bg-black/90 backdrop-blur-md z-40 flex flex-col items-center justify-center p-4 text-center animate-in zoom-in duration-200">
                      <span className="text-white text-[10px] font-black mb-5 uppercase tracking-[0.2em] opacity-70">Remove?</span>
                      <div className="flex gap-3">
                        <button
                          onClick={(e) => { e.stopPropagation(); onRemoveBook(book.id); setConfirmingDeleteId(null); }}
                          className="w-10 h-10 bg-red-600 text-white rounded-xl flex items-center justify-center active:scale-90 transition-transform shadow-lg"
                        >
                          <Check size={18} strokeWidth={3} />
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); setConfirmingDeleteId(null); }}
                          className="w-10 h-10 bg-white/10 text-white rounded-xl flex items-center justify-center active:scale-90 transition-transform"
                        >
                          <X size={18} strokeWidth={3} />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Opening state */}
                  {isOpening && (
                    <div className="absolute inset-0 bg-white/10 backdrop-blur-md z-50 flex items-center justify-center">
                      <div className="w-16 h-1 bg-orange-500 rounded-full animate-pulse shadow-[0_0_20px_rgba(249,115,22,0.6)]" />
                    </div>
                  )}
                </div>

                {/* Book Info */}
                <div className="px-0.5 space-y-1.5">
                  <h3 className={`text-sm font-bold truncate leading-tight tracking-tight ${isDark ? 'text-white' : 'text-[#1D1D1F]'}`}>
                    {(book.name || "Untitled").replace('.pdf', '')}
                  </h3>
                  <div className="flex flex-wrap items-center gap-2">
                    <p className={`text-[10px] font-bold uppercase tracking-widest ${isDark ? 'text-zinc-500' : 'text-gray-400'}`}>
                      {book.totalPages || 0} Pages
                    </p>
                    <CategoryTag category={book.category} isDark={isDark} />
                  </div>
                </div>
              </div>
            );
          })}

          {/* Empty state */}
          {books.length === 0 && (
            <button
              onClick={onAddNew}
              className={`group aspect-[3/4] border-2 border-dashed rounded-2xl flex flex-col items-center justify-center gap-4 transition-all duration-300 ${isDark ? 'border-white/[0.06] hover:border-orange-500/30 hover:bg-orange-500/5 text-zinc-600' : 'border-gray-200 hover:border-orange-400 hover:bg-orange-50/50 text-gray-400'}`}
            >
              <div className={`p-5 rounded-2xl transition-all duration-300 ${isDark ? 'bg-zinc-800 group-hover:bg-orange-500/10' : 'bg-gray-100 group-hover:bg-orange-100'}`}>
                <Plus size={28} strokeWidth={1.5} className="group-hover:text-orange-500 transition-colors" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest group-hover:text-orange-500 transition-colors">Import PDF</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Library;
