import { supabase } from '@/lib/supabase';
import type { PlannedRoute } from '@/types/ride';

export const routesService = {
  async listSaved(userId: string): Promise<PlannedRoute[]> {
    const { data, error } = await supabase
      .from('planned_routes')
      .select('*')
      .eq('owner_id', userId)
      .eq('saved', true)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return (data ?? []).map(mapRow);
  },

  async save(route: Omit<PlannedRoute, 'id' | 'createdAt'>) {
    const { data, error } = await supabase
      .from('planned_routes')
      .insert({
        owner_id: route.ownerId,
        name: route.name,
        ride_type: route.rideType,
        origin_lat: route.origin.lat,
        origin_lng: route.origin.lng,
        dest_lat: route.destination.lat,
        dest_lng: route.destination.lng,
        waypoints: route.waypoints,
        geometry: route.geometry,
        distance_m: route.distanceM,
        duration_s: route.durationS,
        elevation_gain_m: route.elevationGainM,
        elevation_profile: route.elevationProfile,
        saved: route.saved,
      })
      .select()
      .single();
    if (error) throw error;
    return mapRow(data);
  },
};

function mapRow(row: any): PlannedRoute {
  return {
    id: row.id,
    ownerId: row.owner_id,
    name: row.name,
    rideType: row.ride_type,
    origin: { lat: row.origin_lat, lng: row.origin_lng },
    destination: { lat: row.dest_lat, lng: row.dest_lng },
    waypoints: row.waypoints ?? [],
    geometry: row.geometry,
    distanceM: row.distance_m ?? 0,
    durationS: row.duration_s ?? 0,
    elevationGainM: row.elevation_gain_m ?? 0,
    elevationProfile: row.elevation_profile ?? [],
    saved: row.saved ?? false,
    createdAt: row.created_at,
  };
}
