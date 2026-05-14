import { ReactNode } from 'react';
import { ScrollView, StyleSheet, View, ViewStyle } from 'react-native';
import { SafeAreaView, Edge } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { theme } from '@/theme';

export interface ScreenProps {
  children: ReactNode;
  scroll?: boolean;
  padded?: boolean;
  edges?: Edge[];
  contentStyle?: ViewStyle;
  /** Set background to transparent for full-bleed map screens */
  transparent?: boolean;
}

/**
 * Screen — wraps a route with safe area, status bar config, and consistent padding.
 */
export function Screen({
  children,
  scroll = false,
  padded = true,
  edges = ['top', 'left', 'right'],
  contentStyle,
  transparent,
}: ScreenProps) {
  const Container = scroll ? ScrollView : View;

  return (
    <SafeAreaView
      edges={edges}
      style={[
        styles.safe,
        { backgroundColor: transparent ? 'transparent' : theme.colors.ink },
      ]}
    >
      <StatusBar style="light" />
      <Container
        style={styles.flex}
        contentContainerStyle={
          scroll
            ? [
                padded && { padding: theme.layout.screenPadding },
                { paddingBottom: theme.spacing.xxxl },
                contentStyle,
              ]
            : undefined
        }
      >
        {scroll ? (
          children
        ) : (
          <View style={[styles.flex, padded && { padding: theme.layout.screenPadding }, contentStyle]}>
            {children}
          </View>
        )}
      </Container>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  flex: { flex: 1 },
});
