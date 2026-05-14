import { StyleSheet, View } from 'react-native';
import { theme } from '@/theme';
import { Card, Text } from '@/components/ui';
import { formatDistance, formatDuration, formatRelativeDate } from '@/utils/format';
import type { Ride } from '@/types/ride';

export interface RideHistoryItemProps {
  ride: Ride;
  onPress?: () => void;
}

export function RideHistoryItem({ ride, onPress }: RideHistoryItemProps) {
  return (
    <Card onPress={onPress} variant="flat">
      <View style={styles.headerRow}>
        <Text variant="bodyStrong" numberOfLines={1}>
          {ride.title || 'Morning ride'}
        </Text>
        <Text variant="caption" color="textMuted">
          {formatRelativeDate(ride.startedAt)}
        </Text>
      </View>

      <View style={styles.metricsRow}>
        <Metric label="Distance" value={`${formatDistance(ride.distanceM)} km`} />
        <Metric label="Time" value={formatDuration(ride.durationS)} />
        <Metric label="Avg" value={`${ride.avgSpeedKph.toFixed(1)} km/h`} />
      </View>
    </Card>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <View style={{ alignItems: 'flex-start', gap: 2 }}>
      <Text variant="overline" color="textMuted">
        {label}
      </Text>
      <Text variant="h3">{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.md,
  },
  metricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
