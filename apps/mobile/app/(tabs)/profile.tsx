import { Alert, ScrollView, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';

import { theme } from '@/theme';
import { Avatar, Button, Card, Screen, StatTile, Text } from '@/components/ui';
import { ChevronRightIcon, SettingsIcon } from '@/components/icons';
import { useAuth } from '@/hooks/useAuth';
import { authService } from '@/services/auth';
import { RideHistoryItem } from '@/components/ride';
import type { Ride } from '@/types/ride';

const MOCK_RIDES: Ride[] = [
  {
    id: 'mock-1',
    userId: 'me',
    title: 'Sunset along Roxas',
    rideType: 'sunset',
    status: 'completed',
    startedAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    endedAt: null,
    distanceM: 14_200,
    durationS: 56 * 60,
    movingDurationS: 52 * 60,
    avgSpeedKph: 16.3,
    maxSpeedKph: 32.4,
    avgPaceSPerKm: 220,
    elevationGainM: 38,
    calories: 420,
    polyline: null,
  },
  {
    id: 'mock-2',
    userId: 'me',
    title: 'Marikina river loop',
    rideType: 'training',
    status: 'completed',
    startedAt: new Date(Date.now() - 1000 * 60 * 60 * 60).toISOString(),
    endedAt: null,
    distanceM: 28_400,
    durationS: 92 * 60,
    movingDurationS: 87 * 60,
    avgSpeedKph: 19.6,
    maxSpeedKph: 38.1,
    avgPaceSPerKm: 184,
    elevationGainM: 122,
    calories: 780,
    polyline: null,
  },
];

export default function ProfileScreen() {
  const router = useRouter();
  const { profile } = useAuth();

  const onSignOut = async () => {
    try {
      await authService.signOut();
      router.replace('/(auth)/onboarding');
    } catch (e: any) {
      Alert.alert('Could not sign out', e?.message);
    }
  };

  return (
    <Screen scroll>
      <View style={styles.header}>
        <Avatar name={profile?.displayName ?? 'Rider'} uri={profile?.avatarUrl} size={72} />
        <View style={{ flex: 1 }}>
          <Text variant="h1">{profile?.displayName ?? 'Rider'}</Text>
          <Text variant="caption" color="textSecondary">
            {profile?.city ?? 'Metro Manila'} · {profile?.bikeType ?? 'commuter'}
          </Text>
        </View>
        <Button
          label=""
          variant="ghost"
          onPress={() => router.push('/(tabs)/settings')}
          leftIcon={<SettingsIcon color={theme.colors.textPrimary} size={22} />}
          fullWidth={false}
        />
      </View>

      <Card variant="elevated">
        <Text variant="overline" color="textSecondary">
          All time
        </Text>
        <View style={styles.statsRow}>
          <StatTile label="Distance" value="1,284" unit="km" size="lg" />
          <StatTile label="Rides" value="83" size="lg" />
          <StatTile label="Elev" value="6,210" unit="m" size="lg" />
        </View>
      </Card>

      <View style={styles.sectionHeader}>
        <Text variant="h2">Ride history</Text>
        <ChevronRightIcon color={theme.colors.textMuted} size={20} />
      </View>

      <View style={{ gap: theme.spacing.md }}>
        {MOCK_RIDES.map((r) => (
          <RideHistoryItem key={r.id} ride={r} />
        ))}
      </View>

      <View style={{ marginTop: theme.spacing.xl, gap: theme.spacing.sm }}>
        <Button
          label="Settings"
          variant="secondary"
          onPress={() => router.push('/(tabs)/settings')}
        />
        <Button label="Sign out" variant="ghost" onPress={onSignOut} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
    marginBottom: theme.spacing.lg,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: theme.spacing.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: theme.spacing.lg,
  },
});
