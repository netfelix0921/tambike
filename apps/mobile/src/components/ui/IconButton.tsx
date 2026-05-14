import { ReactNode } from 'react';
import { Pressable, StyleSheet, ViewStyle } from 'react-native';
import * as Haptics from 'expo-haptics';
import { theme } from '@/theme';

export interface IconButtonProps {
  icon: ReactNode;
  onPress?: () => void;
  variant?: 'solid' | 'ghost' | 'tonal';
  size?: number;
  accessibilityLabel?: string;
  style?: ViewStyle;
}

export function IconButton({
  icon,
  onPress,
  variant = 'tonal',
  size = 44,
  accessibilityLabel,
  style,
}: IconButtonProps) {
  return (
    <Pressable
      hitSlop={theme.hitSlop}
      onPress={() => {
        Haptics.selectionAsync().catch(() => {});
        onPress?.();
      }}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      style={({ pressed }) => [
        styles.base,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor:
            variant === 'solid'
              ? theme.colors.brand500
              : variant === 'tonal'
              ? theme.colors.surfaceElevated
              : 'transparent',
        },
        pressed && { opacity: 0.8, transform: [{ scale: 0.96 }] },
        style,
      ]}
    >
      {icon}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
