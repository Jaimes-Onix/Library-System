
import React, { useState } from 'react';
import {
    BookOpen,
    Home,
    Library,
    Upload,
    Heart,
    Sun,
    Moon,
    Briefcase,
    GraduationCap,
    User,
    Palette,
    ArrowRight,
    Search
} from 'lucide-react';
import VantaFog from './VantaFog';
import { Theme, UserProfile } from '../types';

interface LandingProps {
    theme: Theme;
    onToggleTheme: () => void;
    onNavigate: (view: string) => void;
    user: UserProfile | null;
    onAuth: () => void;
}

const Landing: React.FC<LandingProps> = ({ theme, onToggleTheme, onNavigate, user, onAuth }) => {
    const isDark = theme === 'dark';
    const sidebarBg = isDark ? 'bg-[#F5F5F7]' : 'bg-[#1D1D1F]'; // Inverted for contrast or sidebar specific? 
    // Wait, the image shows a consistent sidebar. Let's stick to the app's sidebar style or the image's.
    // The image shows white sidebar in light mode (presumably). The user said "based on our theme".
    // "Our theme" is likely the dark/orange theme we've been using.
    // Let's use a dark sidebar for dark mode, white for light mode, consistent with the app.

    const bg = isDark ? 'bg-black' : 'bg-white';
    const text = isDark ? 'text-white' : 'text-black';
    const sidebarColor = isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-gray-200';
    const sidebarText = isDark ? 'text-gray-400' : 'text-gray-500';
    const sidebarActive = isDark ? 'bg-orange-500/10 text-orange-500' : 'bg-orange-50 text-orange-600';
    const sidebarHover = isDark ? 'hover:bg-white/5 hover:text-white' : 'hover:bg-gray-50 hover:text-gray-900';

    return (
        <div className={`flex min-h-screen w-full relative ${bg} ${text}`}>

            {/* Sidebar */}
            <aside className={`w-[280px] flex-shrink-0 flex flex-col border-r z-20 transition-colors duration-300 sticky top-0 h-screen ${sidebarColor}`}>

                {/* Logo */}
                <div className="p-8">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-orange-500 rounded-xl text-white shadow-lg shadow-orange-500/20">
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

                {/* Navigation */}
                <div className="flex-1 px-4 space-y-8 overflow-y-auto no-scrollbar">

                    {/* Main Nav */}
                    <div>
                        <p className={`px-4 text-[11px] font-black uppercase tracking-widest mb-4 ${sidebarText}`}>
                            Navigate
                        </p>
                        <div className="space-y-1">
                            <button
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${sidebarActive}`}
                            >
                                <Home size={20} />
                                Home
                            </button>
                            <button
                                onClick={() => onNavigate('library')}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${sidebarText} ${sidebarHover}`}
                            >
                                <Library size={20} />
                                All Books
                            </button>
                            <button
                                onClick={() => onNavigate('upload')}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${sidebarText} ${sidebarHover}`}
                            >
                                <Upload size={20} />
                                Import PDF
                            </button>
                            <button
                                onClick={() => onNavigate('favorites')}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${sidebarText} ${sidebarHover}`}
                            >
                                <Heart size={20} />
                                Favorites
                            </button>
                        </div>
                    </div>

                    {/* Categories */}
                    <div>
                        <p className={`px-4 text-[11px] font-black uppercase tracking-widest mb-4 ${sidebarText}`}>
                            Categories
                        </p>
                        <div className="space-y-1">
                            {[
                                { label: 'Philippines', icon: Home, color: 'bg-blue-500' },
                                { label: 'Internal', icon: Briefcase, color: 'bg-purple-500' },
                                { label: 'International', icon: GraduationCap, color: 'bg-green-500' },
                                { label: 'PH Interns', icon: User, color: 'bg-orange-500' },
                            ].map((cat) => (
                                <button
                                    key={cat.label}
                                    onClick={() => onNavigate('library')}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all group ${sidebarText} ${sidebarHover}`}
                                >
                                    <div className={`w-2 h-2 rounded-full ${cat.color} group-hover:scale-125 transition-transform`} />
                                    {cat.label}
                                </button>
                            ))}
                        </div>
                    </div>

                </div>

                {/* Footer */}
                <div className="p-4 border-t border-white/5">
                    <button
                        onClick={onToggleTheme}
                        className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-all ${sidebarText} ${sidebarHover}`}
                    >
                        <span className="flex items-center gap-3">
                            {isDark ? <Moon size={18} /> : <Sun size={18} />}
                            {isDark ? 'Dark Mode' : 'Light Mode'}
                        </span>
                        <div className={`w-10 h-5 rounded-full relative transition-colors ${isDark ? 'bg-orange-500' : 'bg-gray-300'}`}>
                            <div className={`absolute top-1 w-3 h-3 rounded-full bg-white transition-all ${isDark ? 'left-6' : 'left-1'}`} />
                        </div>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 relative">
                {/* Vanta Background */}
                <div className="fixed inset-0 z-0 pointer-events-none">
                    <VantaFog />
                    {/* Overlay gradient to ensure text readability if needed */}
                    <div className={`absolute inset-0 bg-gradient-to-t ${isDark ? 'from-black/50 via-transparent to-black/20' : 'from-white/50 via-transparent to-white/20'}`} />
                </div>

                {/* Content */}
                <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-8">

                    {/* Hero Card */}
                    <div className={`w-full max-w-4xl p-12 rounded-[40px] shadow-2xl backdrop-blur-xl border transition-all duration-500 hover:scale-[1.01]
            ${isDark
                            ? 'bg-zinc-900/40 border-white/10 shadow-black/50'
                            : 'bg-white/40 border-white/40 shadow-xl'}`}
                    >
                        <div className="flex flex-col items-center text-center space-y-8">

                            <div className="space-y-4 max-w-2xl">
                                <h2 className="text-5xl md:text-6xl font-black tracking-tight leading-tight">
                                    Welcome to <span className="text-orange-500">Library System</span>:
                                    <br />
                                    <span className={`text-4xl md:text-5xl font-thin opacity-90 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                        Your Digital Flipbook Gallery
                                    </span>
                                </h2>

                                <p className={`text-lg md:text-xl font-medium leading-relaxed max-w-2xl mx-auto ${isDark ? 'text-zinc-300' : 'text-gray-700'}`}>
                                    Transform your PDFs into premium digital flipbooks. Create, organize,
                                    and share your documents in a beautiful flipbook experience where
                                    professional publishing meets modern design.
                                </p>
                            </div>

                            <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
                                <button
                                    onClick={() => onNavigate('upload')}
                                    className="group relative px-8 py-4 bg-white text-black rounded-full font-bold text-base transition-all hover:scale-105 active:scale-95 shadow-xl hover:shadow-2xl hover:bg-gray-100"
                                >
                                    Upload PDF
                                    <div className="absolute inset-0 rounded-full border border-black/5" />
                                </button>

                                <button
                                    onClick={() => onNavigate('library')}
                                    className={`group px-8 py-4 rounded-full font-bold text-base transition-all hover:scale-105 active:scale-95 border backdrop-blur-md flex items-center gap-2
                    ${isDark
                                            ? 'bg-white/5 border-white/20 text-white hover:bg-white/10'
                                            : 'bg-black/5 border-black/10 text-black hover:bg-black/10'}`}
                                >
                                    Discover Library
                                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                </button>
                            </div>

                        </div>
                    </div>

                    {/* Floating Preview Cards (Decorative) */}
                    <div className="absolute bottom-[-100px] left-1/2 -translate-x-1/2 flex gap-8 opacity-50 pointer-events-none select-none blur-[2px] transition-all duration-1000 hover:blur-0 hover:opacity-100 hover:bottom-[-50px]">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className={`w-48 h-64 rounded-2xl shadow-2xl transform transition-transform duration-500 hover:-translate-y-4 ${i === 2 ? '-translate-y-12 z-10' : 'rotate-3 scale-90'
                                } ${isDark ? 'bg-zinc-800' : 'bg-white'}`}>
                                {/* Mock Card Content */}
                            </div>
                        ))}
                    </div>

                </div>

                {/* Top Right Actions */}
                <div className="absolute top-8 right-8 z-20 flex items-center gap-4">
                    {user ? (
                        <button
                            onClick={() => onNavigate('home')}
                            className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold text-sm transition-all shadow-lg active:scale-95 ${isDark
                                ? 'bg-white text-black hover:bg-gray-200'
                                : 'bg-black text-white hover:bg-gray-800'
                                }`}
                        >
                            My Books
                            <ArrowRight size={16} />
                        </button>
                    ) : (
                        <button
                            onClick={onAuth}
                            className={`px-6 py-3 rounded-full font-bold text-sm transition-all shadow-lg active:scale-95 border backdrop-blur-md ${isDark
                                ? 'bg-white/10 text-white border-white/20 hover:bg-white/20'
                                : 'bg-black/5 text-black border-black/10 hover:bg-black/10'
                                }`}
                        >
                            Sign In
                        </button>
                    )}
                </div>

            </main>
        </div>
    );
};

export default Landing;
