import { StyleSheet, View } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

import { theme } from '@/theme';
import { IconButton, Screen, StatTile, Text } from '@/components/ui';
import { RouteMap, MapPlaceholder } from '@/components/map';
import { ArrowRightIcon, ChevronRightIcon } from '@/components/icons';
import { useLocation } from '@/hooks/useLocation';
import { env } from '@/lib/env';

/**
 * Navigation screen — minimal-cognitive-load while moving.
 * Big maneuver card on top, ETA card on bottom, full-screen map between.
 *
 * In a full impl, the next instruction comes from a navigation engine
 * (Mapbox Nav SDK or our own off-route detector). Here we render a static
 * preview so the screen is end-to-end visible.
 */
export default function NavigationScreen() {
  const router = useRouter();
  const { location } = useLocation({ watch: true });

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <Screen padded={false} transparent edges={['top']}>
        <View style={StyleSheet.absoluteFill}>
          {env.mapboxAccessToken ? (
            <RouteMap userLocation={location} followUser showUserPuck zoom={16} />
          ) : (
            <MapPlaceholder message="Navigation map" />
          )}
        </View>

        {/* Top instruction card */}
        <View style={styles.instructionWrap}>
          <View style={styles.instructionCard}>
            <View style={styles.maneuverCircle}>
              <ArrowRightIcon color={theme.colors.textInverse} size={28} />
            </View>
            <View style={{ flex: 1 }}>
              <Text variant="caption" color="textMuted">
                In 220 m
              </Text>
              <Text variant="h2">Turn right</Text>
              <Text variant="body" color="textSecondary">
                onto Roxas Boulevard
              </Text>
            </View>
            <IconButton
              icon={<ChevronRightIcon color={theme.colors.textPrimary} size={18} />}
              onPress={() => router.back()}
              style={{ transform: [{ rotate: '180deg' }] }}
              accessibilityLabel="Exit navigation"
            />
          </View>
        </View>

        {/* Bottom ETA card */}
        <LinearGradient
          colors={['transparent', theme.colors.ink]}
          style={styles.bottomScrim}
          pointerEvents="none"
        />
        <View style={styles.etaCard}>
          <View style={styles.etaRow}>
            <StatTile label="ETA" value="5:42 PM" />
            <StatTile label="Remaining" value="6.2" unit="km" />
            <StatTile label="Time" value="22 min" />
          </View>
        </View>
      </Screen>
    </>
  );
}

const styles = StyleSheet.create({
  instructionWrap: {
    paddingHorizontal: theme.layout.screenPadding,
    paddingTop: theme.spacing.md,
  },
  instructionCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
    ...theme.shadow.card,
  },
  maneuverCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: theme.colors.brand500,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomScrim: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 220,
  },
  etaCard: {
    position: 'absolute',
    left: theme.layout.screenPadding,
    right: theme.layout.screenPadding,
    bottom: theme.spacing.xl,
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    ...theme.shadow.card,
  },
  etaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
