
import React from 'react';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import VantaFog from './VantaFog';
import { Theme, UserProfile } from '../types';

interface LandingProps {
    theme: Theme;
    onToggleTheme: () => void;
    user: UserProfile | null;
    onAuth: () => void;
}

const Landing: React.FC<LandingProps> = ({ theme, onToggleTheme, user, onAuth }) => {
    const navigate = useNavigate();
    const isDark = theme === 'dark';

    return (
        <div className={`relative w-full min-h-screen flex flex-col items-center justify-center ${isDark ? 'text-white' : 'text-black'}`}>

            {/* Vanta Background */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <VantaFog />
                <div className={`absolute inset-0 bg-gradient-to-t ${isDark ? 'from-black/50 via-transparent to-black/20' : 'from-white/50 via-transparent to-white/20'}`} />
            </div>

            {/* Content */}
            <div className="relative z-10 flex flex-col items-center justify-center flex-1 w-full p-8">

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
                                onClick={() => user ? navigate('/library/home') : onAuth()}
                                className="group relative px-8 py-4 bg-white text-black rounded-full font-bold text-base transition-all hover:scale-105 active:scale-95 shadow-xl hover:shadow-2xl hover:bg-gray-100"
                            >
                                Get Started
                                <div className="absolute inset-0 rounded-full border border-black/5" />
                            </button>

                            <button
                                onClick={() => navigate('/examples')}
                                className={`group px-8 py-4 rounded-full font-bold text-base transition-all hover:scale-105 active:scale-95 border backdrop-blur-md flex items-center gap-2
                                    ${isDark
                                        ? 'bg-white/5 border-white/20 text-white hover:bg-white/10'
                                        : 'bg-black/5 border-black/10 text-black hover:bg-black/10'}`}
                            >
                                See Examples
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
        </div>
    );
};

export default Landing;
