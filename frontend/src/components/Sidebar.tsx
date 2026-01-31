
import React from 'react';
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
  Sun
} from 'lucide-react';
import { UserProfile, Theme } from '../types';

interface SidebarProps {
  theme: Theme;
  userProfile: UserProfile;
  onLogout: () => void;
  activeFilter: string;
  onFilterChange: (filter: string) => void;
  onToggleTheme: () => void;
  onOpenSettings: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  theme,
  userProfile, 
  onLogout, 
  activeFilter, 
  onFilterChange, 
  onToggleTheme,
  onOpenSettings
}) => {
  const isDark = theme === 'dark';

  // "Opposite Color" Logic for High Visual Clarity:
  // If Main theme is Light (White), Sidebar is Dark (#1D1D1F).
  // If Main theme is Dark (Black), Sidebar is Light (#F5F5F7).
  const sidebarBg = isDark ? 'bg-[#F5F5F7]' : 'bg-[#1D1D1F]';
  const sidebarText = isDark ? 'text-gray-900' : 'text-white';
  const sidebarBorder = isDark ? 'border-gray-200' : 'border-white/5';
  const sidebarItemHover = isDark ? 'hover:bg-gray-200' : 'hover:bg-white/5';
  
  // Highlighted item logic
  const sidebarItemActive = isDark ? 'bg-black text-white' : 'bg-white text-black';
  const sidebarSecondaryText = isDark ? 'text-gray-400' : 'text-zinc-500';

  const navItems = [
    { id: 'all', label: 'All Books', icon: Library },
    { id: 'favorites', label: 'Favorites', icon: Heart },
  ];

  const categories = [
    { id: 'Professional', label: 'Professional', icon: Briefcase, color: 'bg-blue-500' },
    { id: 'Academic', label: 'Academic', icon: GraduationCap, color: 'bg-purple-500' },
    { id: 'Personal', label: 'Personal', icon: User, color: 'bg-orange-500' },
    { id: 'Creative', label: 'Creative', icon: Palette, color: 'bg-pink-500' },
  ];

  return (
    <aside className={`w-84 h-full flex flex-col z-40 hidden md:flex transition-all duration-700 ease-in-out border-r shadow-2xl ${sidebarBg} ${sidebarText} ${sidebarBorder}`}>
      {/* User Profile Header */}
      <div className="p-10 pb-6">
        <div className="flex items-center gap-5 mb-12 group cursor-pointer" onClick={onOpenSettings}>
          <div className={`w-16 h-16 rounded-[22px] overflow-hidden flex items-center justify-center text-xl font-bold shadow-xl transition-all duration-500 group-hover:scale-110 border ${isDark ? 'bg-white text-black border-gray-200' : 'bg-white/10 text-white border-white/10'}`}>
            {userProfile.photoUrl ? (
              <img src={userProfile.photoUrl} alt={userProfile.name} className="w-full h-full object-cover" />
            ) : (
              userProfile.initials
            )}
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-lg font-bold truncate group-hover:text-blue-500 transition-colors leading-tight">{userProfile.name}</span>
            <span className={`text-xs font-black uppercase tracking-tighter mt-0.5 ${sidebarSecondaryText}`}>Pro Member</span>
          </div>
        </div>

        <div className="space-y-2">
          <p className={`px-5 text-xs font-black uppercase tracking-[0.2em] mb-4 ${sidebarSecondaryText}`}>Library</p>
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onFilterChange(item.id)}
              className={`w-full flex items-center gap-4 px-6 py-5 rounded-[20px] transition-all text-base font-bold
                ${activeFilter === item.id 
                  ? `${sidebarItemActive} shadow-xl translate-x-1` 
                  : `${sidebarText} ${sidebarItemHover}`
                }
              `}
            >
              <item.icon size={22} strokeWidth={activeFilter === item.id ? 2.5 : 2} />
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Categories */}
      <div className="px-10 py-8">
        <p className={`px-5 text-xs font-black uppercase tracking-[0.2em] mb-5 ${sidebarSecondaryText}`}>Categories</p>
        <div className="space-y-2">
          {categories.map((cat) => (
            <button 
              key={cat.id}
              onClick={() => onFilterChange(cat.id)}
              className={`w-full flex items-center gap-4 px-6 py-4 rounded-xl text-sm font-bold transition-all
                ${activeFilter === cat.id 
                  ? `${isDark ? 'bg-gray-200 text-black shadow-lg' : 'bg-white/10 text-white shadow-lg'} translate-x-1` 
                  : `${sidebarSecondaryText} ${sidebarItemHover}`
                }`}
            >
              <div className={`w-3 h-3 rounded-full ${cat.color} ${activeFilter === cat.id ? 'scale-125' : ''}`} />
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Footer Actions */}
      <div className={`mt-auto p-10 border-t ${sidebarBorder} space-y-4`}>
        <button
          onClick={onToggleTheme}
          className={`w-full flex items-center gap-4 px-6 py-5 rounded-[20px] text-base font-bold transition-all ${sidebarText} ${sidebarItemHover}`}
        >
          {isDark ? <Sun size={22} className="text-orange-400" /> : <Moon size={22} className="text-blue-400" />}
          {isDark ? 'Light' : 'Dark'} Mode
        </button>

        <button
          onClick={onOpenSettings}
          className={`w-full flex items-center gap-4 px-6 py-5 rounded-[20px] text-base font-bold transition-all ${sidebarText} ${sidebarItemHover}`}
        >
          <Settings size={22} />
          Account Settings
        </button>
        
        <button
          onClick={onLogout}
          className={`w-full flex items-center gap-4 px-6 py-5 rounded-[20px] text-base font-black text-red-500 transition-all active:scale-95 ${isDark ? 'hover:bg-red-50' : 'hover:bg-red-500/10'}`}
        >
          <LogOut size={22} />
          Sign Out
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
