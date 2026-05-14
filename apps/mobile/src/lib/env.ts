/**
 * Environment access — single source of truth for runtime config.
 * Public values use the `EXPO_PUBLIC_*` convention so they ship with the bundle.
 */
export const env = {
  supabaseUrl: process.env.EXPO_PUBLIC_SUPABASE_URL ?? '',
  supabaseAnonKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? '',
  mapboxAccessToken: process.env.EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN ?? '',
} as const;

export function assertEnv() {
  const missing: string[] = [];
  if (!env.supabaseUrl) missing.push('EXPO_PUBLIC_SUPABASE_URL');
  if (!env.supabaseAnonKey) missing.push('EXPO_PUBLIC_SUPABASE_ANON_KEY');
  if (!env.mapboxAccessToken) missing.push('EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN');
  if (missing.length) {
    // Don't crash in dev — just warn loudly.
    console.warn(`[RideFlow] Missing env vars: ${missing.join(', ')}`);
  }
}
