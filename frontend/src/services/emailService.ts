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
        // Format: uuid + code, we just want the code for the email
        const verificationCode = verificationToken.slice(-6);

        console.log(`Attempting to send verification email to ${email}`);

        // Invoke Supabase Edge Function to send email
        const { data, error } = await supabase.functions.invoke('send-verification-email', {
            body: {
                email,
                verificationCode,
                verificationToken
            }
        });

        if (error) {
            console.error('Supabase Function Error:', error);
            // Check for specific error types if detailed error info is available
            // For now, we throw a generic error that the UI can catch
            throw new Error(error.message || 'Failed to invoke email function');
        }

        if (data?.error) {
            console.error('Email Service Error:', data.error);
            throw new Error(data.error);
        }

        console.log('Verification email sent successfully');
    } catch (error: any) {
        console.error('Error sending verification email:', error);
        // Re-throw so the UI knows it failed and can show the fallback code
        throw new Error(error.message || 'Failed to send verification email');
    }
};
