import React from 'react';
import { View, Text, Pressable, type ViewStyle } from 'react-native';
import { Fonts } from '@/constants/Typography';
import { useTheme } from '@/components/theme-context';
import { PlatformColors } from '@/constants/Colors';
import { StatusBadge } from './status-badge';
import type { Contest } from '@/store/types';
import Animated, { FadeInUp } from 'react-native-reanimated';

interface ContestCardProps {
  contest: Contest;
  index: number;
  onPress: () => void;
}

function getDeadlineInfo(deadline: string): { text: string; isExpired: boolean; isUrgent: boolean; isSoon: boolean } {
  const now = new Date();
  const dl = new Date(deadline);
  const diff = dl.getTime() - now.getTime();

  if (diff <= 0) return { text: 'Expired', isExpired: true, isUrgent: false, isSoon: false };

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const isUrgent = diff < 24 * 60 * 60 * 1000;
  const isSoon = diff < 3 * 24 * 60 * 60 * 1000;

  if (days > 0) return { text: `${days}d ${hours}h`, isExpired: false, isUrgent, isSoon };
  if (hours > 0) return { text: `${hours}h ${minutes}m`, isExpired: false, isUrgent, isSoon };
  return { text: `${minutes}m`, isExpired: false, isUrgent: true, isSoon: true };
}

export function ContestCard({ contest, index, onPress }: ContestCardProps) {
  const { colors, mode } = useTheme();
  const platColors = PlatformColors[contest.platform] || PlatformColors.Other;
  const deadline = getDeadlineInfo(contest.deadline);

  const deadlineColor = deadline.isExpired
    ? colors.error
    : deadline.isUrgent
    ? '#FF6B6B'
    : deadline.isSoon
    ? colors.warning
    : colors.accent;

  return (
    <Animated.View
      entering={FadeInUp.delay(index * 60).duration(380).springify().damping(18)}
    >
      <Pressable
        onPress={onPress}
        style={({ pressed }) => ({
          backgroundColor: colors.card,
          borderRadius: 20,
          borderCurve: 'continuous',
          padding: 18,
          gap: 14,
          borderWidth: 1,
          borderColor: pressed ? colors.primary + '30' : colors.border,
          boxShadow: pressed
            ? undefined
            : mode === 'dark'
            ? '0 2px 16px rgba(0,0,0,0.3)'
            : colors.cardShadow,
          transform: [{ scale: pressed ? 0.98 : 1 }],
          opacity: pressed ? 0.92 : 1,
        } as ViewStyle)}
      >
        {/* Title + badges row */}
        <View style={{ gap: 10 }}>
          <Text
            style={{
              fontFamily: Fonts.bold,
              fontSize: 16,
              color: colors.textPrimary,
              letterSpacing: -0.2,
            }}
            numberOfLines={1}
          >
            {contest.name}
          </Text>

          <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
            <View
              style={{
                backgroundColor: platColors.bg,
                paddingHorizontal: 10,
                paddingVertical: 4,
                borderRadius: 8,
                borderCurve: 'continuous',
              }}
            >
              <Text
                style={{
                  fontFamily: Fonts.semiBold,
                  fontSize: 11,
                  color: platColors.text,
                  letterSpacing: 0.2,
                }}
              >
                {contest.platform}
              </Text>
            </View>
            <View
              style={{
                backgroundColor: colors.cardElevated,
                paddingHorizontal: 10,
                paddingVertical: 4,
                borderRadius: 8,
                borderCurve: 'continuous',
              }}
            >
              <Text
                style={{
                  fontFamily: Fonts.medium,
                  fontSize: 11,
                  color: colors.textSecondary,
                }}
              >
                {contest.type}
              </Text>
            </View>
          </View>
        </View>

        {/* Divider */}
        <View style={{ height: 1, backgroundColor: colors.border }} />

        {/* Stats row */}
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View style={{ flex: 1, gap: 3 }}>
            <Text style={{ fontFamily: Fonts.regular, fontSize: 10, color: colors.textTertiary, letterSpacing: 0.5, textTransform: 'uppercase' }}>
              Prize
            </Text>
            <Text
              selectable
              style={{
                fontFamily: Fonts.bold,
                fontSize: 16,
                color: colors.textPrimary,
                letterSpacing: -0.3,
              }}
            >
              ${contest.prize.toLocaleString()}
            </Text>
          </View>

          <View style={{ flex: 1, gap: 3 }}>
            <Text style={{ fontFamily: Fonts.regular, fontSize: 10, color: colors.textTertiary, letterSpacing: 0.5, textTransform: 'uppercase' }}>
              Deadline
            </Text>
            <Text
              style={{
                fontFamily: Fonts.semiBold,
                fontSize: 14,
                color: deadlineColor,
                fontVariant: ['tabular-nums'],
              }}
            >
              {deadline.text}
            </Text>
          </View>

          <View style={{ alignItems: 'flex-end', gap: 3 }}>
            <Text style={{ fontFamily: Fonts.regular, fontSize: 10, color: colors.textTertiary, letterSpacing: 0.5, textTransform: 'uppercase' }}>
              Status
            </Text>
            <StatusBadge status={contest.status} />
          </View>
        </View>
      </Pressable>
    </Animated.View>
  );
}
