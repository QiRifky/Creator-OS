import React from 'react';
import { View, Text } from 'react-native';
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
}: StatCardProps) {
  const { colors } = useTheme();

  return (
    <Animated.View
      entering={FadeInUp.delay(index * 120).duration(500).springify()}
      style={{
        flex: 1,
        backgroundColor: colors.card,
        borderRadius: 18,
        borderCurve: 'continuous',
        padding: 16,
        gap: 10,
        borderWidth: 1,
        borderColor: colors.border,
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
      }}
    >
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
          }}
          numberOfLines={2}
        >
          {label}
        </Text>
        <View
          style={{
            width: 32,
            height: 32,
            borderRadius: 10,
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
        style={{ fontSize: 26 }}
      />
    </Animated.View>
  );
}
