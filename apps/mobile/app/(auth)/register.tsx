import { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';

import { theme } from '@/theme';
import { Button, Input, Screen, Text } from '@/components/ui';
import { authService } from '@/services/auth';
import { LockIcon, MailIcon, ProfileIcon } from '@/components/icons';

export default function RegisterScreen() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmit = async () => {
    if (!name || !email || !password) {
      Alert.alert('Missing details', 'Please fill in all the fields.');
      return;
    }
    if (password.length < 8) {
      Alert.alert('Weak password', 'Use at least 8 characters.');
      return;
    }

    setLoading(true);
    try {
      await authService.signUp({ email: email.trim(), password, displayName: name.trim() });
      router.replace('/(tabs)');
    } catch (e: any) {
      Alert.alert('Could not create account', e?.message ?? 'Try again.');
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
          <Text variant="hero">Create your account</Text>
          <Text variant="body" color="textSecondary">
            Start tracking rides, discovering routes, and meeting up with riders near you.
          </Text>
        </View>

        <View style={styles.form}>
          <Input
            label="Display name"
            placeholder="e.g., Rio Castillo"
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
            leftSlot={<ProfileIcon color={theme.colors.textMuted} size={18} />}
          />
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
            placeholder="At least 8 characters"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            leftSlot={<LockIcon color={theme.colors.textMuted} size={18} />}
          />
        </View>

        <View style={styles.actions}>
          <Button label="Create account" onPress={onSubmit} loading={loading} />
          <Button
            label="I already have an account"
            variant="ghost"
            onPress={() => router.replace('/(auth)/login')}
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
