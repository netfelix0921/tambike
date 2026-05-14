import { StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { theme } from '@/theme';
import { Text } from '@/components/ui';

/**
 * Used when Mapbox cannot render (no token / web fallback / Storybook).
 * Keeps the layout looking intentional rather than broken.
 */
export function MapPlaceholder({ message }: { message?: string }) {
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[theme.colors.ink, theme.colors.surface, theme.colors.surfaceElevated]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      <View style={styles.gridOverlay} />
      <Text variant="caption" color="textMuted" align="center">
        {message ?? 'Map preview will appear here'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  gridOverlay: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.05,
    backgroundColor: theme.colors.brand500,
  },
});
