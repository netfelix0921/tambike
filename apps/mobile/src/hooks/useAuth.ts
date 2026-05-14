import { useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { authService } from '@/services/auth';
import { useAuthStore } from '@/stores/authStore';

/**
 * Subscribes to Supabase auth state and hydrates the auth store.
 * Mount this once at the root layout.
 */
export function useAuthBootstrap() {
  const { setSession, setProfile, setInitialized } = useAuthStore();

  useEffect(() => {
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
