
import React, { useEffect, useState } from 'react';
import { UserProfile, Theme } from '../types';
import {
    Users,
    BookOpen,
    Search,
    Loader2,
    Bell,
    Settings,
    Menu,
    Book,
    AlertCircle,
    Activity
} from 'lucide-react';
import AdminSidebar from './AdminSidebar';
import { BarChart, DonutChart, LineChart, StatCard } from './AdminCharts';
import AccountSettingsModal from './AccountSettingsModal';

interface AdminDashboardProps {
    theme: Theme;
    onExit: () => void;
    onLogout?: () => Promise<void>;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ theme, onExit, onLogout }) => {
    const [activeView, setActiveView] = useState('dashboard');
    const [students, setStudents] = useState<UserProfile[]>([]);
    const [booksCount, setBooksCount] = useState<number>(0);
    const [loading, setLoading] = useState(false);
    const isDark = theme === 'dark';
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [adminProfile, setAdminProfile] = useState<UserProfile | null>(null);

    useEffect(() => {
        // Placeholder - database not connected
    }, []);

    const renderDashboard = () => (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="text-center py-20">
                <div className="w-20 h-20 bg-orange-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <AlertCircle className="text-orange-500" size={48} />
                </div>
                <h2 className="text-2xl font-black mb-3">Database Not Connected</h2>
                <p className="text-zinc-500">Please configure your database to view dashboard data.</p>
            </div>
        </div>
    );

    const displayProfile = adminProfile || {
        id: 'admin-temp',
        email: 'admin@example.com',
        name: 'Administrator',
        role: 'admin',
        created_at: '',
        initials: 'AD'
    };

    return (
        <div className={`flex w-full min-h-screen ${isDark ? 'bg-black text-white' : 'bg-gray-50 text-gray-900'}`}>
            <AdminSidebar
                theme={theme}
                activeView={activeView}
                onNavigate={(view) => {
                    if (view === 'settings') {
                        setIsSettingsOpen(true);
                    } else {
                        setActiveView(view);
                    }
                }}
                onLogout={async () => {
                    if (onLogout) await onLogout();
                    onExit();
                }}
                onExit={onExit}
            />

            <div className="flex-1 flex flex-col h-screen overflow-hidden">
                <header className={`px-10 py-6 flex justify-between items-center ${isDark ? 'bg-black/80 backdrop-blur-md z-20 sticky top-0' : 'bg-white/80 backdrop-blur-md'}`}>
                    <div>
                        <h1 className="text-2xl font-black tracking-tight flex items-center gap-2">
                            Welcome back, Admin!
                            <span className="text-2xl">👋</span>
                        </h1>
                        <p className={`text-xs font-bold uppercase tracking-widest mt-1 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                        </p>
                    </div>

                    <div className="flex items-center gap-6">
                        <button
                            onClick={() => setIsSettingsOpen(true)}
                            className="p-2 rounded-full hover:bg-white/10 transition-colors"
                        >
                            <Settings size={20} />
                        </button>

                        <button className="relative w-10 h-10 rounded-full flex items-center justify-center bg-orange-600 text-white shadow-lg shadow-orange-600/30">
                            <Bell size={20} />
                        </button>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto w-full p-10 pb-20 no-scrollbar">
                    {renderDashboard()}
                </main>
            </div>

            <AccountSettingsModal
                isOpen={isSettingsOpen}
                onClose={() => setIsSettingsOpen(false)}
                userProfile={displayProfile}
                onSave={(updated) => {
                    setAdminProfile(updated);
                    setIsSettingsOpen(false);
                }}
                theme={theme}
                onLogout={async () => {
                    if (onLogout) await onLogout();
                    onExit();
                }}
            />
        </div>
    );
};

export default AdminDashboard;
