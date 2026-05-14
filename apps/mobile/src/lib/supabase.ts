import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { env, isDemoMode } from './env';

/**
 * Supabase client.
 *
 * In demo mode we still construct a client (with a placeholder URL) so that
 * downstream services don't crash when imported, but no real network calls
 * are made — the auth bootstrap short-circuits with a stub profile.
 */
const url = isDemoMode ? 'https://demo.invalid' : env.supabaseUrl;
const key = isDemoMode ? 'demo-anon-key' : env.supabaseAnonKey;

export const supabase = createClient(url, key, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: !isDemoMode,
    persistSession: !isDemoMode,
    detectSessionInUrl: false,
  },
  realtime: {
    params: { eventsPerSecond: 5 },
  },
});
