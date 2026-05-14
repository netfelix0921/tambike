import { Stack } from 'expo-router';
import { theme } from '@/theme';

export default function RideLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: theme.colors.ink },
        animation: 'slide_from_right',
      }}
    />
  );
}
