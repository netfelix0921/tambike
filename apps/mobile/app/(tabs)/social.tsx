import { ScrollView, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';

import { theme } from '@/theme';
import { Avatar, Button, Card, Screen, Text } from '@/components/ui';
import { ClockIcon, PlusIcon, UsersIcon } from '@/components/icons';
import { formatTime } from '@/utils/format';

const MOCK_RIDES = [
  {
    id: 'gr_1',
    title: 'Sunday sunset spin',
    meetupName: 'CCP Lagoon',
    startsAt: new Date(Date.now() + 1000 * 60 * 60 * 26).toISOString(),
    rideType: 'sunset' as const,
    going: 7,
    avatars: ['R', 'M', 'A', 'J'],
  },
  {
    id: 'gr_2',
    title: 'Easy cafe pedal',
    meetupName: 'Magnolia → Maginhawa',
    startsAt: new Date(Date.now() + 1000 * 60 * 60 * 90).toISOString(),
    rideType: 'coffee' as const,
    going: 4,
    avatars: ['T', 'V', 'K'],
  },
];

export default function SocialScreen() {
  const router = useRouter();

  return (
    <Screen scroll>
      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <Text variant="hero">Group rides</Text>
          <Text variant="body" color="textSecondary">
            Plan, invite, and roll out together.
          </Text>
        </View>
      </View>

      <Button
        label="Create a ride"
        leftIcon={<PlusIcon color={theme.colors.textInverse} size={18} />}
        onPress={() => router.push('/ride/group')}
        style={{ marginTop: theme.spacing.md }}
      />

      <Text variant="h2" style={{ marginTop: theme.spacing.xl, marginBottom: theme.spacing.md }}>
        Upcoming
      </Text>

      <View style={{ gap: theme.spacing.md }}>
        {MOCK_RIDES.map((r) => (
          <Card
            key={r.id}
            variant="elevated"
            onPress={() => router.push({ pathname: '/ride/group', params: { id: r.id } })}
          >
            <View style={styles.rowBetween}>
              <View style={{ flex: 1, gap: 2 }}>
                <Text variant="bodyStrong">{r.title}</Text>
                <View style={styles.metaRow}>
                  <ClockIcon color={theme.colors.textMuted} size={14} />
                  <Text variant="caption" color="textSecondary">
                    {formatTime(r.startsAt)} · {r.meetupName}
                  </Text>
                </View>
              </View>
              <View style={styles.avatarStack}>
                {r.avatars.slice(0, 3).map((a, i) => (
                  <View
                    key={i}
                    style={[styles.stackedAvatar, { transform: [{ translateX: -i * 10 }] }]}
                  >
                    <Avatar name={a} size={28} />
                  </View>
                ))}
                <View style={[styles.goingBadge, { transform: [{ translateX: -30 }] }]}>
                  <UsersIcon color={theme.colors.textPrimary} size={12} />
                  <Text variant="caption">{r.going}</Text>
                </View>
              </View>
            </View>
          </Card>
        ))}
      </View>

      <Card variant="outline" style={{ marginTop: theme.spacing.xl }}>
        <Text variant="bodyStrong">Friends</Text>
        <Text variant="caption" color="textSecondary" style={{ marginTop: 4 }}>
          Add friends to see their live rides and share yours.
        </Text>
        <Button
          label="Find riders"
          variant="secondary"
          style={{ marginTop: theme.spacing.md }}
          onPress={() => {}}
        />
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'flex-end', gap: theme.spacing.md },
  rowBetween: { flexDirection: 'row', alignItems: 'center' },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  avatarStack: { flexDirection: 'row', alignItems: 'center' },
  stackedAvatar: {
    borderWidth: 2,
    borderColor: theme.colors.surface,
    borderRadius: 14,
  },
  goingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: theme.colors.surfaceElevated,
    borderRadius: theme.radius.pill,
  },
});
