import { Tabs } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { theme } from '@/theme';
import { Text } from '@/components/ui';
import {
  HomeIcon,
  MapIcon,
  RideIcon,
  UsersIcon,
  ProfileIcon,
} from '@/components/icons';

/**
 * Bottom tabs — five primary destinations.
 * Center "Ride" tab is intentionally bigger; it routes to the live tracker entry.
 */
export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.colors.brand500,
        tabBarInactiveTintColor: theme.colors.textMuted,
        tabBarStyle: styles.tabBar,
        tabBarShowLabel: true,
        tabBarLabel: ({ focused, color, children }) => (
          <Text
            variant="overline"
            style={{ color, opacity: focused ? 1 : 0.7, fontSize: 10 }}
          >
            {children as string}
          </Text>
        ),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <HomeIcon color={color} size={22} />,
        }}
      />
      <Tabs.Screen
        name="plan"
        options={{
          title: 'Plan',
          tabBarIcon: ({ color }) => <MapIcon color={color} size={22} />,
        }}
      />
      <Tabs.Screen
        name="ride"
        options={{
          title: 'Ride',
          tabBarIcon: ({ color, focused }) => (
            <View style={[styles.centerTab, focused && { backgroundColor: theme.colors.brand500 }]}>
              <RideIcon color={focused ? theme.colors.textInverse : color} size={26} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="social"
        options={{
          title: 'Social',
          tabBarIcon: ({ color }) => <UsersIcon color={color} size={22} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <ProfileIcon color={color} size={22} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{ href: null }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: theme.colors.surface,
    borderTopColor: theme.colors.border,
    borderTopWidth: 1,
    height: 84,
    paddingTop: 8,
    paddingBottom: 24,
  },
  centerTab: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: theme.colors.surfaceElevated,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -16,
    borderWidth: 2,
    borderColor: theme.colors.ink,
  },
});
