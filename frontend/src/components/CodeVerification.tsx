
import React, { useEffect, useState } from 'react';
import { Theme } from '../types';
import { Loader2, Mail, CheckCircle2, XCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface CodeVerificationProps {
    theme: Theme;
    email: string;
    verificationToken: string;
    onVerified: () => void;
    onCancel: () => void;
}

export type VerificationStatus = 'pending' | 'verified' | 'expired' | 'error';

const CodeVerification: React.FC<CodeVerificationProps> = ({
    theme,
    email,
    verificationToken,
    onVerified,
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
            // Check if the code matches the token in database
            const { data, error } = await supabase
                .from('verification_tokens')
                .select('*')
                .eq('token', verificationToken)
                .eq('status', 'pending')
                .single();

            if (error || !data) {
                setError('Verification code expired or invalid');
                setIsVerifying(false);
                return;
            }

            // In a real implementation, you'd store the 6-digit code separately
            // For now, we'll use the last 6 characters of the token
            const storedCode = verificationToken.slice(-6);

            if (enteredCode === storedCode) {
                setStatus('verified');

                // Update token status
                await supabase
                    .from('verification_tokens')
                    .update({ status: 'verified' })
                    .eq('token', verificationToken);

                setTimeout(onVerified, 1500);
            } else {
                setError('Invalid verification code. Please try again.');
                setCode(['', '', '', '', '', '']);
                document.getElementById('code-0')?.focus();
            }
        } catch (err) {
            setError('Verification failed. Please try again.');
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
            <div className={`max-w-md w-full rounded-3xl p-8 ${isDark ? 'bg-zinc-800 border border-zinc-700' : 'bg-white border border-gray-200'} shadow-2xl`}>
                {status === 'pending' && (
                    <>
                        <div className="text-center mb-8">
                            <div className="w-16 h-16 bg-amber-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Mail className="text-amber-500" size={32} />
                            </div>
                            <h2 className={`text-2xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>Check Your Email</h2>
                            <p className={`${isDark ? 'text-zinc-300' : 'text-gray-600'}`}>
                                We've sent a 6-digit code to <br />
                                <span className="font-semibold text-amber-500">{email}</span>
                            </p>
                        </div>

                        <div className="mb-6">
                            <div className="flex gap-2 justify-center mb-4">
                                {code.map((digit, index) => (
                                    <input
                                        key={index}
                                        id={`code-${index}`}
                                        type="text"
                                        inputMode="numeric"
                                        maxLength={1}
                                        value={digit}
                                        onChange={(e) => handleCodeChange(index, e.target.value)}
                                        onKeyDown={(e) => handleKeyDown(index, e)}
                                        className={`w-12 h-14 text-center text-2xl font-bold rounded-xl border-2 transition-all ${isDark
                                                ? 'bg-zinc-900 border-zinc-700 text-white focus:border-amber-500'
                                                : 'bg-gray-50 border-gray-300 text-gray-900 focus:border-amber-500'
                                            } focus:outline-none focus:ring-2 focus:ring-amber-500/20`}
                                        disabled={isVerifying}
                                    />
                                ))}
                            </div>

                            {error && (
                                <p className="text-red-500 text-sm text-center mb-2">{error}</p>
                            )}

                            {isVerifying && (
                                <div className="flex items-center justify-center gap-2 text-amber-500">
                                    <Loader2 className="animate-spin" size={16} />
                                    <span className="text-sm font-semibold">Verifying...</span>
                                </div>
                            )}
                        </div>

                        <div className="text-center mb-6">
                            <p className={`text-xs ${isDark ? 'text-zinc-400' : 'text-gray-500'}`}>
                                Code expires in {formatTime(countdown)}
                            </p>
                        </div>

                        <button
                            onClick={onCancel}
                            className={`w-full py-3 font-semibold transition-colors ${isDark ? 'text-zinc-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'}`}
                        >
                            Cancel
                        </button>
                    </>
                )}

                {status === 'verified' && (
                    <div className="text-center py-8">
                        <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                            <CheckCircle2 className="text-green-500" size={32} />
                        </div>
                        <h2 className={`text-2xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>Verified!</h2>
                        <p className={`${isDark ? 'text-zinc-400' : 'text-gray-600'}`}>Creating your account...</p>
                    </div>
                )}

                {status === 'expired' && (
                    <div className="text-center py-8">
                        <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                            <XCircle className="text-red-500" size={32} />
                        </div>
                        <h2 className={`text-2xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>Code Expired</h2>
                        <p className={`mb-6 ${isDark ? 'text-zinc-400' : 'text-gray-600'}`}>Please try signing up again.</p>
                        <button
                            onClick={onCancel}
                            className={`w-full py-3 rounded-xl font-semibold transition-all ${isDark ? 'bg-zinc-900 hover:bg-zinc-800 text-white' : 'bg-gray-900 hover:bg-gray-800 text-white'
                                }`}
                        >
                            Try Again
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CodeVerification;
