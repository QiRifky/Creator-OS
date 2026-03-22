import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Alert,
  Pressable,
} from 'react-native';
import { useRouter, useLocalSearchParams, Stack } from 'expo-router';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Fonts } from '@/constants/Typography';
import { useTheme } from '@/components/theme-context';
import { useAppStore } from '@/store/useAppStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dropdown } from '@/components/ui/dropdown';
import { ConfettiOverlay } from '@/components/confetti-overlay';
import type { ContestPlatform, ContestType, ContestStatus } from '@/store/types';

const PLATFORM_OPTIONS = [
  { label: 'X (Twitter)', value: 'X' },
  { label: 'TikTok', value: 'TikTok' },
  { label: 'Facebook', value: 'Facebook' },
  { label: 'Instagram', value: 'Instagram' },
  { label: 'Dribbble', value: 'Dribbble' },
  { label: 'Other', value: 'Other' },
];

const TYPE_OPTIONS = [
  { label: 'Design', value: 'Design' },
  { label: 'Video', value: 'Video' },
  { label: 'Photo', value: 'Photo' },
  { label: 'Writing', value: 'Writing' },
  { label: 'Music', value: 'Music' },
  { label: 'Other', value: 'Other' },
];

const STATUS_OPTIONS = [
  { label: 'Draft', value: 'Draft' },
  { label: 'Submitted', value: 'Submitted' },
  { label: 'Shortlisted', value: 'Shortlisted' },
  { label: 'Won', value: 'Won' },
  { label: 'Lost', value: 'Lost' },
];

export default function EditContestScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ id: string }>();
  const { colors, mode } = useTheme();

  const contests = useAppStore((s) => s.contests);
  const updateContest = useAppStore((s) => s.updateContest);
  const deleteContest = useAppStore((s) => s.deleteContest);

  const contest = useMemo(
    () => contests.find((c) => c.id === params.id),
    [contests, params.id]
  );

  const [name, setName] = useState(contest?.name || '');
  const [platform, setPlatform] = useState(contest?.platform || '');
  const [type, setType] = useState(contest?.type || '');
  const [prize, setPrize] = useState(contest?.prize?.toString() || '');
  const [link, setLink] = useState(contest?.link || '');
  const [deadline, setDeadline] = useState(
    contest?.deadline ? new Date(contest.deadline) : new Date()
  );
  const [status, setStatus] = useState<string>(contest?.status || 'Draft');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showConfetti, setShowConfetti] = useState(false);
  const [saving, setSaving] = useState(false);

  const previousStatus = contest?.status;

  const validate = useCallback(() => {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = 'Contest name is required';
    if (!platform) e.platform = 'Please select a platform';
    if (!type) e.type = 'Please select a contest type';
    if (prize && isNaN(Number(prize))) e.prize = 'Must be a valid number';
    setErrors(e);
    return Object.keys(e).length === 0;
  }, [name, platform, type, prize]);

  const handleSave = useCallback(() => {
    if (!contest || !validate()) return;
    setSaving(true);

    setTimeout(() => {
      updateContest(contest.id, {
        name: name.trim(),
        platform: platform as ContestPlatform,
        type: type as ContestType,
        prize: Number(prize) || 0,
        link: link.trim(),
        deadline: deadline.toISOString(),
        status: status as ContestStatus,
      });
      setSaving(false);

      if (status === 'Won' && previousStatus !== 'Won') {
        if (process.env.EXPO_OS === 'ios') {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        }
        setShowConfetti(true);
        setTimeout(() => {
          router.back();
        }, 2000);
      } else {
        if (process.env.EXPO_OS === 'ios') {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        }
        router.back();
      }
    }, 300);
  }, [
    contest,
    validate,
    updateContest,
    name,
    platform,
    type,
    prize,
    link,
    deadline,
    status,
    previousStatus,
    router,
  ]);

  const handleDelete = () => {
    if (!contest) return;
    Alert.alert('Delete Contest', `Are you sure you want to delete "${contest.name}"?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          deleteContest(contest.id);
          router.back();
        },
      },
    ]);
  };

  if (!contest) {
    return (
      <>
        <Stack.Screen
          options={{
            headerShown: true,
            title: 'Contest Not Found',
            headerStyle: { backgroundColor: colors.background },
            headerTintColor: colors.textPrimary,
            headerTitleStyle: { fontFamily: Fonts.semiBold },
            headerShadowVisible: false,
          }}
        />
        <View
          style={{
            flex: 1,
            backgroundColor: colors.background,
            alignItems: 'center',
            justifyContent: 'center',
            gap: 12,
          }}
        >
          <Ionicons name="alert-circle-outline" size={48} color={colors.textTertiary} />
          <Text
            style={{
              fontFamily: Fonts.semiBold,
              fontSize: 16,
              color: colors.textSecondary,
            }}
          >
            Contest not found
          </Text>
          <Button title="Go Back" onPress={() => router.back()} variant="secondary" />
        </View>
      </>
    );
  }

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          title: 'Edit Contest',
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.textPrimary,
          headerTitleStyle: { fontFamily: Fonts.semiBold },
          headerShadowVisible: false,
          headerRight: () => (
            <Pressable onPress={handleDelete} hitSlop={10}>
              <Ionicons name="trash-outline" size={22} color={colors.error} />
            </Pressable>
          ),
        }}
      />
      <View style={{ flex: 1, backgroundColor: colors.background }}>
        <ConfettiOverlay visible={showConfetti} onComplete={() => setShowConfetti(false)} />
        <KeyboardAvoidingView
          behavior={process.env.EXPO_OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}
        >
          <ScrollView
            contentContainerStyle={{
              padding: 20,
              gap: 18,
              paddingBottom: 48,
            }}
            keyboardShouldPersistTaps="handled"
          >
            <Input
              label="Contest Name"
              placeholder="Enter name"
              value={name}
              onChangeText={setName}
              error={errors.name}
            />

            <Dropdown
              label="Platform"
              placeholder="Select Platform"
              options={PLATFORM_OPTIONS}
              value={platform}
              onChange={setPlatform}
              error={errors.platform}
            />

            <Dropdown
              label="Contest Type"
              placeholder="Select Type"
              options={TYPE_OPTIONS}
              value={type}
              onChange={setType}
              error={errors.type}
            />

            <Input
              label="Reward/Prize ($)"
              placeholder="0.00"
              value={prize}
              onChangeText={setPrize}
              keyboardType="decimal-pad"
              error={errors.prize}
            />

            <Input
              label="Contest Link"
              placeholder="https://"
              value={link}
              onChangeText={setLink}
              keyboardType="url"
              autoCapitalize="none"
            />

            {/* Date Picker */}
            <View style={{ gap: 6 }}>
              <Text
                style={{
                  fontFamily: Fonts.medium,
                  fontSize: 13,
                  color: colors.textSecondary,
                  marginLeft: 2,
                }}
              >
                Deadline
              </Text>
              <Pressable
                onPress={() => setShowDatePicker(true)}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  backgroundColor: colors.inputBackground,
                  borderRadius: 12,
                  borderCurve: 'continuous',
                  borderWidth: 1.5,
                  borderColor: colors.inputBorder,
                  paddingHorizontal: 14,
                  paddingVertical: 14,
                  gap: 10,
                }}
              >
                <Ionicons name="calendar-outline" size={18} color={colors.textTertiary} />
                <Text
                  style={{
                    fontFamily: Fonts.regular,
                    fontSize: 15,
                    color: colors.textPrimary,
                  }}
                >
                  {deadline.toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </Text>
              </Pressable>
            </View>

            {showDatePicker && (
              <View
                style={{
                  backgroundColor: colors.card,
                  borderRadius: 14,
                  borderCurve: 'continuous',
                  overflow: 'hidden',
                }}
              >
                <DateTimePicker
                  value={deadline}
                  mode="date"
                  display="spinner"
                  themeVariant={mode}
                  onChange={(_, selectedDate) => {
                    if (process.env.EXPO_OS === 'android') {
                      setShowDatePicker(false);
                    }
                    if (selectedDate) setDeadline(selectedDate);
                  }}
                />
                {process.env.EXPO_OS === 'ios' && (
                  <Pressable
                    onPress={() => setShowDatePicker(false)}
                    style={{
                      alignItems: 'center',
                      paddingVertical: 12,
                      borderTopWidth: 0.5,
                      borderTopColor: colors.border,
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: Fonts.semiBold,
                        fontSize: 15,
                        color: colors.primary,
                      }}
                    >
                      Done
                    </Text>
                  </Pressable>
                )}
              </View>
            )}

            <Dropdown
              label="Status"
              placeholder="Select Status"
              options={STATUS_OPTIONS}
              value={status}
              onChange={setStatus}
            />

            {status === 'Won' && previousStatus !== 'Won' && (
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  backgroundColor: 'rgba(255, 215, 0, 0.12)',
                  padding: 14,
                  borderRadius: 12,
                  borderCurve: 'continuous',
                  gap: 10,
                }}
              >
                <Ionicons name="trophy" size={20} color="#FFD700" />
                <Text
                  style={{
                    fontFamily: Fonts.medium,
                    fontSize: 13,
                    color: '#FFD700',
                    flex: 1,
                  }}
                >
                  Prize will be added to your total earnings!
                </Text>
              </View>
            )}

            <View style={{ gap: 10, marginTop: 8 }}>
              <Button title="Save Changes" onPress={handleSave} loading={saving} style={{ paddingVertical: 18 }} />
              <Button
                title="Delete Contest"
                onPress={handleDelete}
                variant="danger"
                icon={<Ionicons name="trash-outline" size={18} color="#FFFFFF" />}
              />
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </>
  );
}
