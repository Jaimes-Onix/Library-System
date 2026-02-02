
import React from 'react';
import {
    LayoutDashboard,
    BarChart2,
    Book,
    Users,
    Settings,
    ShieldCheck,
    LogOut,
    Library
} from 'lucide-react';
import { Theme } from '../types';

interface AdminSidebarProps {
    theme: Theme;
    activeView: string;
    onNavigate: (view: string) => void;
    onLogout: () => void;
    onExit: () => void;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({
    theme,
    activeView,
    onNavigate,
    onLogout,
    onExit
}) => {
    const isDark = theme === 'dark';

    const menuItems = [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'analytics', label: 'Analysis', icon: BarChart2 },
        { id: 'books', label: 'Library Books', icon: Book },
        { id: 'students', label: 'Students', icon: Users },
        { id: 'settings', label: 'Settings', icon: Settings },
    ];

    return (
        <div className={`w-64 h-screen flex flex-col border-r transition-colors duration-300 ${isDark ? 'bg-[#0A0A0A] border-white/5' : 'bg-white border-gray-100'
            }`}>
            {/* Brand */}
            <div className="p-8 flex items-center gap-3">
                <div className="bg-orange-600 p-2 rounded-xl text-white">
                    <Library size={24} strokeWidth={2.5} />
                </div>
                <div>
                    <h1 className={`font-black tracking-tight text-lg ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        LibAdmin
                    </h1>
                    <p className={`text-[10px] font-bold uppercase tracking-widest ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                        System
                    </p>
                </div>
            </div>

            {/* Navigation */}
            <div className="flex-1 px-4 space-y-2 overflow-y-auto">
                <p className={`px-4 text-xs font-bold uppercase tracking-widest mb-4 opacity-50 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    Main Menu
                </p>

                {menuItems.map((item) => {
                    const isActive = activeView === item.id;
                    return (
                        <button
                            key={item.id}
                            onClick={() => onNavigate(item.id)}
                            className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-200 group relative overflow-hidden ${isActive
                                ? (isDark ? 'text-white' : 'text-orange-600')
                                : (isDark ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900')
                                }`}
                        >
                            {/* Active Background Indicators */}
                            {isActive && (
                                <div className={`absolute inset-0 opacity-100 ${isDark
                                    ? 'bg-gradient-to-r from-orange-600/20 to-transparent border-l-2 border-orange-500'
                                    : 'bg-orange-50 border-l-2 border-orange-500'
                                    }`} />
                            )}

                            <item.icon
                                size={20}
                                strokeWidth={isActive ? 2.5 : 2}
                                className={`relative z-10 transition-transform group-hover:scale-110 ${isActive ? 'text-orange-500' : ''}`}
                            />
                            <span className={`relative z-10 font-bold text-sm tracking-wide ${isActive ? 'translate-x-1' : ''} transition-transform`}>
                                {item.label}
                            </span>
                        </button>
                    );
                })}
            </div>

            {/* Footer / User */}
            <div className={`p-6 border-t ${isDark ? 'border-white/5' : 'border-gray-100'}`}>
                <button
                    onClick={onExit}
                    className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl mb-3 text-sm font-bold transition-all ${isDark
                        ? 'bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-900'
                        }`}
                >
                    <LogOut size={16} />
                    Exit Admin
                </button>
            </div>
        </div>
    );
};

export default AdminSidebar;
