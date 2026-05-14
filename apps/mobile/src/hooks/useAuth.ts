import { useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { authService } from '@/services/auth';
import { useAuthStore } from '@/stores/authStore';
import { isDemoMode } from '@/lib/env';
import type { UserProfile } from '@/types/user';

/** Stub profile used in demo mode so the UI looks alive without a backend. */
const DEMO_PROFILE: UserProfile = {
  id: 'demo-user',
  email: 'demo@rideflow.ph',
  displayName: 'Rio Castillo',
  avatarUrl: null,
  city: 'Metro Manila',
  bikeType: 'gravel',
  weightKg: 70,
  unitSystem: 'metric',
  createdAt: new Date().toISOString(),
};

/**
 * Subscribes to Supabase auth state and hydrates the auth store.
 * Mount this once at the root layout.
 *
 * In demo mode it bypasses Supabase and signs you in as a stub user so you
 * can preview the full app shell (home, plan, tracker, etc.).
 */
export function useAuthBootstrap() {
  const { setSession, setProfile, setInitialized } = useAuthStore();

  useEffect(() => {
    if (isDemoMode) {
      // Construct a fake session-shaped object so guards relying on `!!session` pass.
      const fakeSession = {
        access_token: 'demo',
        refresh_token: 'demo',
        token_type: 'bearer',
        expires_in: 3600,
        expires_at: Math.floor(Date.now() / 1000) + 3600,
        user: { id: DEMO_PROFILE.id, email: DEMO_PROFILE.email },
      } as any;
      setSession(fakeSession);
      setProfile(DEMO_PROFILE);
      setInitialized(true);
      return;
    }

    let mounted = true;

    supabase.auth.getSession().then(async ({ data }) => {
      if (!mounted) return;
      setSession(data.session ?? null);
      if (data.session?.user.id) {
        const profile = await authService.getProfile(data.session.user.id).catch(() => null);
        if (mounted) setProfile(profile);
      }
      if (mounted) setInitialized(true);
    });

    const { data: sub } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session ?? null);
      if (session?.user.id) {
        const profile = await authService.getProfile(session.user.id).catch(() => null);
        setProfile(profile);
      } else {
        setProfile(null);
      }
    });

    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, [setSession, setProfile, setInitialized]);
}

/**
 * Convenience selector for screens.
 */
export function useAuth() {
  return useAuthStore((s) => ({
    initialized: s.initialized,
    isAuthenticated: !!s.session,
    user: s.user,
    profile: s.profile,
  }));
}
