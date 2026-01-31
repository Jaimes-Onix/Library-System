
import React from 'react';
import { ArrowRight, Sparkles, ChevronRight } from 'lucide-react';
import { Theme } from '../types';
import RubiksCube from './RubiksCube';

interface HomeProps {
  theme: Theme;
  onStart: () => void;
  onViewExamples: () => void;
}



const Home: React.FC<HomeProps> = ({ theme, onStart, onViewExamples }) => {
  const isDark = theme === 'dark';

  return (
    <div className={`w-full ${isDark ? 'bg-black text-white' : 'bg-white text-gray-900'} selection:bg-blue-500 selection:text-white`}>
      <style>{`
        .preserve-3d { transform-style: preserve-3d; }
        .rotate-y-90 { transform: rotateY(90deg) translateZ(32px); }
        .rotate-y-180 { transform: rotateY(180deg) translateZ(32px); }
        .-rotate-y-90 { transform: rotateY(-90deg) translateZ(32px); }
        .rotate-x-90 { transform: rotateX(90deg) translateZ(32px); }
        .-rotate-x-90 { transform: rotateX(-90deg) translateZ(32px); }
        
        @media (min-width: 768px) {
          .rotate-y-90 { transform: rotateY(90deg) translateZ(40px); }
          .rotate-y-180 { transform: rotateY(180deg) translateZ(40px); }
          .-rotate-y-90 { transform: rotateY(-90deg) translateZ(40px); }
          .rotate-x-90 { transform: rotateX(90deg) translateZ(40px); }
          .-rotate-x-90 { transform: rotateX(-90deg) translateZ(40px); }
        }

        @keyframes cube-rotate {
          0% { transform: rotateX(0) rotateY(0) rotateZ(0); }
          100% { transform: rotateX(360deg) rotateY(720deg) rotateZ(360deg); }
        }
        .animate-cube-rotate {
          animation: cube-rotate 25s linear infinite;
        }
      `}</style>

      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center pt-20 px-10 md:px-20 overflow-hidden">
        {/* Radial background glow */}
        <div className="absolute top-0 right-0 w-[60%] h-[80%] bg-gradient-to-bl from-blue-900/10 via-transparent to-transparent -z-10" />

        <div className="max-w-[1400px] mx-auto w-full flex flex-col lg:flex-row items-center justify-between gap-16">
          <div className="flex-1 space-y-10 animate-in fade-in slide-in-from-left-8 duration-1000">
            {/* Launch Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-zinc-900 border border-zinc-800 text-[11px] font-bold text-zinc-400 group cursor-pointer hover:border-amber-500/50 transition-all">
              <span className="text-amber-500">Email for developers</span>
              <ChevronRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
            </div>

            <h1 className="text-6xl md:text-8xl font-black tracking-tight leading-[1.0] text-balance" style={{ fontFamily: "'Playfair Display', serif" }}>
              Email for <br />
              <span className="text-zinc-400">developers</span>
            </h1>

            <p className="text-lg md:text-xl font-medium text-zinc-500 max-w-lg leading-relaxed">
              The best way to reach humans instead of spam folders.
              Deliver transactional and marketing emails at scale.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-6 pt-4">
              <button
                onClick={onStart}
                className="w-full sm:w-auto px-10 py-4 bg-white hover:bg-gray-100 text-black rounded-[14px] text-base font-bold transition-all active:scale-95 shadow-xl"
              >
                Get Started
              </button>
              <button
                onClick={onViewExamples}
                className="w-full sm:w-auto px-10 py-4 text-zinc-500 hover:text-white font-bold transition-colors flex items-center justify-center gap-2 group"
              >
                Documentation
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          <div className="flex-1 flex justify-center items-center lg:justify-end animate-in fade-in zoom-in duration-1000">
            <RubiksCube />
          </div>
        </div>
      </section>

      {/* Feature Section (Refined for Dark Theme) */}
      <section className="py-40 px-10 md:px-20 border-t border-zinc-900">
        <div className="max-w-[1400px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-24">
            <div className="space-y-6">
              <div className="w-12 h-12 bg-zinc-900 rounded-xl flex items-center justify-center text-blue-500 border border-zinc-800">
                <Sparkles size={24} />
              </div>
              <h3 className="text-xl font-bold tracking-tight">AI Augmented</h3>
              <p className="text-zinc-500 font-medium leading-relaxed">Gemini-powered insights generate high-conversion hooks for every document in your archive.</p>
            </div>
            <div className="space-y-6">
              <div className="w-12 h-12 bg-zinc-900 rounded-xl flex items-center justify-center text-purple-500 border border-zinc-800">
                <div className="w-5 h-5 border-2 border-current rounded-sm rotate-12" />
              </div>
              <h3 className="text-xl font-bold tracking-tight">Spatial Physics</h3>
              <p className="text-zinc-500 font-medium leading-relaxed">Proprietary 3D rendering simulates real-world paper weight, friction, and surface illumination.</p>
            </div>
            <div className="space-y-6">
              <div className="w-12 h-12 bg-zinc-900 rounded-xl flex items-center justify-center text-orange-500 border border-zinc-800">
                <ArrowRight className="rotate-[-45deg]" size={24} />
              </div>
              <h3 className="text-xl font-bold tracking-tight">Enterprise Scale</h3>
              <p className="text-zinc-500 font-medium leading-relaxed">Built for massive PDF collections. Intelligent fuzzy search helps you find any page in milliseconds.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 px-10 border-t border-zinc-900 text-center">
        <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row justify-between items-center gap-8 text-sm font-bold tracking-widest uppercase text-zinc-600">
          <span>© 2025 Digital FlipBook</span>
          <div className="flex gap-10">
            <a href="#" className="hover:text-white transition-colors">Twitter</a>
            <a href="#" className="hover:text-white transition-colors">GitHub</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
