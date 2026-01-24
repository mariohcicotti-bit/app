import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://dsefhlaczureapcssmxh.supabase.co';
const supabaseAnonKey = 'sb_publishable_AO-3sFwNhi7Ke5InvjIXwg_Ji1QhA7O';

console.log('Supabase Config:', {
  url: supabaseUrl,
  key: supabaseAnonKey ? '***' + supabaseAnonKey.slice(-10) : 'UNDEFINED'
});

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
});
