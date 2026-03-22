import React, { useMemo, useCallback } from 'react';
import { View, Text, ScrollView, RefreshControl } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Fonts } from '@/constants/Typography';
import { useTheme } from '@/components/theme-context';
import { useAppStore } from '@/store/useAppStore';
import { PieChart } from '@/components/pie-chart';
import { BarChart } from '@/components/bar-chart';
import { StatusColors } from '@/constants/Colors';
import type { ContestStatus } from '@/store/types';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';

const STATUSES: ContestStatus[] = ['Draft', 'Submitted', 'Shortlisted', 'Won', 'Lost'];

const STATUS_ICONS: Record<ContestStatus, keyof typeof Ionicons.glyphMap> = {
  Draft: 'document-outline',
  Submitted: 'paper-plane-outline',
  Shortlisted: 'star-outline',
  Won: 'trophy-outline',
  Lost: 'close-circle-outline',
};

export default function PortfolioScreen() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const getUserContests = useAppStore((s) => s.getUserContests);
  const [refreshing, setRefreshing] = React.useState(false);

  const contests = getUserContests();

  const stats = useMemo(() => {
    const total = contests.length;
    const wins = contests.filter((c) => c.status === 'Won').length;
    const submitted = contests.filter((c) => c.status === 'Submitted').length;
    const shortlisted = contests.filter((c) => c.status === 'Shortlisted').length;
    const earnings = contests
      .filter((c) => c.status === 'Won')
      .reduce((sum, c) => sum + c.prize, 0);
    const winRate = total > 0 ? (wins / total) * 100 : 0;

    const statusCounts: Record<ContestStatus, number> = {
      Draft: contests.filter((c) => c.status === 'Draft').length,
      Submitted: submitted,
      Shortlisted: shortlisted,
      Won: wins,
      Lost: contests.filter((c) => c.status === 'Lost').length,
    };

    return { total, wins, submitted, shortlisted, earnings, winRate, statusCounts };
  }, [contests]);

  const monthlyEarnings = useMemo(() => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const now = new Date();
    const last6 = [];

    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthIdx = d.getMonth();
      const year = d.getFullYear();
      const label = months[monthIdx];

      const total = contests
        .filter((c) => {
          if (c.status !== 'Won') return false;
          const cd = new Date(c.updatedAt || c.createdAt);
          return cd.getMonth() === monthIdx && cd.getFullYear() === year;
        })
        .reduce((sum, c) => sum + c.prize, 0);

      last6.push({ label, value: total });
    }

    return last6;
  }, [contests]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 500);
  }, []);

  const SummaryItem = ({
    label,
    value,
    color,
  }: {
    label: string;
    value: string;
    color?: string;
  }) => (
    <View style={{ flex: 1, alignItems: 'center', gap: 4 }}>
      <Text
        selectable
        style={{
          fontFamily: Fonts.extraBold,
          fontSize: 20,
          color: color || colors.textPrimary,
          fontVariant: ['tabular-nums'],
        }}
      >
        {value}
      </Text>
      <Text
        style={{
          fontFamily: Fonts.medium,
          fontSize: 11,
          color: colors.textTertiary,
        }}
      >
        {label}
      </Text>
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView
        contentContainerStyle={{
          paddingTop: insets.top + 8,
          paddingBottom: insets.bottom + 100,
          paddingHorizontal: 20,
          gap: 20,
        }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
          />
        }
      >
        {/* Header */}
        <Text
          style={{
            fontFamily: Fonts.extraBold,
            fontSize: 28,
            color: colors.textPrimary,
            letterSpacing: -0.5,
          }}
        >
          Portfolio
        </Text>

        {/* Summary Row */}
        <Animated.View
          entering={FadeInUp.duration(500)}
          style={{
            flexDirection: 'row',
            backgroundColor: colors.card,
            borderRadius: 18,
            borderCurve: 'continuous',
            padding: 18,
            borderWidth: 1,
            borderColor: colors.border,
          }}
        >
          <SummaryItem label="Wins" value={`${stats.wins}`} color={colors.success} />
          <SummaryItem label="Submitted" value={`${stats.submitted}`} color={colors.primary} />
          <SummaryItem label="Waiting" value={`${stats.shortlisted}`} color={colors.warning} />
          <SummaryItem label="Earnings" value={`$${stats.earnings.toLocaleString()}`} color={colors.accent} />
        </Animated.View>

        {/* Status Breakdown */}
        <Animated.View entering={FadeInDown.delay(150).duration(500)} style={{ gap: 12 }}>
          <Text
            style={{
              fontFamily: Fonts.semiBold,
              fontSize: 17,
              color: colors.textPrimary,
            }}
          >
            Status Breakdown
          </Text>
          <View
            style={{
              backgroundColor: colors.card,
              borderRadius: 18,
              borderCurve: 'continuous',
              borderWidth: 1,
              borderColor: colors.border,
              overflow: 'hidden',
            }}
          >
            {STATUSES.map((status, idx) => {
              const count = stats.statusCounts[status];
              const statusColor = StatusColors[status];
              return (
                <View
                  key={status}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingHorizontal: 16,
                    paddingVertical: 14,
                    borderBottomWidth: idx < STATUSES.length - 1 ? 0.5 : 0,
                    borderBottomColor: colors.border,
                    gap: 12,
                  }}
                >
                  <Ionicons
                    name={STATUS_ICONS[status]}
                    size={18}
                    color={statusColor.text}
                  />
                  <Text
                    style={{
                      flex: 1,
                      fontFamily: Fonts.medium,
                      fontSize: 15,
                      color: colors.textPrimary,
                    }}
                  >
                    {status}
                  </Text>
                  <View
                    style={{
                      backgroundColor: statusColor.bg,
                      paddingHorizontal: 12,
                      paddingVertical: 4,
                      borderRadius: 12,
                      minWidth: 44,
                      alignItems: 'center',
                    }}
                  >
                    <Text
                      selectable
                      style={{
                        fontFamily: Fonts.bold,
                        fontSize: 14,
                        color: statusColor.text,
                        fontVariant: ['tabular-nums'],
                      }}
                    >
                      {count}
                    </Text>
                  </View>
                </View>
              );
            })}
          </View>
        </Animated.View>

        {/* Charts */}
        <Animated.View
          entering={FadeInDown.delay(300).duration(500)}
          style={{ flexDirection: 'row', gap: 16, alignItems: 'flex-start' }}
        >
          {/* Pie Chart */}
          <View
            style={{
              flex: 1,
              backgroundColor: colors.card,
              borderRadius: 18,
              borderCurve: 'continuous',
              padding: 18,
              borderWidth: 1,
              borderColor: colors.border,
              alignItems: 'center',
            }}
          >
            <Text
              style={{
                fontFamily: Fonts.semiBold,
                fontSize: 14,
                color: colors.textSecondary,
                marginBottom: 12,
              }}
            >
              Win Rate
            </Text>
            <PieChart percentage={stats.winRate} size={120} strokeWidth={12} label="" />
          </View>

          {/* Bar Chart */}
          <View
            style={{
              flex: 1.5,
              backgroundColor: colors.card,
              borderRadius: 18,
              borderCurve: 'continuous',
              padding: 18,
              borderWidth: 1,
              borderColor: colors.border,
            }}
          >
            <Text
              style={{
                fontFamily: Fonts.semiBold,
                fontSize: 14,
                color: colors.textSecondary,
                marginBottom: 8,
              }}
            >
              Monthly Earnings
            </Text>
            <BarChart data={monthlyEarnings} height={140} />
          </View>
        </Animated.View>

        {/* Empty State */}
        {contests.length === 0 && (
          <View
            style={{
              alignItems: 'center',
              paddingVertical: 24,
              gap: 8,
            }}
          >
            <Ionicons name="bar-chart-outline" size={40} color={colors.textTertiary} />
            <Text
              style={{
                fontFamily: Fonts.medium,
                fontSize: 14,
                color: colors.textTertiary,
                textAlign: 'center',
              }}
            >
              Start adding contests to see analytics
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
