
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://tjvenykbssfojlrhdvvc.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRqdmVueWtic3Nmb2pscmhkdnZjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk4MjQ0NzMsImV4cCI6MjA4NTQwMDQ3M30.7CwCNPYuO1eAlqTJzauX6hlO9dS1gXH2C1ylh9Yj5pM';
const supabase = createClient(supabaseUrl, supabaseKey);

async function createAdmin() {
    console.log('Node:', process.version);
    console.log('Attempting admin.test@example.com...');

    const { data, error } = await supabase.auth.signUp({
        email: 'admin.test@example.com',
        password: 'Password123!',
    });

    if (error) {
        console.error('Error:', error.message);
    } else {
        console.log('Success:', data.user?.id);
    }
}

createAdmin();
