import { useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

import { theme } from '@/theme';
import { Screen, IconButton, Text, Chip } from '@/components/ui';
import { LiveStatPanel, RideControls, RideTypeSelector } from '@/components/ride';
import { RouteMap, MapPlaceholder } from '@/components/map';
import { ChevronRightIcon } from '@/components/icons';
import { useRideTracker } from '@/hooks/useRideTracker';
import { useRideStore } from '@/stores/rideStore';
import { useLocation } from '@/hooks/useLocation';
import { env } from '@/lib/env';
import type { RideType } from '@/types/ride';

/**
 * The Live Tracker — full-bleed map with live metrics floating above.
 * Owns ride lifecycle through `useRideTracker`.
 */
export default function TrackerScreen() {
  const router = useRouter();
  const { status, start, pause, resume, stop } = useRideTracker();
  const metrics = useRideStore((s) => s.metrics);
  const rideType = useRideStore((s) => s.rideType);
  const reset = useRideStore((s) => s.reset);
  const { location } = useLocation({ watch: false });
  const [pendingType, setPendingType] = useState<RideType>('chill');

  const onStop = () => {
    Alert.alert('End ride?', 'You can save the ride or discard it.', [
      { text: 'Keep going', style: 'cancel' },
      {
        text: 'Discard',
        style: 'destructive',
        onPress: () => {
          reset();
          router.back();
        },
      },
      {
        text: 'Save',
        onPress: () => {
          stop();
          // In a full impl: persist via ridesService.create + appendTrack + finalize.
          // For the scaffold we just bounce back to the tabs.
          setTimeout(() => {
            reset();
            router.replace('/(tabs)');
          }, 600);
        },
      },
    ]);
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <Screen padded={false} transparent edges={['top']}>
        {/* Map */}
        <View style={StyleSheet.absoluteFill}>
          {env.mapboxAccessToken ? (
            <RouteMap
              userLocation={location}
              followUser={status === 'recording'}
              showUserPuck
            />
          ) : (
            <MapPlaceholder message="Live ride preview" />
          )}
        </View>

        {/* Top scrim + back */}
        <LinearGradient
          colors={[theme.colors.ink, 'transparent']}
          style={styles.topScrim}
          pointerEvents="none"
        />
        <View style={styles.topBar}>
          <IconButton
            icon={<ChevronRightIcon color={theme.colors.textPrimary} size={20} />}
            onPress={() => router.back()}
            style={{ transform: [{ rotate: '180deg' }] }}
            accessibilityLabel="Back"
          />
          <Chip
            label={status === 'recording' ? 'Recording' : status === 'paused' ? 'Paused' : 'Ready'}
            tone={status === 'recording' ? 'success' : status === 'paused' ? 'warning' : 'brand500'}
            selected={status !== 'idle'}
          />
        </View>

        {/* Bottom panel */}
        <View style={styles.bottom}>
          {status === 'idle' ? (
            <View style={styles.idleSheet}>
              <Text variant="h2">Ride type</Text>
              <View style={{ marginTop: theme.spacing.md, marginBottom: theme.spacing.lg }}>
                <RideTypeSelector value={pendingType} onChange={setPendingType} />
              </View>
              <RideControls
                status={status}
                onStart={() => start(pendingType)}
                onPause={pause}
                onResume={resume}
                onStop={onStop}
              />
            </View>
          ) : (
            <View style={{ gap: theme.spacing.md }}>
              <LiveStatPanel metrics={metrics} />
              <View style={styles.controlsWrap}>
                <Text variant="overline" color="textMuted" style={{ marginBottom: theme.spacing.sm }}>
                  {rideType.toUpperCase()} RIDE
                </Text>
                <RideControls
                  status={status}
                  onStart={() => start(pendingType)}
                  onPause={pause}
                  onResume={resume}
                  onStop={onStop}
                />
              </View>
            </View>
          )}
        </View>
      </Screen>
    </>
  );
}

const styles = StyleSheet.create({
  topScrim: { position: 'absolute', top: 0, left: 0, right: 0, height: 140 },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.layout.screenPadding,
    paddingTop: theme.spacing.sm,
  },
  bottom: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    padding: theme.layout.screenPadding,
    gap: theme.spacing.md,
  },
  idleSheet: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.xl,
    padding: theme.spacing.xl,
    alignItems: 'center',
  },
  controlsWrap: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.xl,
    padding: theme.spacing.lg,
    alignItems: 'center',
  },
});
