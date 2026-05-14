import { StyleSheet, View } from 'react-native';
import { theme } from '@/theme';
import { Text } from './Text';

export interface StatTileProps {
  /** Big numeric value */
  value: string;
  /** Unit shown subtly next to the value */
  unit?: string;
  /** Caption above the value (e.g., "DISTANCE") */
  label: string;
  /** Optional emphasis size — `xl` is for the live ride hero metric */
  size?: 'md' | 'lg' | 'xl';
  align?: 'left' | 'center';
}

/**
 * StatTile — a uniform numeric block used everywhere stats are displayed.
 * Values use tabular-nums to prevent the live tracker from "dancing".
 */
export function StatTile({ value, unit, label, size = 'md', align = 'left' }: StatTileProps) {
  const variant = size === 'xl' ? 'metricLg' : size === 'lg' ? 'metricMd' : 'h1';

  return (
    <View style={[styles.container, align === 'center' && { alignItems: 'center' }]}>
      <Text variant="overline" color="textMuted">
        {label}
      </Text>
      <View style={styles.valueRow}>
        <Text variant={variant} color="textPrimary">
          {value}
        </Text>
        {unit ? (
          <Text variant="caption" color="textSecondary" style={styles.unit}>
            {unit}
          </Text>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'flex-start',
    gap: 4,
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 4,
  },
  unit: {
    paddingBottom: 6,
  },
});
