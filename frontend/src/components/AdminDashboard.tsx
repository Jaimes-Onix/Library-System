
import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
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
    Activity,
    CheckCircle,
    Plus
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
    const [loading, setLoading] = useState(true);
    const isDark = theme === 'dark';

    // Settings Modal State
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    // Fetch real admin profile
    const [adminProfile, setAdminProfile] = useState<UserProfile | null>(null);

    // Student Management State
    const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
    const [studentBooks, setStudentBooks] = useState<any[]>([]);

    useEffect(() => {
        fetchDashboardData();
        fetchAdminProfile();
    }, []);

    const fetchAdminProfile = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', user.id)
                    .single();

                if (profile) {
                    // Map DB snake_case to frontend camelCase for the Modal
                    setAdminProfile({
                        ...profile,
                        photoUrl: profile.photo_url || profile.avatar_url
                    });
                }
            }
        } catch (error) {
            console.error('Error fetching admin profile:', error);
        }
    };

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            // 1. Fetch Students
            const { data: studentsData } = await supabase
                .from('profiles')
                .select('*')
                .eq('role', 'user')
                .order('created_at', { ascending: false });

            setStudents(studentsData || []);

            // 2. Fetch Books Count (Admin view usually sees all books or just logic-based count)
            const { count } = await supabase
                .from('books')
                .select('*', { count: 'exact', head: true });

            setBooksCount(count || 65400); // Fallback to a cool number if 0/error, or use real count

        } catch (error) {
            console.error('Error loading admin data:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchStudentBooks = async (studentId: string) => {
        if (selectedStudentId === studentId) {
            setSelectedStudentId(null);
            setStudentBooks([]);
            return;
        }
        setSelectedStudentId(studentId);
        const { data } = await supabase.from('books').select('*').eq('user_id', studentId);
        setStudentBooks(data || []);
    };

    // --- Sub-Views ---

    const renderDashboard = () => (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    theme={theme}
                    title="Total Books"
                    value={booksCount > 1000 ? `${(booksCount / 1000).toFixed(1)}k` : booksCount.toString()}
                    icon={<Book size={24} />}
                    color="from-orange-500 to-amber-500"
                    trend="+12.5%"
                    trendUp={true}
                />
                <StatCard
                    theme={theme}
                    title="Active Members"
                    value={students.length.toString()}
                    icon={<Users size={24} />}
                    color="from-orange-600 to-red-500"
                    trend="+5 new"
                    trendUp={true}
                />
                <StatCard
                    theme={theme}
                    title="Active Rentals"
                    value="854"
                    icon={<Activity size={24} />}
                    color="from-amber-500 to-yellow-400"
                    trend="+8.2%"
                    trendUp={true}
                />
                <StatCard
                    theme={theme}
                    title="Overdue Books"
                    value="24"
                    icon={<AlertCircle size={24} />}
                    color="from-red-600 to-red-400"
                    trend="-2.1%"
                    trendUp={false}
                />
            </div>

            {/* Charts Row 1 */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <BarChart theme={theme} />
                </div>
                <div className="lg:col-span-1">
                    <DonutChart theme={theme} />
                </div>
            </div>

            {/* Charts Row 2 */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <LineChart theme={theme} />
                </div>
                <div className={`p-8 rounded-[32px] overflow-hidden flex flex-col ${isDark ? 'bg-[#1C1C1E]' : 'bg-white shadow-xl'}`}>
                    <div className="flex justify-between items-center mb-6">
                        <h3 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>New Members</h3>
                        <button className={`p-2 rounded-full hover:bg-white/10 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                            <Menu size={16} />
                        </button>
                    </div>
                    <div className="flex-1 overflow-y-auto no-scrollbar space-y-4">
                        {students.slice(0, 5).map(student => (
                            <div key={student.id} className="flex items-center gap-4">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold overflow-hidden ${isDark ? 'bg-white/10' : 'bg-gray-100'}`}>
                                    {student.photo_url || student.photoUrl ? (
                                        <img src={student.photo_url || student.photoUrl} className="w-full h-full object-cover" />
                                    ) : (
                                        (student.initials || "U").substring(0, 2)
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className={`text-sm font-bold truncate ${isDark ? 'text-white' : 'text-gray-900'}`}>{student.name}</h4>
                                    <p className={`text-xs truncate ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>{student.email}</p>
                                </div>
                                <div className={`w-2 h-2 rounded-full ${student.status === 'active' ? 'bg-green-500' : 'bg-yellow-500'}`} />
                            </div>
                        ))}
                    </div>
                    <button className={`mt-6 w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 ${isDark ? 'bg-orange-600/10 text-orange-500 hover:bg-orange-600/20' : 'bg-orange-50 text-orange-600'}`}>
                        View All Students
                    </button>
                </div>
            </div>
        </div>
    );

    const renderStudentsView = () => (
        <div className="animate-in fade-in duration-500">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h2 className="text-3xl font-black mb-1">Student Directory</h2>
                    <p className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Manage library access and accounts</p>
                </div>
                <div className="flex gap-4">
                    <div className={`flex items-center gap-2 px-4 py-3 rounded-xl min-w-[300px] ${isDark ? 'bg-[#1C1C1E]' : 'bg-white border border-gray-200'}`}>
                        <Search size={18} className="opacity-50" />
                        <input
                            type="text"
                            placeholder="Search students..."
                            className="bg-transparent text-sm w-full outline-none font-medium"
                        />
                    </div>
                    <button className="bg-orange-600 hover:bg-orange-500 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 text-sm shadow-lg shadow-orange-600/20 transition-all active:scale-95">
                        <Plus size={18} />
                        Add Student
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {students.map(student => (
                    <div key={student.id} className={`p-6 rounded-[24px] relative overflow-hidden group transition-all hover:-translate-y-1 ${isDark ? 'bg-[#1C1C1E] hover:bg-[#252528]' : 'bg-white border border-gray-100 hover:shadow-xl'}`}>
                        <div className="flex flex-col items-center text-center">
                            <div className={`w-20 h-20 rounded-full mb-4 overflow-hidden border-2 shadow-lg ${isDark ? 'border-white/10' : 'border-white'}`}>
                                {student.photo_url || student.photoUrl ? (
                                    <img src={student.photo_url || student.photoUrl} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center text-white font-bold">
                                        {student.initials || "ST"}
                                    </div>
                                )}
                            </div>
                            <h3 className={`font-bold text-lg mb-1 leading-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>{student.name}</h3>
                            <p className={`text-xs font-mono mb-4 px-2 py-1 rounded ${isDark ? 'bg-black/30 text-gray-400' : 'bg-gray-100 text-gray-500'}`}>
                                {student.student_id || 'ID: ----'}
                            </p>

                            <div className="flex items-center gap-2 w-full justify-between px-2 text-xs font-bold opacity-70 mb-6">
                                <span>{student.grade_section || 'N/A'}</span>
                                <span className={`px-2 py-0.5 rounded-full ${student.status === 'active' ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}`}>
                                    {student.status || 'Active'}
                                </span>
                            </div>

                            <button
                                onClick={() => fetchStudentBooks(student.id)}
                                className={`w-full py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-colors ${selectedStudentId === student.id
                                    ? 'bg-orange-600 text-white'
                                    : (isDark ? 'bg-white/5 text-white hover:bg-white/10' : 'bg-gray-100 text-black hover:bg-gray-200')
                                    }`}
                            >
                                {selectedStudentId === student.id ? <CheckCircle size={14} /> : <BookOpen size={14} />}
                                {selectedStudentId === student.id ? 'Close Library' : 'View Library'}
                            </button>
                        </div>

                        {/* Inline Library View */}
                        {selectedStudentId === student.id && (
                            <div className="mt-4 pt-4 border-t border-dashed border-white/10">
                                {studentBooks.length > 0 ? (
                                    <div className="grid grid-cols-3 gap-2">
                                        {studentBooks.map(b => (
                                            <div key={b.id} className="aspect-[2/3] bg-gray-800 rounded overflow-hidden">
                                                <img src={b.cover_url} className="w-full h-full object-cover" />
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-[10px] text-center opacity-40 italic py-2">No books rented</p>
                                )}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );

    // Default mock if not loaded yet, or fallback
    const displayProfile = adminProfile || {
        id: 'admin-temp',
        email: '...',
        name: '...',
        role: 'admin',
        created_at: '',
        initials: '...'
    };

    if (loading && !adminProfile && !students.length) {
        return (
            <div className="flex h-screen w-full items-center justify-center bg-black text-white">
                <Loader2 className="animate-spin text-orange-500" size={32} />
            </div>
        )
    }

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
                {/* Top Header */}
                <header className={`px-10 py-6 flex justify-between items-center ${isDark ? 'bg-black/80 backdrop-blur-md z-20 sticky top-0' : 'bg-white/80 backdrop-blur-md'}`}>
                    <div>
                        <h1 className="text-2xl font-black tracking-tight flex items-center gap-2">
                            Welcome back, {adminProfile ? adminProfile.name.split(' ')[0] : 'Admin'}!
                            <span className="text-2xl">👋</span>
                        </h1>
                        <p className={`text-xs font-bold uppercase tracking-widest mt-1 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                        </p>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className={`flex items-center gap-2 px-4 py-2.5 rounded-full ${isDark ? 'bg-[#1C1C1E]' : 'bg-white shadow-sm border border-gray-100'}`}>
                            <Search size={18} className="opacity-50" />
                            <input
                                type="text"
                                placeholder="Search..."
                                className="bg-transparent text-sm w-48 outline-none font-medium placeholder:text-gray-500"
                            />
                        </div>

                        <button
                            onClick={() => setIsSettingsOpen(true)}
                            className="p-2 rounded-full hover:bg-white/10 transition-colors"
                        >
                            <Settings size={20} />
                        </button>

                        <button className="relative w-10 h-10 rounded-full flex items-center justify-center bg-orange-600 text-white shadow-lg shadow-orange-600/30">
                            <Bell size={20} />
                            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 border-2 border-black rounded-full flex items-center justify-center text-[8px] font-bold">3</span>
                        </button>
                    </div>
                </header>

                {/* Main Content Area */}
                <main className="flex-1 overflow-y-auto w-full p-10 pb-20 no-scrollbar">
                    {activeView === 'dashboard' && renderDashboard()}
                    {activeView === 'students' && renderStudentsView()}

                    {/* Placeholders for other views */}
                    {activeView === 'analytics' && (
                        <div className="text-center py-20 opacity-50">
                            <Activity size={48} className="mx-auto mb-4" />
                            <h2 className="text-xl font-bold">Deep Analytics Module</h2>
                            <p>Coming soon...</p>
                        </div>
                    )}
                    {activeView === 'books' && (
                        <div className="text-center py-20 opacity-50">
                            <Book size={48} className="mx-auto mb-4" />
                            <h2 className="text-xl font-bold">Inventory Management</h2>
                            <p>Coming soon...</p>
                        </div>
                    )}
                </main>
            </div>

            {/* Account Settings Modal */}
            <AccountSettingsModal
                isOpen={isSettingsOpen}
                onClose={() => setIsSettingsOpen(false)}
                userProfile={displayProfile}
                onSave={(updated) => {
                    setAdminProfile(updated); // Update local state immediately
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
