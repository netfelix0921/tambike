import { create } from 'zustand';
import type { Session, User } from '@supabase/supabase-js';
import type { UserProfile } from '@/types/user';

interface AuthState {
  initialized: boolean;
  session: Session | null;
  user: User | null;
  profile: UserProfile | null;
  setSession: (session: Session | null) => void;
  setProfile: (profile: UserProfile | null) => void;
  setInitialized: (v: boolean) => void;
  reset: () => void;
}

/**
 * Auth store — kept intentionally thin. The hook (useAuth) drives subscriptions
 * to Supabase and writes into this store; UI reads via selectors.
 */
export const useAuthStore = create<AuthState>((set) => ({
  initialized: false,
  session: null,
  user: null,
  profile: null,
  setSession: (session) => set({ session, user: session?.user ?? null }),
  setProfile: (profile) => set({ profile }),
  setInitialized: (initialized) => set({ initialized }),
  reset: () => set({ session: null, user: null, profile: null }),
}));
