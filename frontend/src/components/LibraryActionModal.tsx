
import React, { useState, useEffect } from 'react';
import { Play, BookOpen, X, Trash2, AlertCircle, Sparkles, Loader2, Check, Heart } from 'lucide-react';
import { LibraryBook, Theme } from '../types';

interface LibraryActionModalProps {
  book: LibraryBook | null;
  onClose: () => void;
  onSelectMode: (mode: 'manual' | 'preview') => void;
  onSummarize?: (id: string) => Promise<string | null>;
  onApplySummary?: (id: string, summary: string) => void;
  isSummarizing?: boolean;
  onRemove?: (id: string) => void;
  onToggleFavorite: (id: string) => void;
  theme: Theme;
}

const LibraryActionModal: React.FC<LibraryActionModalProps> = ({ 
  book, 
  onClose, 
  onSelectMode, 
  onSummarize, 
  onApplySummary,
  isSummarizing,
  onRemove,
  onToggleFavorite,
  theme
}) => {
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [tempSummary, setTempSummary] = useState<string | null>(null);
  const isDark = theme === 'dark';

  // Clear local state when modal book changes or closes
  useEffect(() => {
    setTempSummary(null);
    setShowConfirmDelete(false);
  }, [book?.id]);

  if (!book) return null;

  const handleSummarizeClick = async () => {
    if (!onSummarize) return;
    const result = await onSummarize(book.id);
    if (result) {
      setTempSummary(result);
    }
  };

  const handleApplySummary = () => {
    if (onApplySummary && tempSummary) {
      onApplySummary(book.id, tempSummary);
      setTempSummary(null); // Clear after applying
    }
  };

  const currentSummary = tempSummary || book.summary;
  const isFav = book.isFavorite;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-md animate-in fade-in duration-300">
      <div 
        className={`${isDark ? 'bg-zinc-900/90 border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)]' : 'bg-white/90 border-white/40 shadow-2xl'} backdrop-blur-3xl w-full max-w-sm rounded-[40px] border overflow-hidden animate-in zoom-in slide-in-from-bottom-8 duration-500`}
      >
        {!showConfirmDelete ? (
          <div className="p-8 flex flex-col items-center text-center">
            {/* Action buttons at top */}
            <div className="absolute top-6 right-6 flex gap-2">
              <button
                onClick={() => onToggleFavorite(book.id)}
                className={`p-2.5 rounded-full transition-all active:scale-90 ${isFav ? (isDark ? 'bg-red-500/20 text-red-500' : 'bg-red-50 text-red-500') : (isDark ? 'bg-white/5 text-gray-500 hover:text-white' : 'bg-gray-50 text-gray-400 hover:text-gray-900')}`}
                title={isFav ? "Remove from Favorites" : "Add to Favorites"}
              >
                <Heart size={18} className={isFav ? 'fill-red-500' : ''} />
              </button>

              {onSummarize && !tempSummary && (
                <button
                  onClick={handleSummarizeClick}
                  disabled={isSummarizing}
                  className={`p-2.5 rounded-full transition-colors disabled:opacity-50 ${isDark ? 'bg-blue-500/10 text-blue-400 hover:bg-blue-500/20' : 'bg-blue-50 text-blue-600 hover:bg-blue-100'}`}
                  title="Generate AI Summary"
                >
                  {isSummarizing ? <Loader2 size={18} className="animate-spin" /> : <Sparkles size={18} />}
                </button>
              )}
              <button
                onClick={() => setShowConfirmDelete(true)}
                className={`p-2.5 rounded-full transition-colors ${isDark ? 'bg-red-500/10 text-red-400 hover:bg-red-500/20' : 'bg-red-50 text-red-600 hover:bg-red-100'}`}
                title="Remove Book"
              >
                <Trash2 size={18} />
              </button>
            </div>

            <div className="relative w-32 aspect-[3/4] mb-6 shadow-2xl rounded-sm overflow-hidden perspective-1000 rotate-y-[-5deg] group">
               <img src={book.coverUrl} alt={book.name} className="w-full h-full object-cover" />
               <div className="absolute inset-y-0 left-0 w-1.5 bg-black/20" />
            </div>

            <h3 className={`text-xl font-bold mb-1 line-clamp-1 px-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {book.name.replace('.pdf', '')}
            </h3>
            <p className={`text-xs mb-6 uppercase tracking-widest font-bold ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
              {book.totalPages} Pages
            </p>

            {currentSummary && (
              <div className={`mb-8 p-4 rounded-2xl border transition-all duration-500 animate-in fade-in slide-in-from-top-2 
                ${tempSummary 
                  ? (isDark ? 'bg-blue-500/10 border-blue-500/20' : 'bg-blue-50 border-blue-100') 
                  : (isDark ? 'bg-white/5 border-white/10' : 'bg-gray-50/50 border-gray-100')}`}
              >
                {tempSummary && (
                  <span className={`block text-[8px] font-black uppercase tracking-[0.2em] mb-2 ${isDark ? 'text-blue-400' : 'text-blue-500'}`}>
                    AI Suggestion
                  </span>
                )}
                <p className={`text-xs italic leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  "{currentSummary}"
                </p>
                
                {tempSummary && (
                  <button
                    onClick={handleApplySummary}
                    className={`mt-4 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all active:scale-95 shadow-md ${isDark ? 'bg-blue-500 hover:bg-blue-400 text-white shadow-blue-900/40' : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/20'}`}
                  >
                    <Check size={14} strokeWidth={3} />
                    Apply Summary
                  </button>
                )}
              </div>
            )}

            <div className="w-full space-y-3">
              <button
                onClick={() => onSelectMode('preview')}
                className={`w-full flex items-center justify-center gap-3 py-4 rounded-[20px] font-bold transition-all active:scale-95 shadow-lg group ${isDark ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-900/40' : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/20'}`}
              >
                <Play size={18} fill="currentColor" className="group-hover:scale-110 transition-transform" />
                Preview Mode
              </button>
              
              <button
                onClick={() => onSelectMode('manual')}
                className={`w-full flex items-center justify-center gap-3 py-4 rounded-[20px] font-bold transition-all active:scale-95 shadow-lg group ${isDark ? 'bg-white hover:bg-gray-100 text-black shadow-white/5' : 'bg-gray-900 hover:bg-black text-white shadow-black/10'}`}
              >
                <BookOpen size={18} className="group-hover:scale-110 transition-transform" />
                Read Now
              </button>
            </div>

            <button 
              onClick={onClose}
              className={`mt-6 p-2 transition-colors ${isDark ? 'text-gray-500 hover:text-white' : 'text-gray-400 hover:text-gray-600'}`}
            >
              <X size={20} />
            </button>
          </div>
        ) : (
          /* Confirmation View */
          <div className="p-10 flex flex-col items-center text-center animate-in zoom-in fade-in duration-300">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-6 ${isDark ? 'bg-red-500/10 text-red-400' : 'bg-red-50 text-red-500'}`}>
              <AlertCircle size={32} />
            </div>
            
            <h3 className={`text-xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>Remove Book?</h3>
            <p className={`text-sm mb-10 leading-relaxed ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              Are you sure you want to remove <span className={`font-semibold ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>"{book.name.replace('.pdf', '')}"</span>? This action cannot be undone.
            </p>

            <div className="w-full space-y-3">
              <button
                onClick={() => onRemove && onRemove(book.id)}
                className={`w-full py-4 rounded-[20px] font-bold transition-all active:scale-95 shadow-lg ${isDark ? 'bg-red-500 hover:bg-red-400 text-white shadow-red-900/40' : 'bg-red-600 hover:bg-red-700 text-white shadow-red-500/20'}`}
              >
                Remove Permanently
              </button>
              
              <button
                onClick={() => setShowConfirmDelete(false)}
                className={`w-full py-4 rounded-[20px] font-bold transition-all active:scale-95 ${isDark ? 'bg-white/10 hover:bg-white/20 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'}`}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LibraryActionModal;
