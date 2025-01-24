// Ensure environment variables are defined
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl) {
  throw new Error('SUPABASE_URL is not defined');
}

if (!supabaseAnonKey) {
  throw new Error('SUPABASE_ANON_KEY is not defined');
}

export const SUPABASE_URL: string = supabaseUrl;
export const SUPABASE_ANON_KEY: string = supabaseAnonKey;
