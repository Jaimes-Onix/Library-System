
import React from 'react';
import { BookOpen, Search, User as UserIcon, Settings, Library } from 'lucide-react';
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
  const isDashboardView = ['home', 'library', 'upload', 'reader'].includes(view);

  const navLinks = [
    { label: 'Home', view: 'landing' as AppView },
    { label: 'Examples', view: 'examples' as AppView },
    { label: 'Features', view: 'features' as AppView },
  ];

  const photoSrc = userProfile?.photoUrl || userProfile?.photo_url || '';

  return (
    <header className={`fixed top-0 left-0 right-0 h-14 border-b z-50 transition-all duration-500 ${isDark ? 'bg-black/40 backdrop-blur-2xl border-white/5' : 'bg-white/90 backdrop-blur-xl border-gray-100'}`}>
      <div className="flex items-center justify-between px-6 h-full">
        {/* Logo Section */}
        <div className="flex items-center gap-3 min-w-[200px]">
          <div
            onClick={() => onNavigate('landing')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className={`p-1.5 rounded-xl transition-all duration-300 group-hover:scale-110 group-active:scale-95 ${isDark ? 'bg-white text-black' : 'bg-black text-white'}`}>
              <img src="/logo.png" alt="Logo" className={`w-5 h-5 object-contain ${isDark ? 'brightness-0' : 'brightness-0 invert'}`} />
            </div>
            <span className={`font-bold tracking-tight text-base hidden sm:block transition-colors duration-300 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Library System
            </span>
          </div>

          {view === 'reader' && fileName && (
            <div className="flex items-center gap-2 animate-in slide-in-from-left-4 fade-in duration-500">
              <span className="text-gray-400 text-lg font-light">/</span>
              <span className={`text-sm font-medium truncate max-w-[200px] ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{fileName}</span>
            </div>
          )}
        </div>

        {/* Global Navigation - only on public pages */}
        {!isDashboardView && (
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => onNavigate(link.view)}
                className={`text-xs font-black uppercase tracking-widest transition-colors ${view === link.view ? 'text-orange-500' : (isDark ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900')}`}
              >
                {link.label}
              </button>
            ))}
          </nav>
        )}

        {/* Search - Library view */}
        {view === 'library' && (
          <div className="flex-1 max-w-md px-8 hidden md:block animate-in fade-in duration-500">
            <div className="relative group">
              <Search className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${isDark ? 'text-zinc-600' : 'text-gray-400'} group-focus-within:text-orange-500`} size={16} />
              <input
                type="text"
                placeholder="Search collection..."
                className={`w-full pl-11 pr-4 py-2.5 rounded-xl text-sm outline-none transition-all duration-300 border
                  ${isDark ? 'bg-zinc-900/60 border-zinc-800 text-white placeholder:text-zinc-600' : 'bg-gray-100 border-gray-200 text-gray-900 placeholder:text-gray-400'}
                  focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500/30
                `}
              />
            </div>
          </div>
        )}

        {/* Right side actions */}
        <div className="flex items-center gap-3 min-w-[200px] justify-end">
          {isAuthenticated ? (
            <div className="flex items-center gap-2.5 animate-in fade-in duration-500">
              {/* My Books button */}
              {!isDashboardView && (
                <button
                  onClick={() => onNavigate('home')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-sm transition-all border ${isDark ? 'bg-white/[0.06] border-white/[0.08] text-white hover:bg-white/[0.1]' : 'bg-white border-gray-200 text-gray-900 hover:bg-gray-50'}`}
                >
                  <Library size={15} />
                  My Books
                </button>
              )}

              {/* Profile avatar */}
              <div
                onClick={onOpenSettings}
                className={`group relative w-8 h-8 rounded-full border flex items-center justify-center text-[10px] font-black cursor-pointer transition-all hover:ring-2 hover:ring-orange-500/30 ${isDark ? 'bg-zinc-800 border-white/10 text-white' : 'bg-gray-100 border-gray-200 text-gray-900'}`}
              >
                {photoSrc ? (
                  <img src={photoSrc} alt="" className="w-full h-full object-cover rounded-full" />
                ) : (
                  userProfile?.initials || <UserIcon size={14} />
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={onAuth}
                className={`px-5 py-2 font-semibold text-sm transition-colors ${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'}`}
              >
                Login
              </button>
              <button
                onClick={onAuth}
                className="px-5 py-2 bg-orange-600 text-white rounded-xl font-bold text-sm transition-all hover:bg-orange-500 active:scale-95 shadow-lg shadow-orange-500/20"
              >
                Get Started
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
