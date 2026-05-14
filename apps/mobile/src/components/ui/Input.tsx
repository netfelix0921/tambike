import { forwardRef, ReactNode, useState } from 'react';
import {
  StyleSheet,
  TextInput,
  TextInputProps,
  View,
  ViewStyle,
} from 'react-native';
import { theme } from '@/theme';
import { Text } from './Text';

export interface InputProps extends TextInputProps {
  label?: string;
  helperText?: string;
  error?: string;
  leftSlot?: ReactNode;
  rightSlot?: ReactNode;
  containerStyle?: ViewStyle;
}

export const Input = forwardRef<TextInput, InputProps>(function Input(
  { label, helperText, error, leftSlot, rightSlot, containerStyle, onFocus, onBlur, style, ...rest },
  ref,
) {
  const [focused, setFocused] = useState(false);

  return (
    <View style={[styles.container, containerStyle]}>
      {label ? (
        <Text variant="overline" color="textSecondary" style={styles.label}>
          {label}
        </Text>
      ) : null}

      <View
        style={[
          styles.field,
          focused && { borderColor: theme.colors.brand500 },
          !!error && { borderColor: theme.colors.danger },
        ]}
      >
        {leftSlot ? <View style={styles.slot}>{leftSlot}</View> : null}
        <TextInput
          ref={ref}
          {...rest}
          placeholderTextColor={theme.colors.textMuted}
          selectionColor={theme.colors.brand500}
          onFocus={(e) => {
            setFocused(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            onBlur?.(e);
          }}
          style={[styles.input, style]}
        />
        {rightSlot ? <View style={styles.slot}>{rightSlot}</View> : null}
      </View>

      {error ? (
        <Text variant="caption" color="danger" style={{ marginTop: 6 }}>
          {error}
        </Text>
      ) : helperText ? (
        <Text variant="caption" color="textMuted" style={{ marginTop: 6 }}>
          {helperText}
        </Text>
      ) : null}
    </View>
  );
});

const styles = StyleSheet.create({
  container: { width: '100%' },
  label: { marginBottom: 8 },
  field: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    paddingHorizontal: theme.spacing.lg,
    minHeight: 52,
  },
  slot: { paddingHorizontal: 4 },
  input: {
    flex: 1,
    color: theme.colors.textPrimary,
    fontSize: 15,
    paddingVertical: 14,
  },
});
