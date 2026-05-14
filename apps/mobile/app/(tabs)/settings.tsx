import { useState } from 'react';
import { StyleSheet, Switch, View } from 'react-native';
import { useRouter, Stack } from 'expo-router';

import { theme } from '@/theme';
import { Card, Divider, Screen, Text } from '@/components/ui';
import { ChevronRightIcon } from '@/components/icons';

interface ToggleSetting {
  key: string;
  title: string;
  description: string;
  value: boolean;
}

const DEFAULT_TOGGLES: ToggleSetting[] = [
  {
    key: 'preferLanes',
    title: 'Prefer bike lanes',
    description: 'Bias routes toward known bike infrastructure.',
    value: true,
  },
  {
    key: 'avoidFlood',
    title: 'Avoid flood-prone roads',
    description: 'Skip Manila roads with frequent flooding reports.',
    value: true,
  },
  {
    key: 'voiceNav',
    title: 'Voice directions',
    description: 'Spoken turn-by-turn cues during navigation.',
    value: true,
  },
  {
    key: 'shareLive',
    title: 'Share live location',
    description: 'Allow friends to see you during group rides.',
    value: false,
  },
];

export default function SettingsScreen() {
  const [toggles, setToggles] = useState(DEFAULT_TOGGLES);
  const router = useRouter();

  const onToggle = (key: string) =>
    setToggles((prev) => prev.map((t) => (t.key === key ? { ...t, value: !t.value } : t)));

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <Screen scroll>
        <Text variant="hero">Settings</Text>
        <Text variant="body" color="textSecondary" style={{ marginBottom: theme.spacing.xl }}>
          Tune the app to your ride.
        </Text>

        <Section title="Routing">
          {toggles.map((t, idx) => (
            <View key={t.key}>
              <ToggleRow
                title={t.title}
                description={t.description}
                value={t.value}
                onChange={() => onToggle(t.key)}
              />
              {idx < toggles.length - 1 ? <Divider /> : null}
            </View>
          ))}
        </Section>

        <Section title="Units">
          <LinkRow title="Measurement" value="Metric (km, m)" />
          <Divider />
          <LinkRow title="Speed display" value="km/h" />
        </Section>

        <Section title="About">
          <LinkRow title="Help & support" />
          <Divider />
          <LinkRow title="Privacy policy" />
          <Divider />
          <LinkRow title="Version" value="0.1.0 MVP" />
        </Section>
      </Screen>
    </>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={{ marginBottom: theme.spacing.xl }}>
      <Text variant="overline" color="textMuted" style={{ marginBottom: theme.spacing.sm }}>
        {title}
      </Text>
      <Card padding={0}>
        <View style={styles.cardInner}>{children}</View>
      </Card>
    </View>
  );
}

function ToggleRow({
  title,
  description,
  value,
  onChange,
}: {
  title: string;
  description: string;
  value: boolean;
  onChange: () => void;
}) {
  return (
    <View style={styles.row}>
      <View style={{ flex: 1, paddingRight: theme.spacing.md }}>
        <Text variant="bodyStrong">{title}</Text>
        <Text variant="caption" color="textSecondary">
          {description}
        </Text>
      </View>
      <Switch
        value={value}
        onValueChange={onChange}
        trackColor={{ false: theme.colors.border, true: theme.colors.brand500 }}
        thumbColor="#fff"
      />
    </View>
  );
}

function LinkRow({ title, value }: { title: string; value?: string }) {
  return (
    <View style={styles.row}>
      <Text variant="bodyStrong" style={{ flex: 1 }}>
        {title}
      </Text>
      {value ? <Text variant="caption" color="textSecondary">{value}</Text> : null}
      <ChevronRightIcon color={theme.colors.textMuted} size={18} />
    </View>
  );
}

const styles = StyleSheet.create({
  cardInner: {},
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    minHeight: 56,
    gap: theme.spacing.sm,
  },
});
