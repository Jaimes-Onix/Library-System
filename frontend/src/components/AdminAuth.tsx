import React, { useState } from 'react';
import { ShieldCheck, Eye, EyeOff, Loader2, ArrowRight } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { showSuccessToast } from '../utils/toast';
import { useNavigate } from 'react-router-dom';
import VantaFog from './VantaFog';

const AdminAuth: React.FC = () => {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');

    const handleAdminAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const email = formData.email.trim();
            const password = formData.password.trim();

            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });
            if (error) {
                if (error.status === 400) {
                    throw new Error("Invalid email or password. Please check your credentials.");
                }
                throw error;
            }

            // Ensure admin profile exists with correct role
            const { data: { user: authUser } } = await supabase.auth.getUser();
            if (authUser) {
                await supabase.from('profiles').upsert({
                    id: authUser.id,
                    email: authUser.email,
                    role: 'admin',
                    name: authUser.user_metadata?.full_name || 'Admin User',
                    status: 'active'
                });
            }

            setTimeout(() => {
                showSuccessToast('Verified. Entering Dashboard...');
                navigate('/admin/dashboard');
            }, 1000);
        } catch (err: any) {
            setError(err.message || 'Authentication failed');
            setIsLoading(false);
        }
        // Note: We don't set isLoading(false) on success immediately to prevent UI flicker before redirect
    };

    return (
        <div className="min-h-screen bg-[#050505] flex items-center justify-center p-4 relative overflow-hidden">
            {/* Vanta FOG Background */}
            <VantaFog />

            <div className="w-full max-w-md bg-[#111]/80 backdrop-blur-xl p-10 rounded-[32px] border border-white/10 shadow-2xl relative z-10">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-600 via-red-500 to-orange-600 opacity-80" />

                <div className="text-center mb-10">
                    <div className="w-20 h-20 bg-zinc-900 border border-white/10 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl relative group">
                        <ShieldCheck size={40} className="text-orange-500 relative z-10" strokeWidth={2.5} />
                        <div className="absolute inset-0 bg-orange-500/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>

                    <h1 className="text-3xl font-black text-white mb-2 tracking-tight">Admin Portal</h1>
                    <p className="text-zinc-500 text-sm">Secure access for library administrators</p>
                </div>

                <form onSubmit={handleAdminAuth} className="space-y-4">
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider ml-1">Email</label>
                        <input
                            type="email"
                            required
                            className="w-full px-4 py-4 bg-zinc-900/50 border border-white/5 rounded-2xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500/50 outline-none transition-all text-white placeholder-zinc-600"
                            placeholder="admin@school.edu"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                    </div>

                    <div className="space-y-1 relative">
                        <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider ml-1">Password</label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                required
                                className="w-full px-4 py-4 bg-zinc-900/50 border border-white/5 rounded-2xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500/50 outline-none transition-all text-white placeholder-zinc-600 pr-12"
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition-colors"
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    {error && (
                        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-sm font-medium text-center">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full flex items-center justify-center gap-2 py-4 bg-white text-black rounded-2xl font-black transition-all active:scale-95 hover:bg-orange-500 hover:text-white disabled:opacity-50 mt-6 shadow-lg shadow-white/5"
                    >
                        {isLoading ? <Loader2 className="animate-spin" size={20} /> : (
                            <>
                                Enter Dashboard
                                <ArrowRight size={18} />
                            </>
                        )}
                    </button>
                </form>

                <div className="mt-8 pt-8 border-t border-white/5 text-center">
                    <button
                        onClick={() => navigate('/')}
                        className="text-xs text-zinc-600 hover:text-zinc-400 transition-colors"
                    >
                        ← Back to Student Portal
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AdminAuth;
