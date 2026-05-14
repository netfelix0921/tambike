import { ScrollView, StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';

import { theme } from '@/theme';
import { Avatar, Button, Card, Chip, Screen, StatTile, Text } from '@/components/ui';
import {
  CoffeeIcon,
  AlertIcon,
  DropletIcon,
  SunsetIcon,
  ChevronRightIcon,
} from '@/components/icons';
import { useAuth } from '@/hooks/useAuth';

export default function HomeScreen() {
  const router = useRouter();
  const { profile } = useAuth();
  const greeting = greetingForNow();
  const firstName = profile?.displayName?.split(' ')[0] ?? 'rider';

  return (
    <Screen scroll padded={false}>
      {/* Hero header with sunset gradient */}
      <LinearGradient
        colors={[theme.colors.sunset500 + '33', 'transparent']}
        style={styles.heroBg}
      />
      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <Text variant="overline" color="textMuted">
            {greeting}
          </Text>
          <Text variant="hero">Hi, {firstName}</Text>
          <Text variant="body" color="textSecondary" style={{ marginTop: 4 }}>
            Manila is calling. Let&apos;s find your line.
          </Text>
        </View>
        <Avatar name={profile?.displayName} uri={profile?.avatarUrl} size={48} />
      </View>

      <View style={styles.body}>
        {/* Weekly summary card */}
        <Card variant="elevated">
          <Text variant="overline" color="textSecondary">
            This week
          </Text>
          <View style={styles.statsRow}>
            <StatTile label="Distance" value="42.6" unit="km" size="lg" />
            <StatTile label="Rides" value="4" size="lg" />
            <StatTile label="Time" value="3:18" size="lg" />
          </View>
        </Card>

        {/* Big "Start a ride" CTA */}
        <Card variant="flat" padding="xl">
          <View style={styles.ctaRow}>
            <View style={{ flex: 1, gap: 4 }}>
              <Text variant="overline" color="brand500">
                Ready when you are
              </Text>
              <Text variant="h1">Start a ride</Text>
              <Text variant="caption" color="textSecondary">
                Pick a vibe and we&apos;ll route you safely.
              </Text>
            </View>
          </View>
          <Button
            label="Start now"
            onPress={() => router.push('/ride/tracker')}
            style={{ marginTop: theme.spacing.lg }}
          />
        </Card>

        {/* Quick actions */}
        <View style={styles.quickRow}>
          <QuickAction
            label="Plan route"
            icon={<ChevronRightIcon color={theme.colors.brand500} />}
            onPress={() => router.push('/(tabs)/plan')}
          />
          <QuickAction
            label="Group ride"
            icon={<ChevronRightIcon color={theme.colors.info} />}
            onPress={() => router.push('/(tabs)/social')}
          />
        </View>

        {/* Manila highlights */}
        <View style={{ gap: theme.spacing.md }}>
          <Text variant="h2">For your city</Text>

          <Card variant="elevated" onPress={() => router.push('/(tabs)/plan')}>
            <View style={styles.suggestionRow}>
              <View style={[styles.iconChip, { backgroundColor: theme.colors.sunset500 + '22' }]}>
                <SunsetIcon color={theme.colors.sunset500} size={22} />
              </View>
              <View style={{ flex: 1 }}>
                <Text variant="bodyStrong">Manila Bay sunset loop</Text>
                <Text variant="caption" color="textSecondary">
                  12.4 km · best at 5:40 PM
                </Text>
              </View>
              <ChevronRightIcon color={theme.colors.textMuted} size={20} />
            </View>
          </Card>

          <Card variant="elevated" onPress={() => router.push('/(tabs)/plan')}>
            <View style={styles.suggestionRow}>
              <View style={[styles.iconChip, { backgroundColor: theme.colors.coffeeStop + '22' }]}>
                <CoffeeIcon color={theme.colors.coffeeStop} size={22} />
              </View>
              <View style={{ flex: 1 }}>
                <Text variant="bodyStrong">Poblacion coffee crawl</Text>
                <Text variant="caption" color="textSecondary">
                  3 stops · 8.2 km
                </Text>
              </View>
              <ChevronRightIcon color={theme.colors.textMuted} size={20} />
            </View>
          </Card>

          <Card variant="outline">
            <View style={styles.suggestionRow}>
              <View style={[styles.iconChip, { backgroundColor: theme.colors.flood + '22' }]}>
                <DropletIcon color={theme.colors.flood} size={22} />
              </View>
              <View style={{ flex: 1 }}>
                <Text variant="bodyStrong">2 flood-prone roads nearby</Text>
                <Text variant="caption" color="textSecondary">
                  Avoiding them in your route plans.
                </Text>
              </View>
              <Chip label="Active" tone="info" selected />
            </View>
          </Card>

          <Card variant="outline">
            <View style={styles.suggestionRow}>
              <View style={[styles.iconChip, { backgroundColor: theme.colors.danger + '22' }]}>
                <AlertIcon color={theme.colors.danger} size={22} />
              </View>
              <View style={{ flex: 1 }}>
                <Text variant="bodyStrong">Hazard reports active</Text>
                <Text variant="caption" color="textSecondary">
                  Tap to report or confirm a hazard near you.
                </Text>
              </View>
              <ChevronRightIcon color={theme.colors.textMuted} size={20} />
            </View>
          </Card>
        </View>
      </View>
    </Screen>
  );
}

function QuickAction({
  label,
  icon,
  onPress,
}: {
  label: string;
  icon: React.ReactNode;
  onPress: () => void;
}) {
  return (
    <Card onPress={onPress} variant="flat" style={{ flex: 1 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <Text variant="bodyStrong">{label}</Text>
        {icon}
      </View>
    </Card>
  );
}

function greetingForNow() {
  const h = new Date().getHours();
  if (h < 11) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  if (h < 20) return 'Golden hour';
  return 'Night ride?';
}

const styles = StyleSheet.create({
  heroBg: { position: 'absolute', top: 0, left: 0, right: 0, height: 280 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.layout.screenPadding,
    paddingTop: theme.spacing.md,
    paddingBottom: theme.spacing.lg,
    gap: theme.spacing.md,
  },
  body: {
    paddingHorizontal: theme.layout.screenPadding,
    gap: theme.spacing.lg,
    paddingBottom: theme.spacing.xxxl,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: theme.spacing.md,
  },
  ctaRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quickRow: {
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
  suggestionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
  },
  iconChip: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
