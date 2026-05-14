import type { LatLng, TrackPoint } from '@/types';

const EARTH_RADIUS_M = 6_371_000;

/**
 * Haversine distance between two coordinates in meters.
 */
export function haversine(a: LatLng, b: LatLng): number {
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);

  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * EARTH_RADIUS_M * Math.asin(Math.min(1, Math.sqrt(h)));
}

/**
 * Sum the distance along an ordered list of track points.
 * Filters out low-accuracy samples that would otherwise inflate distance.
 */
export function totalDistance(points: TrackPoint[], maxAccuracyM = 30): number {
  let total = 0;
  let last: TrackPoint | null = null;
  for (const p of points) {
    if (p.accuracy != null && p.accuracy > maxAccuracyM) continue;
    if (last) total += haversine(last, p);
    last = p;
  }
  return total;
}

/**
 * Cumulative elevation gain — sums all positive deltas with a small smoothing
 * threshold to ignore GPS noise.
 */
export function elevationGain(points: TrackPoint[], smoothingM = 2): number {
  let gain = 0;
  let lastEle: number | null = null;
  for (const p of points) {
    if (p.altitude == null) continue;
    if (lastEle != null) {
      const delta = p.altitude - lastEle;
      if (delta > smoothingM) {
        gain += delta;
      }
    }
    lastEle = p.altitude;
  }
  return gain;
}

function toRad(deg: number): number {
  return (deg * Math.PI) / 180;
}
