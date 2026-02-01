
import React from 'react';
import { BookOpen, Search, User as UserIcon, Settings } from 'lucide-react';
import { Theme, AppView, UserProfile } from '../types';

interface HeaderProps {
  view: AppView;
  theme: Theme;
  onNavigate: (view: AppView) => void;
  onOpenSettings: () => void;
  fileName?: string;
  isAuthenticated: boolean;
  userProfile: UserProfile | null;
  onAuth: () => void;
}

const Header: React.FC<HeaderProps> = ({
  view,
  theme,
  onNavigate,
  onOpenSettings,
  fileName,
  isAuthenticated,
  userProfile,
  onAuth
}) => {
  const isDark = theme === 'dark';
  const isDashboardView = ['library', 'upload', 'reader'].includes(view);

  const navLinks = [
    { label: 'Home', view: 'landing' as AppView },
    { label: 'Examples', view: 'examples' as AppView },
    { label: 'Features', view: 'features' as AppView },
  ];

  return (
    <header className={`fixed top-0 left-0 right-0 h-20 border-b z-50 transition-all duration-500 ${isDark ? 'bg-black/80 backdrop-blur-2xl border-white/5' : 'bg-white/80 backdrop-blur-xl border-gray-100'}`}>
      <div className="flex items-center justify-between px-10 h-full">
        {/* Logo Section */}
        <div className="flex items-center gap-4 min-w-[240px]">
          <div
            onClick={() => onNavigate('landing')}
            className="flex items-center gap-4 cursor-pointer group"
          >
            <div
              className={`p-2 rounded-2xl shadow-lg transition-all duration-300 group-hover:scale-110 group-active:scale-95 ${isDark ? 'bg-white text-black' : 'bg-black text-white'}`}
            >
              <BookOpen size={24} strokeWidth={2.5} />
            </div>
            <span className={`font-bold tracking-tight text-xl hidden sm:block transition-colors duration-300 ${isDark ? 'text-white group-hover:text-amber-400' : 'text-gray-900 group-hover:text-amber-600'}`}>
              Library System
            </span>
          </div>

          {view === 'reader' && fileName && (
            <div className="flex items-center gap-3 animate-in slide-in-from-left-4 fade-in duration-500">
              <span className="text-gray-400 text-2xl font-light">/</span>
              <span className={`text-base font-medium truncate max-w-[250px] ${isDark ? 'text-gray-300' : 'text-gray-500'}`}>{fileName}</span>
            </div>
          )}
        </div>

        {/* Global Navigation */}
        {!isDashboardView && (
          <nav className="hidden lg:flex items-center gap-10">
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => onNavigate(link.view)}
                className={`text-sm font-black uppercase tracking-widest transition-colors ${view === link.view ? 'text-orange-500' : (isDark ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900')}`}
              >
                {link.label}
              </button>
            ))}
          </nav>
        )}

        {/* Search Section - Only for Dashboard Library */}
        {view === 'library' && (
          <div className="flex-1 max-w-xl px-12 hidden md:block animate-in fade-in duration-500">
            <div className="relative group">
              <Search className={`absolute left-5 top-1/2 -translate-y-1/2 transition-colors ${isDark ? 'text-zinc-600' : 'text-gray-400'} group-focus-within:text-blue-500`} size={20} />
              <input
                type="text"
                placeholder="Search collection..."
                className={`w-full pl-14 pr-6 py-3.5 rounded-2xl text-base outline-none transition-all duration-300 border
                  ${isDark ? 'bg-zinc-900 border-zinc-800 text-white placeholder:text-zinc-600' : 'bg-gray-100 border-gray-200 text-gray-900 placeholder:text-gray-400'}
                  focus:ring-8 focus:ring-blue-500/5 focus:border-blue-500
                `}
              />
            </div>
          </div>
        )}

        {/* Auth Actions / Profile Display */}
        <div className="flex items-center gap-4 min-w-[240px] justify-end">
          {isAuthenticated ? (
            <div className="flex items-center gap-3 animate-in fade-in duration-500">
              <button
                onClick={() => onNavigate('library')}
                className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all hidden sm:block ${isDark ? 'bg-white text-black hover:bg-gray-200' : 'bg-black text-white hover:bg-gray-800'}`}
              >
                Go to Library
              </button>
              <div
                onClick={onOpenSettings}
                className={`group relative w-10 h-10 rounded-full border flex items-center justify-center text-xs font-black cursor-pointer transition-all hover:ring-4 hover:ring-orange-500/20 ${isDark ? 'bg-zinc-800 border-white/10 text-white' : 'bg-gray-100 border-gray-200 text-gray-900'}`}
              >
                {userProfile?.photoUrl ? (
                  <img src={userProfile.photoUrl} alt="" className="w-full h-full object-cover rounded-full" />
                ) : (
                  userProfile?.initials || <UserIcon size={16} />
                )}

                {/* Floating Settings Tooltip Indicator */}
                <div className="absolute -bottom-1 -right-1 bg-orange-600 text-white p-1 rounded-full scale-0 group-hover:scale-100 transition-transform shadow-lg border-2 border-white dark:border-black">
                  <Settings size={10} strokeWidth={3} />
                </div>
              </div>
            </div>
          ) : (
            <>
              <button
                onClick={onAuth}
                className={`px-6 py-3 font-bold text-sm transition-colors ${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'}`}
              >
                Login
              </button>
              <button
                onClick={onAuth}
                className="px-6 py-3 bg-orange-600 text-white rounded-xl font-bold text-sm transition-all hover:bg-orange-500 active:scale-95 shadow-lg shadow-orange-500/20"
              >
                Get Started
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
