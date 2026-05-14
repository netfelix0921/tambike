import { ReactNode } from 'react';
import {
  ActivityIndicator,
  Pressable,
  PressableProps,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { theme } from '@/theme';
import { Text } from './Text';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';
type Size = 'sm' | 'md' | 'lg';

export interface ButtonProps extends Omit<PressableProps, 'children'> {
  label: string;
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  fullWidth?: boolean;
  style?: ViewStyle;
}

export function Button({
  label,
  variant = 'primary',
  size = 'md',
  loading,
  leftIcon,
  rightIcon,
  fullWidth = true,
  disabled,
  onPress,
  style,
  ...rest
}: ButtonProps) {
  const sizeStyle = SIZE[size];
  const isDisabled = disabled || loading;

  return (
    <Pressable
      {...rest}
      disabled={isDisabled}
      onPress={(e) => {
        Haptics.selectionAsync().catch(() => {});
        onPress?.(e);
      }}
      style={({ pressed }) => [
        styles.base,
        sizeStyle.container,
        VARIANT[variant].container,
        fullWidth && { alignSelf: 'stretch' },
        pressed && { opacity: 0.85, transform: [{ scale: 0.98 }] },
        isDisabled && { opacity: 0.5 },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={VARIANT[variant].textColor} />
      ) : (
        <View style={styles.row}>
          {leftIcon}
          <Text
            variant={size === 'sm' ? 'bodyStrong' : 'h3'}
            style={{ color: VARIANT[variant].textColor }}
          >
            {label}
          </Text>
          {rightIcon}
        </View>
      )}
    </Pressable>
  );
}

const SIZE: Record<Size, { container: ViewStyle }> = {
  sm: { container: { paddingVertical: 10, paddingHorizontal: 14, borderRadius: theme.radius.md } },
  md: { container: { paddingVertical: 14, paddingHorizontal: 18, borderRadius: theme.radius.lg } },
  lg: { container: { paddingVertical: 18, paddingHorizontal: 22, borderRadius: theme.radius.lg } },
};

const VARIANT: Record<Variant, { container: ViewStyle; textColor: string }> = {
  primary: {
    container: { backgroundColor: theme.colors.brand500 },
    textColor: theme.colors.textInverse,
  },
  secondary: {
    container: {
      backgroundColor: theme.colors.surfaceElevated,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    textColor: theme.colors.textPrimary,
  },
  ghost: {
    container: { backgroundColor: 'transparent' },
    textColor: theme.colors.textPrimary,
  },
  danger: {
    container: { backgroundColor: theme.colors.danger },
    textColor: '#fff',
  },
};

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
});
