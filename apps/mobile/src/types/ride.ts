import type { LatLng, LngLat, RouteGeometry } from './geo';

/**
 * Ride mode selected by the rider — tunes routing and recommendations.
 */
export type RideType = 'chill' | 'coffee' | 'sunset' | 'training';

/**
 * Status of an in-flight ride recording.
 */
export type RideStatus = 'idle' | 'recording' | 'paused' | 'completed';

/**
 * A single GPS sample captured during ride tracking.
 */
export interface TrackPoint {
  lat: number;
  lng: number;
  /** Elevation in meters */
  altitude: number | null;
  /** Speed in m/s (raw from GPS — convert at display time) */
  speed: number | null;
  /** Heading in degrees */
  heading: number | null;
  /** Horizontal accuracy in meters */
  accuracy: number | null;
  /** Epoch ms */
  timestamp: number;
}

/**
 * Live, derived metrics shown on the tracker screen. All units are SI internally;
 * formatting/conversion happens at the UI boundary.
 */
export interface RideMetrics {
  /** meters */
  distanceM: number;
  /** seconds (only "moving" time excludes pauses) */
  durationS: number;
  movingDurationS: number;
  /** km/h current */
  speedKph: number;
  avgSpeedKph: number;
  maxSpeedKph: number;
  /** seconds per km, derived from avg speed */
  avgPaceSPerKm: number;
  elevationGainM: number;
  elevationLossM: number;
  calories: number;
}

export interface Ride {
  id: string;
  userId: string;
  title: string | null;
  rideType: RideType;
  status: RideStatus;
  startedAt: string;
  endedAt: string | null;
  /** Aggregated metrics — same shape as RideMetrics but persisted */
  distanceM: number;
  durationS: number;
  movingDurationS: number;
  avgSpeedKph: number;
  maxSpeedKph: number;
  avgPaceSPerKm: number;
  elevationGainM: number;
  calories: number;
  /** Optional encoded polyline for thumbnail/preview */
  polyline: string | null;
  /** Full track points (only when fetched in detail) */
  track?: TrackPoint[];
}

/**
 * A planned, saveable route — created in Planner, executable in Tracker.
 */
export interface PlannedRoute {
  id: string;
  ownerId: string;
  name: string;
  rideType: RideType;
  origin: LatLng;
  destination: LatLng;
  waypoints: LatLng[];
  geometry: RouteGeometry;
  /** Total distance from routing engine (m) */
  distanceM: number;
  /** ETA in seconds */
  durationS: number;
  elevationGainM: number;
  /** Sampled elevation profile for the elevation chart */
  elevationProfile: Array<{ d: number; e: number }>;
  saved: boolean;
  createdAt: string;
}

/**
 * The shape returned from the Mapbox Directions API after our adapter normalizes it.
 */
export interface RouteResult {
  geometry: RouteGeometry;
  distanceM: number;
  durationS: number;
  steps: NavigationStep[];
}

export interface NavigationStep {
  /** "Turn right onto Tordesillas St" */
  instruction: string;
  distanceM: number;
  durationS: number;
  /** Maneuver type — `turn-right`, `roundabout`, etc. */
  maneuver: string;
  /** Coordinates where this step starts: [lng, lat] */
  location: LngLat;
}

export type { LatLng, LngLat, RouteGeometry };
