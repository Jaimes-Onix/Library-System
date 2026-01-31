
import React from 'react';
import { Theme } from '../types';
import {
  Zap,
  Library,
  Cloud,
  Shield,
  Eye,
  Sparkles,
  Cpu,
  Layers,
  MousePointer2,
  Smartphone,
  Scale,
  Search
} from 'lucide-react';

interface FeaturesPageProps {
  theme: Theme;
}

const FeaturesPage: React.FC<FeaturesPageProps> = ({ theme }) => {
  const isDark = theme === 'dark';

  const detailedFeatures = [
    {
      title: "Spatial 3D Flip Engine",
      subtitle: "The world's most immersive reading technology.",
      description: "Our proprietary 3D rendering engine utilizes hardware-accelerated CSS3 Matrix3D transforms to deliver buttery-smooth 60fps page transitions. We don't just 'slide' images; we simulate real-world paper physics including variable-drag resistance, dynamic surface lighting, and sub-pixel edge anti-aliasing. Every flip feels heavy, tactile, and physically grounded.",
      icon: Zap,
      color: "bg-blue-500",
      details: [
        "60FPS Hardware Acceleration",
        "Variable Drag-and-Flip Physics",
        "Dynamic Real-time Shadow Mapping",
        "Perspective-Correct 3D Warping"
      ]
    },
    {
      title: "Gemini-3 AI Librarian",
      subtitle: "Intelligent document understanding and curation.",
      description: "Integrated directly with Google's Gemini-3 architecture, our AI scans every uploaded PDF to understand its core intent. It automatically generates sophisticated executive hooks, precise semantic tags, and intelligent category suggestions. Your library doesn't just store files; it understands them, making discovery instantaneous.",
      icon: Sparkles,
      color: "bg-purple-600",
      details: [
        "Automated Marketing Hooks",
        "Semantic Category Suggestion",
        "Executive AI Summaries",
        "Metadata Context Extraction"
      ]
    },
    {
      title: "Vector-Perfect Precision",
      subtitle: "Zero-loss rendering for every document.",
      description: "Powered by an custom-tuned implementation of the PDF.js 4.4 kernel, our viewer preserves 100% of your document's fidelity. We support high-complexity vector paths, embedded CMYK profiles, and proprietary font character mapping (CMap). Whether at 100% or 500% zoom, your text remains razor-sharp and vector-perfect.",
      icon: Cpu,
      color: "bg-orange-500",
      details: [
        "4K High-DPI Support",
        "Full CMYK Color Preservation",
        "Vector Path Optimization",
        "Multi-layer Transparency Handling"
      ]
    },
    {
      title: "Adaptive Reading Viewports",
      subtitle: "Precision controls for focused consumption.",
      description: "Switch seamlessly between Immersive Preview—perfect for presentations—and Manual Focus for deep work. Our interface adapts dynamically to your hardware, offering 500% precision zoom, single-page portrait spreads, or double-page landscape spreads. Includes an ambient color-match engine that adjusts the background to reduce eye-fatigue.",
      icon: Eye,
      color: "bg-red-500",
      details: [
        "Precision 5X Optical Zoom",
        "Ambient Eye-Strain Reduction",
        "Manual & Auto-Preview Modes",
        "Landscape Spread Management"
      ]
    },
    {
      title: "Global Cloud Architecture",
      subtitle: "Persistent library access on every device.",
      description: "Built on a resilient cloud-sync backbone, your curated shelf follows you wherever you go. Metadata, favorites, custom categories, and even your current reading position are synchronized in real-time. Start reading on your desktop workstation and pick up exactly where you left off on your tablet or mobile device.",
      icon: Cloud,
      color: "bg-cyan-500",
      details: [
        "Real-time Position Sync",
        "Cross-Device Continuity",
        "Cloud-based Metadata Shelf",
        "Low-latency Data Retrieval"
      ]
    },
    {
      title: "Smart Shelf Intelligence",
      subtitle: "Professional-grade organization system.",
      description: "Transform a chaotic folder of PDFs into a curated digital bookshelf. Our Smart Cataloging system provides specialized shelves for Professional, Academic, Creative, and Personal works. Combined with an intelligent fuzzy-search index, finding the exact document you need takes milliseconds, not minutes.",
      icon: Library,
      color: "bg-indigo-500",
      details: [
        "Fuzzy-logic Document Search",
        "Multi-Category Cataloging",
        "Featured Hero Carousels",
      ],
    },
    {
      title: "Admin Super-Control",
      subtitle: "Total oversight with granular permissions.",
      description: "Empower your organization with a dedicated Admin Dashboard. View every user's digital bookshelf, manage access roles, audit upload logs, and oversee the entire library from a single, beautiful command center. You prefer a 'God Mode'? You got it.",
      icon: Shield,
      color: "bg-amber-500",
      details: [
        "Global User Management",
        "Universal Bookshelf View",
        "Role-Based Access Control",
        "Activity & Upload Auditing"
      ]
    }
  ];

  return (
    <div className={`w-full pb-40 ${isDark ? 'bg-black text-white' : 'bg-white text-gray-900'}`}>
      <div className="max-w-[1400px] mx-auto px-10">
        <div className="pt-32 mb-40 text-center animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <h1 className="text-7xl md:text-8xl font-black tracking-tight mb-8">
            Engineered for <span className="text-amber-500">Excellence.</span>
          </h1>
          <p className="text-xl md:text-2xl font-medium text-gray-500 max-w-3xl mx-auto leading-relaxed">
            Merging high-fidelity physics with premium aesthetics. A digital experience worthy of your content.
          </p>
        </div>

        {/* Feature Grid Section */}
        <div className="space-y-60">
          {detailedFeatures.map((feature, idx) => (
            <div key={idx} className={`flex flex-col lg:flex-row items-center gap-24 ${idx % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}>
              <div className="flex-1 space-y-10 animate-in fade-in duration-1000">
                <div>
                  <div className={`w-24 h-24 rounded-[32px] ${feature.color} text-white flex items-center justify-center mb-10 shadow-2xl shadow-amber-500/20`}>
                    <feature.icon size={48} strokeWidth={2.5} />
                  </div>
                  <h3 className="text-sm font-black text-amber-500 uppercase tracking-[0.3em] mb-4">{feature.subtitle}</h3>
                  <h2 className="text-5xl md:text-6xl font-black mb-8 tracking-tight leading-tight">{feature.title}</h2>
                  <p className="text-xl md:text-2xl font-medium text-gray-500 leading-relaxed mb-12">{feature.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-y-6 gap-x-8 pt-8 border-t border-gray-100 dark:border-white/5">
                  {feature.details.map((detail, dIdx) => (
                    <div key={dIdx} className="flex items-center gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                      <span className="text-sm font-bold tracking-tight opacity-70">{detail}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex-1 w-full aspect-square relative group">
                {/* Visual Representation Placeholder */}
                <div className={`absolute inset-0 rounded-[64px] ${isDark ? 'bg-zinc-900 shadow-none' : 'bg-gray-50 shadow-inner'} border border-gray-100 dark:border-white/5 overflow-hidden transition-transform duration-1000 group-hover:scale-[1.02]`}>
                  <div className="absolute inset-0 flex items-center justify-center opacity-10">
                    <Layers size={240} strokeWidth={0.5} />
                  </div>
                  <div className={`absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t ${isDark ? 'from-black/40' : 'from-gray-200/50'} to-transparent`} />

                  {/* Floating Mockup Element */}
                  <div className="absolute inset-0 flex items-center justify-center p-12">
                    <div className={`w-full aspect-[3/4.2] rounded-2xl shadow-2xl transition-all duration-1000 group-hover:rotate-y-[-15deg] flex flex-col overflow-hidden ${isDark ? 'bg-zinc-800' : 'bg-white'}`}>
                      <div className={`h-8 w-full border-b ${isDark ? 'bg-zinc-700/50 border-white/5' : 'bg-gray-100 border-gray-200'} flex items-center px-3 gap-1.5`}>
                        <div className="w-2 h-2 rounded-full bg-zinc-400" />
                        <div className="w-2 h-2 rounded-full bg-zinc-400" />
                        <div className="w-2 h-2 rounded-full bg-zinc-400" />
                      </div>
                      <div className="flex-1 flex gap-4 p-8">
                        <div className={`w-1/2 h-full rounded-lg ${isDark ? 'bg-zinc-700' : 'bg-gray-100 text-amber-500/10'}`} />
                        <div className="w-1/2 space-y-4">
                          <div className={`h-4 w-full rounded-full ${isDark ? 'bg-zinc-700' : 'bg-gray-100'}`} />
                          <div className={`h-4 w-3/4 rounded-full ${isDark ? 'bg-zinc-700' : 'bg-gray-100'}`} />
                          <div className={`h-4 w-1/2 rounded-full ${isDark ? 'bg-zinc-700' : 'bg-gray-100'}`} />
                        </div>
                      </div>
                      <div className="absolute inset-y-0 left-0 w-4 bg-black/10 backdrop-blur-[2px]" />
                    </div>
                  </div>
                </div>
                {/* Decorative background glow */}
                <div className={`absolute -inset-10 blur-[100px] -z-10 opacity-20 ${feature.color}`} />
              </div>
            </div>
          ))}
        </div>

        {/* Technical Capabilities Section */}
        <section className="mt-80 pt-40 border-t border-gray-100 dark:border-white/5">
          <div className="text-center mb-32">
            <h2 className="text-6xl font-black tracking-tight mb-8">Standard-Setting Performance.</h2>
            <p className="text-2xl font-medium text-gray-500 max-w-2xl mx-auto">Beneath the luxury interface lies a stack of high-performance technologies.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            {[
              { icon: MousePointer2, title: "Tactile Response", desc: "Interruptible animations allow for natural browsing speed." },
              { icon: Smartphone, title: "Mobile Optimized", desc: "First-class touch gesture support for iOS and Android tablets." },
              { icon: Scale, title: "Adaptive Layout", desc: "Dynamic page-scaling that respects your device aspect ratio." },
              { icon: Shield, title: "Secure Storage", desc: "End-to-end encryption for your private document archive." }
            ].map((cap, cIdx) => (
              <div key={cIdx} className="space-y-6">
                <div className="w-12 h-12 rounded-xl bg-gray-100 dark:bg-white/5 flex items-center justify-center text-amber-500">
                  <cap.icon size={24} />
                </div>
                <h4 className="text-xl font-black tracking-tight">{cap.title}</h4>
                <p className="text-gray-500 font-medium leading-relaxed">{cap.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </div>

      <section className="mt-60 py-40 px-10 text-center">
        <div className="max-w-4xl mx-auto bg-amber-500 rounded-[80px] p-24 text-white shadow-2xl relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-tr from-black/20 to-transparent pointer-events-none" />
          <h2 className="text-6xl font-black tracking-tight mb-12 relative z-10">Elevate your digital archive today.</h2>
          <button className="px-16 py-6 bg-black text-white rounded-[32px] text-xl font-black transition-all hover:scale-105 active:scale-95 shadow-xl relative z-10">
            Get Started for Free
          </button>
        </div>
      </section>
    </div>
  );
};

export default FeaturesPage;
