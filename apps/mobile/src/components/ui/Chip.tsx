import { ReactNode } from 'react';
import { Pressable, StyleSheet, View, ViewStyle } from 'react-native';
import { theme } from '@/theme';
import { ColorToken } from '@/theme/colors';
import { Text } from './Text';

export interface ChipProps {
  label: string;
  selected?: boolean;
  onPress?: () => void;
  leftIcon?: ReactNode;
  tone?: ColorToken;
  style?: ViewStyle;
}

export function Chip({ label, selected, onPress, leftIcon, tone = 'brand500', style }: ChipProps) {
  const Container = onPress ? Pressable : View;
  return (
    <Container
      onPress={onPress}
      style={({ pressed }: any) => [
        styles.base,
        selected && {
          backgroundColor: theme.colors[tone],
          borderColor: theme.colors[tone],
        },
        pressed && { opacity: 0.85 },
        style,
      ]}
    >
      {leftIcon}
      <Text
        variant="bodyStrong"
        style={{
          color: selected ? theme.colors.textInverse : theme.colors.textPrimary,
        }}
      >
        {label}
      </Text>
    </Container>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: theme.radius.pill,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
  },
});
