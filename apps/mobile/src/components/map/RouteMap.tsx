import { useMemo, useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import Mapbox from '@rnmapbox/maps';
import { theme } from '@/theme';
import type { LatLng, RouteGeometry } from '@/types/ride';

export interface RouteMapProps {
  /** Coordinates of the active route as [lng, lat] tuples */
  route?: RouteGeometry | null;
  /** Live cyclist position */
  userLocation?: LatLng | null;
  /** Camera zoom (default 14 — good for city navigation) */
  zoom?: number;
  /** Map style URL — defaults to Mapbox night style suited for dark mode */
  styleURL?: string;
  /** Optional point-of-interest pins (coffee, water, hazard) */
  pois?: Array<{ id: string; coords: LatLng; color?: string }>;
  /** Show navigation puck (heading-aware) */
  showUserPuck?: boolean;
  /** Follow user / heading */
  followUser?: boolean;
}

/**
 * RouteMap — the single map surface used by Planner, Tracker, and Navigation screens.
 * Mapbox token is configured at app boot via `lib/mapbox.ts`.
 */
export function RouteMap({
  route,
  userLocation,
  zoom = 14,
  styleURL = Mapbox.StyleURL.Dark,
  pois,
  showUserPuck = true,
  followUser = false,
}: RouteMapProps) {
  const cameraRef = useRef<Mapbox.Camera>(null);

  const routeGeoJson = useMemo(() => {
    if (!route?.coordinates?.length) return null;
    return {
      type: 'Feature' as const,
      properties: {},
      geometry: {
        type: 'LineString' as const,
        coordinates: route.coordinates.map(([lng, lat]) => [lng, lat]),
      },
    };
  }, [route]);

  const center = userLocation
    ? [userLocation.lng, userLocation.lat]
    : route?.coordinates?.[0] ?? [120.9842, 14.5995]; // Default: Manila City Hall

  return (
    <View style={styles.container}>
      <Mapbox.MapView
        style={styles.map}
        styleURL={styleURL}
        compassEnabled
        scaleBarEnabled={false}
        attributionEnabled={false}
        logoEnabled={false}
      >
        <Mapbox.Camera
          ref={cameraRef}
          centerCoordinate={center}
          zoomLevel={zoom}
          followUserLocation={followUser}
          followUserMode={Mapbox.UserTrackingMode.FollowWithHeading}
          animationDuration={400}
        />

        {showUserPuck ? <Mapbox.UserLocation androidRenderMode="compass" visible /> : null}

        {routeGeoJson ? (
          <Mapbox.ShapeSource id="route-source" shape={routeGeoJson}>
            <Mapbox.LineLayer
              id="route-line-casing"
              style={{
                lineColor: theme.colors.routeLineCasing,
                lineWidth: 9,
                lineCap: 'round',
                lineJoin: 'round',
              }}
            />
            <Mapbox.LineLayer
              id="route-line"
              style={{
                lineColor: theme.colors.routeLine,
                lineWidth: 5,
                lineCap: 'round',
                lineJoin: 'round',
              }}
            />
          </Mapbox.ShapeSource>
        ) : null}

        {pois?.map((p) => (
          <Mapbox.PointAnnotation
            key={p.id}
            id={`poi-${p.id}`}
            coordinate={[p.coords.lng, p.coords.lat]}
          >
            <View
              style={[
                styles.poi,
                { backgroundColor: p.color ?? theme.colors.coffeeStop },
              ]}
            />
          </Mapbox.PointAnnotation>
        ))}
      </Mapbox.MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.ink },
  map: { flex: 1 },
  poi: {
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: '#000',
  },
});
