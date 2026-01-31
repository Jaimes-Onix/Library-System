
import React from 'react';
import { Briefcase, GraduationCap, User, Palette, Check } from 'lucide-react';
import { Category, Theme } from '../types';

interface CategorySelectionModalProps {
  isOpen: boolean;
  bookName: string;
  coverUrl: string;
  onSelect: (category: Category) => void;
  theme: Theme;
}

const CategorySelectionModal: React.FC<CategorySelectionModalProps> = ({
  isOpen,
  bookName,
  coverUrl,
  onSelect,
  theme
}) => {
  if (!isOpen) return null;

  const isDark = theme === 'dark';

  const categories: { id: Category; label: string; icon: any; color: string; bgColor: string }[] = [
    { id: 'Professional', label: 'Professional', icon: Briefcase, color: 'text-blue-500', bgColor: 'bg-blue-500/10' },
    { id: 'Academic', label: 'Academic', icon: GraduationCap, color: 'text-purple-500', bgColor: 'bg-purple-500/10' },
    { id: 'Personal', label: 'Personal', icon: User, color: 'text-orange-500', bgColor: 'bg-orange-500/10' },
    { id: 'Creative', label: 'Creative', icon: Palette, color: 'text-pink-500', bgColor: 'bg-pink-500/10' },
  ];

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-6 bg-black/60 backdrop-blur-xl animate-in fade-in duration-500">
      <div className={`w-full max-w-4xl overflow-hidden rounded-[56px] border shadow-[0_60px_120px_-20px_rgba(0,0,0,0.6)] animate-in zoom-in slide-in-from-bottom-12 duration-700
        ${isDark ? 'bg-zinc-900/90 border-white/10' : 'bg-white/95 border-white/40'}`}
      >
        <div className="flex flex-col md:flex-row h-full">
          {/* Left: Book Preview - Significantly Enlarged */}
          <div className={`w-full md:w-[45%] p-14 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r ${isDark ? 'bg-black/20 border-white/5' : 'bg-gray-50/50 border-gray-100'}`}>
             <div className="relative w-full max-w-[280px] aspect-[3/4.2] shadow-[0_40px_80px_-15px_rgba(0,0,0,0.3)] rounded-xl overflow-hidden perspective-2000 rotate-y-[-12deg] mb-10 transition-transform duration-500 group-hover:rotate-y-[-5deg]">
                <img src={coverUrl} alt={bookName} className="w-full h-full object-cover" />
                <div className="absolute inset-y-0 left-0 w-3 bg-black/20 backdrop-blur-[1px]" />
                <div className="absolute inset-y-0 left-3 w-px bg-white/10" />
             </div>
             <h3 className={`text-xl font-black text-center line-clamp-2 leading-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>
               {bookName.replace('.pdf', '')}
             </h3>
             <p className="text-xs font-black uppercase tracking-[0.3em] text-blue-500 mt-4 opacity-80">New Selection</p>
          </div>

          {/* Right: Category Choices - Enlarged Buttons & Text */}
          <div className="flex-1 p-14 flex flex-col justify-center">
            <h2 className={`text-4xl font-black mb-3 tracking-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Classify this Book
            </h2>
            <p className={`text-lg mb-10 font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              Organize your premium digital collection.
            </p>

            <div className="grid grid-cols-1 gap-4">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => onSelect(cat.id)}
                  className={`group relative flex items-center gap-6 p-6 rounded-[32px] transition-all active:scale-[0.98] border
                    ${isDark 
                      ? 'bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/10 hover:shadow-2xl' 
                      : 'bg-white border-gray-100 hover:border-gray-200 hover:shadow-2xl hover:-translate-y-1'}`}
                >
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 ${cat.bgColor} ${cat.color} shadow-inner`}>
                    <cat.icon size={32} strokeWidth={2.5} />
                  </div>
                  <div className="flex flex-col items-start gap-1">
                    <span className={`text-xl font-black tracking-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>{cat.label}</span>
                    <span className={`text-xs font-semibold ${isDark ? 'text-zinc-500' : 'text-gray-400'}`}>Move to {cat.label} shelf</span>
                  </div>
                  <div className={`ml-auto p-2 rounded-full transition-all duration-300 opacity-0 group-hover:opacity-100 bg-blue-500 text-white shadow-lg shadow-blue-500/40`}>
                    <Check size={20} strokeWidth={3} />
                  </div>
                </button>
              ))}
            </div>
            
            <button
              onClick={() => onSelect('Uncategorized')}
              className={`w-full mt-10 py-4 text-sm font-black uppercase tracking-[0.4em] transition-all duration-300 ${isDark ? 'text-zinc-600 hover:text-white' : 'text-gray-400 hover:text-gray-900 hover:tracking-[0.5em]'}`}
            >
              Skip Selection
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategorySelectionModal;
