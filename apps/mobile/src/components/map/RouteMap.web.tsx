import { MapPlaceholder } from './MapPlaceholder';
import type { RouteMapProps } from './RouteMap';

/**
 * Web fallback — `@rnmapbox/maps` is iOS/Android only.
 * The placeholder keeps the layout intentional so the app shell still feels
 * complete in browser previews (Expo Web / Codespaces).
 */
export function RouteMap(_props: RouteMapProps) {
  return <MapPlaceholder message="Map preview is mobile-only. Run on iOS/Android to see live tiles." />;
}

export type { RouteMapProps } from './RouteMap';
