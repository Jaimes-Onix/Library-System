
import React, { useEffect, useRef, useCallback } from 'react';
import { ArrowRight, Upload, Brain, BookOpen, Lock, Search, Rocket } from 'lucide-react';
import { Theme } from '../types';

// Custom hook for scroll reveal using Intersection Observer
const useScrollReveal = () => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const children = el.querySelectorAll<HTMLElement>('[data-reveal]');

    // Set initial hidden state via inline styles (avoids CSS conflicts)
    children.forEach((child) => {
      const type = child.dataset.reveal || 'fade-up';
      child.style.opacity = '0';
      child.style.transition = 'opacity 0.8s cubic-bezier(0.16,1,0.3,1), transform 0.8s cubic-bezier(0.16,1,0.3,1)';
      if (type === 'fade-up') child.style.transform = 'translateY(50px)';
      else if (type === 'fade-left') child.style.transform = 'translateX(-50px)';
      else if (type === 'fade-right') child.style.transform = 'translateX(50px)';
      else if (type === 'zoom-in') child.style.transform = 'scale(0.9)';
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const target = entry.target as HTMLElement;
            const delay = target.dataset.revealDelay || '0';
            target.style.transitionDelay = `${delay}ms`;
            target.style.opacity = '1';
            target.style.transform = 'translateY(0) translateX(0) scale(1)';
            observer.unobserve(target);
          }
        });
      },
      { threshold: 0.05, rootMargin: '0px 0px -30px 0px' }
    );

    children.forEach((child) => observer.observe(child));

    return () => observer.disconnect();
  }, []);

  return ref;
};

interface HomeProps {
  theme: Theme;
  onStart: () => void;
  onViewExamples: () => void;
}

const Home: React.FC<HomeProps> = ({ theme, onStart, onViewExamples }) => {
  const isDark = theme === 'dark';
  const featuresRef = useScrollReveal();
  const ctaRef = useScrollReveal();

  return (
    <div className="w-full bg-[#0a0a0a] text-white selection:bg-orange-500 selection:text-white overflow-hidden">

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center px-6 md:px-16 py-32">
        {/* Background Gradient */}
        <div className="absolute inset-0 overflow-hidden -z-10">
          {/* Radial gradient - orange/red */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-radial from-orange-600/20 via-red-900/10 to-transparent blur-3xl" />

          {/* Noise texture overlay */}
          <div className="absolute inset-0 opacity-[0.015] bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxwYXRoIGQ9Ik0wIDBoMzAwdjMwMEgweiIgZmlsdGVyPSJ1cmwoI2EpIiBvcGFjaXR5PSIuMDUiLz48L3N2Zz4=')]" />
        </div>

        <div className="max-w-[1400px] mx-auto w-full">
          <div className="max-w-2xl">

            {/* Content */}
            <div className="space-y-10 animate-in fade-in slide-in-from-left-8 duration-1000">

              {/* Small badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm">
                <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
                <span className="text-xs font-bold tracking-wide text-gray-400">DIGITAL READING EXPERIENCE</span>
              </div>

              {/* Main Headline */}
              <div className="space-y-6">
                <h1 className="text-6xl md:text-8xl font-black tracking-tight leading-[0.9] text-white">
                  LIBRARY
                  <br />
                  <span className="bg-gradient-to-r from-orange-500 via-red-500 to-orange-600 bg-clip-text text-transparent">
                    SYSTEM
                  </span>
                </h1>
                <p className="text-xl md:text-2xl font-medium text-gray-400 max-w-xl leading-relaxed">
                  Transforming the way you access knowledge. A modern, digital reading experience for students and faculty.
                </p>
              </div>

              {/* CTAs */}
              <div className="flex flex-wrap gap-4">
                <button
                  onClick={onStart}
                  className="group px-8 py-4 rounded-full font-bold text-base transition-all duration-300 flex items-center gap-3 bg-white text-black hover:bg-gray-100 shadow-2xl shadow-orange-500/20 hover:shadow-orange-500/30 active:scale-95"
                >
                  GET STARTED
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </button>

                <button
                  onClick={onViewExamples}
                  className="px-8 py-4 rounded-full font-bold text-base transition-all bg-white/5 border border-white/10 hover:bg-white/10 backdrop-blur-sm active:scale-95"
                >
                  VIEW DEMO
                </button>
              </div>

              {/* Stats */}
              <div className="flex gap-12 pt-6 border-t border-white/10">
                <div>
                  <div className="text-3xl font-bold text-white">1000+</div>
                  <div className="text-sm text-gray-500">Documents</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-white">500+</div>
                  <div className="text-sm text-gray-500">Active Users</div>
                </div>
                <div>
                  <div className="text-3xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">100%</div>
                  <div className="text-sm text-gray-500">Secure</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section ref={featuresRef} className="py-32 px-6 md:px-16 bg-gradient-to-b from-transparent via-orange-500/5 to-transparent">
        <div className="max-w-[1400px] mx-auto">

          {/* Section Header */}
          <div className="text-center mb-20 space-y-4" data-reveal="fade-up" data-reveal-delay="0">
            <h2 className="text-5xl md:text-6xl font-black text-white">
              Powerful Features
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Everything you need to transform and manage your PDF library
            </p>
          </div>

          {/* Feature Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

            {/* Feature 1 */}
            <div data-reveal="fade-up" data-reveal-delay="100" className="group p-8 rounded-2xl border bg-white/5 border-white/10 hover:bg-white/10 hover:border-orange-500/50 transition-all duration-300">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg shadow-orange-500/50">
                <Upload className="text-white" size={24} />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-white">
                Lightning Fast
              </h3>
              <p className="text-gray-400 leading-relaxed">
                Upload PDFs in seconds with optimized processing and automatic cover generation.
              </p>
            </div>

            {/* Feature 2 */}
            <div data-reveal="fade-up" data-reveal-delay="200" className="group p-8 rounded-2xl border bg-white/5 border-white/10 hover:bg-white/10 hover:border-orange-500/50 transition-all duration-300">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg shadow-orange-500/50">
                <Brain className="text-white" size={24} />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-white">
                AI-Powered
              </h3>
              <p className="text-gray-400 leading-relaxed">
                Intelligent summaries and descriptions generated automatically using advanced AI.
              </p>
            </div>

            {/* Feature 3 */}
            <div data-reveal="fade-up" data-reveal-delay="300" className="group p-8 rounded-2xl border bg-white/5 border-white/10 hover:bg-white/10 hover:border-orange-500/50 transition-all duration-300">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg shadow-orange-500/50">
                <BookOpen className="text-white" size={24} />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-white">
                Beautiful Reader
              </h3>
              <p className="text-gray-400 leading-relaxed">
                Elegant flip-book interface with smooth animations and realistic page turns.
              </p>
            </div>

            {/* Feature 4 */}
            <div data-reveal="fade-up" data-reveal-delay="400" className="group p-8 rounded-2xl border bg-white/5 border-white/10 hover:bg-white/10 hover:border-orange-500/50 transition-all duration-300">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg shadow-orange-500/50">
                <Lock className="text-white" size={24} />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-white">
                Secure Storage
              </h3>
              <p className="text-gray-400 leading-relaxed">
                Your documents are encrypted and stored securely. Only you have access to your library.
              </p>
            </div>

            {/* Feature 5 */}
            <div data-reveal="fade-up" data-reveal-delay="500" className="group p-8 rounded-2xl border bg-white/5 border-white/10 hover:bg-white/10 hover:border-orange-500/50 transition-all duration-300">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg shadow-orange-500/50">
                <Search className="text-white" size={24} />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-white">
                Smart Organize
              </h3>
              <p className="text-gray-400 leading-relaxed">
                Custom categories with easy search and filtering to find what you need quickly.
              </p>
            </div>

            {/* Feature 6 */}
            <div data-reveal="fade-up" data-reveal-delay="600" className="group p-8 rounded-2xl border bg-white/5 border-white/10 hover:bg-white/10 hover:border-orange-500/50 transition-all duration-300">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg shadow-orange-500/50">
                <Rocket className="text-white" size={24} />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-white">
                Instant Loading
              </h3>
              <p className="text-gray-400 leading-relaxed">
                On-demand loading for instant library access. No waiting for large libraries.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section ref={ctaRef} className="py-32 px-6 md:px-16 relative">
        {/* Background glow */}
        <div className="absolute inset-0 bg-gradient-to-t from-orange-500/10 via-transparent to-transparent" />

        <div className="max-w-4xl mx-auto text-center space-y-8 relative z-10">
          <h2 data-reveal="fade-up" data-reveal-delay="0" className="text-5xl md:text-7xl font-black text-white">
            Ready to start?
          </h2>
          <p data-reveal="fade-up" data-reveal-delay="150" className="text-xl text-gray-400 max-w-2xl mx-auto">
            Join thousands transforming their PDF experience. Sign up today and upload your first document in seconds.
          </p>
          <div data-reveal="zoom-in" data-reveal-delay="300">
            <button
              onClick={onStart}
              className="group px-12 py-5 rounded-full font-bold text-lg transition-all duration-300 flex items-center gap-3 mx-auto bg-gradient-to-r from-orange-500 to-red-500 text-white hover:from-orange-600 hover:to-red-600 shadow-2xl shadow-orange-500/30 hover:shadow-orange-500/50 active:scale-95"
            >
              Start Free Today
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
