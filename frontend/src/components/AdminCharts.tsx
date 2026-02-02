
import React from 'react';
import { Theme } from '../types';

interface ChartProps {
    theme: Theme;
}

const isDark = (theme: Theme) => theme === 'dark';

export const StatCard: React.FC<{
    title: string;
    value: string;
    trend?: string;
    trendUp?: boolean;
    icon: React.ReactNode;
    color: string;
    theme: Theme;
}> = ({ title, value, trend, trendUp, icon, color, theme }) => (
    <div className={`p-6 rounded-[24px] relative overflow-hidden group transition-all duration-300 hover:-translate-y-1 ${isDark(theme) ? 'bg-[#1C1C1E] border border-white/5' : 'bg-white border border-gray-100 shadow-xl'
        }`}>
        <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${color} opacity-10 rounded-bl-[100px] transition-transform group-hover:scale-110`} />

        <div className="flex items-start justify-between mb-4">
            <div className={`p-3 rounded-2xl ${isDark(theme) ? 'bg-white/5 text-white' : 'bg-gray-50 text-gray-900'
                }`}>
                {icon}
            </div>
            {trend && (
                <span className={`text-xs font-bold px-2 py-1 rounded-full ${trendUp ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'
                    }`}>
                    {trend}
                </span>
            )}
        </div>

        <h3 className={`text-3xl font-black tracking-tighter mb-1 ${isDark(theme) ? 'text-white' : 'text-gray-900'}`}>
            {value}
        </h3>
        <p className={`text-xs font-bold uppercase tracking-widest ${isDark(theme) ? 'text-gray-500' : 'text-gray-400'}`}>
            {title}
        </p>
    </div>
);

export const BarChart: React.FC<ChartProps> = ({ theme }) => {
    const data = [40, 70, 45, 90, 60, 80, 50, 70, 65, 85, 95, 75];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const max = Math.max(...data);

    return (
        <div className={`p-8 rounded-[32px] w-full h-[350px] flex flex-col ${isDark(theme) ? 'bg-[#1C1C1E]' : 'bg-white shadow-xl'
            }`}>
            <div className="flex justify-between items-center mb-8">
                <h3 className={`text-lg font-bold ${isDark(theme) ? 'text-white' : 'text-gray-900'}`}>Monthly Rentals</h3>
                <div className="flex gap-2">
                    {[2024, 2025].map(y => (
                        <span key={y} className={`text-xs font-bold px-3 py-1 rounded-full cursor-pointer ${y === 2025 ? 'bg-orange-600 text-white' : (isDark(theme) ? 'bg-white/5 text-gray-500' : 'bg-gray-100 text-gray-400')
                            }`}>{y}</span>
                    ))}
                </div>
            </div>

            <div className="flex-1 flex items-end justify-between gap-2 px-2">
                {data.map((h, i) => (
                    <div key={i} className="flex flex-col items-center gap-2 group w-full">
                        <div className="w-full relative h-[200px] flex items-end rounded-t-lg bg-transparent hover:bg-white/5 transition-colors">
                            <div
                                style={{ height: `${(h / max) * 100}%` }}
                                className={`w-full mx-auto rounded-t-lg transition-all duration-500 group-hover:opacity-80 relative ${
                                    // Varied colors based on height nicely
                                    h > 80 ? 'bg-gradient-to-t from-orange-600 to-amber-400' :
                                        h > 60 ? 'bg-gradient-to-t from-orange-700 to-orange-500' :
                                            'bg-gradient-to-t from-red-800 to-orange-700'
                                    }`}
                            >
                                {/* Tooltip */}
                                <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-black text-white text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                    {h}k
                                </div>
                            </div>
                        </div>
                        <span className={`text-[10px] font-bold uppercase tracking-wider ${isDark(theme) ? 'text-gray-500' : 'text-gray-400'}`}>
                            {months[i]}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export const DonutChart: React.FC<ChartProps> = ({ theme }) => {
    // Categories: Professional, Academic, Personal, Creative
    const segments = [
        { label: 'Professional', value: 35, color: '#F97316' }, // Orange
        { label: 'Academic', value: 45, color: '#EA580C' },     // Dark Orange
        { label: 'Personal', value: 15, color: '#FB923C' },     // Light Orange
        { label: 'Creative', value: 5, color: '#FDBA74' },      // Pale Orange
    ];

    const total = segments.reduce((sum, s) => sum + s.value, 0);
    let currentAngle = 0;

    return (
        <div className={`p-8 rounded-[32px] w-full h-[350px] flex flex-col relative overflow-hidden ${isDark(theme) ? 'bg-[#1C1C1E]' : 'bg-white shadow-xl'
            }`}>
            <h3 className={`text-lg font-bold mb-4 ${isDark(theme) ? 'text-white' : 'text-gray-900'}`}>Popular Categories</h3>

            <div className="flex-1 flex items-center justify-center relative">
                <svg viewBox="0 0 100 100" className="w-48 h-48 -rotate-90 transform">
                    {segments.map((seg, i) => {
                        const angle = (seg.value / total) * 360;
                        const dashArray = `${(angle / 360) * 251.2} 251.2`; // 2 * PI * r (r=40) ≈ 251.2
                        const offset = -((currentAngle / 360) * 251.2);
                        currentAngle += angle;

                        return (
                            <circle
                                key={i}
                                cx="50"
                                cy="50"
                                r="40"
                                fill="transparent"
                                stroke={seg.color}
                                strokeWidth="12"
                                strokeDasharray={dashArray}
                                strokeDashoffset={offset}
                                strokeLinecap="round"
                                className="transition-all duration-1000 ease-out hover:stroke-width-[14]"
                            />
                        );
                    })}
                </svg>
                {/* Center Text */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className={`text-3xl font-black ${isDark(theme) ? 'text-white' : 'text-gray-900'}`}>
                        {total}%
                    </span>
                    <span className={`text-[9px] font-bold uppercase tracking-widest ${isDark(theme) ? 'text-gray-500' : 'text-gray-400'}`}>
                        Engaged
                    </span>
                </div>
            </div>

            <div className="flex justify-center gap-4 mt-4">
                {segments.map(seg => (
                    <div key={seg.label} className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: seg.color }} />
                        <span className={`text-[10px] font-bold uppercase ${isDark(theme) ? 'text-gray-400' : 'text-gray-500'}`}>
                            {seg.label}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export const LineChart: React.FC<ChartProps> = ({ theme }) => {
    // Generate a sleek curve
    const points = [20, 45, 30, 60, 55, 80, 65, 90, 85, 100];
    const max = 100;
    const width = 100;
    const height = 40;

    // Create SVG path
    const pathD = points.map((val, i) => {
        const x = (i / (points.length - 1)) * width;
        const y = height - ((val / max) * height);
        return `${i === 0 ? 'M' : 'L'} ${x},${y}`;
    }).join(' ');

    return (
        <div className={`p-8 rounded-[32px] w-full flex flex-col justify-between relative overflow-hidden ${isDark(theme) ? 'bg-[#1C1C1E]' : 'bg-white shadow-xl'
            }`}>
            <div className="flex justify-between items-end mb-6 relative z-10">
                <div>
                    <h3 className={`text-lg font-bold mb-1 ${isDark(theme) ? 'text-white' : 'text-gray-900'}`}>Activity Growth</h3>
                    <div className="flex items-center gap-2">
                        <span className="text-3xl font-black text-orange-500">+36.7%</span>
                        <span className={`text-xs font-bold ${isDark(theme) ? 'text-gray-500' : 'text-gray-400'}`}>vs. last month</span>
                    </div>
                </div>
            </div>

            {/* Chart Area */}
            <div className="relative h-24 w-full">
                <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible" preserveAspectRatio="none">
                    {/* Gradient Fill */}
                    <defs>
                        <linearGradient id="lineGap" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#F97316" stopOpacity="0.3" />
                            <stop offset="100%" stopColor="#F97316" stopOpacity="0" />
                        </linearGradient>
                    </defs>
                    <path d={`${pathD} L ${width},${height} L 0,${height} Z`} fill="url(#lineGap)" />

                    {/* Line */}
                    <path d={pathD} fill="none" stroke="#F97316" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />

                    {/* Points */}
                    {points.map((val, i) => {
                        const x = (i / (points.length - 1)) * width;
                        const y = height - ((val / max) * height);
                        return (
                            <circle key={i} cx={x} cy={y} r="1.5" fill="#F97316" className="transition-all hover:r-3" />
                        );
                    })}
                </svg>
            </div>
        </div>
    )
}
