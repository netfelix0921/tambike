import { Redirect } from 'expo-router';

/**
 * Entry redirect — root navigator does the real auth gating, but this prevents
 * a brief blank frame on cold start by sending us straight to the tabs.
 */
export default function RootIndex() {
  return <Redirect href="/(tabs)" />;
}
