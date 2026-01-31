
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
    <div className={`flex flex-col items-center justify-center h-full w-full px-8 fade-in relative ${isDark ? 'text-white' : 'text-gray-900'}`}>
      {onBack && !isLoading && (
        <button
          onClick={onBack}
          className={`absolute top-12 left-12 flex items-center gap-2 transition-colors font-bold text-base group ${isDark ? 'text-gray-500 hover:text-white' : 'text-gray-400 hover:text-gray-900'}`}
        >
          <ChevronLeft size={22} className="group-hover:-translate-x-1 transition-transform" />
          Back to Library
        </button>
      )}

      <div className="max-w-2xl w-full text-center">
        <h1 className={`text-5xl font-black mb-4 tracking-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>
          Digital Flip Book
        </h1>
        <p className={`mb-14 text-xl font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
          Transform your PDFs into elegant flipbooks.
        </p>

        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`
            relative group
            w-full aspect-[4/3] rounded-[48px]
            border-2 border-dashed transition-all duration-300 ease-out
            flex flex-col items-center justify-center gap-8
            ${isDark ? 'bg-zinc-900 border-zinc-800 shadow-none' : 'bg-white shadow-2xl shadow-gray-200/50 border-gray-200'}
            ${isLoading ? (isDark ? 'border-blue-900 bg-blue-950/20' : 'border-blue-200 bg-blue-50/50') + ' cursor-wait' : ''}
            ${!isLoading && isDragging 
              ? (isDark ? 'border-blue-500 bg-blue-500/10 scale-[1.02]' : 'border-blue-500 bg-blue-50 scale-[1.02]') 
              : `hover:${isDark ? 'border-zinc-700 hover:bg-zinc-800/50' : 'border-gray-300 hover:bg-gray-50'}`
            }
          `}
        >
          {isLoading ? (
            <div className="flex flex-col items-center gap-6 animate-in fade-in zoom-in duration-300">
              <div className="relative">
                <div className={`absolute inset-0 rounded-full blur-xl animate-pulse ${isDark ? 'bg-blue-500/30' : 'bg-blue-400/30'}`}></div>
                <Loader2 className={`relative w-16 h-16 animate-spin ${isDark ? 'text-blue-400' : 'text-blue-600'}`} strokeWidth={2} />
              </div>
              <span className={`font-bold text-2xl tracking-wide px-12 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                {statusMessage || "Processing..."}
              </span>
            </div>
          ) : (
            <>
              <div className={`
                p-8 rounded-[32px] transition-colors duration-300
                ${isDragging ? (isDark ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-100 text-blue-600') : (isDark ? 'bg-zinc-800 text-zinc-500 group-hover:bg-zinc-700' : 'bg-gray-100 text-gray-500 group-hover:bg-white group-hover:shadow-xl')}
              `}>
                <UploadCloud size={64} strokeWidth={1.5} />
              </div>

              <div className="space-y-2">
                <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Drop one or more PDFs here
                </p>
                <p className={`text-lg font-medium ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                  or click to browse multiple files
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
        
        {!isLoading && (
          <div className={`mt-10 flex items-center justify-center gap-3 text-lg font-medium ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
            <FileText size={22} />
            <span>Supported Format: PDF</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default Upload;
