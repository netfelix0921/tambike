/**
 * Environment access — single source of truth for runtime config.
 * Public values use the `EXPO_PUBLIC_*` convention so they ship with the bundle.
 *
 * Demo mode: when any required value is missing, the app switches to a
 * read-only, no-network experience. Lets you preview the UI on the web with
 * zero setup (e.g., GitHub Codespaces).
 */
export const env = {
  supabaseUrl: process.env.EXPO_PUBLIC_SUPABASE_URL ?? '',
  supabaseAnonKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? '',
  mapboxAccessToken: process.env.EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN ?? '',
} as const;

export const isDemoMode =
  !env.supabaseUrl || !env.supabaseAnonKey || env.supabaseUrl.includes('your-project');

export function assertEnv() {
  if (isDemoMode) {
    console.info('[RideFlow] Running in DEMO MODE — no Supabase, no Mapbox.');
    return;
  }
  const missing: string[] = [];
  if (!env.mapboxAccessToken) missing.push('EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN');
  if (missing.length) {
    console.warn(`[RideFlow] Missing env vars: ${missing.join(', ')}`);
  }
}
