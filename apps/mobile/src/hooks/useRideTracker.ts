import { useCallback, useEffect, useRef } from 'react';
import * as Speech from 'expo-speech';
import { useRideStore } from '@/stores/rideStore';
import { useAuthStore } from '@/stores/authStore';
import { useLocation } from './useLocation';
import { elevationGain, totalDistance } from '@/utils/geo';
import { estimateCalories } from '@/utils/calories';
import type { RideType, TrackPoint } from '@/types/ride';

/**
 * useRideTracker — orchestrates start / pause / resume / stop and derives
 * live metrics from incoming GPS samples. Pass into the LiveTracker screen.
 */
export function useRideTracker() {
  const profile = useAuthStore((s) => s.profile);
  const status = useRideStore((s) => s.status);
  const startedAt = useRideStore((s) => s.startedAt);
  const totalPausedMs = useRideStore((s) => s.totalPausedMs);
  const track = useRideStore((s) => s.track);
  const startStore = useRideStore((s) => s.start);
  const pauseStore = useRideStore((s) => s.pause);
  const resumeStore = useRideStore((s) => s.resume);
  const stopStore = useRideStore((s) => s.stop);
  const resetStore = useRideStore((s) => s.reset);
  const appendPoint = useRideStore((s) => s.appendPoint);
  const setMetrics = useRideStore((s) => s.setMetrics);

  const tickRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Stream GPS only while recording or paused — saves battery in idle screens.
  useLocation({
    watch: status === 'recording',
    distanceInterval: 3,
    timeInterval: 1000,
    onUpdate: useCallback(
      (p: TrackPoint) => {
        appendPoint(p);
      },
      [appendPoint],
    ),
  });

  // Recompute derived metrics every second so the timer is smooth.
  useEffect(() => {
    if (status !== 'recording') {
      if (tickRef.current) clearInterval(tickRef.current);
      tickRef.current = null;
      return;
    }

    tickRef.current = setInterval(() => {
      if (!startedAt) return;
      const distanceM = totalDistance(track);
      const elapsedMs = Date.now() - startedAt - totalPausedMs;
      const durationS = elapsedMs / 1000;
      const movingDurationS = durationS; // simplification — refine with stationary detection

      const last = track[track.length - 1];
      const speedKph = last?.speed != null && last.speed > 0 ? last.speed * 3.6 : 0;
      const avgSpeedKph = movingDurationS > 0 ? (distanceM / 1000) / (movingDurationS / 3600) : 0;
      const maxSpeedKph = track.reduce(
        (max, p) => Math.max(max, p.speed != null ? p.speed * 3.6 : 0),
        0,
      );
      const avgPaceSPerKm = avgSpeedKph > 0 ? 3600 / avgSpeedKph : 0;
      const elevGain = elevationGain(track);
      const calories = estimateCalories({
        weightKg: profile?.weightKg ?? 70,
        durationS: movingDurationS,
        avgSpeedKph,
      });

      setMetrics({
        distanceM,
        durationS,
        movingDurationS,
        speedKph,
        avgSpeedKph,
        maxSpeedKph,
        avgPaceSPerKm,
        elevationGainM: elevGain,
        elevationLossM: 0,
        calories,
      });
    }, 1000);

    return () => {
      if (tickRef.current) clearInterval(tickRef.current);
      tickRef.current = null;
    };
  }, [status, startedAt, totalPausedMs, track, profile?.weightKg, setMetrics]);

  const start = useCallback(
    (rideType: RideType) => {
      startStore(rideType);
      Speech.speak('Ride started. Stay safe out there.').catch(() => {});
    },
    [startStore],
  );

  const pause = useCallback(() => {
    pauseStore();
    Speech.speak('Paused.').catch(() => {});
  }, [pauseStore]);

  const resume = useCallback(() => {
    resumeStore();
    Speech.speak('Resumed.').catch(() => {});
  }, [resumeStore]);

  const stop = useCallback(() => {
    stopStore();
    Speech.speak('Ride complete. Great work!').catch(() => {});
  }, [stopStore]);

  return { status, start, pause, resume, stop, reset: resetStore };
}
