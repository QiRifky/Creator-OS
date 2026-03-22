import React from 'react';
import { View, Text, Pressable } from 'react-native';
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

function getDeadlineText(deadline: string): { text: string; isExpired: boolean } {
  const now = new Date();
  const dl = new Date(deadline);
  const diff = dl.getTime() - now.getTime();

  if (diff <= 0) return { text: 'Expired', isExpired: true };

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  if (days > 0) return { text: `${days}d ${hours}h ${minutes}m`, isExpired: false };
  if (hours > 0) return { text: `${hours}h ${minutes}m`, isExpired: false };
  return { text: `${minutes}m`, isExpired: false };
}

export function ContestCard({ contest, index, onPress }: ContestCardProps) {
  const { colors } = useTheme();
  const platColors = PlatformColors[contest.platform] || PlatformColors.Other;
  const deadline = getDeadlineText(contest.deadline);

  return (
    <Animated.View
      entering={FadeInUp.delay(index * 80).duration(400).springify()}
    >
      <Pressable
        onPress={onPress}
        style={({ pressed }) => ({
          backgroundColor: colors.card,
          borderRadius: 18,
          borderCurve: 'continuous',
          padding: 16,
          gap: 12,
          borderWidth: 1,
          borderColor: colors.border,
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
          opacity: pressed ? 0.92 : 1,
          transform: [{ scale: pressed ? 0.98 : 1 }],
        })}
      >
        <Text
          style={{
            fontFamily: Fonts.bold,
            fontSize: 16,
            color: colors.textPrimary,
          }}
          numberOfLines={1}
        >
          {contest.name}
        </Text>

        <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}>
          <View
            style={{
              backgroundColor: platColors.bg,
              paddingHorizontal: 10,
              paddingVertical: 3,
              borderRadius: 12,
              borderCurve: 'continuous',
            }}
          >
            <Text
              style={{
                fontFamily: Fonts.semiBold,
                fontSize: 11,
                color: platColors.text,
              }}
            >
              {contest.platform}
            </Text>
          </View>
          <View
            style={{
              backgroundColor: colors.cardElevated,
              paddingHorizontal: 10,
              paddingVertical: 3,
              borderRadius: 12,
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

        <View style={{ flexDirection: 'row', gap: 16, alignItems: 'center' }}>
          <View style={{ gap: 2 }}>
            <Text
              style={{
                fontFamily: Fonts.regular,
                fontSize: 11,
                color: colors.textTertiary,
              }}
            >
              Prize
            </Text>
            <Text
              selectable
              style={{
                fontFamily: Fonts.bold,
                fontSize: 15,
                color: colors.textPrimary,
              }}
            >
              ${contest.prize.toLocaleString()}
            </Text>
          </View>

          <View style={{ gap: 2 }}>
            <Text
              style={{
                fontFamily: Fonts.regular,
                fontSize: 11,
                color: colors.textTertiary,
              }}
            >
              Deadline
            </Text>
            <Text
              style={{
                fontFamily: Fonts.semiBold,
                fontSize: 13,
                color: deadline.isExpired ? colors.error : colors.warning,
                fontVariant: ['tabular-nums'],
              }}
            >
              {deadline.text}
            </Text>
          </View>

          <View style={{ flex: 1, alignItems: 'flex-end' }}>
            <Text
              style={{
                fontFamily: Fonts.regular,
                fontSize: 11,
                color: colors.textTertiary,
                marginBottom: 2,
              }}
            >
              Status
            </Text>
            <StatusBadge status={contest.status} />
          </View>
        </View>
      </Pressable>
    </Animated.View>
  );
}
