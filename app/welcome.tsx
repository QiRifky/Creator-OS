import React from 'react';
import { View, Text, useWindowDimensions, type ViewStyle } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Fonts } from '@/constants/Typography';
import { Gradients } from '@/constants/Colors';
import { useTheme } from '@/components/theme-context';
import { Button } from '@/components/ui/button';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';

export default function WelcomeScreen() {
  const router = useRouter();
  const { colors, mode } = useTheme();
  const { height } = useWindowDimensions();
  const isDark = mode === 'dark';

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View
        style={{
          flex: 1,
          backgroundColor: colors.background,
          justifyContent: 'center',
          alignItems: 'center',
          padding: 28,
          experimental_backgroundImage: isDark ? Gradients.welcomeDark : Gradients.welcomeLight,
        } as ViewStyle}
      >
        <Animated.View
          entering={FadeInUp.duration(900).springify().damping(14)}
          style={{ alignItems: 'center', gap: 20, marginBottom: height * 0.08 }}
        >
          {/* Logo with ambient glow */}
          <View style={{ alignItems: 'center', justifyContent: 'center', marginBottom: 8 }}>
            {isDark && (
              <View style={{ position: 'absolute', width: 130, height: 130, borderRadius: 65, backgroundColor: colors.primaryGlow, opacity: 0.15 }} />
            )}
            <View
              style={{
                width: 92,
                height: 92,
                borderRadius: 28,
                borderCurve: 'continuous',
                backgroundColor: colors.primaryMuted,
                alignItems: 'center',
                justifyContent: 'center',
                borderWidth: 1,
                borderColor: isDark ? 'rgba(108,99,255,0.2)' : 'rgba(108,99,255,0.08)',
                boxShadow: isDark ? `0 0 40px ${colors.primaryGlow}` : undefined,
              }}
            >
              <Ionicons name="trophy" size={44} color={colors.primary} />
            </View>
          </View>
          <Text
            style={{
              fontFamily: Fonts.extraBold,
              fontSize: 42,
              color: colors.textPrimary,
              letterSpacing: -1.5,
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
              lineHeight: 25,
              maxWidth: 260,
            }}
          >
            Track contests. Measure success.{'\n'}Build a career.
          </Text>
        </Animated.View>

        <Animated.View
          entering={FadeInDown.delay(350).duration(700).springify().damping(16)}
          style={{ width: '100%', gap: 14, maxWidth: 340 }}
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
