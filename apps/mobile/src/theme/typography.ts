import { TextStyle } from 'react-native';

/**
 * Type scale — display sizes for ride stats, body for content, mono for live numerics.
 */
export const typography = {
  display: {
    fontSize: 48,
    lineHeight: 52,
    fontWeight: '700',
    letterSpacing: -1,
  } satisfies TextStyle,
  hero: {
    fontSize: 32,
    lineHeight: 38,
    fontWeight: '700',
    letterSpacing: -0.5,
  } satisfies TextStyle,
  h1: {
    fontSize: 24,
    lineHeight: 30,
    fontWeight: '700',
  } satisfies TextStyle,
  h2: {
    fontSize: 20,
    lineHeight: 26,
    fontWeight: '600',
  } satisfies TextStyle,
  h3: {
    fontSize: 17,
    lineHeight: 22,
    fontWeight: '600',
  } satisfies TextStyle,
  body: {
    fontSize: 15,
    lineHeight: 22,
    fontWeight: '400',
  } satisfies TextStyle,
  bodyStrong: {
    fontSize: 15,
    lineHeight: 22,
    fontWeight: '600',
  } satisfies TextStyle,
  caption: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '500',
  } satisfies TextStyle,
  overline: {
    fontSize: 11,
    lineHeight: 14,
    fontWeight: '700',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  } satisfies TextStyle,
  // Tabular numerics for live ride stats — replace with a mono font when bundled
  metricLg: {
    fontSize: 56,
    lineHeight: 60,
    fontWeight: '800',
    letterSpacing: -1.5,
    fontVariant: ['tabular-nums'],
  } satisfies TextStyle,
  metricMd: {
    fontSize: 28,
    lineHeight: 32,
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
  } satisfies TextStyle,
} as const;

export type TypographyToken = keyof typeof typography;
