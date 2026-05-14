import type { LatLng } from './geo';

export type PoiType = 'coffee' | 'water' | 'bike_shop' | 'rest_stop' | 'viewpoint';

export interface PointOfInterest {
  id: string;
  type: PoiType;
  name: string;
  coords: LatLng;
  address: string | null;
  notes: string | null;
  /** 1–5 community rating, may be null until reviewed */
  rating: number | null;
  /** Hours of operation as free-form text (e.g., "6am – 9pm") */
  hours: string | null;
  /** Best for this ride type (used to sort suggestions on Coffee/Sunset rides) */
  recommendedFor: Array<'chill' | 'coffee' | 'sunset' | 'training'>;
}

export type HazardType = 'flood' | 'pothole' | 'glass' | 'construction' | 'traffic' | 'other';
export type HazardSeverity = 'low' | 'medium' | 'high';

export interface Hazard {
  id: string;
  reporterId: string;
  type: HazardType;
  severity: HazardSeverity;
  coords: LatLng;
  description: string | null;
  /** Confirmations from other riders — used to fade old reports */
  confirmations: number;
  /** ISO timestamp; client treats as expired after 24h for non-flood hazards */
  reportedAt: string;
  expiresAt: string | null;
}
