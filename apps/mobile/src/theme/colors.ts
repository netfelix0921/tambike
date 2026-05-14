/**
 * RideFlow color palette — a calm, cinematic dark mode tuned for outdoor visibility.
 * Primary tone reads as "Manila Bay sunset" turning into "city night neon".
 */
export const palette = {
  // Neutrals
  black: '#05080C',
  ink: '#0B0F14',
  surface: '#11161D',
  surfaceElevated: '#171E27',
  surfaceMuted: '#1E2630',
  border: '#222B36',
  divider: '#1B232E',

  // Text
  textPrimary: '#F2F5F9',
  textSecondary: '#A6B0BD',
  textMuted: '#6B7685',
  textInverse: '#05080C',

  // Brand — energetic lime → mint, signals motion & speed
  brand50: '#E9FFF3',
  brand100: '#BFF8DA',
  brand300: '#5CEAA5',
  brand500: '#1FD584',
  brand600: '#13B870',
  brand700: '#0E8A56',

  // Sunset accent (Manila Bay)
  sunset300: '#FFC07A',
  sunset500: '#FF7A45',
  sunset600: '#E85B27',

  // Status
  info: '#4DA8FF',
  warning: '#F5B53C',
  danger: '#FF5A5F',
  success: '#1FD584',

  // Map / route layers
  routeLine: '#5CEAA5',
  routeLineCasing: '#0B0F14',
  hazard: '#FF5A5F',
  flood: '#4DA8FF',
  waterStop: '#7AD7FF',
  coffeeStop: '#C9A37C',
} as const;

export type ColorToken = keyof typeof palette;
