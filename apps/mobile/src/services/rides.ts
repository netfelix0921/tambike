import { supabase } from '@/lib/supabase';
import type { Ride, TrackPoint } from '@/types/ride';

export const ridesService = {
  async list(userId: string): Promise<Ride[]> {
    const { data, error } = await supabase
      .from('rides')
      .select('*')
      .eq('user_id', userId)
      .order('started_at', { ascending: false });
    if (error) throw error;
    return (data ?? []).map(mapRideRow);
  },

  async get(rideId: string): Promise<Ride | null> {
    const { data, error } = await supabase
      .from('rides')
      .select('*, track_points(*)')
      .eq('id', rideId)
      .maybeSingle();
    if (error) throw error;
    if (!data) return null;
    return {
      ...mapRideRow(data),
      track: (data.track_points ?? []).map(mapTrackPointRow),
    };
  },

  async create(ride: Omit<Ride, 'id'>): Promise<Ride> {
    const { data, error } = await supabase
      .from('rides')
      .insert(toRideRow(ride))
      .select()
      .single();
    if (error) throw error;
    return mapRideRow(data);
  },

  async appendTrack(rideId: string, points: TrackPoint[]) {
    if (!points.length) return;
    const rows = points.map((p) => ({
      ride_id: rideId,
      lat: p.lat,
      lng: p.lng,
      altitude: p.altitude,
      speed: p.speed,
      heading: p.heading,
      accuracy: p.accuracy,
      ts: new Date(p.timestamp).toISOString(),
    }));
    const { error } = await supabase.from('track_points').insert(rows);
    if (error) throw error;
  },

  async finalize(rideId: string, summary: Partial<Ride>) {
    const { data, error } = await supabase
      .from('rides')
      .update({
        status: 'completed',
        ended_at: summary.endedAt,
        distance_m: summary.distanceM,
        duration_s: summary.durationS,
        moving_duration_s: summary.movingDurationS,
        avg_speed_kph: summary.avgSpeedKph,
        max_speed_kph: summary.maxSpeedKph,
        avg_pace_s_per_km: summary.avgPaceSPerKm,
        elevation_gain_m: summary.elevationGainM,
        calories: summary.calories,
        polyline: summary.polyline,
      })
      .eq('id', rideId)
      .select()
      .single();
    if (error) throw error;
    return mapRideRow(data);
  },
};

function mapRideRow(row: any): Ride {
  return {
    id: row.id,
    userId: row.user_id,
    title: row.title,
    rideType: row.ride_type,
    status: row.status,
    startedAt: row.started_at,
    endedAt: row.ended_at,
    distanceM: row.distance_m ?? 0,
    durationS: row.duration_s ?? 0,
    movingDurationS: row.moving_duration_s ?? 0,
    avgSpeedKph: row.avg_speed_kph ?? 0,
    maxSpeedKph: row.max_speed_kph ?? 0,
    avgPaceSPerKm: row.avg_pace_s_per_km ?? 0,
    elevationGainM: row.elevation_gain_m ?? 0,
    calories: row.calories ?? 0,
    polyline: row.polyline,
  };
}

function mapTrackPointRow(row: any): TrackPoint {
  return {
    lat: row.lat,
    lng: row.lng,
    altitude: row.altitude,
    speed: row.speed,
    heading: row.heading,
    accuracy: row.accuracy,
    timestamp: new Date(row.ts).getTime(),
  };
}

function toRideRow(ride: Omit<Ride, 'id'>) {
  return {
    user_id: ride.userId,
    title: ride.title,
    ride_type: ride.rideType,
    status: ride.status,
    started_at: ride.startedAt,
    ended_at: ride.endedAt,
    distance_m: ride.distanceM,
    duration_s: ride.durationS,
    moving_duration_s: ride.movingDurationS,
    avg_speed_kph: ride.avgSpeedKph,
    max_speed_kph: ride.maxSpeedKph,
    avg_pace_s_per_km: ride.avgPaceSPerKm,
    elevation_gain_m: ride.elevationGainM,
    calories: ride.calories,
    polyline: ride.polyline,
  };
}
