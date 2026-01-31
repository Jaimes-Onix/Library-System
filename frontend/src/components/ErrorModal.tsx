import React from 'react';
import { AlertCircle, X } from 'lucide-react';

interface ErrorModalProps {
    isOpen: boolean;
    title: string;
    message: string;
    onClose: () => void;
    theme?: 'light' | 'dark';
}

const ErrorModal: React.FC<ErrorModalProps> = ({ isOpen, title, message, onClose, theme = 'light' }) => {
    if (!isOpen) return null;

    const isDark = theme === 'dark';

    return (
        <div
            className="fixed inset-0 z-[200] flex items-center justify-center p-4 animate-in fade-in duration-300"
            style={{
                backgroundColor: 'rgba(0, 0, 0, 0.4)',
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)'
            }}
            onClick={onClose}
        >
            <div
                className="relative w-full max-w-sm animate-in zoom-in-95 fade-in duration-300"
                style={{
                    fontFamily: '-apple-system, BlinkMacSystemFont, "San Francisco", "Helvetica Neue", sans-serif'
                }}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Modal Container */}
                <div
                    className="rounded-[20px] shadow-2xl overflow-hidden"
                    style={{
                        backgroundColor: isDark ? 'rgba(28, 28, 30, 0.85)' : 'rgba(255, 255, 255, 0.85)',
                        backdropFilter: 'blur(20px)',
                        WebkitBackdropFilter: 'blur(20px)',
                        border: isDark ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(0, 0, 0, 0.05)'
                    }}
                >
                    {/* Header */}
                    <div className="relative px-6 pt-8 pb-4">
                        <button
                            onClick={onClose}
                            className={`absolute top-4 right-4 p-2 rounded-full transition-colors ${isDark ? 'hover:bg-white/10' : 'hover:bg-black/5'
                                }`}
                            aria-label="Close"
                        >
                            <X size={18} className={isDark ? 'text-gray-400' : 'text-gray-600'} />
                        </button>

                        {/* Error Icon */}
                        <div className="flex justify-center mb-4">
                            <div
                                className="w-16 h-16 rounded-full flex items-center justify-center"
                                style={{
                                    backgroundColor: 'rgba(255, 59, 48, 0.1)'
                                }}
                            >
                                <AlertCircle size={32} style={{ color: '#ff3b30' }} />
                            </div>
                        </div>

                        {/* Title */}
                        <h2
                            className="text-center font-bold text-xl mb-2"
                            style={{
                                color: isDark ? '#f5f5f7' : '#1d1d1f'
                            }}
                        >
                            {title}
                        </h2>

                        {/* Message */}
                        <p
                            className="text-center leading-relaxed"
                            style={{
                                color: isDark ? 'rgba(235, 235, 245, 0.6)' : 'rgba(60, 60, 67, 0.6)',
                                fontSize: '15px'
                            }}
                        >
                            {message}
                        </p>
                    </div>

                    {/* Action Button */}
                    <div className="px-6 pb-6">
                        <button
                            onClick={onClose}
                            className="w-full py-3.5 rounded-[14px] font-semibold text-white transition-all duration-200 active:scale-95"
                            style={{
                                backgroundColor: '#ff3b30',
                                fontSize: '17px',
                                letterSpacing: '-0.02em'
                            }}
                        >
                            Try Again
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ErrorModal;
