import { useEffect } from 'react';
import { useRouter } from 'expo-router';

/**
 * The "Ride" tab is a launcher — pressing it sends the rider into the
 * full-screen tracker. This avoids ever rendering the live tracker UI under
 * the tab bar.
 */
export default function RideTabLauncher() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/ride/tracker');
  }, [router]);
  return null;
}
