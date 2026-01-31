
import React, { useState, useEffect, useRef, useCallback, forwardRef } from 'react';
import { ChevronLeft, ChevronRight, Loader2, Sparkles, Book as BookIcon } from 'lucide-react';
import HTMLFlipBook from 'react-pageflip';
import { LibraryBook, Theme } from '../types';

interface FeaturedCarouselProps {
  books: LibraryBook[];
  theme: Theme;
}

const AUTO_PLAY_INTERVAL = 14000; 

const FeaturedPage = forwardRef<HTMLDivElement, { doc: any; pageNum: number }>(({ doc, pageNum }, ref) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isRendered, setIsRendered] = useState(false);

  useEffect(() => {
    if (!doc) return;
    let isMounted = true;

    const render = async () => {
      try {
        const page = await doc.getPage(pageNum);
        const viewport = page.getViewport({ scale: 1.0 }); 
        const canvas = canvasRef.current;
        if (!canvas || !isMounted) return;
        
        const context = canvas.getContext('2d');
        if (!context) return;

        canvas.width = viewport.width;
        canvas.height = viewport.height;
        await page.render({ canvasContext: context, viewport }).promise;
        
        if (isMounted) setIsRendered(true);
      } catch (e) {
        console.error("Featured page render error", e);
      }
    };

    render();
    return () => { isMounted = false; };
  }, [doc, pageNum]);

  return (
    <div ref={ref} className="bg-white w-full h-full overflow-hidden relative shadow-inner">
      <canvas ref={canvasRef} className="w-full h-full object-contain bg-white" />
      {!isRendered && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-50/50">
          <Loader2 size={32} className="animate-spin text-blue-400" />
        </div>
      )}
      <div className="absolute inset-0 bg-gradient-to-r from-black/5 via-transparent to-black/5 pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-[1px] bg-black/5 pointer-events-none" />
    </div>
  );
});

const FeaturedFlipBook: React.FC<{ book: LibraryBook }> = ({ book }) => {
  const bookRef = useRef<any>(null);
  const [isReady, setIsReady] = useState(false);
  
  // defensive check: ensure at least 2 pages for react-pageflip to function reliably
  const pagesToShow = [1, 2, 3, 4, 5, 6].filter(p => p <= book.totalPages);

  useEffect(() => {
    setIsReady(false);
    const timer = setTimeout(() => setIsReady(true), 400);
    return () => clearTimeout(timer);
  }, [book.id]);

  useEffect(() => {
    if (!isReady || pagesToShow.length < 2) return;
    
    const interval = setInterval(() => {
      const api = bookRef.current?.pageFlip();
      if (api) {
        const current = api.getCurrentPageIndex();
        if (current < pagesToShow.length - 1) {
          api.flipNext();
        } else {
          api.turnToPage(0);
        }
      }
    }, 6000);

    return () => clearInterval(interval);
  }, [isReady, pagesToShow.length, book.id]);

  if (!isReady) {
    return (
      <div className="w-[600px] h-[420px] bg-zinc-900/10 rounded-[24px] animate-pulse flex items-center justify-center border border-black/5">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="animate-spin text-blue-500/30" size={48} />
          <span className="text-[10px] font-black uppercase tracking-widest opacity-20">Initializing Viewport</span>
        </div>
      </div>
    );
  }

  // If only 1 page, render a static cover instead of a flipbook to prevent internal react-pageflip errors
  if (pagesToShow.length < 2) {
    return (
      <div className="relative w-[300px] h-[420px] shadow-[0_80px_120px_-30px_rgba(0,0,0,0.5)] rounded-r-lg overflow-hidden border border-black/5 animate-in fade-in zoom-in duration-1000">
        <img src={book.coverUrl} className="w-full h-full object-cover" alt="Cover" />
        <div className="absolute inset-y-0 left-0 w-3 bg-black/10 backdrop-blur-sm" />
      </div>
    );
  }

  return (
    <div className="relative w-[600px] h-[420px] perspective-2000 animate-in zoom-in fade-in duration-1000 flex items-center justify-center overflow-visible">
      <HTMLFlipBook
        key={`featured-flip-${book.id}`}
        width={300} 
        height={420}
        size="fixed" 
        minWidth={300}
        maxWidth={300}
        minHeight={420}
        maxHeight={420}
        maxShadowOpacity={0.4}
        showCover={true} 
        mobileScrollSupport={false}
        startPage={0}
        drawShadow={true}
        flippingTime={2500}
        usePortrait={false}
        startZIndex={0}
        autoSize={false}
        clickEventForward={false}
        useMouseEvents={false}
        swipeDistance={0}
        showPageCorners={false}
        disableFlipByClick={true}
        ref={(el) => (bookRef.current = el)}
        className="featured-flipbook shadow-[0_80px_120px_-30px_rgba(0,0,0,0.7)]"
        style={{ backgroundColor: 'transparent' }}
      >
        {pagesToShow.map((p) => (
          <FeaturedPage key={`${book.id}-feat-p-${p}`} doc={book.doc} pageNum={p} />
        ))}
      </HTMLFlipBook>
      <div className="absolute inset-y-0 left-1/2 -translate-x-full w-4 bg-gradient-to-r from-transparent to-black/10 z-10 pointer-events-none" />
    </div>
  );
};

const FeaturedCarousel: React.FC<FeaturedCarouselProps> = ({ books, theme }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const isDark = theme === 'dark';

  const nextSlide = useCallback(() => {
    if (books.length <= 1) return;
    setCurrentIndex((prev) => (prev + 1) % books.length);
  }, [books.length]);

  const prevSlide = useCallback(() => {
    if (books.length <= 1) return;
    setCurrentIndex((prev) => (prev === 0 ? books.length - 1 : prev - 1));
  }, [books.length]);

  useEffect(() => {
    if (books.length <= 1) return;
    const timer = setInterval(nextSlide, AUTO_PLAY_INTERVAL);
    return () => clearInterval(timer);
  }, [nextSlide, books.length]);

  if (books.length === 0) return null;

  const currentBook = books[currentIndex];
  if (!currentBook) return null;

  return (
    <div className={`relative w-full h-[600px] overflow-hidden flex items-center justify-center mb-12 transition-all duration-1000 ${isDark ? 'bg-zinc-950' : 'bg-[#F5F5F7]'}`}>
      <div 
        key={`immersive-bg-${currentBook.id}`}
        className={`absolute inset-0 z-0 bg-cover bg-center transition-all duration-1000 scale-125 blur-[150px] ${isDark ? 'opacity-40' : 'opacity-25'}`}
        style={{ backgroundImage: `url(${currentBook.coverUrl})` }}
      />

      {books.length > 1 && (
        <button 
          onClick={(e) => { e.stopPropagation(); prevSlide(); }}
          className={`absolute left-8 z-40 p-5 rounded-full transition-all active:scale-90 hidden xl:flex items-center justify-center border shadow-2xl backdrop-blur-xl ${
            isDark 
              ? 'bg-white/5 text-white/90 border-white/20 hover:text-white hover:bg-white/10' 
              : 'bg-black/5 text-black/80 border-black/10 hover:text-black hover:bg-black/10'
          }`}
        >
          <ChevronLeft size={52} strokeWidth={3} />
        </button>
      )}

      {books.length > 1 && (
        <button 
          onClick={(e) => { e.stopPropagation(); nextSlide(); }}
          className={`absolute right-8 z-40 p-5 rounded-full transition-all active:scale-90 hidden xl:flex items-center justify-center border shadow-2xl backdrop-blur-xl ${
            isDark 
              ? 'bg-white/5 text-white/90 border-white/20 hover:text-white hover:bg-white/10' 
              : 'bg-black/5 text-black/80 border-black/10 hover:text-black hover:bg-black/10'
          }`}
        >
          <ChevronRight size={52} strokeWidth={3} />
        </button>
      )}
      
      <div className="relative z-10 w-full max-w-[1400px] mx-auto flex flex-col lg:flex-row items-center justify-between gap-16 lg:gap-32 px-12 h-full py-16">
        <div className="flex-[1.2] flex justify-center items-center h-full">
          <FeaturedFlipBook key={`fbook-${currentBook.id}`} book={currentBook} />
        </div>

        <div className="flex-1 flex flex-col text-left animate-in slide-in-from-right-16 fade-in duration-1000">
          <div className="space-y-10 max-w-xl">
              <div className="flex items-center gap-4">
                <div className={`px-6 py-2 rounded-full text-[11px] font-black uppercase tracking-[0.3em] ${isDark ? 'bg-blue-600 text-white shadow-[0_0_40px_rgba(59,130,246,0.5)]' : 'bg-black text-white shadow-2xl'}`}>
                  Featured Selection
                </div>
              </div>
              
              <h2 className={`text-6xl font-black leading-tight tracking-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {currentBook.name.replace('.pdf', '')}
              </h2>
              
              <div className="min-h-[120px] flex items-start">
                {currentBook.summary ? (
                   <p className={`text-2xl leading-relaxed font-light italic opacity-60 ${isDark ? 'text-gray-300' : 'text-gray-600'} animate-in fade-in slide-in-from-bottom-2 duration-1000`}>
                    {currentBook.summary}
                  </p>
                ) : (
                  <div className="flex flex-col gap-3 w-full opacity-30">
                    <div className="flex items-center gap-2 mb-1">
                       <Sparkles size={16} className="animate-pulse text-blue-500" />
                       <span className="text-xs font-black uppercase tracking-[0.2em]">Writing your hook...</span>
                    </div>
                    <div className="h-4 bg-gray-400/20 rounded-full w-full animate-pulse" />
                    <div className="h-4 bg-gray-400/20 rounded-full w-[80%] animate-pulse" style={{ animationDelay: '0.2s' }} />
                  </div>
                )}
              </div>

              <div className="flex items-center gap-16 pt-8">
                 <div className="flex flex-col gap-2">
                    <span className={`text-5xl font-black tracking-tighter ${isDark ? 'text-white' : 'text-gray-900'}`}>{currentBook.totalPages}</span>
                    <span className="text-[11px] font-black text-gray-500 uppercase tracking-widest opacity-40">Pages</span>
                 </div>
                 <div className={`w-px h-16 ${isDark ? 'bg-white/10' : 'bg-gray-200'}`} />
                 <div className="flex flex-col gap-2">
                    <span className={`text-5xl font-black tracking-tighter ${isDark ? 'text-white' : 'text-gray-900'}`}>PDF</span>
                    <span className="text-[11px] font-black text-gray-500 uppercase tracking-widest opacity-40">Format</span>
                 </div>
              </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-12 flex gap-5 z-20">
        {books.map((_, idx) => (
          <button 
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`h-2.5 rounded-full transition-all duration-1000 ${idx === currentIndex ? 'w-20 bg-blue-500' : 'w-5 bg-gray-400/10 hover:bg-gray-400/40'}`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default FeaturedCarousel;
