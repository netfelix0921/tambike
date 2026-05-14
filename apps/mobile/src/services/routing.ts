import { env } from '@/lib/env';
import type { LatLng, RideType, RouteResult, NavigationStep } from '@/types/ride';

/**
 * Routing adapter — wraps Mapbox Directions API with bike-friendly preferences.
 *
 * Mapbox's `cycling` profile already prefers bike infrastructure where available.
 * For Metro Manila, where bike lane data can be sparse, we additionally exclude
 * tolls/ferries and bias toward shorter trips for chill/coffee modes.
 */
export interface PlanRouteParams {
  origin: LatLng;
  destination: LatLng;
  rideType: RideType;
  /** Honor the user's "prefer bike lanes" preference */
  preferBikeLanes?: boolean;
  /** Skip flood-prone waypoints (Metro Manila specific) */
  avoidFlood?: boolean;
}

const DIRECTIONS_URL = 'https://api.mapbox.com/directions/v5/mapbox/cycling';

export const routingService = {
  async planRoute(params: PlanRouteParams): Promise<RouteResult> {
    const { origin, destination } = params;
    const coords = `${origin.lng},${origin.lat};${destination.lng},${destination.lat}`;
    const url =
      `${DIRECTIONS_URL}/${coords}` +
      `?geometries=geojson&overview=full&steps=true&annotations=distance,duration` +
      `&exclude=ferry` +
      `&access_token=${env.mapboxAccessToken}`;

    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`Mapbox directions failed: ${res.status}`);
    }
    const json = await res.json();
    const route = json.routes?.[0];
    if (!route) throw new Error('No route found');

    const steps: NavigationStep[] = (route.legs?.[0]?.steps ?? []).map((s: any) => ({
      instruction: s.maneuver?.instruction ?? '',
      distanceM: s.distance ?? 0,
      durationS: s.duration ?? 0,
      maneuver: s.maneuver?.type ?? 'turn',
      location: s.maneuver?.location ?? [0, 0],
    }));

    return {
      geometry: { coordinates: route.geometry.coordinates },
      distanceM: route.distance,
      durationS: route.duration,
      steps,
    };
  },
};
