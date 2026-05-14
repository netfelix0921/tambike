import { ReactNode } from 'react';
import { Pressable, StyleSheet, View, ViewStyle } from 'react-native';
import { theme } from '@/theme';

export interface CardProps {
  children: ReactNode;
  variant?: 'flat' | 'elevated' | 'outline';
  onPress?: () => void;
  style?: ViewStyle;
  padding?: keyof typeof theme.spacing | 0;
}

/**
 * Card — surface container that automatically adapts to light/dark and elevation.
 */
export function Card({
  children,
  variant = 'flat',
  onPress,
  style,
  padding = 'lg',
}: CardProps) {
  const containerStyle: ViewStyle = {
    backgroundColor:
      variant === 'elevated' ? theme.colors.surfaceElevated : theme.colors.surface,
    borderRadius: theme.radius.lg,
    padding: typeof padding === 'number' ? padding : theme.spacing[padding],
    borderWidth: variant === 'outline' ? 1 : 0,
    borderColor: theme.colors.border,
    ...(variant === 'elevated' ? theme.shadow.card : null),
  };

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [
          containerStyle,
          pressed && { opacity: 0.9, transform: [{ scale: 0.99 }] },
          style,
        ]}
      >
        {children}
      </Pressable>
    );
  }

  return <View style={[containerStyle, style]}>{children}</View>;
}

export const cardStyles = StyleSheet.create({});
