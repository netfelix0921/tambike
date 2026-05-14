import { StyleSheet, View } from 'react-native';
import { useRouter, Stack } from 'expo-router';

import { theme } from '@/theme';
import { Avatar, Button, Card, Divider, Screen, Text } from '@/components/ui';
import { RouteMap, MapPlaceholder } from '@/components/map';
import { ClockIcon, UsersIcon } from '@/components/icons';
import { env } from '@/lib/env';

const PARTICIPANTS = [
  { id: '1', name: 'Rio Castillo', status: 'going', host: true },
  { id: '2', name: 'Marie Lim', status: 'going', host: false },
  { id: '3', name: 'Alex Tan', status: 'going', host: false },
  { id: '4', name: 'Joey Reyes', status: 'maybe', host: false },
];

export default function GroupRideScreen() {
  const router = useRouter();

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <Screen padded={false}>
        <View style={styles.mapWrap}>
          {env.mapboxAccessToken ? (
            <RouteMap
              pois={[
                { id: 'meet', coords: { lat: 14.5599, lng: 120.9823 }, color: theme.colors.brand500 },
              ]}
            />
          ) : (
            <MapPlaceholder message="Meetup map" />
          )}
        </View>

        <View style={styles.sheet}>
          <View style={styles.headerRow}>
            <View style={{ flex: 1 }}>
              <Text variant="overline" color="brand500">
                Sunset ride
              </Text>
              <Text variant="hero">Sunday sunset spin</Text>
              <View style={styles.metaRow}>
                <ClockIcon color={theme.colors.textMuted} size={14} />
                <Text variant="caption" color="textSecondary">
                  Sunday · 5:00 PM
                </Text>
              </View>
              <View style={styles.metaRow}>
                <UsersIcon color={theme.colors.textMuted} size={14} />
                <Text variant="caption" color="textSecondary">
                  Meet at CCP Lagoon · 12.4 km loop
                </Text>
              </View>
            </View>
          </View>

          <Card variant="outline" style={{ marginTop: theme.spacing.lg }}>
            <Text variant="bodyStrong">Who&apos;s in</Text>
            <Text variant="caption" color="textSecondary" style={{ marginBottom: theme.spacing.md }}>
              {PARTICIPANTS.filter((p) => p.status === 'going').length} going ·{' '}
              {PARTICIPANTS.filter((p) => p.status === 'maybe').length} maybe
            </Text>
            {PARTICIPANTS.map((p, i) => (
              <View key={p.id}>
                <View style={styles.participantRow}>
                  <Avatar name={p.name} size={36} />
                  <View style={{ flex: 1 }}>
                    <Text variant="bodyStrong">{p.name}</Text>
                    <Text variant="caption" color="textSecondary">
                      {p.host ? 'Host' : p.status === 'going' ? 'Going' : 'Maybe'}
                    </Text>
                  </View>
                </View>
                {i < PARTICIPANTS.length - 1 ? <Divider /> : null}
              </View>
            ))}
          </Card>

          <View style={styles.actions}>
            <Button
              label="Share invite link"
              variant="secondary"
              onPress={() => {}}
              style={{ flex: 1 }}
              fullWidth={false}
            />
            <Button
              label="Start group ride"
              onPress={() => router.replace('/ride/tracker')}
              style={{ flex: 1 }}
              fullWidth={false}
            />
          </View>
        </View>
      </Screen>
    </>
  );
}

const styles = StyleSheet.create({
  mapWrap: { height: 220 },
  sheet: {
    flex: 1,
    backgroundColor: theme.colors.ink,
    marginTop: -theme.radius.xl,
    borderTopLeftRadius: theme.radius.xl,
    borderTopRightRadius: theme.radius.xl,
    padding: theme.layout.screenPadding,
    paddingBottom: theme.spacing.xxxl,
  },
  headerRow: { gap: 4 },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4 },
  participantRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
  },
  actions: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
    marginTop: theme.spacing.lg,
  },
});
