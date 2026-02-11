
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
import { UserProfile, Theme, AppView } from '../types';

interface SidebarProps {
  theme: Theme;
  userProfile: UserProfile;
  onLogout: () => Promise<void>;
  activeView: string;
  activeFilter: string;
  onFilterChange: (filter: string) => void;
  onNavigate: (view: AppView) => void;
  onToggleTheme: () => void;
  onOpenSettings: () => void;
  onOpenAdmin: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  theme,
  userProfile,
  onLogout,
  activeView,
  activeFilter,
  onFilterChange,
  onNavigate,
  onToggleTheme,
  onOpenSettings,
  onOpenAdmin
}) => {
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  if (!userProfile) return null;

  const isDark = theme === 'dark';

  // Inverted color scheme for contrast
  const sidebarBg = isDark ? 'bg-[#F5F5F7]' : 'bg-[#1D1D1F]';
  const sidebarText = isDark ? 'text-gray-900' : 'text-white';
  const sidebarItemHover = isDark ? 'hover:bg-black/[0.05]' : 'hover:bg-white/[0.06]';
  const sidebarItemActive = isDark ? 'bg-black text-white' : 'bg-white text-black';
  const sidebarSecondaryText = isDark ? 'text-gray-400' : 'text-zinc-500';
  const dividerColor = isDark ? 'border-gray-200/60' : 'border-white/[0.06]';

  const navItems = [
    { id: 'home', label: 'Home', icon: Home, action: () => onNavigate('home') },
    { id: 'all', label: 'All Books', icon: Library, action: () => { onNavigate('library'); onFilterChange('all'); } },
    { id: 'upload', label: 'Import PDF', icon: Upload, action: () => onNavigate('upload') },
    { id: 'favorites', label: 'Favorites', icon: Heart, action: () => { onNavigate('library'); onFilterChange('favorites'); } },
  ];

  const categories = [
    { id: 'Professional', label: 'Professional', icon: Briefcase, color: 'bg-blue-500', activeRing: 'ring-blue-400/40' },
    { id: 'Academic', label: 'Academic', icon: GraduationCap, color: 'bg-purple-500', activeRing: 'ring-purple-400/40' },
    { id: 'Personal', label: 'Personal', icon: User, color: 'bg-orange-500', activeRing: 'ring-orange-400/40' },
    { id: 'Creative', label: 'Creative', icon: Palette, color: 'bg-pink-500', activeRing: 'ring-pink-400/40' },
  ];

  const getIsNavActive = (id: string) => {
    if (id === 'home') return activeView === 'home';
    if (id === 'upload') return activeView === 'upload';
    if (id === 'all') return activeView === 'library' && activeFilter === 'all';
    if (id === 'favorites') return activeView === 'library' && activeFilter === 'favorites';
    return false;
  };

  const getIsCategoryActive = (id: string) => {
    return activeView === 'library' && activeFilter === id;
  };

  return (
    <aside className={`w-[260px] min-w-[260px] h-full flex flex-col z-40 hidden md:flex transition-all duration-500 border-r overflow-y-auto overflow-x-hidden ${sidebarBg} ${sidebarText} ${dividerColor}`}>

      {/* ─── App Logo ─── */}
      <div className="px-7 pt-7 pb-5 flex-shrink-0">
        <div className="flex items-center gap-3.5">
          <div className={`p-2 rounded-2xl ${isDark ? 'bg-black' : 'bg-white'}`}>
            <BookOpen size={20} className={isDark ? 'text-white' : 'text-black'} strokeWidth={2.5} />
          </div>
          <div className="flex flex-col">
            <span className="text-base font-bold tracking-tight leading-tight">Library</span>
            <span className={`text-[10px] font-black uppercase tracking-[0.15em] ${sidebarSecondaryText}`}>System</span>
          </div>
        </div>
      </div>

      {/* ─── Navigate Section ─── */}
      <div className="px-5 pt-2 pb-2 flex-shrink-0">
        <p className={`px-4 text-[10px] font-black uppercase tracking-[0.2em] mb-3 ${sidebarSecondaryText}`}>
          Navigate
        </p>
        <div className="space-y-1">
          {navItems.map((item) => {
            const isActive = getIsNavActive(item.id);
            return (
              <button
                key={item.id}
                onClick={item.action}
                className={`w-full flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-200 text-[14px] font-semibold group
                  ${isActive
                    ? `${sidebarItemActive} shadow-lg`
                    : `${sidebarText} ${sidebarItemHover} active:scale-[0.98]`
                  }
                `}
              >
                <item.icon size={20} strokeWidth={isActive ? 2.5 : 1.8} className={`transition-all duration-200 flex-shrink-0 ${!isActive ? 'group-hover:scale-110' : ''}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ─── Categories Section ─── */}
      <div className="flex-1 min-h-0 px-5 pt-4 pb-2">
        <p className={`px-4 text-[10px] font-black uppercase tracking-[0.2em] mb-3 ${sidebarSecondaryText}`}>
          Categories
        </p>
        <div className="space-y-1">
          {categories.map((cat) => {
            const isActive = getIsCategoryActive(cat.id);
            return (
              <button
                key={cat.id}
                onClick={() => { onNavigate('library'); onFilterChange(cat.id); }}
                className={`w-full flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-200 text-[14px] font-semibold group
                  ${isActive
                    ? `${sidebarItemActive} shadow-lg`
                    : `${sidebarText} ${sidebarItemHover} active:scale-[0.98]`
                  }
                `}
              >
                <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 transition-all duration-200 ${cat.color} ${isActive ? `ring-[3px] ${cat.activeRing} scale-110` : 'group-hover:scale-125'}`} />
                <cat.icon size={20} strokeWidth={isActive ? 2.5 : 1.8} className={`transition-all duration-200 flex-shrink-0 ${!isActive ? 'group-hover:scale-110' : ''}`} />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ─── Divider ─── */}
      <div className={`mx-7 border-t flex-shrink-0 ${dividerColor}`} />

      {/* ─── Bottom Actions ─── */}
      <div className="px-5 py-5 space-y-1 flex-shrink-0 mt-auto">
        {/* Theme Toggle */}
        <button
          onClick={onToggleTheme}
          className={`w-full flex items-center gap-4 px-4 py-3 rounded-2xl text-[14px] font-semibold transition-all duration-200 active:scale-[0.98] group ${sidebarText} ${sidebarItemHover}`}
        >
          <div className="relative w-5 h-5 flex-shrink-0">
            <Sun size={20} strokeWidth={1.8} className={`absolute inset-0 transition-all duration-500 ${isDark ? 'opacity-0 rotate-90 scale-0' : 'opacity-100 rotate-0 scale-100'}`} />
            <Moon size={20} strokeWidth={1.8} className={`absolute inset-0 transition-all duration-500 ${isDark ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-0'}`} />
          </div>
          <span>{isDark ? 'Dark Mode' : 'Light Mode'}</span>
        </button>

        {/* Admin Dashboard */}
        {userProfile.role === 'admin' && (
          <button
            onClick={onOpenAdmin}
            className={`w-full flex items-center gap-4 px-4 py-3 rounded-2xl text-[14px] font-bold transition-all duration-200 active:scale-[0.98] group border
              ${isDark
                ? 'bg-orange-500/10 text-orange-600 hover:bg-orange-500/15 border-orange-500/15'
                : 'bg-orange-500/10 text-orange-400 hover:bg-orange-500/15 border-orange-500/10'
              }`}
          >
            <ShieldCheck size={20} strokeWidth={2} className="group-hover:rotate-12 transition-transform duration-300 flex-shrink-0" />
            <span>Admin Panel</span>
          </button>
        )}

        {/* Account Settings */}
        <button
          onClick={onOpenSettings}
          className={`w-full flex items-center gap-4 px-4 py-3 rounded-2xl text-[14px] font-semibold transition-all duration-200 active:scale-[0.98] group ${sidebarText} ${sidebarItemHover}`}
        >
          <Settings size={20} strokeWidth={1.8} className="group-hover:rotate-90 transition-transform duration-500 flex-shrink-0" />
          <span>Account Settings</span>
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
          className={`w-full flex items-center gap-4 px-4 py-3 rounded-2xl text-[14px] font-bold transition-all duration-200 active:scale-[0.98] group text-red-500 disabled:opacity-50
            ${isDark ? 'hover:bg-red-50' : 'hover:bg-red-500/10'}`}
        >
          {isLoggingOut ? (
            <Loader2 size={20} className="animate-spin flex-shrink-0" />
          ) : (
            <LogOut size={20} strokeWidth={2} className="group-hover:-translate-x-0.5 transition-transform duration-200 flex-shrink-0" />
          )}
          <span>{isLoggingOut ? 'Signing Out...' : 'Sign Out'}</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
