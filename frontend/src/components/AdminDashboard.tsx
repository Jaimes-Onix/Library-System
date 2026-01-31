
import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { UserProfile, LibraryBook, Theme } from '../types';
import { Users, BookOpen, Search, Loader2 } from 'lucide-react';

interface AdminDashboardProps {
    theme: Theme;
    onExit: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ theme, onExit }) => {
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
    const [userBooks, setUserBooks] = useState<any[]>([]);
    const isDark = theme === 'dark';

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setUsers(data || []);
        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchUserBooks = async (userId: string) => {
        setSelectedUserId(userId);
        const { data } = await supabase
            .from('books')
            .select('*')
            .eq('user_id', userId);
        setUserBooks(data || []);
    };

    return (
        <div className={`min-h-screen p-10 ${isDark ? 'bg-black text-white' : 'bg-gray-50 text-gray-900'}`}>
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-10">
                    <h1 className="text-4xl font-black tracking-tight">Admin Dashboard</h1>
                    <button onClick={onExit} className="px-6 py-2 bg-gray-200 text-black font-bold rounded-xl hover:bg-gray-300 transition-colors">
                        Exit Admin
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* User List */}
                    <div className={`col-span-1 rounded-3xl p-6 h-[80vh] overflow-hidden flex flex-col ${isDark ? 'bg-zinc-900 border border-zinc-800' : 'bg-white shadow-xl'}`}>
                        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                            <Users className="text-blue-500" />
                            Registered Users
                        </h2>

                        {loading ? (
                            <div className="flex justify-center p-10"><Loader2 className="animate-spin" /></div>
                        ) : (
                            <div className="overflow-y-auto space-y-3 pr-2 custom-scrollbar">
                                {users.map(user => (
                                    <div
                                        key={user.id}
                                        onClick={() => fetchUserBooks(user.id)}
                                        className={`p-4 rounded-2xl cursor-pointer transition-all border ${selectedUserId === user.id ? 'bg-blue-600 border-blue-500 text-white shadow-lg' : (isDark ? 'bg-black/40 border-white/5 hover:bg-white/5' : 'bg-gray-50 border-gray-200 hover:bg-gray-100')}`}
                                    >
                                        <div className="font-bold">{user.email}</div>
                                        <div className="text-xs opacity-60 mt-1 uppercase tracking-wider">{user.role}</div>
                                        <div className="text-[10px] opacity-40 mt-2 font-mono">{user.id}</div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* User Bookshelf View */}
                    <div className={`col-span-2 rounded-3xl p-8 h-[80vh] overflow-y-auto ${isDark ? 'bg-zinc-900 border border-zinc-800' : 'bg-white shadow-xl'}`}>
                        <h2 className="text-xl font-bold mb-8 flex items-center gap-2">
                            <BookOpen className="text-purple-500" />
                            {selectedUserId ? 'User Bookshelf' : 'Select a user to view their library'}
                        </h2>

                        {selectedUserId && (
                            <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
                                {userBooks.map(book => (
                                    <div key={book.id} className="group relative aspect-[3/4.2] rounded-xl overflow-hidden bg-gray-100 dark:bg-zinc-800 shadow-md">
                                        {book.cover_url ? (
                                            <img src={book.cover_url} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="flex items-center justify-center h-full text-zinc-400 font-bold">No Cover</div>
                                        )}
                                        <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                                            <p className="text-white text-sm font-bold truncate">{book.title}</p>
                                        </div>
                                    </div>
                                ))}
                                {userBooks.length === 0 && (
                                    <div className="col-span-full py-20 text-center opacity-50 font-medium">No books found for this user.</div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
