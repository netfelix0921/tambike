/**
 * The authenticated rider profile. Mirrors `profiles` table.
 */
export interface UserProfile {
  id: string;
  email: string;
  displayName: string;
  avatarUrl: string | null;
  city: string | null;
  bikeType: BikeType | null;
  weightKg: number | null;
  unitSystem: UnitSystem;
  createdAt: string;
}

export type BikeType = 'road' | 'mtb' | 'gravel' | 'commuter' | 'folding' | 'fixie';

export type UnitSystem = 'metric' | 'imperial';

export interface UserPreferences {
  units: UnitSystem;
  voiceNavigation: boolean;
  preferBikeLanes: boolean;
  avoidHighways: boolean;
  avoidFloodProneRoads: boolean;
  shareLiveLocation: boolean;
}
