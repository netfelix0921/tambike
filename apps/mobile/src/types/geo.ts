/**
 * Geographic primitives shared across maps, ride tracking, and routing.
 */

export interface LatLng {
  lat: number;
  lng: number;
}

/** Mapbox-style coordinate ordering */
export type LngLat = [number, number];

export interface BoundingBox {
  ne: LatLng;
  sw: LatLng;
}

export interface RouteGeometry {
  /** GeoJSON LineString coordinates: [lng, lat][] */
  coordinates: LngLat[];
}

export interface ElevationPoint {
  distanceM: number;
  elevationM: number;
}
