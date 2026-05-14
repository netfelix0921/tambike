import { supabase } from '@/lib/supabase';
import type { Hazard, PointOfInterest, PoiType } from '@/types/poi';
import type { LatLng } from '@/types/geo';

export const poisService = {
  /**
   * Fetch POIs within a radius (km) of a center point.
   * Backed by a Postgres RPC `pois_near` which uses PostGIS `ST_DWithin`.
   */
  async nearby(center: LatLng, radiusKm = 5, types?: PoiType[]): Promise<PointOfInterest[]> {
    const { data, error } = await supabase.rpc('pois_near', {
      lat: center.lat,
      lng: center.lng,
      radius_km: radiusKm,
      types: types ?? null,
    });
    if (error) throw error;
    return (data ?? []).map(mapPoiRow);
  },

  async listHazards(center: LatLng, radiusKm = 10): Promise<Hazard[]> {
    const { data, error } = await supabase.rpc('hazards_near', {
      lat: center.lat,
      lng: center.lng,
      radius_km: radiusKm,
    });
    if (error) throw error;
    return (data ?? []).map(mapHazardRow);
  },

  async reportHazard(input: Omit<Hazard, 'id' | 'confirmations' | 'reportedAt' | 'expiresAt'>) {
    const { data, error } = await supabase
      .from('hazards')
      .insert({
        reporter_id: input.reporterId,
        type: input.type,
        severity: input.severity,
        lat: input.coords.lat,
        lng: input.coords.lng,
        description: input.description,
      })
      .select()
      .single();
    if (error) throw error;
    return mapHazardRow(data);
  },

  async confirmHazard(hazardId: string) {
    const { error } = await supabase.rpc('confirm_hazard', { hazard_id: hazardId });
    if (error) throw error;
  },
};

function mapPoiRow(row: any): PointOfInterest {
  return {
    id: row.id,
    type: row.type,
    name: row.name,
    coords: { lat: row.lat, lng: row.lng },
    address: row.address,
    notes: row.notes,
    rating: row.rating,
    hours: row.hours,
    recommendedFor: row.recommended_for ?? [],
  };
}

function mapHazardRow(row: any): Hazard {
  return {
    id: row.id,
    reporterId: row.reporter_id,
    type: row.type,
    severity: row.severity,
    coords: { lat: row.lat, lng: row.lng },
    description: row.description,
    confirmations: row.confirmations ?? 0,
    reportedAt: row.reported_at,
    expiresAt: row.expires_at,
  };
}
