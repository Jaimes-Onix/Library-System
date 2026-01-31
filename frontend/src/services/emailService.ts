import { supabase } from '../lib/supabase';

interface VerificationEmailParams {
    email: string;
    verificationToken: string;
}

export const sendVerificationEmail = async ({
    email,
    verificationToken
}: VerificationEmailParams): Promise<void> => {
    try {
        // Extract the 6-digit code from the token (last 6 characters)
        const verificationCode = verificationToken.slice(-6);

        // Invoke Supabase Edge Function to send email
        const { data, error } = await supabase.functions.invoke('send-verification-email', {
            body: {
                email,
                verificationCode,
                verificationToken
            }
        });

        if (error) {
            console.error('Email service error:', error);
            throw new Error('Failed to send verification email');
        }

        console.log('Verification email sent successfully:', data);
    } catch (error) {
        console.error('Error sending verification email:', error);
        throw error;
    }
};
