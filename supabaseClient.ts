
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.48.1';

// Provided by user
// Fix: Use 'as string' to prevent literal narrowing, resolving the 'unintentional comparison' TS errors.
const supabaseUrl = 'https://nbyfyftovedputxhlsjo.supabase.co' as string;
const supabaseAnonKey = 'sb_publishable_OT-UZ0CemUzQ516Qisls4g_W3IH_mkR' as string;

// If the URL is empty or a placeholder, we flag Supabase as unconfigured.
export const IS_SUPABASE_CONFIGURED = 
  supabaseUrl !== '' && 
  supabaseUrl !== 'https://placeholder.supabase.co' &&
  !supabaseUrl.includes('placeholder');

/**
 * Initialize the client.
 */
export const supabase = createClient(
  IS_SUPABASE_CONFIGURED ? supabaseUrl : 'https://placeholder.supabase.co',
  IS_SUPABASE_CONFIGURED ? supabaseAnonKey : 'placeholder-anon-key'
);
