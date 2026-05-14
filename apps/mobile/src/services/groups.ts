import { supabase } from '@/lib/supabase';
import type { GroupParticipant, GroupRide } from '@/types/group';
import type { LatLng } from '@/types/geo';

export const groupsService = {
  async listMine(userId: string): Promise<GroupRide[]> {
    const { data, error } = await supabase
      .from('group_rides')
      .select('*, group_participants!inner(user_id)')
      .eq('group_participants.user_id', userId)
      .order('starts_at', { ascending: true });
    if (error) throw error;
    return (data ?? []).map(mapGroupRow);
  },

  async create(input: Omit<GroupRide, 'id' | 'inviteCode' | 'createdAt' | 'status'>) {
    const { data, error } = await supabase
      .from('group_rides')
      .insert({
        host_id: input.hostId,
        title: input.title,
        description: input.description,
        meetup_lat: input.meetupPoint.lat,
        meetup_lng: input.meetupPoint.lng,
        meetup_name: input.meetupName,
        starts_at: input.startsAt,
        ride_type: input.rideType,
        route_id: input.routeId,
      })
      .select()
      .single();
    if (error) throw error;
    return mapGroupRow(data);
  },

  async join(groupRideId: string, userId: string) {
    const { error } = await supabase
      .from('group_participants')
      .insert({ group_ride_id: groupRideId, user_id: userId, role: 'member', status: 'going' });
    if (error) throw error;
  },

  async listParticipants(groupRideId: string): Promise<GroupParticipant[]> {
    const { data, error } = await supabase
      .from('group_participants')
      .select('*, profiles(display_name, avatar_url)')
      .eq('group_ride_id', groupRideId);
    if (error) throw error;
    return (data ?? []).map(mapParticipantRow);
  },

  /** Push a live location ping for the current group ride */
  async pingLocation(groupRideId: string, userId: string, coords: LatLng) {
    const { error } = await supabase
      .from('group_participants')
      .update({
        live_lat: coords.lat,
        live_lng: coords.lng,
        live_updated_at: new Date().toISOString(),
      })
      .eq('group_ride_id', groupRideId)
      .eq('user_id', userId);
    if (error) throw error;
  },

  /**
   * Subscribe to live participant location updates via Supabase Realtime.
   */
  subscribeToParticipants(groupRideId: string, onChange: () => void) {
    const channel = supabase
      .channel(`group-ride:${groupRideId}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'group_participants', filter: `group_ride_id=eq.${groupRideId}` },
        () => onChange(),
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  },
};

function mapGroupRow(row: any): GroupRide {
  return {
    id: row.id,
    hostId: row.host_id,
    title: row.title,
    description: row.description,
    meetupPoint: { lat: row.meetup_lat, lng: row.meetup_lng },
    meetupName: row.meetup_name,
    startsAt: row.starts_at,
    rideType: row.ride_type,
    routeId: row.route_id,
    status: row.status,
    inviteCode: row.invite_code,
    createdAt: row.created_at,
  };
}

function mapParticipantRow(row: any): GroupParticipant {
  return {
    groupRideId: row.group_ride_id,
    userId: row.user_id,
    displayName: row.profiles?.display_name ?? 'Rider',
    avatarUrl: row.profiles?.avatar_url ?? null,
    role: row.role,
    status: row.status,
    liveLocation: row.live_lat != null ? { lat: row.live_lat, lng: row.live_lng } : null,
    liveLocationUpdatedAt: row.live_updated_at,
  };
}
