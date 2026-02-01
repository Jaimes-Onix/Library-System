import React, { useState } from 'react';
import { BookOpen, ArrowRight, Mail, Lock, User, Loader2, ShieldCheck, Eye, EyeOff } from 'lucide-react';
import { UserProfile, QRVerificationState } from '../types';
import CodeVerification from './CodeVerification';
import ErrorModal from './ErrorModal';
import { showSuccessToast, showInfoToast } from '../utils/toast';

interface AuthProps {
  onAuthSuccess: (profile: UserProfile) => void;
}

import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

// Map Supabase errors to friendly messages
const getFriendlyErrorMessage = (error: any): string => {
  const message = error?.message || '';
  console.log('[AUTH] Mapping error:', message);

  if (message.includes('Invalid login credentials')) {
    return 'The email or password you entered is incorrect.';
  }
  if (message.includes('Email not confirmed')) {
    return 'Please verify your email before signing in.';
  }
  if (message.includes('User not found')) {
    return 'No account found with this email.';
  }
  if (message.includes('already registered') || message.includes('already exists')) {
    return 'An account with this email already exists.';
  }
  if (message.includes('Password') && message.includes('weak')) {
    return 'Your password is too weak. Try at least 6 characters.';
  }
  if (message.includes('Network') || message.includes('fetch')) {
    return 'Unable to connect. Please check your internet.';
  }

  // Generic fallback
  return message || 'An unexpected error occurred. Please try again.';
};

const Auth: React.FC<AuthProps> = ({ onAuthSuccess }) => {
  const { user } = useAuth();
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [authType, setAuthType] = useState<'student' | 'admin'>('student');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [qrVerification, setQrVerification] = useState<QRVerificationState | null>(null);
  const [errorModal, setErrorModal] = useState({ isOpen: false, message: '' });
  const [formData, setFormData] = useState({
    user: '',
    email: '',
    password: '',
    name: '',
    studentId: '',
    gradeSection: '',
    course: ''
  });

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  /* Validate form inputs */
  const validateForm = (): boolean => {
    const email = formData.email || formData.user;

    // Check for empty fields
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

    // Validate email format (basic check)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email.toLowerCase() !== 'admin' && !emailRegex.test(email)) {
      setErrorModal({ isOpen: true, message: 'Please enter a valid email address' });
      return false;
    }

    // Check password strength for signup
    if (mode === 'signup') {
      if (formData.password.length < 6) {
        setErrorModal({ isOpen: true, message: 'Password must be at least 6 characters' });
        return false;
      }
    }

    return true;
  };

  /* New Handle Submit using Supabase Native Auth */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate before submitting
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    console.log('[AUTH] ========== AUTHENTICATION ATTEMPT ==========');
    console.log('[AUTH] Mode:', mode);

    try {
      let email = formData.email || formData.user;
      if (email.toLowerCase() === 'admin') email = 'admin@flipbook.com';

      console.log('[AUTH] Email:', email);

      if (mode === 'signin') {
        console.log('[AUTH] Attempting sign in...');
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password: formData.password,
        });

        console.log('[AUTH] Sign in response:', { data, error });

        if (error) {
          console.error('[AUTH] Sign in failed:', error);
          const friendlyMessage = getFriendlyErrorMessage(error);
          setErrorModal({ isOpen: true, message: friendlyMessage });
          setIsLoading(false);
          return;
        }

        console.log('[AUTH] Sign in successful!');
        showSuccessToast('Welcome back! Signing you in...');
      } else {
        // Sign Up with Supabase (triggers verification email)
        console.log('[AUTH] Attempting sign up...');
        const { data, error } = await supabase.auth.signUp({
          email,
          password: formData.password,
          options: {
            data: {
              full_name: formData.name,
              student_id: formData.studentId,
              grade_section: formData.gradeSection,
              course: formData.course,
            }
          }
        });

        console.log('[AUTH] Sign up response:', { data, error });

        if (error) {
          console.error('[AUTH] Sign up failed:', error);
          const friendlyMessage = getFriendlyErrorMessage(error);
          setErrorModal({ isOpen: true, message: friendlyMessage });
          setIsLoading(false);
          return;
        }

        // If signup is successful, Supabase sends the email.
        // We show the verification UI to let the user enter the code.
        // Identify if the user is new or existing based on response
        if (data.user && !data.session) {
          console.log('[AUTH] Verification required, showing code entry');
          showInfoToast(`Verification code sent to ${email}`);
          setQrVerification({
            email,
            token: '', // No token needed for local state, Supabase handles it
            status: 'pending',
            expiresAt: Date.now() + 5 * 60 * 1000
          });
        } else if (data.session) {
          console.log('[AUTH] Sign up successful with immediate session');
          showSuccessToast('Account created successfully!');
          onAuthSuccess({
            id: data.user!.id,
            email: data.user!.email!,
            role: 'user',
            name: formData.name,
            initials: getInitials(formData.name),
            student_id: formData.studentId,
            grade_section: formData.gradeSection,
            course: formData.course,
            created_at: new Date().toISOString()
          });
        }
      }
    } catch (err: any) {
      console.error('[AUTH] Unexpected error:', err);
      const friendlyMessage = getFriendlyErrorMessage(err);
      setErrorModal({ isOpen: true, message: friendlyMessage });
    } finally {
      setIsLoading(false);
      console.log('[AUTH] ========== END AUTHENTICATION ==========');
    }
  };

  const handleVerifyOtp = async (code: string) => {
    if (!qrVerification) return;

    try {
      const { data, error } = await supabase.auth.verifyOtp({
        email: qrVerification.email,
        token: code,
        type: 'signup'
      });

      if (error) throw error;

      if (data.session && data.user) {
        // Create profile if it doesn't exist (Trigger might handle this, but safe to do here)
        const emailLower = qrVerification.email.toLowerCase();
        const role = (emailLower === 'admin@flipbook.com' || emailLower === 'admin123@gmail.com') ? 'admin' : 'user';

        const { error: profileError } = await supabase
          .from('profiles')
          .upsert({
            id: data.user.id,
            email: qrVerification.email,
            role: role,
            student_id: formData.studentId || null,
            grade_section: formData.gradeSection || null,
            course: formData.course || null,
            status: 'active',
            created_at: new Date().toISOString()
          });

        if (profileError) console.warn("Profile creation warning:", profileError);

        showSuccessToast('Email verified successfully!');
        setQrVerification(null);
        // AuthContext should pick up the session change
      }
    } catch (err: any) {
      console.error("Verification failed:", err);
      throw err; // Propagate to CodeVerification to show error
    }
  };

  if (qrVerification) {
    return (
      <CodeVerification
        theme="dark"
        email={qrVerification.email}
        onVerifyCode={handleVerifyOtp}
        onCancel={() => setQrVerification(null)}
      />
    );
  }

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
        {/* Abstract Background Orbs */}
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-orange-600/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-red-600/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />

        {/* Noise Texture */}
        <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay pointer-events-none" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} />

        <div className="relative w-full max-w-md px-6 animate-in fade-in zoom-in duration-700">
          <div className="bg-[#111111] backdrop-blur-2xl p-10 rounded-[32px] shadow-2xl shadow-black border border-white/10 relative overflow-hidden">
            {/* Top Orange Line */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-600 via-red-500 to-orange-600 opacity-80" />

            <div className="flex flex-col items-center text-center mb-10">
              <div className="bg-zinc-900 border border-white/10 text-orange-500 p-4 rounded-3xl shadow-xl mb-6 relative group">
                <div className="absolute inset-0 bg-orange-500/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                {authType === 'admin' ? <ShieldCheck size={32} strokeWidth={2.5} className="relative z-10" /> : <BookOpen size={32} strokeWidth={2.5} className="relative z-10" />}
              </div>

              {/* User Type Toggle */}
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

            {authType !== 'admin' && (
              <div className="mt-8 pt-8 border-t border-white/5 text-center">
                <button
                  onClick={() => {
                    setMode(mode === 'signin' ? 'signup' : 'signin');
                    setFormData({ user: '', email: '', password: '', name: '', studentId: '', gradeSection: '', course: '' });
                  }}
                  className="text-sm text-zinc-500 hover:text-white transition-colors"
                >
                  {mode === 'signin'
                    ? "Don't have an account? "
                    : "Already have an account? "}
                  <span className="font-bold text-orange-500">{mode === 'signin' ? 'Sign up free' : 'Sign in'}</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Auth;