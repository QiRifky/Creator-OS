import React, { useState, useCallback } from 'react';
import {
  Text,
  ScrollView,
  KeyboardAvoidingView,
} from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { Fonts } from '@/constants/Typography';
import { useTheme } from '@/components/theme-context';
import { useAppStore } from '@/store/useAppStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Animated, { FadeInDown } from 'react-native-reanimated';

export default function SignUpScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const signUp = useAppStore((s) => s.signUp);

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = useCallback(() => {
    const e: Record<string, string> = {};
    if (!username.trim()) e.username = 'Username is required';
    else if (username.trim().length < 3)
      e.username = 'Username must be at least 3 characters';
    if (!password) e.password = 'Password is required';
    else if (password.length < 6)
      e.password = 'Password must be at least 6 characters';
    if (password !== confirmPassword)
      e.confirmPassword = 'Passwords do not match';
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      e.email = 'Invalid email address';
    setErrors(e);
    return Object.keys(e).length === 0;
  }, [username, password, confirmPassword, email]);

  const handleSignUp = useCallback(() => {
    if (!validate()) return;
    setLoading(true);

    setTimeout(() => {
      const result = signUp(username.trim(), password, email.trim());
      setLoading(false);

      if (result.success) {
        router.replace('/(tabs)/dashboard');
      } else {
        setErrors({ username: result.error || 'Sign up failed' });
      }
    }, 400);
  }, [validate, signUp, username, password, email, router]);

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          title: 'Create Account',
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.textPrimary,
          headerTitleStyle: { fontFamily: Fonts.semiBold },
          headerShadowVisible: false,
        }}
      />
      <KeyboardAvoidingView
        behavior={process.env.EXPO_OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1, backgroundColor: colors.background }}
      >
        <ScrollView
          contentContainerStyle={{ padding: 24, gap: 20, paddingBottom: 48 }}
          keyboardShouldPersistTaps="handled"
        >
          <Animated.View entering={FadeInDown.duration(500)} style={{ gap: 6, marginBottom: 8 }}>
            <Text
              style={{
                fontFamily: Fonts.bold,
                fontSize: 28,
                color: colors.textPrimary,
              }}
            >
              Join Contestly
            </Text>
            <Text
              style={{
                fontFamily: Fonts.regular,
                fontSize: 15,
                color: colors.textSecondary,
                lineHeight: 22,
              }}
            >
              Start tracking your contest journey today.
            </Text>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(100).duration(500)} style={{ gap: 16 }}>
            <Input
              label="Username"
              placeholder="Choose a username"
              icon="person-outline"
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
              autoCorrect={false}
              error={errors.username}
            />

            <Input
              label="Email (optional)"
              placeholder="your@email.com"
              icon="mail-outline"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              error={errors.email}
            />

            <Input
              label="Password"
              placeholder="Min 6 characters"
              icon="lock-closed-outline"
              value={password}
              onChangeText={setPassword}
              isPassword
              error={errors.password}
            />

            <Input
              label="Confirm Password"
              placeholder="Re-enter password"
              icon="lock-closed-outline"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              isPassword
              error={errors.confirmPassword}
            />
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(250).duration(500)} style={{ gap: 12, marginTop: 8 }}>
            <Button
              title="Create Account"
              onPress={handleSignUp}
              loading={loading}
              style={{ paddingVertical: 18 }}
            />
            <Button
              title="Already have an account? Log in"
              onPress={() => router.replace('/login')}
              variant="ghost"
              textStyle={{ color: colors.textSecondary, fontSize: 14 }}
            />
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
}
