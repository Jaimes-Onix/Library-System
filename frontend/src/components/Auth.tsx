import React, { useState } from 'react';
import { BookOpen, ArrowRight, Mail, Lock, User, Loader2, ShieldCheck, Eye, EyeOff } from 'lucide-react';
import { UserProfile } from '../types';
import ErrorModal from './ErrorModal';
import VantaFog from './VantaFog';
import { showSuccessToast } from '../utils/toast';

interface AuthProps {
  onAuthSuccess: (profile: UserProfile) => void;
  onBack?: () => void;
}

const Auth: React.FC<AuthProps> = ({ onAuthSuccess, onBack }) => {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [authType, setAuthType] = useState<'student' | 'admin'>('student');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorModal, setErrorModal] = useState({ isOpen: false, message: '' });
  const [formData, setFormData] = useState({
    user: '',
    email: '',
    password: '',
    name: '',
    studentId: '',
    gradeSection: '',
    course: '',
    photo: null as File | null
  });

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const validateForm = (): boolean => {
    const email = formData.email || formData.user;

    if (!email.trim()) {
      setErrorModal({ isOpen: true, message: 'Please enter your email address' });
      return false;
    }

    if (!formData.password.trim()) {
      setErrorModal({ isOpen: true, message: 'Please enter your password' });
      return false;
    }

    if (mode === 'signup') {
      if (!formData.name.trim()) {
        setErrorModal({ isOpen: true, message: 'Please enter your name' });
        return false;
      }
      if (!formData.studentId.trim()) {
        setErrorModal({ isOpen: true, message: 'Please enter your Student ID' });
        return false;
      }
      if (!formData.gradeSection.trim()) {
        setErrorModal({ isOpen: true, message: 'Please enter your Grade / Section' });
        return false;
      }
      if (!formData.course.trim()) {
        setErrorModal({ isOpen: true, message: 'Please enter your Course' });
        return false;
      }
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email.toLowerCase() !== 'admin' && !emailRegex.test(email)) {
      setErrorModal({ isOpen: true, message: 'Please enter a valid email address' });
      return false;
    }

    if (mode === 'signup') {
      if (formData.password.length < 6) {
        setErrorModal({ isOpen: true, message: 'Password must be at least 6 characters' });
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    // Placeholder for future database integration
    setTimeout(() => {
      setErrorModal({
        isOpen: true,
        message: 'Database not configured. Please set up your database first.'
      });
      setIsLoading(false);
    }, 1000);
  };

  return (
    <>
      <ErrorModal
        isOpen={errorModal.isOpen}
        title="Sign In Failed"
        message={errorModal.message}
        onClose={() => setErrorModal({ isOpen: false, message: '' })}
        theme="dark"
      />

      <div className="fixed inset-0 flex items-center justify-center bg-[#050505] overflow-hidden">
        <VantaFog />

        {onBack && (
          <button
            onClick={onBack}
            className="absolute top-6 right-6 z-20 px-4 py-2 text-sm font-medium text-zinc-500 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 rounded-full backdrop-blur-md transition-all"
          >
            ← Back
          </button>
        )}

        <div className="relative w-full max-w-md px-6 animate-in fade-in zoom-in duration-700 z-10">
          <div className="bg-[#111111]/80 backdrop-blur-2xl p-10 rounded-[32px] shadow-2xl shadow-black border border-white/10 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-600 via-red-500 to-orange-600 opacity-80" />

            <div className="flex flex-col items-center text-center mb-10">
              <div className="bg-zinc-900 border border-white/10 text-orange-500 p-4 rounded-3xl shadow-xl mb-6 relative group">
                <div className="absolute inset-0 bg-orange-500/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                {authType === 'admin' ? <ShieldCheck size={32} strokeWidth={2.5} className="relative z-10" /> : <BookOpen size={32} strokeWidth={2.5} className="relative z-10" />}
              </div>

              <div className="flex p-1 bg-zinc-900/80 border border-white/5 rounded-full mb-8 w-full max-w-[240px]">
                <button
                  onClick={() => { setMode('signin'); setAuthType('student'); }}
                  className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded-full transition-all ${authType === 'student' ? 'bg-orange-600 text-white shadow-lg shadow-orange-900/40' : 'text-zinc-500 hover:text-zinc-300'}`}
                >
                  Student
                </button>
                <button
                  onClick={() => { setMode('signin'); setAuthType('admin'); }}
                  className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded-full transition-all ${authType === 'admin' ? 'bg-orange-600 text-white shadow-lg shadow-orange-900/40' : 'text-zinc-500 hover:text-zinc-300'}`}
                >
                  Admin
                </button>
              </div>

              <h1 className="text-3xl font-black tracking-tighter text-white mb-2">
                {authType === 'admin' ? 'Admin Access' : (mode === 'signin' ? 'Welcome Back' : 'Create Account')}
              </h1>
              <p className="text-zinc-500 text-sm font-medium">
                {mode === 'signin'
                  ? 'Sign in to access your digital library'
                  : 'Join us to start curating your flipbooks'}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === 'signup' && (
                <>
                  <div className="flex justify-center mb-4">
                    <label className="cursor-pointer group relative">
                      <div className={`w-24 h-24 rounded-full flex items-center justify-center border-2 border-dashed transition-all overflow-hidden ${formData.photo ? 'border-orange-500 p-0.5' : 'border-zinc-700 hover:border-orange-500 bg-zinc-900/50'}`}>
                        {formData.photo ? (
                          <img src={URL.createObjectURL(formData.photo)} alt="Profile Preview" className="w-full h-full object-cover rounded-full" />
                        ) : (
                          <div className="flex flex-col items-center gap-1 text-zinc-500 group-hover:text-orange-500 transition-colors">
                            <User size={24} />
                            <span className="text-[10px] font-bold uppercase">Upload</span>
                          </div>
                        )}
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            setFormData({ ...formData, photo: e.target.files[0] });
                          }
                        }}
                      />
                      <div className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="text-[10px] font-bold text-white uppercase tracking-wider">Change</span>
                      </div>
                    </label>
                  </div>

                  <div className="relative group">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-orange-500 transition-colors" size={18} />
                    <input
                      type="text"
                      required
                      placeholder="Full Name"
                      className="w-full pl-12 pr-4 py-4 bg-zinc-900/50 border border-white/5 rounded-2xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500/50 outline-none transition-all text-sm font-medium text-white placeholder-zinc-600"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>
                  <div className="relative group">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-orange-500 transition-colors" size={18} />
                    <input
                      type="text"
                      required
                      placeholder="Student ID"
                      className="w-full pl-12 pr-4 py-4 bg-zinc-900/50 border border-white/5 rounded-2xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500/50 outline-none transition-all text-sm font-medium text-white placeholder-zinc-600"
                      value={formData.studentId}
                      onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                    />
                  </div>
                  <div className="relative group">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-orange-500 transition-colors" size={18} />
                    <input
                      type="text"
                      required
                      placeholder="Grade / Year & Section"
                      className="w-full pl-12 pr-4 py-4 bg-zinc-900/50 border border-white/5 rounded-2xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500/50 outline-none transition-all text-sm font-medium text-white placeholder-zinc-600"
                      value={formData.gradeSection}
                      onChange={(e) => setFormData({ ...formData, gradeSection: e.target.value })}
                    />
                  </div>
                  <div className="relative group">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-orange-500 transition-colors" size={18} />
                    <input
                      type="text"
                      required
                      placeholder="Course"
                      className="w-full pl-12 pr-4 py-4 bg-zinc-900/50 border border-white/5 rounded-2xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500/50 outline-none transition-all text-sm font-medium text-white placeholder-zinc-600"
                      value={formData.course}
                      onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                    />
                  </div>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-orange-500 transition-colors" size={18} />
                    <input
                      type="email"
                      required
                      placeholder="Email address"
                      className="w-full pl-12 pr-4 py-4 bg-zinc-900/50 border border-white/5 rounded-2xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500/50 outline-none transition-all text-sm font-medium text-white placeholder-zinc-600"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                </>
              )}

              {mode === 'signin' && (
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-orange-500 transition-colors" size={18} />
                  <input
                    type="text"
                    required
                    placeholder="Username or Email"
                    className="w-full pl-12 pr-4 py-4 bg-zinc-900/50 border border-white/5 rounded-2xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500/50 outline-none transition-all text-sm font-medium text-white placeholder-zinc-600"
                    value={formData.user}
                    onChange={(e) => setFormData({ ...formData, user: e.target.value })}
                  />
                </div>
              )}

              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-orange-500 transition-colors" size={18} />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="Password"
                  className="w-full pl-12 pr-12 py-4 bg-zinc-900/50 border border-white/5 rounded-2xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500/50 outline-none transition-all text-sm font-medium text-white placeholder-zinc-600"
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

              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 py-4 bg-white text-black rounded-2xl font-black transition-all active:scale-95 hover:bg-orange-500 hover:text-white disabled:opacity-50 mt-4"
              >
                {isLoading ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  <>
                    {mode === 'signin' ? 'Sign In' : 'Get Started'}
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </form>

            <div className="mt-8 pt-8 border-t border-white/5 text-center">
              <button
                onClick={() => {
                  setMode(mode === 'signin' ? 'signup' : 'signin');
                  setFormData({ user: '', email: '', password: '', name: '', studentId: '', gradeSection: '', course: '', photo: null });
                }}
                className="text-sm text-zinc-500 hover:text-white transition-colors"
              >
                {mode === 'signin'
                  ? "Don't have an account? "
                  : "Already have an account? "}
                <span className="font-bold text-orange-500">{mode === 'signin' ? 'Sign up free' : 'Sign in'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Auth;