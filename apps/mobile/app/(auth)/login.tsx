import { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';

import { theme } from '@/theme';
import { Button, Input, Screen, Text } from '@/components/ui';
import { authService } from '@/services/auth';
import { LockIcon, MailIcon } from '@/components/icons';

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmit = async () => {
    if (!email || !password) {
      Alert.alert('Missing details', 'Enter your email and password.');
      return;
    }
    setLoading(true);
    try {
      await authService.signIn({ email: email.trim(), password });
      router.replace('/(tabs)');
    } catch (e: any) {
      Alert.alert('Sign in failed', e?.message ?? 'Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.header}>
          <Text variant="hero">Welcome back</Text>
          <Text variant="body" color="textSecondary">
            Sign in to keep your rides, routes, and friends in sync.
          </Text>
        </View>

        <View style={styles.form}>
          <Input
            label="Email"
            placeholder="you@example.com"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            leftSlot={<MailIcon color={theme.colors.textMuted} size={18} />}
          />
          <Input
            label="Password"
            placeholder="Your password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            leftSlot={<LockIcon color={theme.colors.textMuted} size={18} />}
          />
        </View>

        <View style={styles.actions}>
          <Button label="Sign in" onPress={onSubmit} loading={loading} />
          <Button
            label="Create a new account"
            variant="ghost"
            onPress={() => router.replace('/(auth)/register')}
          />
        </View>
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'space-between' },
  header: { gap: theme.spacing.sm, marginTop: theme.spacing.xl },
  form: { gap: theme.spacing.md },
  actions: { gap: theme.spacing.sm, paddingBottom: theme.spacing.lg },
});
