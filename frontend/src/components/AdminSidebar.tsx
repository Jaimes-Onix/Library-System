
import React from 'react';
import {
    LayoutDashboard,
    BarChart2,
    Book,
    Users,
    Settings,
    ShieldCheck,
    LogOut,
    BookOpen
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

    // Aligned with Landing/App Sidebar Theme
    const sidebarBg = isDark ? 'bg-zinc-900' : 'bg-white';
    const sidebarBorder = isDark ? 'border-zinc-800' : 'border-gray-200';
    const sidebarText = isDark ? 'text-gray-400' : 'text-gray-500';
    const sidebarItemHover = isDark ? 'hover:bg-white/5 hover:text-white' : 'hover:bg-gray-50 hover:text-gray-900';
    const sidebarItemActive = isDark ? 'bg-orange-500/10 text-orange-500' : 'bg-orange-50 text-orange-600';
    const sidebarSecondaryText = isDark ? 'text-gray-500' : 'text-gray-400';
    const dividerColor = isDark ? 'border-white/5' : 'border-gray-100';

    const menuItems = [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'analytics', label: 'Analysis', icon: BarChart2 },
        { id: 'books', label: 'Library Books', icon: Book },
        { id: 'students', label: 'Students', icon: Users },
        { id: 'settings', label: 'Settings', icon: Settings },
    ];

    return (
        <div className={`w-[280px] min-w-[280px] h-screen flex flex-col border-r transition-colors duration-300 ${sidebarBg} ${sidebarBorder} ${sidebarText}`}>
            {/* ─── App Logo ─── */}
            <div className="p-8 flex-shrink-0">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-orange-500 rounded-xl text-white shadow-lg shadow-orange-500/20">
                        <BookOpen size={24} strokeWidth={2.5} />
                    </div>
                    <div>
                        <h1 className={`text-lg font-bold tracking-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>
                            LibAdmin
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
                        Main Menu
                    </p>
                    <div className="space-y-1">
                        {menuItems.map((item) => {
                            const isActive = activeView === item.id;
                            return (
                                <button
                                    key={item.id}
                                    onClick={() => onNavigate(item.id)}
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
            </div>

            {/* ─── Footer / User ─── */}
            <div className={`p-4 border-t ${dividerColor}`}>
                <button
                    onClick={onExit}
                    className={`w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all border
                ${isDark
                            ? 'bg-zinc-800 text-gray-300 hover:bg-zinc-700 hover:text-white border-zinc-700'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-900 border-gray-200'
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
