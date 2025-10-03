import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabaseEnabled = Boolean(supabaseUrl && supabaseAnonKey);

// Supabase client (returns null if not configured)
export const supabase = supabaseEnabled
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

/**
 * Returns Supabase client or null if environment variables are not set.
 * Use this in demo mode to gracefully handle missing configuration.
 */
export function maybeSupabase() {
  return supabase;
}

/**
 * Throws an error if Supabase is not configured.
 * Use this when Supabase is required for functionality.
 */
export function requireSupabase() {
  if (!supabase) {
    throw new Error('Supabase not configured. Using demo mode.');
  }
  return supabase;
}
