import { create } from 'zustand';
import type { RideMetrics, RideStatus, RideType, TrackPoint } from '@/types/ride';

const initialMetrics: RideMetrics = {
  distanceM: 0,
  durationS: 0,
  movingDurationS: 0,
  speedKph: 0,
  avgSpeedKph: 0,
  maxSpeedKph: 0,
  avgPaceSPerKm: 0,
  elevationGainM: 0,
  elevationLossM: 0,
  calories: 0,
};

interface RideState {
  status: RideStatus;
  rideType: RideType;
  startedAt: number | null;
  pausedAt: number | null;
  totalPausedMs: number;
  track: TrackPoint[];
  metrics: RideMetrics;

  start: (rideType: RideType) => void;
  pause: () => void;
  resume: () => void;
  stop: () => void;
  reset: () => void;
  appendPoint: (point: TrackPoint) => void;
  setMetrics: (metrics: RideMetrics) => void;
}

/**
 * Ride store — single source of truth for the active recording.
 * The `useRideTracker` hook owns lifecycle; UI reads metrics + status here.
 */
export const useRideStore = create<RideState>((set, get) => ({
  status: 'idle',
  rideType: 'chill',
  startedAt: null,
  pausedAt: null,
  totalPausedMs: 0,
  track: [],
  metrics: initialMetrics,

  start: (rideType) =>
    set({
      status: 'recording',
      rideType,
      startedAt: Date.now(),
      pausedAt: null,
      totalPausedMs: 0,
      track: [],
      metrics: initialMetrics,
    }),

  pause: () => set({ status: 'paused', pausedAt: Date.now() }),

  resume: () => {
    const { pausedAt, totalPausedMs } = get();
    set({
      status: 'recording',
      pausedAt: null,
      totalPausedMs: totalPausedMs + (pausedAt ? Date.now() - pausedAt : 0),
    });
  },

  stop: () => set({ status: 'completed' }),

  reset: () =>
    set({
      status: 'idle',
      startedAt: null,
      pausedAt: null,
      totalPausedMs: 0,
      track: [],
      metrics: initialMetrics,
    }),

  appendPoint: (point) =>
    set((state) =>
      state.status === 'recording' ? { track: [...state.track, point] } : state,
    ),

  setMetrics: (metrics) => set({ metrics }),
}));
