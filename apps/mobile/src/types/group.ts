import type { LatLng } from './geo';

export type GroupRideStatus = 'scheduled' | 'live' | 'completed' | 'cancelled';

export interface GroupRide {
  id: string;
  hostId: string;
  title: string;
  description: string | null;
  meetupPoint: LatLng;
  meetupName: string;
  startsAt: string;
  rideType: 'chill' | 'coffee' | 'sunset' | 'training';
  routeId: string | null;
  status: GroupRideStatus;
  inviteCode: string;
  createdAt: string;
}

export type GroupParticipantRole = 'host' | 'member';
export type GroupParticipantStatus = 'invited' | 'going' | 'maybe' | 'declined';

export interface GroupParticipant {
  groupRideId: string;
  userId: string;
  displayName: string;
  avatarUrl: string | null;
  role: GroupParticipantRole;
  status: GroupParticipantStatus;
  /** Last broadcast position when the ride is live */
  liveLocation: LatLng | null;
  liveLocationUpdatedAt: string | null;
}
