import { useRef, useState } from 'react';
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  View,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';

import { theme } from '@/theme';
import { Button, Screen, Text } from '@/components/ui';
import { CoffeeIcon, NavIcon, SunsetIcon, UsersIcon } from '@/components/icons';

const { width } = Dimensions.get('window');

const SLIDES = [
  {
    icon: <NavIcon color="#fff" size={56} />,
    title: 'Ride safer through Manila',
    body: 'Bike-friendly routing that prefers lanes and avoids dangerous roads.',
    accent: theme.colors.brand500,
  },
  {
    icon: <SunsetIcon color="#fff" size={56} />,
    title: 'Chase the sunset',
    body: 'Curated rides along Manila Bay timed to golden hour.',
    accent: theme.colors.sunset500,
  },
  {
    icon: <CoffeeIcon color="#fff" size={56} />,
    title: 'Coffee + km',
    body: 'Discover specialty cafes built for cyclists. Refuel and ride on.',
    accent: theme.colors.coffeeStop,
  },
  {
    icon: <UsersIcon color="#fff" size={56} />,
    title: 'Ride together',
    body: 'Plan group rides, share live location, and stay together on the road.',
    accent: theme.colors.info,
  },
];

export default function OnboardingScreen() {
  const router = useRouter();
  const [page, setPage] = useState(0);
  const scrollRef = useRef<ScrollView>(null);

  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const p = Math.round(e.nativeEvent.contentOffset.x / width);
    if (p !== page) setPage(p);
  };

  const next = () => {
    if (page < SLIDES.length - 1) {
      scrollRef.current?.scrollTo({ x: width * (page + 1), animated: true });
    } else {
      router.replace('/(auth)/register');
    }
  };

  return (
    <Screen padded={false}>
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
      >
        {SLIDES.map((s, i) => (
          <View key={i} style={[styles.slide, { width }]}>
            <LinearGradient
              colors={[s.accent + '33', 'transparent']}
              style={styles.iconHalo}
            />
            <View style={[styles.iconCircle, { backgroundColor: s.accent }]}>{s.icon}</View>
            <Text variant="hero" align="center" style={{ marginTop: theme.spacing.xl }}>
              {s.title}
            </Text>
            <Text
              variant="body"
              color="textSecondary"
              align="center"
              style={{ marginTop: theme.spacing.md, paddingHorizontal: theme.spacing.xl }}
            >
              {s.body}
            </Text>
          </View>
        ))}
      </ScrollView>

      <View style={styles.dots}>
        {SLIDES.map((_, i) => (
          <View
            key={i}
            style={[
              styles.dot,
              i === page && { backgroundColor: theme.colors.brand500, width: 24 },
            ]}
          />
        ))}
      </View>

      <View style={styles.actions}>
        <Button label={page === SLIDES.length - 1 ? "Let's ride" : 'Next'} onPress={next} />
        <Button
          label="I already have an account"
          variant="ghost"
          onPress={() => router.push('/(auth)/login')}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  slide: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: theme.spacing.xl,
    paddingTop: theme.spacing.xxxl,
  },
  iconHalo: {
    position: 'absolute',
    top: '20%',
    width: 320,
    height: 320,
    borderRadius: 160,
  },
  iconCircle: {
    width: 112,
    height: 112,
    borderRadius: 56,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dots: {
    flexDirection: 'row',
    alignSelf: 'center',
    gap: 6,
    marginVertical: theme.spacing.lg,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.border,
  },
  actions: {
    paddingHorizontal: theme.layout.screenPadding,
    paddingBottom: theme.spacing.xl,
    gap: theme.spacing.sm,
  },
});
