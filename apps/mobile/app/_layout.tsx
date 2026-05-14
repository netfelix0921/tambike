import { useEffect } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { QueryClientProvider } from '@tanstack/react-query';
import * as SplashScreen from 'expo-splash-screen';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

import { queryClient } from '@/lib/queryClient';
import { initMapbox } from '@/lib/mapbox';
import { assertEnv } from '@/lib/env';
import { useAuthBootstrap } from '@/hooks/useAuth';
import { useAuthStore } from '@/stores/authStore';
import { theme } from '@/theme';

SplashScreen.preventAutoHideAsync().catch(() => {});

export default function RootLayout() {
  assertEnv();
  initMapbox();

  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider>
        <GestureHandlerRootView style={{ flex: 1, backgroundColor: theme.colors.ink }}>
          <StatusBar style="light" />
          <RootNavigator />
        </GestureHandlerRootView>
      </SafeAreaProvider>
    </QueryClientProvider>
  );
}

function RootNavigator() {
  useAuthBootstrap();

  const initialized = useAuthStore((s) => s.initialized);
  const session = useAuthStore((s) => s.session);
  const segments = useSegments();
  const router = useRouter();

  // Redirect logic — keep authed users out of (auth) and unauthed users in.
  useEffect(() => {
    if (!initialized) return;
    SplashScreen.hideAsync().catch(() => {});

    const inAuthGroup = segments[0] === '(auth)';
    if (!session && !inAuthGroup) {
      router.replace('/(auth)/onboarding');
    } else if (session && inAuthGroup) {
      router.replace('/(tabs)');
    }
  }, [initialized, session, segments, router]);

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: theme.colors.ink },
        animation: 'fade',
      }}
    >
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="ride" options={{ animation: 'slide_from_bottom' }} />
    </Stack>
  );
}
