import Mapbox from '@rnmapbox/maps';
import { env } from './env';

/**
 * Initialize Mapbox GL once at app boot. Safe to call multiple times.
 */
let initialized = false;
export function initMapbox() {
  if (initialized) return;
  if (!env.mapboxAccessToken) {
    console.warn('[RideFlow] Mapbox access token missing — map will not render.');
    return;
  }
  Mapbox.setAccessToken(env.mapboxAccessToken);
  // Telemetry off by default — respects rider privacy.
  Mapbox.setTelemetryEnabled(false);
  initialized = true;
}

export { Mapbox };
