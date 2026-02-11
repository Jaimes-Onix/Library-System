
import React from 'react';
import { BookOpen, Search, User as UserIcon, Settings, Library } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Theme, UserProfile } from '../types';

interface HeaderProps {
  theme: Theme;
  onOpenSettings: () => void;
  fileName?: string;
  isAuthenticated: boolean;
  userProfile: UserProfile | null;
  onAuth: () => void;
  hasSidebar?: boolean;
}

const Header: React.FC<HeaderProps> = ({
  theme,
  onOpenSettings,
  fileName,
  isAuthenticated,
  userProfile,
  onAuth,
  hasSidebar = false
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isDark = theme === 'dark';

  // Dashboard views where valid user is likely present or expected
  const isDashboardView = ['/library', '/upload', '/reader'].some(path => location.pathname.startsWith(path));

  const navLinks = [
    { label: 'Home', path: '/home' },
    { label: 'Examples', path: '/examples' },
    { label: 'Features', path: '/features' },
  ];

  const photoSrc = userProfile?.photoUrl || userProfile?.photo_url || '';

  const positionClass = hasSidebar
    ? 'sticky top-0 w-full'
    : 'fixed top-0 left-0 right-0';

  return (
    <header className={`${positionClass} h-14 border-b z-30 transition-all duration-500 ${isDark ? 'bg-black/40 backdrop-blur-2xl border-white/5' : 'bg-white/90 backdrop-blur-xl border-gray-100'}`}>
      <div className="flex items-center justify-between px-6 h-full">
        {/* Logo Section - Hidden if sidebar is present */}
        {!hasSidebar ? (
          <div className="flex items-center gap-3 min-w-[200px]">
            <div
              onClick={() => navigate('/home')}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <div className={`p-1.5 rounded-xl transition-all duration-300 group-hover:scale-110 group-active:scale-95 ${isDark ? 'bg-white text-black' : 'bg-black text-white'}`}>
                <img src="/logo.png" alt="Logo" className={`w-5 h-5 object-contain ${isDark ? 'brightness-0' : 'brightness-0 invert'}`} />
              </div>
              <span className={`font-bold tracking-tight text-base hidden sm:block transition-colors duration-300 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Library System
              </span>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2 animate-in slide-in-from-left-4 fade-in duration-500">
            {/* If reading a file, show filename breadcrumb here */}
            {location.pathname.startsWith('/reader') && fileName && (
              <>
                <span className={`font-bold text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Reading</span>
                <span className="text-gray-400 text-lg font-light">/</span>
                <span className={`text-sm font-medium truncate max-w-[200px] ${isDark ? 'text-white' : 'text-gray-900'}`}>{fileName}</span>
              </>
            )}
          </div>
        )}

        {/* Global Navigation - only on public pages */}
        {!isDashboardView && (
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => navigate(link.path)}
                className={`text-xs font-black uppercase tracking-widest transition-colors ${location.pathname === link.path ? 'text-orange-500' : (isDark ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900')}`}
              >
                {link.label}
              </button>
            ))}
          </nav>
        )}

        {/* Search - Library view */}
        {location.pathname.startsWith('/library') && (
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
            <div className="flex items-center gap-3 animate-in fade-in duration-500">
              {/* My Books button */}
              {!isDashboardView && (
                <button
                  onClick={() => navigate('/library/home')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-sm transition-all border ${isDark ? 'bg-white/[0.06] border-white/[0.08] text-white hover:bg-white/[0.1]' : 'bg-white border-gray-200 text-gray-900 hover:bg-gray-50'}`}
                >
                  <Library size={15} />
                  My Books
                </button>
              )}

              {/* Profile section */}
              <div
                onClick={onOpenSettings}
                className={`flex items-center gap-2.5 px-3 py-1.5 rounded-xl cursor-pointer transition-all ${isDark ? 'hover:bg-white/5' : 'hover:bg-gray-50'}`}
              >
                {/* Avatar */}
                <div
                  className={`relative w-8 h-8 rounded-full border flex-shrink-0 flex items-center justify-center text-[10px] font-black transition-all hover:ring-2 hover:ring-orange-500/30 ${isDark ? 'bg-zinc-800 border-white/10 text-white' : 'bg-gray-100 border-gray-200 text-gray-900'}`}
                >
                  {photoSrc ? (
                    <img src={photoSrc} alt="" className="w-full h-full object-cover rounded-full" />
                  ) : (
                    userProfile?.initials || <UserIcon size={14} />
                  )}
                </div>
                {/* Name */}
                <span className={`text-sm font-semibold hidden sm:block truncate max-w-[120px] ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {userProfile?.name || 'Account'}
                </span>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => navigate('/login')}
                className={`px-5 py-2 font-semibold text-sm transition-colors ${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'}`}
              >
                Login
              </button>
              <button
                onClick={() => navigate('/signup')}
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
