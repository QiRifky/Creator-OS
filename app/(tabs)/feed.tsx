import React, { useState, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  Pressable,
  RefreshControl,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Fonts } from '@/constants/Typography';
import { useTheme } from '@/components/theme-context';
import { useAppStore } from '@/store/useAppStore';
import { ContestCard } from '@/components/contest-card';
import type { ContestPlatform, ContestType } from '@/store/types';
import Animated, { FadeInDown } from 'react-native-reanimated';

const PLATFORMS: ContestPlatform[] = ['X', 'TikTok', 'Facebook', 'Instagram', 'Dribbble', 'Other'];
const TYPES: ContestType[] = ['Design', 'Video', 'Photo', 'Writing', 'Music', 'Other'];
type SortOption = 'deadline' | 'newest' | 'prize';

export default function FeedScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const getUserContests = useAppStore((s) => s.getUserContests);

  const [search, setSearch] = useState('');
  const [platformFilter, setPlatformFilter] = useState<ContestPlatform | null>(null);
  const [typeFilter, setTypeFilter] = useState<ContestType | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>('deadline');
  const [showFilters, setShowFilters] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const contests = getUserContests();

  const filteredContests = useMemo(() => {
    let result = [...contests];

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.platform.toLowerCase().includes(q) ||
          c.type.toLowerCase().includes(q)
      );
    }

    if (platformFilter) {
      result = result.filter((c) => c.platform === platformFilter);
    }

    if (typeFilter) {
      result = result.filter((c) => c.type === typeFilter);
    }

    switch (sortBy) {
      case 'deadline':
        result.sort(
          (a, b) =>
            new Date(a.deadline).getTime() - new Date(b.deadline).getTime()
        );
        break;
      case 'newest':
        result.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        break;
      case 'prize':
        result.sort((a, b) => b.prize - a.prize);
        break;
    }

    return result;
  }, [contests, search, platformFilter, typeFilter, sortBy]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 500);
  }, []);

  const FilterChip = ({
    label,
    active,
    onPress,
  }: {
    label: string;
    active: boolean;
    onPress: () => void;
  }) => (
    <Pressable
      onPress={onPress}
      style={{
        paddingHorizontal: 14,
        paddingVertical: 7,
        borderRadius: 20,
        borderCurve: 'continuous',
        backgroundColor: active ? colors.primary : colors.card,
        borderWidth: 1,
        borderColor: active ? colors.primary : colors.border,
      }}
    >
      <Text
        style={{
          fontFamily: Fonts.medium,
          fontSize: 12,
          color: active ? '#FFFFFF' : colors.textSecondary,
        }}
      >
        {label}
      </Text>
    </Pressable>
  );

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      {/* Header */}
      <View
        style={{
          paddingTop: insets.top + 8,
          paddingHorizontal: 20,
          gap: 12,
          paddingBottom: 8,
        }}
      >
        {/* Search Bar */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: colors.card,
            borderRadius: 14,
            borderCurve: 'continuous',
            borderWidth: 1,
            borderColor: colors.border,
            paddingHorizontal: 14,
            gap: 10,
          }}
        >
          <Ionicons name="search" size={18} color={colors.textTertiary} />
          <TextInput
            placeholder="Search contests..."
            placeholderTextColor={colors.textTertiary}
            value={search}
            onChangeText={setSearch}
            style={{
              flex: 1,
              fontFamily: Fonts.regular,
              fontSize: 15,
              color: colors.textPrimary,
              paddingVertical: 12,
            }}
          />
          {search.length > 0 && (
            <Pressable onPress={() => setSearch('')} hitSlop={10}>
              <Ionicons name="close-circle" size={18} color={colors.textTertiary} />
            </Pressable>
          )}
        </View>

        {/* Filter Row */}
        <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}>
          <Pressable
            onPress={() => setShowFilters(!showFilters)}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 4,
              paddingHorizontal: 12,
              paddingVertical: 7,
              borderRadius: 20,
              borderCurve: 'continuous',
              backgroundColor: showFilters ? colors.primaryMuted : colors.card,
              borderWidth: 1,
              borderColor: showFilters ? colors.primary : colors.border,
            }}
          >
            <Ionicons
              name="options-outline"
              size={14}
              color={showFilters ? colors.primary : colors.textSecondary}
            />
            <Text
              style={{
                fontFamily: Fonts.medium,
                fontSize: 12,
                color: showFilters ? colors.primary : colors.textSecondary,
              }}
            >
              Filters
            </Text>
          </Pressable>

          <View style={{ flex: 1 }} />

          <Text
            style={{
              fontFamily: Fonts.regular,
              fontSize: 11,
              color: colors.textTertiary,
            }}
          >
            Sort:
          </Text>
          {(['deadline', 'newest', 'prize'] as SortOption[]).map((opt) => (
            <FilterChip
              key={opt}
              label={opt === 'deadline' ? 'Deadline' : opt === 'newest' ? 'Newest' : 'Prize'}
              active={sortBy === opt}
              onPress={() => setSortBy(opt)}
            />
          ))}
        </View>

        {/* Expanded Filters */}
        {showFilters && (
          <Animated.View entering={FadeInDown.duration(300)} style={{ gap: 10 }}>
            <View style={{ gap: 6 }}>
              <Text
                style={{
                  fontFamily: Fonts.medium,
                  fontSize: 12,
                  color: colors.textTertiary,
                }}
              >
                Platform
              </Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
                <FilterChip
                  label="All"
                  active={!platformFilter}
                  onPress={() => setPlatformFilter(null)}
                />
                {PLATFORMS.map((p) => (
                  <FilterChip
                    key={p}
                    label={p}
                    active={platformFilter === p}
                    onPress={() =>
                      setPlatformFilter(platformFilter === p ? null : p)
                    }
                  />
                ))}
              </View>
            </View>
            <View style={{ gap: 6 }}>
              <Text
                style={{
                  fontFamily: Fonts.medium,
                  fontSize: 12,
                  color: colors.textTertiary,
                }}
              >
                Type
              </Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
                <FilterChip
                  label="All"
                  active={!typeFilter}
                  onPress={() => setTypeFilter(null)}
                />
                {TYPES.map((t) => (
                  <FilterChip
                    key={t}
                    label={t}
                    active={typeFilter === t}
                    onPress={() =>
                      setTypeFilter(typeFilter === t ? null : t)
                    }
                  />
                ))}
              </View>
            </View>
          </Animated.View>
        )}
      </View>

      {/* Contest List */}
      <FlatList
        data={filteredContests}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingBottom: insets.bottom + 100,
          paddingTop: 8,
          gap: 12,
        }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
          />
        }
        renderItem={({ item, index }) => (
          <ContestCard
            contest={item}
            index={index}
            onPress={() =>
              router.push({
                pathname: '/edit-contest',
                params: { id: item.id },
              })
            }
          />
        )}
        ListEmptyComponent={
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              paddingVertical: 48,
              gap: 12,
            }}
          >
            <Ionicons
              name="document-text-outline"
              size={48}
              color={colors.textTertiary}
            />
            <Text
              style={{
                fontFamily: Fonts.semiBold,
                fontSize: 16,
                color: colors.textSecondary,
              }}
            >
              {search || platformFilter || typeFilter
                ? 'No matching contests'
                : 'No contests yet'}
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
              {search || platformFilter || typeFilter
                ? 'Try adjusting your filters'
                : 'Add your first contest to get started!'}
            </Text>
          </View>
        }
      />
    </View>
  );
}
