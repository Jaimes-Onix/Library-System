
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('[SUPABASE] Missing environment variables!');
    throw new Error('Missing Supabase environment variables');
}

console.log('[SUPABASE] Initializing client...');
console.log('[SUPABASE] URL:', supabaseUrl);
console.log('[SUPABASE] Anon Key exists:', !!supabaseAnonKey);

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

console.log('[SUPABASE] Client initialized successfully');
