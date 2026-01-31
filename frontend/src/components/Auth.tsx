import React, { useState } from 'react';
import { BookOpen, ArrowRight, Mail, Lock, User, Loader2, ShieldCheck } from 'lucide-react';
import { UserProfile, QRVerificationState } from '../types';
import CodeVerification from './CodeVerification';
import { showErrorToast, showSuccessToast, showInfoToast } from '../utils/toast';

interface AuthProps {
  onAuthSuccess: (profile: UserProfile) => void;
}

import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { sendVerificationEmail } from '../services/emailService';

const Auth: React.FC<AuthProps> = ({ onAuthSuccess }) => {
  const { user } = useAuth();
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [isLoading, setIsLoading] = useState(false);
  const [qrVerification, setQrVerification] = useState<QRVerificationState | null>(null);
  const [formData, setFormData] = useState({
    user: '',
    email: '',
    password: '',
    name: ''
  });

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      let email = formData.email || formData.user;

      // Handle "Admin" shortcut
      if (email.toLowerCase() === 'admin') {
        email = 'admin@flipbook.com';
      }

      if (mode === 'signin') {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password: formData.password,
        });

        if (error) {
          // Show specific error message
          if (error.message.includes('Invalid login credentials')) {
            showErrorToast('Invalid email or password. Please try again.');
          } else {
            showErrorToast(error.message);
          }
          setIsLoading(false);
          return;
        }

        // Success - auth state change will be picked up by AuthContext
        showSuccessToast('Welcome back! Signing you in...');
      } else {
        // Generate 6-digit verification code
        const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
        const verificationToken = crypto.randomUUID() + verificationCode; // Append code to token
        const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes

        // Store verification token in Supabase
        const { error: tokenError } = await supabase
          .from('verification_tokens')
          .insert({
            email,
            token: verificationToken,
            expires_at: new Date(expiresAt).toISOString(),
            status: 'pending'
          });

        if (tokenError) throw tokenError;

        // Send verification email with 6-digit code
        try {
          await sendVerificationEmail({
            email,
            verificationToken
          });
          showInfoToast(`Verification code sent to ${email}`);
        } catch (emailError) {
          console.error('Failed to send email:', emailError);
          showInfoToast(`Your verification code is: ${verificationCode}`);
        }

        // Set QR verification state
        setQrVerification({
          email,
          token: verificationToken,
          status: 'pending',
          expiresAt
        });
      }
    } catch (err: any) {
      showErrorToast(err.message || "Authentication failed. Please try again.");
      setIsLoading(false);
    }
  };

  const handleQRVerified = async () => {
    if (!qrVerification) return;

    try {
      // Create the user account
      const { data, error } = await supabase.auth.signUp({
        email: qrVerification.email,
        password: formData.password,
      });

      if (error) throw error;

      if (data.user) {
        const role = qrVerification.email === 'admin@flipbook.com' ? 'admin' : 'user';

        await supabase
          .from('profiles')
          .insert({
            id: data.user.id,
            email: qrVerification.email,
            role: role,
            created_at: new Date().toISOString()
          });

        // Update verification token status
        await supabase
          .from('verification_tokens')
          .update({ status: 'verified' })
          .eq('token', qrVerification.token);
      }
    } catch (err: any) {
      console.error('Verification error:', err);
    }
  };

  if (qrVerification) {
    return (
      <CodeVerification
        theme="dark"
        email={qrVerification.email}
        verificationToken={qrVerification.token}
        onVerified={handleQRVerified}
        onCancel={() => setQrVerification(null)}
      />
    );
  }

  return (
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
                setFormData({ user: '', email: '', password: '', name: '' });
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
  );
};

export default Auth;