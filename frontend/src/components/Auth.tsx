import React, { useState } from 'react';
import { BookOpen, ArrowRight, Mail, Lock, User, Loader2, ShieldCheck } from 'lucide-react';
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
        const role = qrVerification.email === 'admin@flipbook.com' ? 'admin' : 'user';

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

      <div className="fixed inset-0 flex items-center justify-center bg-[#F5F5F7] overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-400/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-400/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />

        <div className="relative w-full max-w-md px-6 animate-in fade-in zoom-in duration-700">
          <div className="bg-white/70 backdrop-blur-3xl p-10 rounded-[40px] shadow-2xl shadow-black/5 border border-white/50">
            <div className="flex flex-col items-center text-center mb-10">
              <div className="bg-black text-white p-4 rounded-3xl shadow-xl shadow-black/20 mb-6">
                <BookOpen size={32} strokeWidth={2.5} />
              </div>
              <h1 className="text-3xl font-bold tracking-tight text-gray-900 mb-2">
                {mode === 'signin' ? 'Welcome Back' : 'Create Account'}
              </h1>
              <p className="text-gray-500 text-sm">
                {mode === 'signin'
                  ? 'Sign in to access your digital library'
                  : 'Join us to start curating your flipbooks'}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === 'signup' && (
                <>
                  <div className="relative group">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" size={18} />
                    <input
                      type="text"
                      required
                      placeholder="Full Name"
                      className="w-full pl-12 pr-4 py-4 bg-gray-50/50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all text-sm font-medium"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>
                  <div className="relative group">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" size={18} />
                    <input
                      type="text"
                      required
                      placeholder="Student ID"
                      className="w-full pl-12 pr-4 py-4 bg-gray-50/50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all text-sm font-medium"
                      value={formData.studentId}
                      onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                    />
                  </div>
                  <div className="relative group">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" size={18} />
                    <input
                      type="text"
                      required
                      placeholder="Grade / Year & Section"
                      className="w-full pl-12 pr-4 py-4 bg-gray-50/50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all text-sm font-medium"
                      value={formData.gradeSection}
                      onChange={(e) => setFormData({ ...formData, gradeSection: e.target.value })}
                    />
                  </div>
                  <div className="relative group">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" size={18} />
                    <input
                      type="text"
                      required
                      placeholder="Course"
                      className="w-full pl-12 pr-4 py-4 bg-gray-50/50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all text-sm font-medium"
                      value={formData.course}
                      onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                    />
                  </div>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" size={18} />
                    <input
                      type="email"
                      required
                      placeholder="Email address"
                      className="w-full pl-12 pr-4 py-4 bg-gray-50/50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all text-sm font-medium"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                </>
              )}

              {mode === 'signin' && (
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" size={18} />
                  <input
                    type="text"
                    required
                    placeholder="Username or Email"
                    className="w-full pl-12 pr-4 py-4 bg-gray-50/50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all text-sm font-medium"
                    value={formData.user}
                    onChange={(e) => setFormData({ ...formData, user: e.target.value })}
                  />
                </div>
              )}

              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" size={18} />
                <input
                  type="password"
                  required
                  placeholder="Password"
                  className="w-full pl-12 pr-4 py-4 bg-gray-50/50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all text-sm font-medium"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 py-4 bg-black text-white rounded-2xl font-bold transition-all active:scale-95 shadow-xl shadow-black/10 hover:bg-gray-800 disabled:opacity-50"
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

            <div className="mt-8 pt-8 border-t border-gray-100 text-center">
              <button
                onClick={() => {
                  setMode(mode === 'signin' ? 'signup' : 'signin');
                  setFormData({ user: '', email: '', password: '', name: '', studentId: '', gradeSection: '', course: '' });
                }}
                className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
              >
                {mode === 'signin'
                  ? "Don't have an account? "
                  : "Already have an account? "}
                <span className="font-bold text-black">{mode === 'signin' ? 'Sign up free' : 'Sign in'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Auth;