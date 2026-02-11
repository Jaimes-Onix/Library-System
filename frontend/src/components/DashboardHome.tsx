
import React, { useRef, useEffect } from 'react';
import { ArrowRight, Upload, BookOpen } from 'lucide-react';
import { LibraryBook, Theme } from '../types';

interface DashboardHomeProps {
  theme: Theme;
  books: LibraryBook[];
  onUpload: () => void;
  onGoToLibrary: () => void;
}

const DashboardHome: React.FC<DashboardHomeProps> = ({ theme, books, onUpload, onGoToLibrary }) => {
  const isDark = theme === 'dark';
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll the carousel
  useEffect(() => {
    const el = scrollRef.current;
    if (!el || books.length === 0) return;

    let animationId: number;
    let scrollPos = 0;
    const speed = 0.5;

    const animate = () => {
      scrollPos += speed;
      if (scrollPos >= el.scrollWidth / 2) {
        scrollPos = 0;
      }
      el.scrollLeft = scrollPos;
      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationId);
  }, [books.length]);

  return (
    <div className="h-full w-full overflow-y-auto no-scrollbar">
      <div className="flex flex-col items-center justify-center min-h-full px-8 py-16">

        {/* Hero Card */}
        <div className={`w-full max-w-2xl rounded-3xl overflow-hidden border backdrop-blur-xl text-center px-10 py-14 transition-all duration-500 ${
          isDark
            ? 'bg-white/[0.06] border-white/[0.08] shadow-2xl'
            : 'bg-white/80 border-gray-200/60 shadow-2xl shadow-gray-200/30'
        }`}>
          <h1 className={`text-3xl md:text-4xl font-bold tracking-tight leading-snug mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Welcome to <span className="font-black">Library System:</span>
            <br />
            <span className={`italic font-normal ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              Your Digital Flipbook Gallery
            </span>
          </h1>

          <p className={`text-sm leading-relaxed max-w-lg mx-auto mb-10 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            Transform your PDFs into premium digital flipbooks. Create, organize,
            and share your documents in a beautiful flipbook experience where
            professional publishing meets modern design.
          </p>

          <div className="flex items-center justify-center gap-3">
            <button
              onClick={onUpload}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all active:scale-95 border ${
                isDark
                  ? 'bg-white/[0.06] border-white/[0.08] text-white hover:bg-white/[0.1]'
                  : 'bg-white border-gray-200 text-gray-900 hover:bg-gray-50 shadow-sm'
              }`}
            >
              <Upload size={16} />
              Upload PDF
            </button>

            <button
              onClick={onGoToLibrary}
              className={`group flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all active:scale-95 ${
                isDark
                  ? 'bg-white text-black hover:bg-gray-100'
                  : 'bg-[#1D1D1F] text-white hover:bg-gray-800'
              }`}
            >
              Discover Library
              <ArrowRight size={15} className="group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>

        {/* Featured Books Carousel */}
        {books.length > 0 && (
          <div className="w-full mt-16">
            <p className={`text-center text-[10px] font-black uppercase tracking-[0.25em] mb-6 ${isDark ? 'text-zinc-600' : 'text-gray-400'}`}>
              Featured Flipbooks
            </p>

            <div className="relative overflow-hidden">
              {/* Fade edges */}
              <div className={`absolute left-0 top-0 bottom-0 w-20 z-10 pointer-events-none ${isDark ? 'bg-gradient-to-r from-[#0a0a0a] to-transparent' : 'bg-gradient-to-r from-[#f5f5f7] to-transparent'}`} />
              <div className={`absolute right-0 top-0 bottom-0 w-20 z-10 pointer-events-none ${isDark ? 'bg-gradient-to-l from-[#0a0a0a] to-transparent' : 'bg-gradient-to-l from-[#f5f5f7] to-transparent'}`} />

              {/* Scrolling carousel */}
              <div
                ref={scrollRef}
                className="flex gap-5 overflow-hidden py-4"
                style={{ scrollBehavior: 'auto' }}
              >
                {/* Duplicate books for seamless loop */}
                {[...books, ...books].map((book, i) => (
                  <div
                    key={`${book.id}-${i}`}
                    className="flex-shrink-0 w-40 group cursor-pointer"
                    onClick={onGoToLibrary}
                  >
                    <div className={`aspect-[3/4] rounded-xl overflow-hidden shadow-lg transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-xl border ${
                      isDark ? 'border-white/5' : 'border-gray-200'
                    }`}>
                      {book.coverUrl ? (
                        <img
                          src={book.coverUrl}
                          alt={book.name}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className={`w-full h-full flex items-center justify-center ${isDark ? 'bg-zinc-800' : 'bg-gray-100'}`}>
                          <BookOpen size={24} className={isDark ? 'text-zinc-600' : 'text-gray-400'} />
                        </div>
                      )}
                    </div>
                    <p className={`mt-2 text-xs font-semibold truncate ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      {(book.name || 'Untitled').replace('.pdf', '')}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardHome;
