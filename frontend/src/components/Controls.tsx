
import React from 'react';
import { ChevronLeft, ChevronRight, Maximize2, ZoomIn, ZoomOut } from 'lucide-react';
import { Theme } from '../types';

interface ControlsProps {
  theme: Theme;
  currentPage: number;
  totalPages: number;
  zoomLevel: number;
  onZoomChange: (zoom: number) => void;
  onPrev: () => void;
  onNext: () => void;
  onFullscreen?: () => void;
}

const Controls: React.FC<ControlsProps> = ({
  theme,
  currentPage,
  totalPages,
  zoomLevel,
  onZoomChange,
  onPrev,
  onNext,
  onFullscreen
}) => {
  const MAX_ZOOM = 5;
  const MIN_ZOOM = 1;
  const isDark = theme === 'dark';

  return (
    <>
      {/* Floating Side Navigation */}
      <div className="fixed inset-y-0 left-0 w-32 flex items-center justify-start pl-8 z-[75] pointer-events-none">
        <button
          onClick={onPrev}
          disabled={currentPage === 0}
          className={`pointer-events-auto p-5 rounded-full backdrop-blur-md border shadow-xl transition-all active:scale-90 disabled:opacity-0 disabled:pointer-events-none ${isDark ? 'bg-white/10 border-white/10 text-white hover:bg-white hover:text-black' : 'bg-white/50 border-gray-100 text-gray-900 hover:bg-white'}`}
        >
          <ChevronLeft size={32} strokeWidth={2.5} />
        </button>
      </div>

      <div className="fixed inset-y-0 right-0 w-32 flex items-center justify-end pr-8 z-[75] pointer-events-none">
        <button
          onClick={onNext}
          disabled={currentPage >= totalPages - 1}
          className={`pointer-events-auto p-5 rounded-full backdrop-blur-md border shadow-xl transition-all active:scale-90 disabled:opacity-0 disabled:pointer-events-none ${isDark ? 'bg-white/10 border-white/10 text-white hover:bg-white hover:text-black' : 'bg-white/50 border-gray-100 text-gray-900 hover:bg-white'}`}
        >
          <ChevronRight size={32} strokeWidth={2.5} />
        </button>
      </div>

      {/* Central Utility Bar */}
      <div className="fixed bottom-10 left-0 right-0 z-[75] flex justify-center pointer-events-none px-4 animate-in slide-in-from-bottom-8 duration-700">
        <div className={`pointer-events-auto flex items-center gap-8 px-10 py-5 rounded-[32px] border shadow-[0_20px_50px_rgba(0,0,0,0.2)] transition-colors duration-500 ${isDark ? 'bg-zinc-900 border-white/10 text-white' : 'bg-white border-gray-100 text-gray-900'}`}>
          
          <div className="flex flex-col items-center">
            <span className={`text-[10px] font-bold uppercase tracking-widest mb-0.5 ${isDark ? 'text-zinc-500' : 'text-gray-400'}`}>Progress</span>
            <span className="text-sm font-bold">
               {currentPage + 1} of {totalPages}
            </span>
          </div>

          <div className={`w-px h-8 ${isDark ? 'bg-zinc-800' : 'bg-gray-100'}`} />

          {/* Zoom Control Section */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => onZoomChange(Math.max(MIN_ZOOM, zoomLevel - 0.5))}
              className={`p-2 transition-colors ${isDark ? 'text-zinc-500 hover:text-white' : 'text-gray-400 hover:text-black'}`}
            >
              <ZoomOut size={20} />
            </button>
            
            <div className="w-48">
               <input 
                type="range"
                min={MIN_ZOOM}
                max={MAX_ZOOM}
                step="0.1"
                value={zoomLevel}
                onChange={(e) => onZoomChange(parseFloat(e.target.value))}
                className={`w-full h-1.5 rounded-full appearance-none cursor-pointer accent-blue-500 ${isDark ? 'bg-zinc-800' : 'bg-gray-100'}`}
               />
            </div>

            <button
              onClick={() => onZoomChange(Math.min(MAX_ZOOM, zoomLevel + 0.5))}
              className={`p-2 transition-colors ${isDark ? 'text-zinc-500 hover:text-white' : 'text-gray-400 hover:text-black'}`}
            >
              <ZoomIn size={20} />
            </button>
          </div>

          <div className={`w-px h-8 ${isDark ? 'bg-zinc-800' : 'bg-gray-100'}`} />

          <button
            onClick={onFullscreen}
            className={`p-2 transition-colors ${isDark ? 'text-zinc-500 hover:text-white' : 'text-gray-400 hover:text-black'}`}
          >
            <Maximize2 size={20} />
          </button>
        </div>
      </div>
    </>
  );
};

export default Controls;
