import React from 'react';
import { View, Text, type ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Fonts } from '@/constants/Typography';
import { useTheme } from '@/components/theme-context';
import { AnimatedCounter } from './animated-counter';
import Animated, { FadeInUp } from 'react-native-reanimated';

interface StatCardProps {
  label: string;
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  icon: keyof typeof Ionicons.glyphMap;
  iconColor: string;
  iconBg: string;
  index: number;
  accentColor?: string;
}

export function StatCard({
  label,
  value,
  prefix,
  suffix,
  decimals,
  icon,
  iconColor,
  iconBg,
  index,
  accentColor,
}: StatCardProps) {
  const { colors, mode } = useTheme();
  const glowColor = accentColor || iconColor;

  return (
    <Animated.View
      entering={FadeInUp.delay(index * 100 + 80).duration(450).springify().damping(16)}
      style={{
        flex: 1,
        backgroundColor: colors.card,
        borderRadius: 20,
        borderCurve: 'continuous',
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: colors.border,
        boxShadow: mode === 'dark'
          ? `0 2px 20px rgba(0,0,0,0.3), 0 0 40px ${glowColor}15`
          : colors.cardShadow,
      } as ViewStyle}
    >
      {/* Gradient accent line at top */}
      <View
        style={{
          height: 2.5,
          experimental_backgroundImage: `linear-gradient(90deg, ${iconColor} 0%, ${iconColor}44 100%)`,
        } as ViewStyle}
      />
      <View style={{ padding: 16, gap: 12 }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Text
            style={{
              fontFamily: Fonts.medium,
              fontSize: 12,
              color: colors.textSecondary,
              flexShrink: 1,
              letterSpacing: 0.2,
            }}
            numberOfLines={2}
          >
            {label}
          </Text>
          <View
            style={{
              width: 34,
              height: 34,
              borderRadius: 11,
              borderCurve: 'continuous',
              backgroundColor: iconBg,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Ionicons name={icon} size={16} color={iconColor} />
          </View>
        </View>
        <AnimatedCounter
          value={value}
          prefix={prefix}
          suffix={suffix}
          decimals={decimals}
          style={{ fontSize: 28, letterSpacing: -1 }}
        />
      </View>
    </Animated.View>
  );
}
