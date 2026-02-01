
import React, { useEffect, useState } from 'react';
import { Theme } from '../types';
import { Loader2, Mail, CheckCircle2, XCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface CodeVerificationProps {
    theme: Theme;
    email: string;
    onVerifyCode: (code: string) => Promise<void>;
    onCancel: () => void;
}

export type VerificationStatus = 'pending' | 'verified' | 'expired' | 'error';

const CodeVerification: React.FC<CodeVerificationProps> = ({
    theme,
    email,
    onVerifyCode,
    onCancel
}) => {
    const isDark = theme === 'dark';
    const [code, setCode] = useState(['', '', '', '', '', '']);
    const [status, setStatus] = useState<VerificationStatus>('pending');
    const [countdown, setCountdown] = useState(300); // 5 minutes
    const [isVerifying, setIsVerifying] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        // Countdown timer
        if (countdown <= 0) {
            setStatus('expired');
            return;
        }

        const timer = setInterval(() => {
            setCountdown(prev => prev - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [countdown]);

    const handleCodeChange = (index: number, value: string) => {
        if (value.length > 1) return; // Only allow single digit
        if (value && !/^\d$/.test(value)) return; // Only allow numbers

        const newCode = [...code];
        newCode[index] = value;
        setCode(newCode);
        setError('');

        // Auto-focus next input
        if (value && index < 5) {
            const nextInput = document.getElementById(`code-${index + 1}`);
            nextInput?.focus();
        }

        // Auto-verify when all 6 digits are entered
        if (newCode.every(digit => digit !== '') && !isVerifying) {
            verifyCode(newCode.join(''));
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
        if (e.key === 'Backspace' && !code[index] && index > 0) {
            const prevInput = document.getElementById(`code-${index - 1}`);
            prevInput?.focus();
        }
    };

    const verifyCode = async (enteredCode: string) => {
        setIsVerifying(true);
        setError('');

        try {
            await onVerifyCode(enteredCode);
            setStatus('verified');
            // onVerified removed, handled by parent via promise success
        } catch (err: any) {
            setError(err.message || 'Verification failed. Please try again.');
            setCode(['', '', '', '', '', '']);
            document.getElementById('code-0')?.focus();
        } finally {
            setIsVerifying(false);
        }
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${isDark ? 'bg-black/95' : 'bg-white/95'} backdrop-blur-md`}>
            <div className={`max-w-md w-full rounded-[32px] p-8 ${isDark ? 'bg-[#111111] border border-white/10' : 'bg-white border border-gray-200'} shadow-2xl relative overflow-hidden`}>
                {/* Top Orange Line */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-600 via-red-500 to-orange-600 opacity-80" />

                <div className="text-center mb-8">
                    <div className="w-20 h-20 bg-orange-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-orange-500/20">
                        <Mail className="text-orange-500" size={36} />
                    </div>
                    <h2 className={`text-2xl font-black mb-3 tracking-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>Verify Your Email</h2>
                    <p className={`text-sm leading-relaxed ${isDark ? 'text-zinc-400' : 'text-gray-600'}`}>
                        We've sent a confirmation link to <br />
                        <span className="font-bold text-orange-500 text-base">{email}</span>
                    </p>
                    <p className={`text-xs mt-4 ${isDark ? 'text-zinc-500' : 'text-gray-500'}`}>
                        Click the link in the email to activate your account.
                    </p>
                </div>

                <div className="space-y-3">
                    <button
                        onClick={async () => {
                            try {
                                const { error } = await supabase.auth.resend({
                                    type: 'signup',
                                    email: email,
                                });
                                if (error) throw error;
                                alert("Verification email resent!");
                            } catch (err: any) {
                                alert("Error resending email: " + err.message);
                            }
                        }}
                        className={`w-full py-4 rounded-2xl font-bold text-sm transition-all border ${isDark
                            ? 'bg-zinc-900/50 border-white/5 text-zinc-300 hover:text-white hover:bg-zinc-800'
                            : 'bg-gray-50 border-gray-200 text-gray-600 hover:text-gray-900'}`}
                    >
                        Resend Email
                    </button>

                    <button
                        onClick={onCancel}
                        className="w-full py-4 rounded-2xl font-bold text-sm text-black bg-white hover:bg-orange-500 hover:text-white transition-all shadow-lg shadow-white/5"
                    >
                        Back to Sign In
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CodeVerification;
