import React, { useMemo } from 'react';
import { View, Text, ScrollView, Pressable, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Fonts } from '@/constants/Typography';
import { useTheme } from '@/components/theme-context';
import { useAppStore } from '@/store/useAppStore';
import { StatCard } from '@/components/stat-card';
import Animated, { FadeInDown } from 'react-native-reanimated';

export default function DashboardScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const getUserContests = useAppStore((s) => s.getUserContests);
  const getCurrentUser = useAppStore((s) => s.getCurrentUser);

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

  const recentContests = useMemo(() => {
    return contests.slice(0, 3);
  }, [contests]);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setKey((k) => k + 1);
    setTimeout(() => setRefreshing(false), 600);
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView
        contentContainerStyle={{
          paddingTop: insets.top + 8,
          paddingBottom: insets.bottom + 100,
          paddingHorizontal: 20,
          gap: 24,
        }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />
        }
      >
        {/* Header */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <View>
            <Text
              style={{
                fontFamily: Fonts.extraBold,
                fontSize: 28,
                color: colors.textPrimary,
                letterSpacing: -0.5,
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
                  marginTop: 2,
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
              opacity: pressed ? 0.7 : 1,
              transform: [{ scale: pressed ? 0.95 : 1 }],
            })}
          >
            <Ionicons name="settings-outline" size={22} color={colors.textSecondary} />
          </Pressable>
        </View>

        {/* Stat Cards Row 1 */}
        <View key={`stats-${key}`} style={{ flexDirection: 'row', gap: 12 }}>
          <StatCard
            label="Total Contests Joined"
            value={stats.total}
            icon="clipboard-outline"
            iconColor={colors.primary}
            iconBg={colors.primaryMuted}
            index={0}
          />
          <StatCard
            label="Total Wins"
            value={stats.wins}
            icon="trophy"
            iconColor={colors.winGold}
            iconBg="rgba(255, 215, 0, 0.15)"
            index={1}
          />
        </View>

        {/* Stat Cards Row 2 */}
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
          />
          <StatCard
            label="Total Prize Earned"
            value={stats.earnings}
            prefix="$"
            icon="cash-outline"
            iconColor={colors.success}
            iconBg={colors.successMuted}
            index={3}
          />
        </View>

        {/* Recent Activity */}
        {recentContests.length > 0 && (
          <Animated.View entering={FadeInDown.delay(400).duration(500)} style={{ gap: 14 }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <Text
                style={{
                  fontFamily: Fonts.semiBold,
                  fontSize: 17,
                  color: colors.textPrimary,
                }}
              >
                Recent Activity
              </Text>
              <Pressable onPress={() => router.navigate('/(tabs)/feed')}>
                <Text
                  style={{
                    fontFamily: Fonts.medium,
                    fontSize: 13,
                    color: colors.primary,
                  }}
                >
                  View All
                </Text>
              </Pressable>
            </View>
            {recentContests.map((contest) => (
              <Pressable
                key={contest.id}
                onPress={() => router.push({ pathname: '/edit-contest', params: { id: contest.id } })}
                style={({ pressed }) => ({
                  flexDirection: 'row',
                  alignItems: 'center',
                  backgroundColor: colors.card,
                  padding: 14,
                  borderRadius: 14,
                  borderCurve: 'continuous',
                  borderWidth: 1,
                  borderColor: colors.border,
                  gap: 12,
                  opacity: pressed ? 0.85 : 1,
                })}
              >
                <View
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 12,
                    borderCurve: 'continuous',
                    backgroundColor:
                      contest.status === 'Won'
                        ? colors.successMuted
                        : contest.status === 'Lost'
                        ? colors.errorMuted
                        : colors.primaryMuted,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Ionicons
                    name={
                      contest.status === 'Won'
                        ? 'trophy'
                        : contest.status === 'Lost'
                        ? 'close-circle-outline'
                        : 'document-text-outline'
                    }
                    size={18}
                    color={
                      contest.status === 'Won'
                        ? colors.success
                        : contest.status === 'Lost'
                        ? colors.error
                        : colors.primary
                    }
                  />
                </View>
                <View style={{ flex: 1, gap: 2 }}>
                  <Text
                    numberOfLines={1}
                    style={{
                      fontFamily: Fonts.semiBold,
                      fontSize: 14,
                      color: colors.textPrimary,
                    }}
                  >
                    {contest.name}
                  </Text>
                  <Text
                    style={{
                      fontFamily: Fonts.regular,
                      fontSize: 12,
                      color: colors.textTertiary,
                    }}
                  >
                    {contest.platform} &middot; {contest.type}
                  </Text>
                </View>
                <View
                  style={{
                    paddingHorizontal: 10,
                    paddingVertical: 4,
                    borderRadius: 10,
                    backgroundColor:
                      contest.status === 'Won'
                        ? colors.successMuted
                        : contest.status === 'Lost'
                        ? colors.errorMuted
                        : colors.primaryMuted,
                  }}
                >
                  <Text
                    style={{
                      fontFamily: Fonts.semiBold,
                      fontSize: 11,
                      color:
                        contest.status === 'Won'
                          ? colors.success
                          : contest.status === 'Lost'
                          ? colors.error
                          : colors.primary,
                    }}
                  >
                    {contest.status}
                  </Text>
                </View>
              </Pressable>
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
              paddingVertical: 32,
              gap: 12,
            }}
          >
            <Ionicons name="sparkles-outline" size={48} color={colors.textTertiary} />
            <Text
              style={{
                fontFamily: Fonts.semiBold,
                fontSize: 16,
                color: colors.textSecondary,
                textAlign: 'center',
              }}
            >
              No contests yet
            </Text>
            <Text
              style={{
                fontFamily: Fonts.regular,
                fontSize: 14,
                color: colors.textTertiary,
                textAlign: 'center',
                lineHeight: 20,
              }}
            >
              Add your first contest to start{'\n'}tracking your journey!
            </Text>
          </Animated.View>
        )}
      </ScrollView>
    </View>
  );
}
