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

export default function LoginScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const login = useAppStore((s) => s.login);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = useCallback(() => {
    setError('');
    if (!username.trim()) {
      setError('Please enter your username');
      return;
    }
    if (!password) {
      setError('Please enter your password');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const result = login(username.trim(), password);
      setLoading(false);

      if (result.success) {
        router.replace('/(tabs)/dashboard');
      } else {
        setError(result.error || 'Login failed');
      }
    }, 400);
  }, [username, password, login, router]);

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          title: 'Sign In',
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
              Welcome back
            </Text>
            <Text
              style={{
                fontFamily: Fonts.regular,
                fontSize: 15,
                color: colors.textSecondary,
                lineHeight: 22,
              }}
            >
              Sign in to continue tracking your contests.
            </Text>
          </Animated.View>

          {error ? (
            <Animated.View
              entering={FadeInDown.duration(300)}
              style={{
                backgroundColor: colors.errorMuted,
                padding: 14,
                borderRadius: 12,
                borderCurve: 'continuous',
              }}
            >
              <Text
                selectable
                style={{
                  fontFamily: Fonts.medium,
                  fontSize: 14,
                  color: colors.error,
                }}
              >
                {error}
              </Text>
            </Animated.View>
          ) : null}

          <Animated.View entering={FadeInDown.delay(100).duration(500)} style={{ gap: 16 }}>
            <Input
              label="Username"
              placeholder="Enter your username"
              icon="person-outline"
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
              autoCorrect={false}
            />

            <Input
              label="Password"
              placeholder="Enter your password"
              icon="lock-closed-outline"
              value={password}
              onChangeText={setPassword}
              isPassword
            />
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(250).duration(500)} style={{ gap: 12, marginTop: 8 }}>
            <Button
              title="Sign In"
              onPress={handleLogin}
              loading={loading}
              style={{ paddingVertical: 18 }}
            />
            <Button
              title="Don't have an account? Sign up"
              onPress={() => router.replace('/signup')}
              variant="ghost"
              textStyle={{ color: colors.textSecondary, fontSize: 14 }}
            />
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
}
