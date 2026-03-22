import React, { useMemo } from 'react';
import { View, Text, ScrollView, Pressable, RefreshControl, type ViewStyle } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Fonts } from '@/constants/Typography';
import { useTheme } from '@/components/theme-context';
import { useAppStore } from '@/store/useAppStore';
import { StatCard } from '@/components/stat-card';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';

export default function DashboardScreen() {
  const router = useRouter();
  const { colors, mode } = useTheme();
  const insets = useSafeAreaInsets();
  const getUserContests = useAppStore((s) => s.getUserContests);
  const getCurrentUser = useAppStore((s) => s.getCurrentUser);
  const isDark = mode === 'dark';

  const [refreshing, setRefreshing] = React.useState(false);
  const [key, setKey] = React.useState(0);

  const contests = getUserContests();
  const user = getCurrentUser();

  const stats = useMemo(() => {
    const total = contests.length;
    const wins = contests.filter((c) => c.status === 'Won').length;
    const winRate = total > 0 ? (wins / total) * 100 : 0;
    const earnings = contests
      .filter((c) => c.status === 'Won')
      .reduce((sum, c) => sum + c.prize, 0);
    return { total, wins, winRate, earnings };
  }, [contests]);

  const recentContests = useMemo(() => contests.slice(0, 3), [contests]);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setKey((k) => k + 1);
    setTimeout(() => setRefreshing(false), 600);
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView
        contentContainerStyle={{
          paddingTop: insets.top + 12,
          paddingBottom: insets.bottom + 100,
          paddingHorizontal: 20,
          gap: 22,
        }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />
        }
      >
        {/* Header */}
        <Animated.View
          entering={FadeInUp.duration(500)}
          style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}
        >
          <View style={{ gap: 3 }}>
            <Text
              style={{
                fontFamily: Fonts.extraBold,
                fontSize: 30,
                color: colors.textPrimary,
                letterSpacing: -1,
              }}
            >
              Contestly
            </Text>
            {user && (
              <Text
                style={{
                  fontFamily: Fonts.medium,
                  fontSize: 14,
                  color: colors.textSecondary,
                }}
              >
                Hey, {user.displayName}
              </Text>
            )}
          </View>
          <Pressable
            onPress={() => router.push('/settings')}
            style={({ pressed }) => ({
              width: 44,
              height: 44,
              borderRadius: 14,
              borderCurve: 'continuous',
              backgroundColor: colors.card,
              borderWidth: 1,
              borderColor: colors.border,
              alignItems: 'center',
              justifyContent: 'center',
              transform: [{ scale: pressed ? 0.92 : 1 }, { rotate: pressed ? '15deg' : '0deg' }],
              boxShadow: isDark ? '0 2px 10px rgba(0,0,0,0.2)' : colors.cardShadow,
            } as ViewStyle)}
          >
            <Ionicons name="settings-outline" size={20} color={colors.textSecondary} />
          </Pressable>
        </Animated.View>

        {/* Stat Cards */}
        <View key={`stats-${key}`} style={{ flexDirection: 'row', gap: 12 }}>
          <StatCard
            label="Total Contests"
            value={stats.total}
            icon="clipboard-outline"
            iconColor={colors.primary}
            iconBg={colors.primaryMuted}
            index={0}
            accentColor={colors.primary}
          />
          <StatCard
            label="Total Wins"
            value={stats.wins}
            icon="trophy"
            iconColor={colors.winGold}
            iconBg={colors.winGoldGlow}
            index={1}
            accentColor={colors.winGold}
          />
        </View>

        <View style={{ flexDirection: 'row', gap: 12 }}>
          <StatCard
            label="Win Rate"
            value={stats.winRate}
            suffix="%"
            decimals={1}
            icon="analytics-outline"
            iconColor={colors.accent}
            iconBg={colors.accentMuted}
            index={2}
            accentColor={colors.accent}
          />
          <StatCard
            label="Prize Earned"
            value={stats.earnings}
            prefix="$"
            icon="cash-outline"
            iconColor={colors.success}
            iconBg={colors.successMuted}
            index={3}
            accentColor={colors.success}
          />
        </View>

        {/* Recent Activity */}
        {recentContests.length > 0 && (
          <Animated.View entering={FadeInDown.delay(400).duration(500)} style={{ gap: 14 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <Text style={{ fontFamily: Fonts.bold, fontSize: 18, color: colors.textPrimary, letterSpacing: -0.3 }}>
                Recent Activity
              </Text>
              <Pressable onPress={() => router.navigate('/(tabs)/feed')} hitSlop={8}>
                <Text style={{ fontFamily: Fonts.medium, fontSize: 13, color: colors.primary }}>
                  View All
                </Text>
              </Pressable>
            </View>
            {recentContests.map((contest, idx) => (
              <Animated.View
                key={contest.id}
                entering={FadeInDown.delay(450 + idx * 60).duration(400)}
              >
                <Pressable
                  onPress={() => router.push({ pathname: '/edit-contest', params: { id: contest.id } })}
                  style={({ pressed }) => ({
                    flexDirection: 'row',
                    alignItems: 'center',
                    backgroundColor: colors.card,
                    padding: 14,
                    borderRadius: 16,
                    borderCurve: 'continuous',
                    borderWidth: 1,
                    borderColor: pressed ? colors.primary + '30' : colors.border,
                    gap: 12,
                    transform: [{ scale: pressed ? 0.98 : 1 }],
                    boxShadow: isDark ? '0 1px 8px rgba(0,0,0,0.2)' : colors.cardShadow,
                  } as ViewStyle)}
                >
                  <View
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 12,
                      borderCurve: 'continuous',
                      backgroundColor:
                        contest.status === 'Won' ? colors.successMuted
                        : contest.status === 'Lost' ? colors.errorMuted
                        : colors.primaryMuted,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Ionicons
                      name={contest.status === 'Won' ? 'trophy' : contest.status === 'Lost' ? 'close-circle-outline' : 'document-text-outline'}
                      size={18}
                      color={contest.status === 'Won' ? colors.success : contest.status === 'Lost' ? colors.error : colors.primary}
                    />
                  </View>
                  <View style={{ flex: 1, gap: 2 }}>
                    <Text numberOfLines={1} style={{ fontFamily: Fonts.semiBold, fontSize: 14, color: colors.textPrimary }}>
                      {contest.name}
                    </Text>
                    <Text style={{ fontFamily: Fonts.regular, fontSize: 12, color: colors.textTertiary }}>
                      {contest.platform} &middot; {contest.type}
                    </Text>
                  </View>
                  <View
                    style={{
                      paddingHorizontal: 10,
                      paddingVertical: 4,
                      borderRadius: 8,
                      backgroundColor:
                        contest.status === 'Won' ? colors.successMuted
                        : contest.status === 'Lost' ? colors.errorMuted
                        : colors.primaryMuted,
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: Fonts.semiBold,
                        fontSize: 11,
                        color:
                          contest.status === 'Won' ? colors.success
                          : contest.status === 'Lost' ? colors.error
                          : colors.primary,
                      }}
                    >
                      {contest.status}
                    </Text>
                  </View>
                </Pressable>
              </Animated.View>
            ))}
          </Animated.View>
        )}

        {/* Empty State */}
        {contests.length === 0 && (
          <Animated.View
            entering={FadeInDown.delay(400).duration(500)}
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              paddingVertical: 40,
              gap: 14,
              backgroundColor: colors.card,
              borderRadius: 20,
              borderCurve: 'continuous',
              borderWidth: 1,
              borderColor: colors.border,
            }}
          >
            <View style={{ width: 56, height: 56, borderRadius: 16, backgroundColor: colors.primaryMuted, alignItems: 'center', justifyContent: 'center' }}>
              <Ionicons name="sparkles-outline" size={28} color={colors.primary} />
            </View>
            <Text style={{ fontFamily: Fonts.semiBold, fontSize: 16, color: colors.textPrimary, textAlign: 'center' }}>
              No contests yet
            </Text>
            <Text style={{ fontFamily: Fonts.regular, fontSize: 14, color: colors.textTertiary, textAlign: 'center', lineHeight: 21 }}>
              Add your first contest to start{'\n'}tracking your journey!
            </Text>
          </Animated.View>
        )}
      </ScrollView>
    </View>
  );
}
