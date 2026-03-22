import React from 'react';
import { View, Text, useWindowDimensions } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Fonts } from '@/constants/Typography';
import { useTheme } from '@/components/theme-context';
import { Button } from '@/components/ui/button';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';

export default function WelcomeScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { height } = useWindowDimensions();

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View
        style={{
          flex: 1,
          backgroundColor: colors.background,
          justifyContent: 'center',
          alignItems: 'center',
          padding: 24,
        }}
      >
        <Animated.View
          entering={FadeInUp.duration(800).springify()}
          style={{ alignItems: 'center', gap: 16, marginBottom: height * 0.08 }}
        >
          <View
            style={{
              width: 88,
              height: 88,
              borderRadius: 24,
              borderCurve: 'continuous',
              backgroundColor: colors.primaryMuted,
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 8,
            }}
          >
            <Ionicons name="trophy" size={42} color={colors.primary} />
          </View>
          <Text
            style={{
              fontFamily: Fonts.extraBold,
              fontSize: 36,
              color: colors.textPrimary,
              letterSpacing: -1,
            }}
          >
            Contestly
          </Text>
          <Text
            style={{
              fontFamily: Fonts.medium,
              fontSize: 16,
              color: colors.textSecondary,
              textAlign: 'center',
              lineHeight: 24,
              maxWidth: 280,
            }}
          >
            Track contests. Measure success.{'\n'}Build a career.
          </Text>
        </Animated.View>

        <Animated.View
          entering={FadeInDown.delay(300).duration(600).springify()}
          style={{ width: '100%', gap: 12, maxWidth: 360 }}
        >
          <Button
            title="Get Started"
            onPress={() => router.push('/signup')}
            variant="primary"
            style={{ paddingVertical: 18 }}
          />
          <Button
            title="I already have an account"
            onPress={() => router.push('/login')}
            variant="ghost"
            textStyle={{ color: colors.textSecondary, fontSize: 15 }}
          />
        </Animated.View>
      </View>
    </>
  );
}
