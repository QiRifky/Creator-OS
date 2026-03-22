import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  Switch,
  Alert,
  KeyboardAvoidingView,
} from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Fonts } from '@/constants/Typography';
import { useTheme } from '@/components/theme-context';
import { useAppStore } from '@/store/useAppStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Animated, { FadeInDown } from 'react-native-reanimated';

export default function SettingsScreen() {
  const router = useRouter();
  const { colors, mode, toggle } = useTheme();
  const getCurrentUser = useAppStore((s) => s.getCurrentUser);
  const updateProfile = useAppStore((s) => s.updateProfile);
  const changePassword = useAppStore((s) => s.changePassword);
  const getUserSettings = useAppStore((s) => s.getUserSettings);
  const setNotificationReminders = useAppStore((s) => s.setNotificationReminders);
  const logout = useAppStore((s) => s.logout);

  const user = getCurrentUser();
  const settings = getUserSettings();

  // Profile
  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [username, setUsername] = useState(user?.username || '');
  const [email, setEmail] = useState(user?.email || '');
  const [profileError, setProfileError] = useState('');
  const [profileSaving, setProfileSaving] = useState(false);

  // Password
  const [currentPw, setCurrentPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [pwError, setPwError] = useState('');
  const [pwSaving, setPwSaving] = useState(false);

  // Notification days
  const reminderDays = settings.notificationReminders || [1, 3];

  const handleSaveProfile = useCallback(() => {
    setProfileError('');
    if (!displayName.trim()) {
      setProfileError('Display name is required');
      return;
    }
    if (!username.trim()) {
      setProfileError('Username is required');
      return;
    }

    setProfileSaving(true);
    setTimeout(() => {
      const result = updateProfile({
        displayName: displayName.trim(),
        username: username.trim(),
        email: email.trim(),
      });
      setProfileSaving(false);
      if (!result.success) {
        setProfileError(result.error || 'Failed to update profile');
      } else {
        Alert.alert('Saved', 'Profile updated successfully.');
      }
    }, 300);
  }, [displayName, username, email, updateProfile]);

  const handleChangePassword = useCallback(() => {
    setPwError('');
    if (!currentPw) {
      setPwError('Enter current password');
      return;
    }
    if (newPw.length < 6) {
      setPwError('New password must be at least 6 characters');
      return;
    }
    if (newPw !== confirmPw) {
      setPwError('New passwords do not match');
      return;
    }

    setPwSaving(true);
    setTimeout(() => {
      const result = changePassword(currentPw, newPw);
      setPwSaving(false);
      if (!result.success) {
        setPwError(result.error || 'Failed to change password');
      } else {
        setCurrentPw('');
        setNewPw('');
        setConfirmPw('');
        Alert.alert('Saved', 'Password changed successfully.');
      }
    }, 300);
  }, [currentPw, newPw, confirmPw, changePassword]);

  const toggleReminder = (day: number) => {
    const updated = reminderDays.includes(day)
      ? reminderDays.filter((d) => d !== day)
      : [...reminderDays, day].sort((a, b) => a - b);
    setNotificationReminders(updated);
  };

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: () => {
          logout();
          router.replace('/welcome');
        },
      },
    ]);
  };

  const Section = ({
    title,
    children,
    delay = 0,
  }: {
    title: string;
    children: React.ReactNode;
    delay?: number;
  }) => (
    <Animated.View entering={FadeInDown.delay(delay).duration(400)} style={{ gap: 12 }}>
      <Text
        style={{
          fontFamily: Fonts.bold,
          fontSize: 17,
          color: colors.textPrimary,
          letterSpacing: -0.2,
          marginLeft: 4,
        }}
      >
        {title}
      </Text>
      <View
        style={{
          backgroundColor: colors.card,
          borderRadius: 20,
          borderCurve: 'continuous',
          padding: 20,
          borderWidth: 1,
          borderColor: colors.border,
          gap: 16,
          boxShadow: mode === 'dark' ? '0 2px 12px rgba(0,0,0,0.2)' : colors.cardShadow,
        }}
      >
        {children}
      </View>
    </Animated.View>
  );

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          title: 'Settings',
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.textPrimary,
          headerTitleStyle: { fontFamily: Fonts.semiBold },
          headerShadowVisible: false,
        }}
      />
      <KeyboardAvoidingView
        behavior={process.env.EXPO_OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1, backgroundColor: colors.background }}
      >
        <ScrollView
          contentContainerStyle={{ padding: 20, gap: 24, paddingBottom: 48 }}
          keyboardShouldPersistTaps="handled"
        >
          {/* Profile */}
          <Section title="Profile" delay={0}>
            <View style={{ alignItems: 'center', alignSelf: 'center' }}>
              {mode === 'dark' && (
                <View style={{ position: 'absolute', width: 80, height: 80, borderRadius: 40, backgroundColor: colors.primaryGlow, opacity: 0.15 }} />
              )}
              <View
                style={{
                  width: 68,
                  height: 68,
                  borderRadius: 22,
                  borderCurve: 'continuous',
                  backgroundColor: colors.primaryMuted,
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderWidth: 2,
                  borderColor: colors.primary + '30',
                }}
              >
                <Text style={{ fontFamily: Fonts.bold, fontSize: 28, color: colors.primary }}>
                  {(user?.displayName || user?.username || 'U')[0].toUpperCase()}
                </Text>
              </View>
            </View>
            <Input
              label="Display Name"
              placeholder="Your name"
              value={displayName}
              onChangeText={setDisplayName}
            />
            <Input
              label="Username"
              placeholder="Username"
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
            />
            <Input
              label="Email"
              placeholder="your@email.com"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            {profileError ? (
              <Text
                selectable
                style={{
                  fontFamily: Fonts.medium,
                  fontSize: 13,
                  color: colors.error,
                }}
              >
                {profileError}
              </Text>
            ) : null}
            <Button
              title="Save Profile"
              onPress={handleSaveProfile}
              loading={profileSaving}
              variant="secondary"
            />
          </Section>

          {/* Notifications */}
          <Section title="Notifications" delay={100}>
            <Text
              style={{
                fontFamily: Fonts.regular,
                fontSize: 14,
                color: colors.textSecondary,
              }}
            >
              Remind me before deadline
            </Text>
            {[1, 2, 3, 5, 7].map((day) => (
              <View
                key={day}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <Text
                  style={{
                    fontFamily: Fonts.medium,
                    fontSize: 15,
                    color: colors.textPrimary,
                  }}
                >
                  {day} {day === 1 ? 'day' : 'days'} before
                </Text>
                <Switch
                  value={reminderDays.includes(day)}
                  onValueChange={() => toggleReminder(day)}
                  trackColor={{ false: colors.border, true: colors.primary }}
                  thumbColor="#FFFFFF"
                />
              </View>
            ))}
          </Section>

          {/* Theme */}
          <Section title="Theme" delay={200}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                <Ionicons
                  name={mode === 'dark' ? 'moon' : 'sunny'}
                  size={20}
                  color={colors.textPrimary}
                />
                <Text
                  style={{
                    fontFamily: Fonts.medium,
                    fontSize: 15,
                    color: colors.textPrimary,
                  }}
                >
                  {mode === 'dark' ? 'Dark Mode' : 'Light Mode'}
                </Text>
              </View>
              <Switch
                value={mode === 'dark'}
                onValueChange={toggle}
                trackColor={{ false: colors.border, true: colors.primary }}
                thumbColor="#FFFFFF"
              />
            </View>
          </Section>

          {/* Security */}
          <Section title="Security" delay={300}>
            <Input
              label="Current Password"
              placeholder="Enter current password"
              value={currentPw}
              onChangeText={setCurrentPw}
              isPassword
            />
            <Input
              label="New Password"
              placeholder="Min 6 characters"
              value={newPw}
              onChangeText={setNewPw}
              isPassword
            />
            <Input
              label="Confirm New Password"
              placeholder="Re-enter new password"
              value={confirmPw}
              onChangeText={setConfirmPw}
              isPassword
            />
            {pwError ? (
              <Text
                selectable
                style={{
                  fontFamily: Fonts.medium,
                  fontSize: 13,
                  color: colors.error,
                }}
              >
                {pwError}
              </Text>
            ) : null}
            <Button
              title="Change Password"
              onPress={handleChangePassword}
              loading={pwSaving}
              variant="secondary"
            />
          </Section>

          {/* Logout */}
          <Animated.View entering={FadeInDown.delay(400).duration(400)}>
            <Button
              title="Logout"
              onPress={handleLogout}
              variant="danger"
              icon={<Ionicons name="log-out-outline" size={20} color="#FFFFFF" />}
            />
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
}
