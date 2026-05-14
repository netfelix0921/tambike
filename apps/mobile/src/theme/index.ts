import { palette } from './colors';
import { typography } from './typography';
import { spacing, radius, shadow } from './spacing';

/**
 * The RideFlow theme — single source of truth for design tokens.
 * Used directly via `theme.*` (no styled-components needed).
 */
export const theme = {
  mode: 'dark' as const,
  colors: palette,
  typography,
  spacing,
  radius,
  shadow,
  hitSlop: { top: 8, bottom: 8, left: 8, right: 8 },
  layout: {
    screenPadding: spacing.lg,
    cardPadding: spacing.lg,
    tabBarHeight: 64,
  },
} as const;

export type Theme = typeof theme;
export { palette, typography, spacing, radius, shadow };
