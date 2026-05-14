import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';

import { theme } from '@/theme';
import { Button, Card, Input, Screen, StatTile, Text } from '@/components/ui';
import { RouteMap, MapPlaceholder } from '@/components/map';
import { RideTypeSelector } from '@/components/ride';
import { TargetIcon, NavIcon } from '@/components/icons';
import type { RideType, RouteResult } from '@/types/ride';
import { routingService } from '@/services/routing';
import { formatDistance, formatDuration } from '@/utils/format';
import { env } from '@/lib/env';

export default function PlanScreen() {
  const router = useRouter();
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [rideType, setRideType] = useState<RideType>('chill');
  const [route, setRoute] = useState<RouteResult | null>(null);
  const [loading, setLoading] = useState(false);

  const onPlan = async () => {
    // In a full impl, geocode the strings via Mapbox. For the scaffold we use
    // sensible Manila defaults so the planner is testable end-to-end.
    setLoading(true);
    try {
      const result = await routingService.planRoute({
        origin: { lat: 14.555, lng: 121.0244 }, // Bonifacio Global City
        destination: { lat: 14.5832, lng: 120.9762 }, // Manila Bay
        rideType,
        preferBikeLanes: true,
        avoidFlood: true,
      });
      setRoute(result);
    } catch (e) {
      console.warn(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen padded={false}>
      <View style={styles.mapWrap}>
        {env.mapboxAccessToken ? (
          <RouteMap route={route?.geometry ?? null} />
        ) : (
          <MapPlaceholder message="Add a Mapbox token in .env to see the map" />
        )}
      </View>

      <View style={styles.sheet}>
        <Text variant="h2">Plan a ride</Text>

        <View style={{ gap: theme.spacing.md, marginTop: theme.spacing.lg }}>
          <Input
            label="From"
            placeholder="Current location"
            value={origin}
            onChangeText={setOrigin}
            leftSlot={<TargetIcon color={theme.colors.brand500} size={18} />}
          />
          <Input
            label="To"
            placeholder="Where to?"
            value={destination}
            onChangeText={setDestination}
            leftSlot={<NavIcon color={theme.colors.sunset500} size={18} />}
          />
        </View>

        <View style={{ marginTop: theme.spacing.lg }}>
          <Text variant="overline" color="textSecondary" style={{ marginBottom: theme.spacing.sm }}>
            Ride type
          </Text>
          <RideTypeSelector value={rideType} onChange={setRideType} />
        </View>

        {route ? (
          <Card variant="elevated" style={{ marginTop: theme.spacing.lg }}>
            <View style={styles.summaryRow}>
              <StatTile label="Distance" value={formatDistance(route.distanceM)} unit="km" />
              <StatTile label="ETA" value={formatDuration(route.durationS)} />
              <StatTile label="Steps" value={`${route.steps.length}`} />
            </View>
          </Card>
        ) : null}

        <View style={{ flexDirection: 'row', gap: theme.spacing.sm, marginTop: theme.spacing.lg }}>
          <Button
            label={route ? 'Re-plan' : 'Plan route'}
            variant="secondary"
            onPress={onPlan}
            loading={loading}
            fullWidth={false}
            style={{ flex: 1 }}
          />
          <Button
            label="Start"
            onPress={() => router.push('/ride/navigation')}
            disabled={!route}
            fullWidth={false}
            style={{ flex: 1 }}
          />
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  mapWrap: { height: 280 },
  sheet: {
    flex: 1,
    backgroundColor: theme.colors.ink,
    marginTop: -theme.radius.xl,
    borderTopLeftRadius: theme.radius.xl,
    borderTopRightRadius: theme.radius.xl,
    padding: theme.layout.screenPadding,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
