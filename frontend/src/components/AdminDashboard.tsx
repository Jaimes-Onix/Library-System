
import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { UserProfile, LibraryBook, Theme } from '../types';
import { Users, BookOpen, Search, Loader2 } from 'lucide-react';

interface AdminDashboardProps {
    theme: Theme;
    onExit: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ theme, onExit }) => {
    const [students, setStudents] = useState<UserProfile[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
    const [studentBooks, setStudentBooks] = useState<any[]>([]);
    const isDark = theme === 'dark';

    useEffect(() => {
        fetchStudents();
    }, []);

    const fetchStudents = async () => {
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('role', 'user') // Only fetch students, not admins
                .order('created_at', { ascending: false });

            if (error) throw error;
            setStudents(data || []);
        } catch (error) {
            console.error('Error fetching students:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchStudentBooks = async (studentId: string) => {
        if (selectedStudentId === studentId) {
            setSelectedStudentId(null); // Deselect if verified
            setStudentBooks([]);
            return;
        }
        setSelectedStudentId(studentId);
        const { data } = await supabase
            .from('books')
            .select('*')
            .eq('user_id', studentId);
        setStudentBooks(data || []);
    };

    const getStatusColor = (status?: string) => {
        switch (status?.toLowerCase()) {
            case 'active': return 'bg-green-500';
            case 'fines': return 'bg-yellow-500';
            case 'suspended': return 'bg-red-500';
            default: return 'bg-gray-400';
        }
    };

    const getStatusLabel = (status?: string) => {
        switch (status?.toLowerCase()) {
            case 'active': return 'Active';
            case 'fines': return 'With Fines';
            case 'suspended': return 'Suspended';
            default: return 'Unknown';
        }
    };

    return (
        <div className={`min-h-screen p-10 font-sans ${isDark ? 'bg-[#0A0A0A] text-white' : 'bg-gray-50 text-gray-900'}`}>
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-12">
                    <div>
                        <h1 className="text-5xl font-black tracking-tighter mb-2">Student Tracking</h1>
                        <p className={`text-lg font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                            Monitor library access and student status
                        </p>
                    </div>
                    <button onClick={onExit} className="px-8 py-3 bg-white text-black font-bold rounded-full hover:scale-105 transition-transform shadow-xl">
                        Exit Admin
                    </button>
                </div>

                {loading ? (
                    <div className="flex justify-center p-20"><Loader2 className="animate-spin w-10 h-10 text-orange-500" /></div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {students.map(student => (
                            <div key={student.id} className={`relative overflow-hidden group rounded-[32px] transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl ${isDark
                                ? 'bg-[#1C1C1E] shadow-black/50 border border-white/5'
                                : 'bg-white shadow-xl border border-gray-100'
                                }`}>
                                {/* Status Indicator Header */}
                                <div className={`h-2 w-full ${getStatusColor(student.status)}`} />

                                <div className="p-8 flex flex-col items-center text-center">
                                    {/* Student Photo */}
                                    <div className="mb-6 relative">
                                        <div className={`w-28 h-28 rounded-full overflow-hidden border-4 shadow-lg ${isDark ? 'border-gray-800' : 'border-white'}`}>
                                            {student.photo_url || student.photoUrl ? (
                                                <img
                                                    src={student.photo_url || student.photoUrl}
                                                    alt={student.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center text-3xl font-bold text-white">
                                                    {student.initials || student.name.charAt(0)}
                                                </div>
                                            )}
                                        </div>
                                        <div className={`absolute bottom-1 right-1 w-6 h-6 rounded-full border-4 ${isDark ? 'border-[#1C1C1E]' : 'border-white'} ${getStatusColor(student.status)}`} />
                                    </div>

                                    {/* Main Info */}
                                    <h3 className="text-2xl font-bold mb-1 tracking-tight">{student.name}</h3>
                                    <p className={`text-sm font-mono mb-4 px-3 py-1 rounded-full ${isDark ? 'bg-black/30 text-gray-400' : 'bg-gray-100 text-gray-500'}`}>
                                        {student.student_id || 'NO ID'}
                                    </p>

                                    {/* Details */}
                                    <div className="w-full space-y-3 mb-8">
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="opacity-50 font-medium">Class</span>
                                            <span className="font-bold">{student.grade_section || 'N/A'}</span>
                                        </div>
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="opacity-50 font-medium">Course</span>
                                            <span className="font-bold">{student.course || 'N/A'}</span>
                                        </div>
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="opacity-50 font-medium">Status</span>
                                            <span className={`font-bold px-2 py-0.5 rounded textxs ${student.status === 'active' ? 'bg-green-500/10 text-green-500' :
                                                student.status === 'suspended' ? 'bg-red-500/10 text-red-500' :
                                                    'bg-yellow-500/10 text-yellow-500'
                                                }`}>
                                                {getStatusLabel(student.status)}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Action */}
                                    <button
                                        onClick={() => fetchStudentBooks(student.id)}
                                        className={`w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all ${selectedStudentId === student.id
                                            ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/30'
                                            : (isDark ? 'bg-white/5 hover:bg-white/10 text-white' : 'bg-gray-100 hover:bg-gray-200 text-black')
                                            }`}
                                    >
                                        <BookOpen size={18} />
                                        {selectedStudentId === student.id ? 'Hide Books' : 'View Library'}
                                    </button>
                                </div>

                                {/* Bookshelf Expansion */}
                                {selectedStudentId === student.id && (
                                    <div className={`p-6 border-t animate-in slide-in-from-top-4 duration-300 ${isDark ? 'bg-black/20 border-white/5' : 'bg-gray-50 border-gray-100'}`}>
                                        <div className="flex items-center gap-2 mb-4 opacity-60">
                                            <Search size={14} />
                                            <span className="text-xs font-bold uppercase tracking-wider">Checked Out Books</span>
                                        </div>
                                        {studentBooks.length > 0 ? (
                                            <div className="grid grid-cols-2 gap-4">
                                                {studentBooks.map(book => (
                                                    <div key={book.id} className="aspect-[3/4.2] bg-gray-800 rounded-lg overflow-hidden shadow-lg relative group">
                                                        {book.cover_url ? (
                                                            <img src={book.cover_url} className="w-full h-full object-cover" />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center text-[10px] text-center p-2 text-white/50 bg-white/5">
                                                                {book.title}
                                                            </div>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="text-center py-8 text-sm opacity-40 italic">
                                                No books in library
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};
export default AdminDashboard;
