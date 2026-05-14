import { useEffect, useRef, useState } from 'react';
import * as Location from 'expo-location';
import type { LatLng, TrackPoint } from '@/types';

export interface UseLocationOptions {
  /** Stream high-accuracy updates while true. Default: false (one-shot fix). */
  watch?: boolean;
  /** Minimum movement (meters) before a new update fires */
  distanceInterval?: number;
  /** Minimum time (ms) between updates */
  timeInterval?: number;
  /** Called when a new fix arrives — useful for ride tracking */
  onUpdate?: (point: TrackPoint) => void;
}

/**
 * Foreground location hook.
 * Background tracking is configured via expo-location task manager
 * — see `services/locationTask.ts` (omitted from this scaffold for brevity).
 */
export function useLocation({
  watch = false,
  distanceInterval = 5,
  timeInterval = 1000,
  onUpdate,
}: UseLocationOptions = {}) {
  const [location, setLocation] = useState<LatLng | null>(null);
  const [permissionGranted, setPermissionGranted] = useState<boolean | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const subRef = useRef<Location.LocationSubscription | null>(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (cancelled) return;
        const granted = status === Location.PermissionStatus.GRANTED;
        setPermissionGranted(granted);
        if (!granted) {
          setError(new Error('Location permission denied'));
          return;
        }

        if (watch) {
          subRef.current = await Location.watchPositionAsync(
            {
              accuracy: Location.Accuracy.BestForNavigation,
              distanceInterval,
              timeInterval,
            },
            (loc) => {
              const point: TrackPoint = {
                lat: loc.coords.latitude,
                lng: loc.coords.longitude,
                altitude: loc.coords.altitude,
                speed: loc.coords.speed,
                heading: loc.coords.heading,
                accuracy: loc.coords.accuracy,
                timestamp: loc.timestamp,
              };
              setLocation({ lat: point.lat, lng: point.lng });
              onUpdate?.(point);
            },
          );
        } else {
          const loc = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.High,
          });
          if (cancelled) return;
          setLocation({ lat: loc.coords.latitude, lng: loc.coords.longitude });
        }
      } catch (e) {
        if (!cancelled) setError(e as Error);
      }
    })();

    return () => {
      cancelled = true;
      subRef.current?.remove();
      subRef.current = null;
    };
  }, [watch, distanceInterval, timeInterval, onUpdate]);

  return { location, permissionGranted, error };
}
