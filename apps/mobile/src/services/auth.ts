import { supabase } from '@/lib/supabase';
import type { UserProfile } from '@/types/user';

export interface SignInPayload {
  email: string;
  password: string;
}

export interface SignUpPayload extends SignInPayload {
  displayName: string;
}

export const authService = {
  async signIn({ email, password }: SignInPayload) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
  },

  async signUp({ email, password, displayName }: SignUpPayload) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { display_name: displayName } },
    });
    if (error) throw error;
    return data;
  },

  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  async getProfile(userId: string): Promise<UserProfile | null> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();
    if (error) throw error;
    if (!data) return null;
    return mapProfileRow(data);
  },

  async updateProfile(userId: string, patch: Partial<UserProfile>) {
    const { data, error } = await supabase
      .from('profiles')
      .update(toProfileRow(patch))
      .eq('id', userId)
      .select()
      .single();
    if (error) throw error;
    return mapProfileRow(data);
  },
};

function mapProfileRow(row: any): UserProfile {
  return {
    id: row.id,
    email: row.email,
    displayName: row.display_name,
    avatarUrl: row.avatar_url,
    city: row.city,
    bikeType: row.bike_type,
    weightKg: row.weight_kg,
    unitSystem: row.unit_system ?? 'metric',
    createdAt: row.created_at,
  };
}

function toProfileRow(patch: Partial<UserProfile>) {
  return {
    display_name: patch.displayName,
    avatar_url: patch.avatarUrl,
    city: patch.city,
    bike_type: patch.bikeType,
    weight_kg: patch.weightKg,
    unit_system: patch.unitSystem,
  };
}
