import { Platform } from 'react-native';
import { env } from './env';

/**
 * Initialize Mapbox GL once at app boot. Safe to call multiple times.
 *
 * On web we skip native Mapbox entirely — `@rnmapbox/maps` is iOS/Android only.
 * The components fall back to MapPlaceholder on the web target.
 */
let initialized = false;
export function initMapbox() {
  if (initialized) return;
  if (Platform.OS === 'web') {
    initialized = true;
    return;
  }
  if (!env.mapboxAccessToken) {
    console.info('[RideFlow] Mapbox token missing — map will render the placeholder.');
    return;
  }
  // Lazy require so web bundlers don't try to resolve the native module.
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const Mapbox = require('@rnmapbox/maps').default;
  Mapbox.setAccessToken(env.mapboxAccessToken);
  Mapbox.setTelemetryEnabled(false);
  initialized = true;
}
