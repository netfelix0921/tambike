/**
 * Estimate calories burned cycling using a MET-based model.
 *
 * MET values per intensity (cycling on level ground):
 *   chill:   6   (~16 km/h)
 *   commute: 8   (~19 km/h)
 *   training:10  (~24 km/h)
 *
 * calories = MET * weightKg * hours
 */
export interface CalorieInput {
  weightKg: number;
  durationS: number;
  avgSpeedKph: number;
}

export function estimateCalories({ weightKg, durationS, avgSpeedKph }: CalorieInput): number {
  if (weightKg <= 0 || durationS <= 0) return 0;
  const met = metForSpeed(avgSpeedKph);
  const hours = durationS / 3600;
  return met * weightKg * hours;
}

function metForSpeed(kph: number): number {
  if (kph < 13) return 4;
  if (kph < 17) return 6;
  if (kph < 20) return 8;
  if (kph < 25) return 10;
  return 12;
}
