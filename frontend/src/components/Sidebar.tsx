
import React, { useState } from 'react';
import {
  Library,
  Heart,
  Settings,
  LogOut,
  Briefcase,
  GraduationCap,
  User,
  Palette,
  Moon,
  Sun,
  ShieldCheck,
  Loader2,
  Home,
  Upload,
  BookOpen
} from 'lucide-react';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { UserProfile, Theme } from '../types';

interface SidebarProps {
  theme: Theme;
  userProfile: UserProfile;
  onLogout: () => Promise<void>;
  onToggleTheme: () => void;
  onOpenSettings: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  theme,
  userProfile,
  onLogout,
  onToggleTheme,
  onOpenSettings,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const currentCategory = searchParams.get('category');
  const currentFilter = searchParams.get('filter');

  const [isLoggingOut, setIsLoggingOut] = useState(false);

  if (!userProfile) return null;

  const isDark = theme === 'dark';

  // Aligned with Landing Page Theme
  const sidebarBg = isDark ? 'bg-zinc-900' : 'bg-white';
  const sidebarBorder = isDark ? 'border-zinc-800' : 'border-gray-200';
  const sidebarText = isDark ? 'text-gray-400' : 'text-gray-500';
  const sidebarItemHover = isDark ? 'hover:bg-white/5 hover:text-white' : 'hover:bg-gray-50 hover:text-gray-900';
  const sidebarItemActive = isDark ? 'bg-orange-500/10 text-orange-500' : 'bg-orange-50 text-orange-600';
  const sidebarSecondaryText = isDark ? 'text-gray-500' : 'text-gray-400';
  const dividerColor = isDark ? 'border-white/5' : 'border-gray-100';

  const navItems = [
    { id: 'home', label: 'Home', icon: Home, path: '/library/home' },
    { id: 'all', label: 'All Books', icon: Library, path: '/library' }, // Default library view
    { id: 'upload', label: 'Import PDF', icon: Upload, path: '/upload' },
    { id: 'favorites', label: 'Favorites', icon: Heart, path: '/library?filter=favorites' },
  ];

  const categories = [
    { id: 'Professional', label: 'Professional', icon: Briefcase, color: 'bg-blue-500', activeRing: 'ring-blue-400/40' },
    { id: 'Academic', label: 'Academic', icon: GraduationCap, color: 'bg-purple-500', activeRing: 'ring-purple-400/40' },
    { id: 'Personal', label: 'Personal', icon: User, color: 'bg-orange-500', activeRing: 'ring-orange-400/40' },
    { id: 'Creative', label: 'Creative', icon: Palette, color: 'bg-pink-500', activeRing: 'ring-pink-400/40' },
  ];

  // Helper to check active state
  const isNavActive = (path: string) => {
    if (path.includes('?')) {
      // Check query params for favorites
      return location.pathname === path.split('?')[0] && location.search === `?${path.split('?')[1]}`;
    }
    // Strict check for home/upload, loose for library (but not if category is selected)
    if (path === '/library') {
      return location.pathname === '/library' && !currentCategory && !currentFilter;
    }
    return location.pathname === path;
  };

  const isCategoryActive = (catId: string) => {
    return location.pathname === '/library' && currentCategory === catId;
  }

  return (
    <div className={`w-[280px] h-full flex flex-col border-r transition-colors duration-300 ${sidebarBg} ${sidebarBorder}`}>
      {/* ─── App Logo ─── */}
      <div className="p-8 flex-shrink-0">
        <div
          onClick={() => navigate('/home')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="p-2.5 bg-orange-500 rounded-xl text-white shadow-lg shadow-orange-500/20 group-hover:scale-110 group-active:scale-95 transition-transform">
            <BookOpen size={24} strokeWidth={2.5} />
          </div>
          <div>
            <h1 className={`text-lg font-bold tracking-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Library
            </h1>
            <p className="text-[10px] font-black uppercase tracking-widest text-orange-500/80">
              System
            </p>
          </div>
        </div>
      </div>

      {/* ─── Navigation ─── */}
      <div className="flex-1 px-4 space-y-8 overflow-y-auto no-scrollbar">
        <div>
          <p className={`px-4 text-[11px] font-black uppercase tracking-widest mb-4 ${sidebarSecondaryText}`}>
            Navigate
          </p>
          <div className="space-y-1">
            {navItems.map((item) => {
              const isActive = isNavActive(item.path);
              return (
                <button
                  key={item.id}
                  onClick={() => navigate(item.path)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all group
                    ${isActive
                      ? sidebarItemActive
                      : `${sidebarText} ${sidebarItemHover}`
                    }
                  `}
                >
                  <item.icon size={20} className={isActive ? '' : 'group-hover:scale-110 transition-transform'} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ─── Categories Section ─── */}
        <div className="flex-1 min-h-0 px-5 pt-4 pb-2">
          <p className={`px-4 text-[10px] font-black uppercase tracking-widest mb-4 ${sidebarSecondaryText}`}>
            Categories
          </p>
          <div className="space-y-1">
            {categories.map((cat) => {
              const isActive = isCategoryActive(cat.id);
              return (
                <button
                  key={cat.id}
                  onClick={() => navigate(`/library?category=${cat.id}`)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all group
                  ${isActive
                      ? sidebarItemActive
                      : `${sidebarText} ${sidebarItemHover}`
                    }
                `}
                >
                  <div className={`w-2 h-2 rounded-full flex-shrink-0 transition-transform ${cat.color} ${isActive ? 'scale-125' : 'group-hover:scale-125'}`} />
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ─── Footer ─── */}
      <div className={`mt-auto p-4 border-t ${dividerColor}`}>
        <div className="space-y-1">
          {/* Admin Dashboard */}
          {userProfile.role === 'admin' && (
            <button
              onClick={() => navigate('/admin')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all border
                ${isDark
                  ? 'bg-orange-500/10 text-orange-600 hover:bg-orange-500/15 border-orange-500/20'
                  : 'bg-orange-500/10 text-orange-600 hover:bg-orange-500/15 border-orange-500/10'
                }`}
            >
              <ShieldCheck size={18} />
              <span>Admin Panel</span>
            </button>
          )}

          {/* Account Settings */}
          <button
            onClick={onOpenSettings}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${sidebarText} ${sidebarItemHover}`}
          >
            <Settings size={18} />
            <span>Settings</span>
          </button>

          {/* Theme Toggle */}
          <button
            onClick={onToggleTheme}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-all ${sidebarText} ${sidebarItemHover}`}
          >
            <span className="flex items-center gap-3">
              {isDark ? <Moon size={18} /> : <Sun size={18} />}
              {isDark ? 'Dark Mode' : 'Light Mode'}
            </span>
            <div className={`w-10 h-5 rounded-full relative transition-colors ${isDark ? 'bg-orange-500' : 'bg-gray-300'}`}>
              <div className={`absolute top-1 w-3 h-3 rounded-full bg-white transition-all ${isDark ? 'left-6' : 'left-1'}`} />
            </div>
          </button>

          {/* Sign Out */}
          <button
            onClick={async () => {
              if (isLoggingOut) return;
              setIsLoggingOut(true);
              try {
                await onLogout();
              } catch (error) {
                console.error('[SIDEBAR] Error during logout:', error);
                setIsLoggingOut(false);
              }
            }}
            disabled={isLoggingOut}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all text-red-500 disabled:opacity-50 hover:bg-red-500/10`}
          >
            {isLoggingOut ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <LogOut size={18} strokeWidth={2} />
            )}
            <span>{isLoggingOut ? 'Signing Out...' : 'Sign Out'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
