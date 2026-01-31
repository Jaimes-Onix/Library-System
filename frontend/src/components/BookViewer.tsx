
import React, { useEffect, useRef, useState, forwardRef } from 'react';
import HTMLFlipBook from 'react-pageflip';
import { PDFPageProxy, Theme } from '../types';
import { Loader2 } from 'lucide-react';

interface BookViewerProps {
  pdfDocument: any;
  onFlip: (pageIndex: number) => void;
  onBookInit: (book: any) => void;
  mode?: 'manual' | 'preview';
  zoomLevel?: number;
  onZoomChange?: (zoom: number) => void;
  theme?: Theme;
}

const PAGE_WIDTH = 550;
const PAGE_HEIGHT = 770;

const Page = forwardRef<HTMLDivElement, { number: number; pdfDocument: any }>(({ number, pdfDocument }, ref) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isRendered, setIsRendered] = useState(false);

  useEffect(() => {
    if (!pdfDocument || !canvasRef.current) return;
    let isMounted = true;

    const renderPage = async () => {
      try {
        const page: PDFPageProxy = await pdfDocument.getPage(number);
        const originalViewport = page.getViewport({ scale: 1 });
        const desiredScale = PAGE_WIDTH / originalViewport.width;
        const outputScale = desiredScale * (window.devicePixelRatio || 1) * 2;
        
        const viewport = page.getViewport({ scale: outputScale });
        const canvas = canvasRef.current!;
        const context = canvas.getContext('2d');
        if (!context || !isMounted) return;

        canvas.width = viewport.width;
        canvas.height = viewport.height;
        await page.render({ canvasContext: context, viewport: viewport }).promise;
        if (isMounted) setIsRendered(true);
      } catch (error) {
        console.error(`Page ${number} render fail`, error);
      }
    };

    renderPage();
    return () => { isMounted = false; };
  }, [pdfDocument, number]);

  return (
    <div ref={ref} className="bg-white flex items-center justify-center overflow-hidden h-full w-full shadow-sm">
      <div className="relative w-full h-full bg-white">
        {!isRendered && (
          <div className="absolute inset-0 flex items-center justify-center bg-white">
            <Loader2 className="animate-spin text-gray-200" size={24} />
          </div>
        )}
        <canvas ref={canvasRef} className="block mx-auto w-full h-full object-contain" />
      </div>
    </div>
  );
});

const BookViewer: React.FC<BookViewerProps> = ({ pdfDocument, onFlip, onBookInit, mode = 'manual', zoomLevel = 1, theme }) => {
  const [pages, setPages] = useState<number[]>([]);
  const [isReady, setIsReady] = useState(false);
  const bookRef = useRef<any>(null);

  useEffect(() => {
    if (pdfDocument) {
      setPages(Array.from({ length: pdfDocument.numPages }, (_, i) => i + 1));
      const timer = setTimeout(() => setIsReady(true), 800);
      return () => clearTimeout(timer);
    }
  }, [pdfDocument]);

  // Automatic Flipping Logic
  useEffect(() => {
    if (mode === 'preview' && isReady && bookRef.current) {
      const autoFlipInterval = setInterval(() => {
        const api = bookRef.current.pageFlip();
        if (api) {
          const current = api.getCurrentPageIndex();
          const total = api.getPageCount();
          if (current < total - 1) {
            api.flipNext();
          } else {
            api.turnToPage(0);
          }
        }
      }, 5000); // Flip every 5 seconds
      return () => clearInterval(autoFlipInterval);
    }
  }, [mode, isReady]);

  if (!pdfDocument || pages.length === 0 || !isReady) {
    return (
      <div className="flex flex-col items-center justify-center h-full w-full bg-white">
        <Loader2 className="animate-spin text-gray-300" size={32} />
      </div>
    );
  }

  return (
    <div className="relative flex items-center justify-center h-full w-full bg-white overflow-hidden">
      <div 
        className="transition-transform duration-700 ease-out flex items-center justify-center"
        style={{ transform: `scale(${zoomLevel})` }}
      >
        <HTMLFlipBook
          width={PAGE_WIDTH}
          height={PAGE_HEIGHT}
          size="stretch"
          minWidth={300}
          maxWidth={850}
          minHeight={400}
          maxHeight={1200}
          maxShadowOpacity={0.2}
          showCover={true}
          mobileScrollSupport={true}
          onFlip={(e: any) => onFlip(e.data)}
          ref={(component: any) => {
            if (component) {
              bookRef.current = component;
              onBookInit(component);
            }
          }}
          className="shadow-2xl"
          startPage={0}
          drawShadow={true}
          flippingTime={1200}
          usePortrait={false}
          startZIndex={0}
          autoSize={true}
          clickEventForward={true}
          useMouseEvents={mode === 'manual' && zoomLevel === 1}
          swipeDistance={30}
          showPageCorners={true}
          disableFlipByClick={mode === 'preview' || zoomLevel > 1}
        >
          {pages.map((pageNum) => (
            <Page key={`pg-${pageNum}`} number={pageNum} pdfDocument={pdfDocument} />
          ))}
        </HTMLFlipBook>
      </div>
    </div>
  );
};

export default BookViewer;
