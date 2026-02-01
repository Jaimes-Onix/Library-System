
import React from 'react';
import { Theme } from '../types';
import { Sparkles, BookOpen } from 'lucide-react';

interface ExamplesPageProps {
  theme: Theme;
  onSelectSample: () => void;
}

const ExamplesPage: React.FC<ExamplesPageProps> = ({ theme, onSelectSample }) => {
  const isDark = theme === 'dark';

  const samples = [
    { title: 'Modern Architecture', category: 'Creative', cover: 'https://images.unsplash.com/photo-1518005020481-a68515605039?w=800&auto=format&fit=crop', pages: 42 },
    { title: 'Global Economy 2024', category: 'Professional', cover: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=800&auto=format&fit=crop', pages: 128 },
    { title: 'Quantum Physics Intro', category: 'Academic', cover: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&auto=format&fit=crop', pages: 84 },
    { title: 'Travel Journal: Japan', category: 'Personal', cover: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&auto=format&fit=crop', pages: 36 },
  ];

  return (
    <div className={`w-full pb-32 ${isDark ? 'bg-black text-white' : 'bg-white text-gray-900'}`}>
      <div className="max-w-[1400px] mx-auto px-10">
        <div className="pt-32 mb-20 text-center">
          <h1 className="text-6xl font-black tracking-tight mb-6">See Digital Books in Action</h1>
          <p className="text-xl font-medium text-gray-500 max-w-2xl mx-auto">Explore interactive flipbook examples created on our platform and feel the smoothness of our rendering engine.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
          {samples.map((sample, idx) => (
            <div
              key={idx}
              className="group cursor-pointer"
              onClick={onSelectSample}
            >
              <div className="aspect-[3/4.2] rounded-[24px] overflow-hidden mb-6 shadow-[0_20px_40px_-10px_rgba(0,0,0,0.2)] border border-gray-100 dark:border-white/5 transition-all duration-500 group-hover:-translate-y-4 group-hover:shadow-[0_60px_100px_-20px_rgba(0,0,0,0.4)]">
                <img src={sample.cover} className="w-full h-full object-cover" alt={sample.title} />
              </div>
              <div className="px-2">
                <span className={`text-[10px] font-black uppercase tracking-widest py-1.5 px-3 rounded-full mb-3 inline-block ${isDark ? 'bg-white/5 text-gray-400' : 'bg-gray-100 text-gray-500'}`}>
                  {sample.category}
                </span>
                <h3 className="text-xl font-black mb-2 tracking-tight group-hover:text-orange-500 transition-colors">{sample.title}</h3>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{sample.pages} Pages</p>
              </div>
            </div>
          ))}
        </div>

        <div className={`mt-40 p-16 rounded-[56px] flex flex-col items-center text-center ${isDark ? 'bg-zinc-950 border border-white/5' : 'bg-gray-50 border border-gray-100'}`}>
          <Sparkles className="text-orange-500 mb-8" size={48} />
          <h2 className="text-4xl font-black mb-6 tracking-tight">Perfect for Any Type of Content</h2>
          <p className="text-lg font-medium text-gray-500 max-w-3xl leading-relaxed">
            From academic materials and reports to portfolios and creative publications, Library System transforms any document into an interactive reading experience that captures attention.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ExamplesPage;
