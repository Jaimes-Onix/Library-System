
import React, { useState, useCallback } from 'react';
import { UploadCloud, FileText, Loader2, ChevronLeft } from 'lucide-react';
import { Theme } from '../types';

interface UploadProps {
  onFilesSelect: (files: File[]) => void;
  onBack?: () => void;
  isLoading: boolean;
  statusMessage?: string;
  theme: Theme;
}

const Upload: React.FC<UploadProps> = ({ onFilesSelect, onBack, isLoading, statusMessage, theme }) => {
  const [isDragging, setIsDragging] = useState(false);
  const isDark = theme === 'dark';

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (!isLoading) setIsDragging(true);
  }, [isLoading]);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      
      if (isLoading) return;

      const droppedFiles = Array.from(e.dataTransfer.files) as File[];
      const pdfFiles = droppedFiles.filter(file => file.type === 'application/pdf');
      
      if (pdfFiles.length > 0) {
        onFilesSelect(pdfFiles);
      } else if (droppedFiles.length > 0) {
        alert('Please upload valid PDF files.');
      }
    },
    [onFilesSelect, isLoading]
  );

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFiles = e.target.files ? Array.from(e.target.files) as File[] : [];
      const pdfFiles = selectedFiles.filter(file => file.type === 'application/pdf');
      
      if (pdfFiles.length > 0) {
        onFilesSelect(pdfFiles);
      }
    },
    [onFilesSelect]
  );

  return (
    <div className={`flex flex-col items-center justify-center h-full w-full px-8 relative ${isDark ? 'text-white' : 'text-gray-900'}`}>
      {/* Back button */}
      {onBack && !isLoading && (
        <button
          onClick={onBack}
          className={`absolute top-8 left-8 flex items-center gap-1.5 transition-colors font-semibold text-sm group ${isDark ? 'text-gray-500 hover:text-white' : 'text-gray-400 hover:text-gray-900'}`}
        >
          <ChevronLeft size={18} className="group-hover:-translate-x-0.5 transition-transform" />
          Back to Library
        </button>
      )}

      {/* Main Card */}
      <div className={`w-full max-w-lg rounded-3xl overflow-hidden border backdrop-blur-xl transition-all duration-500 ${
        isDark 
          ? 'bg-zinc-900/80 border-white/[0.08] shadow-2xl' 
          : 'bg-white/90 border-gray-200/60 shadow-2xl shadow-gray-200/40'
      }`}>
        {/* Card Header */}
        <div className="px-8 pt-10 pb-6 text-center">
          <h1 className={`text-2xl font-bold tracking-tight mb-1.5 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Library System
          </h1>
          <p className={`text-sm font-medium ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
            Create premium digital flipbooks from PDF.
          </p>
        </div>

        {/* Upload Area */}
        <div className="px-8 pb-6">
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`
              relative group w-full aspect-[4/3] rounded-2xl
              border-2 border-dashed transition-all duration-300
              flex flex-col items-center justify-center gap-5
              ${isDark 
                ? 'bg-zinc-800/60 border-zinc-700/60' 
                : 'bg-gray-50 border-gray-200'}
              ${isLoading 
                ? (isDark ? 'border-blue-800 bg-blue-950/30' : 'border-blue-200 bg-blue-50/50') + ' cursor-wait' 
                : ''}
              ${!isLoading && isDragging 
                ? (isDark ? 'border-blue-500 bg-blue-500/10 scale-[1.01]' : 'border-blue-500 bg-blue-50 scale-[1.01]') 
                : !isLoading ? (isDark ? 'hover:border-zinc-600 hover:bg-zinc-800/80' : 'hover:border-gray-300 hover:bg-gray-100/50') : ''
              }
            `}
          >
            {isLoading ? (
              <div className="flex flex-col items-center gap-4 animate-in fade-in zoom-in duration-300">
                <div className="relative">
                  <div className={`absolute inset-0 rounded-full blur-xl animate-pulse ${isDark ? 'bg-blue-500/20' : 'bg-blue-400/20'}`} />
                  <Loader2 className={`relative w-12 h-12 animate-spin ${isDark ? 'text-blue-400' : 'text-blue-600'}`} strokeWidth={2} />
                </div>
                <span className={`font-semibold text-base px-6 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  {statusMessage || "Processing..."}
                </span>
              </div>
            ) : (
              <>
                {/* Upload Icon */}
                <div className={`p-5 rounded-2xl transition-all duration-300 ${
                  isDragging 
                    ? (isDark ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-100 text-blue-600') 
                    : (isDark ? 'bg-zinc-700/80 text-zinc-400 group-hover:bg-zinc-700 group-hover:text-zinc-300' : 'bg-gray-100 text-gray-400 group-hover:bg-white group-hover:text-gray-600 group-hover:shadow-lg')
                }`}>
                  <UploadCloud size={36} strokeWidth={1.5} />
                </div>

                <div className="text-center space-y-1">
                  <p className={`text-base font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    Import New PDF
                  </p>
                  <p className={`text-sm font-medium ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                    Select files to add to your library
                  </p>
                </div>

                <input
                  type="file"
                  accept="application/pdf"
                  multiple
                  onChange={handleFileInput}
                  disabled={isLoading}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                />
              </>
            )}
          </div>
        </div>

        {/* Footer */}
        {!isLoading && (
          <div className={`px-8 pb-8 flex items-center justify-center gap-2 ${isDark ? 'text-zinc-600' : 'text-gray-400'}`}>
            <FileText size={14} />
            <span className="text-xs font-semibold">Library System Standard PDF Support</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default Upload;
