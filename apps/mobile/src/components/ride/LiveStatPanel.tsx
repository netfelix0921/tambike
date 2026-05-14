import { StyleSheet, View } from 'react-native';
import { theme } from '@/theme';
import { Card, StatTile, Divider } from '@/components/ui';
import { formatDistance, formatDuration, formatPace } from '@/utils/format';
import type { RideMetrics } from '@/types/ride';

export interface LiveStatPanelProps {
  metrics: RideMetrics;
}

/**
 * The live ride dashboard — speed dominant, supporting stats arranged in a grid.
 */
export function LiveStatPanel({ metrics }: LiveStatPanelProps) {
  return (
    <Card variant="elevated" padding="xl">
      <View style={styles.heroRow}>
        <StatTile
          label="Speed"
          value={metrics.speedKph.toFixed(1)}
          unit="km/h"
          size="xl"
        />
      </View>

      <Divider />

      <View style={styles.grid}>
        <StatTile label="Distance" value={formatDistance(metrics.distanceM)} unit="km" size="lg" />
        <StatTile label="Time" value={formatDuration(metrics.durationS)} size="lg" />
      </View>

      <View style={styles.grid}>
        <StatTile label="Avg Pace" value={formatPace(metrics.avgPaceSPerKm)} unit="/km" size="md" />
        <StatTile label="Elev Gain" value={`${Math.round(metrics.elevationGainM)}`} unit="m" size="md" />
        <StatTile label="Calories" value={`${Math.round(metrics.calories)}`} unit="kcal" size="md" />
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  heroRow: {
    paddingVertical: theme.spacing.md,
  },
  grid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: theme.spacing.md,
    gap: theme.spacing.lg,
  },
});
