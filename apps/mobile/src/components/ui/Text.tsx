import { Text as RNText, TextProps as RNTextProps, StyleSheet } from 'react-native';
import { theme } from '@/theme';
import { TypographyToken } from '@/theme/typography';
import { ColorToken } from '@/theme/colors';

export interface TextProps extends RNTextProps {
  variant?: TypographyToken;
  color?: ColorToken;
  align?: 'left' | 'center' | 'right';
}

/**
 * Themed Text — single source for typography across the app.
 */
export function Text({
  variant = 'body',
  color = 'textPrimary',
  align,
  style,
  ...rest
}: TextProps) {
  return (
    <RNText
      {...rest}
      style={[
        theme.typography[variant],
        { color: theme.colors[color], textAlign: align },
        style,
      ]}
    />
  );
}

export const textStyles = StyleSheet.create({});
