import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Alert,
  Pressable,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
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

export default function NewContestScreen() {
  const router = useRouter();
  const { colors, mode } = useTheme();
  const insets = useSafeAreaInsets();
  const addContest = useAppStore((s) => s.addContest);

  const [name, setName] = useState('');
  const [platform, setPlatform] = useState('');
  const [type, setType] = useState('');
  const [prize, setPrize] = useState('');
  const [link, setLink] = useState('');
  const [deadline, setDeadline] = useState(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000));
  const [status, setStatus] = useState('Draft');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showConfetti, setShowConfetti] = useState(false);
  const [saving, setSaving] = useState(false);

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
    if (!validate()) return;
    setSaving(true);

    setTimeout(() => {
      addContest({
        name: name.trim(),
        platform: platform as ContestPlatform,
        type: type as ContestType,
        prize: Number(prize) || 0,
        link: link.trim(),
        deadline: deadline.toISOString(),
        status: status as ContestStatus,
      });

      setSaving(false);

      if (status === 'Won') {
        if (process.env.EXPO_OS === 'ios') {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        }
        setShowConfetti(true);
        setTimeout(() => {
          resetForm();
          router.navigate('/(tabs)/dashboard');
        }, 2000);
      } else {
        if (process.env.EXPO_OS === 'ios') {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        }
        resetForm();
        Alert.alert('Saved!', 'Contest has been added successfully.', [
          { text: 'View Feed', onPress: () => router.navigate('/(tabs)/feed') },
          { text: 'Add Another', style: 'cancel' },
        ]);
      }
    }, 300);
  }, [validate, addContest, name, platform, type, prize, link, deadline, status, router]);

  const resetForm = () => {
    setName('');
    setPlatform('');
    setType('');
    setPrize('');
    setLink('');
    setDeadline(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000));
    setStatus('Draft');
    setErrors({});
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ConfettiOverlay visible={showConfetti} onComplete={() => setShowConfetti(false)} />
      <KeyboardAvoidingView
        behavior={process.env.EXPO_OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={{
            paddingTop: insets.top + 8,
            paddingBottom: insets.bottom + 100,
            paddingHorizontal: 20,
            gap: 18,
          }}
          keyboardShouldPersistTaps="handled"
        >
          <Text
            style={{
              fontFamily: Fonts.extraBold,
              fontSize: 28,
              color: colors.textPrimary,
              letterSpacing: -0.5,
            }}
          >
            Add New Contest
          </Text>

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

          {status === 'Won' && (
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

          <Button
            title="Save Contest"
            onPress={handleSave}
            loading={saving}
            style={{ marginTop: 8, paddingVertical: 18 }}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
