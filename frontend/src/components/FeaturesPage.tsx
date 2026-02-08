
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
  Search,
  BookOpen,
  Brain,
  ZoomIn,
  Monitor,
  RefreshCw,
  FolderOpen,
  Users,
  BarChart3,
  FileText,
  Star,
  Wifi
} from 'lucide-react';

interface FeaturesPageProps {
  theme: Theme;
}

const FeaturesPage: React.FC<FeaturesPageProps> = ({ theme }) => {
  const isDark = theme === 'dark';

  const detailedFeatures = [
    {
      title: "Student Handbook",
      subtitle: "Instant access to institutional guidelines.",
      description: "A specialized digital guide for students. Easily search for rules, regulations, and academic policies. Always up-to-date and accessible from any device, ensuring students stay informed about their rights and responsibilities.",
      icon: Library,
      color: "bg-orange-600",
      details: [
        "Searchable Policy Database",
        "Bookmark Critical Sections",
        "Offline Access Support",
        "Institutional Guidelines"
      ]
    },
    {
      title: "Spatial 3D Flip Engine",
      subtitle: "The world's most immersive reading technology.",
      description: "Our proprietary 3D rendering engine utilizes hardware-accelerated CSS3 Matrix3D transforms to deliver buttery-smooth 60fps page transitions. We don't just 'slide' images; we simulate real-world paper physics including variable-drag resistance, dynamic surface lighting, and sub-pixel edge anti-aliasing.",
      icon: Zap,
      color: "bg-red-500",
      details: [
        "60FPS Hardware Acceleration",
        "Variable Drag-and-Flip Physics",
        "Dynamic Real-time Shadow Mapping",
      ]
    },
    {
      title: "Gemini-3 AI Librarian",
      subtitle: "Intelligent document understanding and curation.",
      description: "Integrated directly with Google's Gemini-3 architecture, our AI scans every uploaded PDF to understand its core intent. It automatically generates sophisticated executive hooks, precise semantic tags, and intelligent category suggestions.",
      icon: Sparkles,
      color: "bg-amber-500",
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
      description: "Powered by an custom-tuned implementation of the PDF.js 4.4 kernel, our viewer preserves 100% of your document's fidelity. We support high-complexity vector paths, embedded CMYK profiles, and proprietary font character mapping (CMap).",
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
      description: "Switch seamlessly between Immersive Preview—perfect for presentations—and Manual Focus for deep work. Our interface adapts dynamically to your hardware, offering 500% precision zoom, single-page portrait spreads, or double-page landscape spreads.",
      icon: Eye,
      color: "bg-red-600",
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
      description: "Built on a resilient cloud-sync backbone, your curated shelf follows you wherever you go. Metadata, favorites, custom categories, and even your current reading position are synchronized in real-time.",
      icon: Cloud,
      color: "bg-amber-600",
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
      description: "Transform a chaotic folder of PDFs into a curated digital bookshelf. Our Smart Cataloging system provides specialized shelves for Professional, Academic, Creative, and Personal works.",
      icon: Library,
      color: "bg-orange-700",
      details: [
        "Fuzzy-logic Document Search",
        "Multi-Category Cataloging",
        "Featured Hero Carousels",
      ],
    },
    {
      title: "Admin Super-Control",
      subtitle: "Total oversight with granular permissions.",
      description: "Empower your organization with a dedicated Admin Dashboard. View every user's digital bookshelf, manage access roles, audit upload logs, and oversee the entire library from a single, beautiful command center.",
      icon: Shield,
      color: "bg-red-700",
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
            Library <span className="text-orange-500">System.</span>
          </h1>
          <p className="text-xl md:text-2xl font-medium text-gray-500 max-w-3xl mx-auto leading-relaxed">
            A comprehensive digital reading and management platform for students and faculty.
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
                <div className={`absolute inset-0 rounded-[64px] ${isDark ? 'bg-zinc-900 shadow-none' : 'bg-gray-50 shadow-inner'} border border-gray-100 dark:border-white/5 overflow-hidden transition-transform duration-1000 group-hover:scale-[1.02]`}>
                  <div className={`absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t ${isDark ? 'from-black/60' : 'from-gray-200/50'} to-transparent z-10`} />

                  {/* Unique visual per feature */}
                  <div className="absolute inset-0 flex items-center justify-center p-6">
                    {idx === 0 && (
                      /* Student Handbook - Open book with search */
                      <div className="relative w-full h-full flex items-center justify-center animate-float-slow">
                        <div className={`w-[85%] h-[85%] rounded-2xl shadow-2xl flex flex-col overflow-hidden ${isDark ? 'bg-zinc-800' : 'bg-white'}`}>
                          <div className={`px-6 py-4 border-b ${isDark ? 'bg-zinc-700/50 border-white/5' : 'bg-gray-100 border-gray-200'} flex items-center gap-3`}>
                            <Search size={18} className="text-orange-500" />
                            <div className={`flex-1 h-4 rounded-full ${isDark ? 'bg-zinc-600' : 'bg-gray-200'}`} />
                          </div>
                          <div className="flex-1 p-8 space-y-5">
                            <div className="flex items-center gap-3 mb-6">
                              <BookOpen size={22} className="text-orange-500" />
                              <div className={`h-5 w-40 rounded-full ${isDark ? 'bg-zinc-700' : 'bg-gray-200'}`} />
                            </div>
                            {[1, 0.85, 0.7, 1, 0.6, 0.9, 0.75, 0.65, 0.95].map((w, i) => (
                              <div key={i} className={`h-3 rounded-full ${isDark ? 'bg-zinc-700' : 'bg-gray-100'} animate-shimmer`} style={{ width: `${w * 100}%`, animationDelay: `${i * 0.2}s` }} />
                            ))}
                            <div className="pt-6 flex gap-3">
                              <div className="px-4 py-2 rounded-full bg-orange-500/20 text-orange-500 text-xs font-bold animate-pulse-glow">Chapter 3</div>
                              <div className={`px-4 py-2 rounded-full text-xs font-bold ${isDark ? 'bg-zinc-700 text-zinc-400' : 'bg-gray-100 text-gray-400'}`}>Bookmarked</div>
                              <div className={`px-4 py-2 rounded-full text-xs font-bold ${isDark ? 'bg-zinc-700 text-zinc-400' : 'bg-gray-100 text-gray-400'}`}>Highlighted</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    {idx === 1 && (
                      /* 3D Flip Engine - Stacked pages with perspective */
                      <div className="relative w-full h-full flex items-center justify-center animate-float" style={{ perspective: '1000px' }}>
                        {[3, 2, 1, 0].map((i) => (
                          <div key={i} className={`absolute w-[65%] aspect-[3/4] rounded-2xl shadow-2xl ${isDark ? 'bg-zinc-800 border-white/5' : 'bg-white border-gray-200'} border transition-transform duration-[2s]`}
                            style={{
                              transform: `rotateY(${i * -10}deg) translateX(${i * 28}px) translateZ(${i * -40}px)`,
                              zIndex: 4 - i,
                              opacity: 1 - i * 0.12,
                              animation: i === 0 ? 'none' : undefined
                            }}>
                            <div className="p-6 space-y-4 h-full flex flex-col">
                              <div className={`h-[60%] rounded-xl ${isDark ? 'bg-zinc-700' : 'bg-gray-100'} flex items-center justify-center`}>
                                <FileText size={40} className={`${isDark ? 'text-zinc-600' : 'text-gray-300'}`} />
                              </div>
                              <div className={`h-3 w-3/4 rounded-full ${isDark ? 'bg-zinc-700' : 'bg-gray-200'}`} />
                              <div className={`h-3 w-1/2 rounded-full ${isDark ? 'bg-zinc-700' : 'bg-gray-200'}`} />
                            </div>
                          </div>
                        ))}
                        <div className="absolute bottom-6 right-6 px-4 py-2 rounded-full bg-red-500/20 text-red-400 text-xs font-bold flex items-center gap-2 animate-pulse z-10">
                          <Zap size={14} /> 60 FPS
                        </div>
                      </div>
                    )}
                    {idx === 2 && (
                      /* AI Librarian - AI analysis interface */
                      <div className="relative w-full h-full flex items-center justify-center animate-float-slow">
                        <div className={`w-[90%] h-[80%] rounded-2xl shadow-2xl flex flex-col overflow-hidden ${isDark ? 'bg-zinc-800' : 'bg-white'}`}>
                          <div className={`px-5 py-3 border-b ${isDark ? 'bg-zinc-700/50 border-white/5' : 'bg-gray-100 border-gray-200'} flex items-center gap-3`}>
                            <Brain size={18} className="text-amber-500 animate-pulse" />
                            <span className="text-xs font-bold text-amber-500">AI ANALYSIS</span>
                            <div className="ml-auto flex gap-1">
                              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                              <span className={`text-[9px] font-bold ${isDark ? 'text-zinc-500' : 'text-gray-400'}`}>LIVE</span>
                            </div>
                          </div>
                          <div className="flex-1 p-6 flex gap-5">
                            <div className="w-1/2 space-y-4">
                              <div className={`h-32 rounded-xl ${isDark ? 'bg-zinc-700' : 'bg-gray-100'} flex items-center justify-center`}>
                                <FileText size={36} className={`${isDark ? 'text-zinc-600' : 'text-gray-300'}`} />
                              </div>
                              {[0.9, 0.7, 0.85, 0.6].map((w, i) => (
                                <div key={i} className={`h-2.5 rounded-full ${isDark ? 'bg-zinc-700' : 'bg-gray-200'} animate-shimmer`} style={{ width: `${w * 100}%`, animationDelay: `${i * 0.3}s` }} />
                              ))}
                            </div>
                            <div className="w-1/2 space-y-3">
                              <div className="px-3 py-2 rounded-lg bg-amber-500/20 text-amber-500 text-[11px] font-bold animate-slide-in-right" style={{ animationDelay: '0.2s' }}>CATEGORY: Academic</div>
                              <div className="px-3 py-2 rounded-lg bg-green-500/20 text-green-500 text-[11px] font-bold animate-slide-in-right" style={{ animationDelay: '0.4s' }}>SENTIMENT: Informative</div>
                              <div className="px-3 py-2 rounded-lg bg-blue-500/20 text-blue-400 text-[11px] font-bold animate-slide-in-right" style={{ animationDelay: '0.6s' }}>CONFIDENCE: 97%</div>
                              <div className={`mt-4 p-3 rounded-xl text-[11px] leading-relaxed ${isDark ? 'bg-zinc-700 text-zinc-400' : 'bg-gray-100 text-gray-500'}`}>
                                "A comprehensive guide exploring modern approaches to..."
                              </div>
                              <div className="flex gap-2 mt-3 flex-wrap">
                                {['PDF', 'Research', 'Guide', 'Academic'].map((tag, i) => (
                                  <span key={tag} className={`px-2 py-1 rounded-lg text-[10px] font-bold animate-scale-in ${isDark ? 'bg-zinc-700 text-zinc-400' : 'bg-gray-200 text-gray-500'}`} style={{ animationDelay: `${0.8 + i * 0.15}s` }}>{tag}</span>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                        <Sparkles size={24} className="absolute top-8 right-12 text-amber-500 animate-pulse" />
                        <Sparkles size={18} className="absolute bottom-12 left-8 text-amber-400 animate-pulse" style={{ animationDelay: '1s' }} />
                        <Sparkles size={16} className="absolute top-20 left-16 text-amber-300 animate-pulse" style={{ animationDelay: '2s' }} />
                      </div>
                    )}
                    {idx === 3 && (
                      /* Vector Precision - Document with zoom */
                      <div className="relative w-full h-full flex items-center justify-center animate-float-slow">
                        <div className={`w-[75%] h-[85%] rounded-2xl shadow-2xl overflow-hidden ${isDark ? 'bg-zinc-800' : 'bg-white'}`}>
                          <div className="p-8 space-y-4 h-full">
                            <div className={`h-4 w-3/4 rounded-full ${isDark ? 'bg-zinc-700' : 'bg-gray-200'}`} />
                            <div className={`h-4 w-full rounded-full ${isDark ? 'bg-zinc-700' : 'bg-gray-200'}`} />
                            <div className={`h-4 w-5/6 rounded-full ${isDark ? 'bg-zinc-700' : 'bg-gray-200'}`} />
                            <div className={`h-28 w-full rounded-xl mt-6 ${isDark ? 'bg-zinc-700' : 'bg-gray-100'} flex items-center justify-center`}>
                              <div className="w-24 h-16 rounded-lg border-2 border-dashed border-orange-500/40 flex items-center justify-center">
                                <span className="text-xs text-orange-500 font-bold">SVG</span>
                              </div>
                            </div>
                            {[0.9, 0.7, 1, 0.6, 0.8, 0.95, 0.55].map((w, i) => (
                              <div key={i} className={`h-3 rounded-full ${isDark ? 'bg-zinc-700' : 'bg-gray-200'}`} style={{ width: `${w * 100}%` }} />
                            ))}
                          </div>
                        </div>
                        {/* Zoom circle - animated */}
                        <div className="absolute bottom-10 right-8 w-36 h-36 rounded-full border-4 border-orange-500 bg-black/70 backdrop-blur-md flex items-center justify-center overflow-hidden animate-pulse-glow">
                          <div className="space-y-2 scale-[2.5]">
                            <div className="h-1 w-12 rounded-full bg-white/60" />
                            <div className="h-1 w-10 rounded-full bg-white/60" />
                            <div className="h-1 w-14 rounded-full bg-white/60" />
                          </div>
                          <ZoomIn size={20} className="absolute bottom-2 right-2 text-orange-500" />
                        </div>
                        <div className="absolute top-8 right-8 px-3 py-1.5 rounded-lg bg-orange-500/20 text-orange-500 text-xs font-bold animate-pulse">4K RENDER</div>
                      </div>
                    )}
                    {idx === 4 && (
                      /* Adaptive Viewports - Multiple view modes */
                      <div className="relative w-full h-full flex items-center justify-center gap-6">
                        {/* Desktop view */}
                        <div className={`w-[60%] aspect-[4/3] rounded-2xl shadow-2xl overflow-hidden ${isDark ? 'bg-zinc-800 border-white/5' : 'bg-white border-gray-200'} border animate-float-slow`}>
                          <div className={`h-7 border-b ${isDark ? 'bg-zinc-700/50 border-white/5' : 'bg-gray-100 border-gray-200'} flex items-center px-3 gap-1.5`}>
                            <div className="w-2 h-2 rounded-full bg-red-400" />
                            <div className="w-2 h-2 rounded-full bg-yellow-400" />
                            <div className="w-2 h-2 rounded-full bg-green-400" />
                          </div>
                          <div className="flex h-[calc(100%-28px)]">
                            <div className={`w-1/2 h-full ${isDark ? 'bg-zinc-700' : 'bg-gray-100'} m-3 rounded-lg`} />
                            <div className={`w-1/2 h-full ${isDark ? 'bg-zinc-700' : 'bg-gray-100'} m-3 rounded-lg`} />
                          </div>
                        </div>
                        {/* Phone view */}
                        <div className={`w-[25%] aspect-[9/16] rounded-2xl shadow-2xl overflow-hidden ${isDark ? 'bg-zinc-800 border-white/5' : 'bg-white border-gray-200'} border animate-float`} style={{ animationDelay: '1s' }}>
                          <div className={`h-5 ${isDark ? 'bg-zinc-700/50' : 'bg-gray-100'} flex items-center justify-center`}>
                            <div className="w-8 h-1.5 rounded-full bg-zinc-500" />
                          </div>
                          <div className={`mx-3 my-3 flex-1 h-[80%] rounded-lg ${isDark ? 'bg-zinc-700' : 'bg-gray-100'}`} />
                        </div>
                        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3 z-10">
                          <div className="px-3 py-1.5 rounded-lg bg-red-500/20 text-red-400 text-[11px] font-bold flex items-center gap-1.5"><Monitor size={12} /> Desktop</div>
                          <div className="px-3 py-1.5 rounded-lg bg-red-500/20 text-red-400 text-[11px] font-bold flex items-center gap-1.5"><Smartphone size={12} /> Mobile</div>
                        </div>
                      </div>
                    )}
                    {idx === 5 && (
                      /* Cloud Architecture - Devices syncing to cloud */
                      <div className="relative w-full h-full flex flex-col items-center justify-center gap-8">
                        {/* Cloud icon */}
                        <div className={`w-28 h-28 rounded-3xl flex items-center justify-center ${isDark ? 'bg-zinc-800' : 'bg-gray-100'} shadow-xl animate-float-slow animate-pulse-glow`}>
                          <Cloud size={52} className="text-amber-500" />
                        </div>
                        {/* Sync lines */}
                        <div className="flex items-center gap-4">
                          <RefreshCw size={18} className="text-amber-500 animate-spin" style={{ animationDuration: '3s' }} />
                          <span className={`text-sm font-bold ${isDark ? 'text-zinc-500' : 'text-gray-400'}`}>SYNCING...</span>
                          <Wifi size={18} className="text-green-500 animate-pulse" />
                        </div>
                        {/* Devices */}
                        <div className="flex gap-8">
                          {[
                            { icon: Monitor, label: 'Desktop' },
                            { icon: Smartphone, label: 'Mobile' },
                            { icon: Layers, label: 'Tablet' },
                          ].map((d, i) => (
                            <div key={i} className={`flex flex-col items-center gap-3 p-5 rounded-2xl animate-float ${isDark ? 'bg-zinc-800' : 'bg-gray-100'} shadow-lg`} style={{ animationDelay: `${i * 0.5}s` }}>
                              <d.icon size={32} className={`${isDark ? 'text-zinc-400' : 'text-gray-400'}`} />
                              <span className={`text-[11px] font-bold ${isDark ? 'text-zinc-500' : 'text-gray-400'}`}>{d.label}</span>
                              <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    {idx === 6 && (
                      /* Smart Shelf - Bookshelf grid */
                      <div className="relative w-full h-full flex items-center justify-center animate-float-slow">
                        <div className={`w-[90%] h-[85%] rounded-2xl shadow-2xl overflow-hidden ${isDark ? 'bg-zinc-800' : 'bg-white'}`}>
                          <div className={`px-5 py-3 border-b ${isDark ? 'bg-zinc-700/50 border-white/5' : 'bg-gray-100 border-gray-200'} flex items-center justify-between`}>
                            <div className="flex items-center gap-2">
                              <FolderOpen size={16} className="text-orange-500" />
                              <span className="text-xs font-bold text-orange-500">MY LIBRARY</span>
                            </div>
                            <Search size={16} className={`${isDark ? 'text-zinc-500' : 'text-gray-400'}`} />
                          </div>
                          <div className="p-4 flex gap-2 overflow-hidden">
                            {['All', 'Academic', 'Personal', 'Creative'].map((cat, i) => (
                              <div key={cat} className={`px-3 py-1.5 rounded-full text-[10px] font-bold whitespace-nowrap ${i === 0 ? 'bg-orange-500 text-white' : isDark ? 'bg-zinc-700 text-zinc-400' : 'bg-gray-100 text-gray-500'}`}>{cat}</div>
                            ))}
                          </div>
                          <div className="px-4 pb-4 grid grid-cols-3 gap-3">
                            {[0, 1, 2, 3, 4, 5].map((i) => (
                              <div key={i} className={`aspect-[3/4] rounded-xl ${isDark ? 'bg-zinc-700' : 'bg-gray-100'} flex flex-col items-center justify-center gap-2 transition-transform hover:scale-105 animate-scale-in`} style={{ animationDelay: `${i * 0.1}s` }}>
                                <BookOpen size={20} className={`${isDark ? 'text-zinc-500' : 'text-gray-300'}`} />
                                <div className={`h-1.5 w-12 rounded-full ${isDark ? 'bg-zinc-600' : 'bg-gray-200'}`} />
                                {i < 2 && <Star size={12} className="text-orange-500 fill-orange-500" />}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                    {idx === 7 && (
                      /* Admin Dashboard - Charts and user list */
                      <div className="relative w-full h-full flex items-center justify-center animate-float-slow">
                        <div className={`w-[92%] h-[85%] rounded-2xl shadow-2xl overflow-hidden ${isDark ? 'bg-zinc-800' : 'bg-white'}`}>
                          <div className={`px-5 py-3 border-b ${isDark ? 'bg-zinc-700/50 border-white/5' : 'bg-gray-100 border-gray-200'} flex items-center gap-2`}>
                            <Shield size={16} className="text-red-500" />
                            <span className="text-xs font-bold text-red-500">ADMIN PANEL</span>
                            <div className="ml-auto w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                          </div>
                          <div className="flex h-[calc(100%-36px)]">
                            {/* Sidebar */}
                            <div className={`w-1/4 border-r p-3 space-y-2 ${isDark ? 'border-white/5' : 'border-gray-200'}`}>
                              {['Dashboard', 'Users', 'Books', 'Settings'].map((item, i) => (
                                <div key={item} className={`px-3 py-2 rounded-lg text-[10px] font-bold ${i === 0 ? 'bg-red-500/20 text-red-500' : isDark ? 'text-zinc-500 hover:bg-zinc-700/50' : 'text-gray-400 hover:bg-gray-100'} transition-colors`}>{item}</div>
                              ))}
                            </div>
                            {/* Content */}
                            <div className="flex-1 p-4 space-y-4">
                              {/* Stats row */}
                              <div className="flex gap-3">
                                {[
                                  { label: 'Users', val: '127', icon: Users },
                                  { label: 'Books', val: '843', icon: BookOpen },
                                  { label: 'Active', val: '89%', icon: BarChart3 },
                                ].map((s, i) => (
                                  <div key={s.label} className={`flex-1 p-3 rounded-xl ${isDark ? 'bg-zinc-700' : 'bg-gray-100'} animate-scale-in`} style={{ animationDelay: `${i * 0.15}s` }}>
                                    <s.icon size={14} className={`mb-1 ${isDark ? 'text-zinc-500' : 'text-gray-400'}`} />
                                    <div className={`text-base font-black ${isDark ? 'text-white' : 'text-gray-900'}`}>{s.val}</div>
                                    <div className={`text-[9px] ${isDark ? 'text-zinc-500' : 'text-gray-400'}`}>{s.label}</div>
                                  </div>
                                ))}
                              </div>
                              {/* Chart bars */}
                              <div className={`flex items-end gap-1.5 h-20 p-3 rounded-xl ${isDark ? 'bg-zinc-700' : 'bg-gray-100'}`}>
                                {[40, 65, 45, 80, 55, 70, 90, 60, 75, 85, 50, 95].map((h, i) => (
                                  <div key={i} className="flex-1 rounded-t bg-gradient-to-t from-red-500 to-orange-400 transition-all" style={{ height: `${h}%`, animationDelay: `${i * 0.1}s` }} />
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                {/* Decorative background glow */}
                <div className={`absolute -inset-10 blur-[100px] -z-10 opacity-30 ${feature.color}`} />
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
