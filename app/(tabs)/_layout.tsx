import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/components/theme-context';
import { Fonts } from '@/constants/Typography';

function GlowIcon({ name, focused, color, isDark, glowColor }: {
  name: keyof typeof Ionicons.glyphMap;
  focused: boolean;
  color: string;
  isDark: boolean;
  glowColor: string;
}) {
  return (
    <View style={{ alignItems: 'center' }}>
      {focused && isDark && (
        <View style={{ position: 'absolute', top: -1, width: 28, height: 28, borderRadius: 14, backgroundColor: glowColor, opacity: 0.3 }} />
      )}
      <Ionicons name={name} size={22} color={color} />
    </View>
  );
}

export default function TabLayout() {
  const { colors, mode } = useTheme();
  const insets = useSafeAreaInsets();
  const isDark = mode === 'dark';

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textTertiary,
        tabBarLabelStyle: { fontFamily: Fonts.semiBold, fontSize: 10, marginTop: 1, letterSpacing: 0.3 },
        tabBarItemStyle: { paddingTop: 4 },
        tabBarStyle: {
          position: 'absolute',
          borderTopWidth: 0,
          backgroundColor: 'transparent',
          elevation: 0,
          paddingBottom: insets.bottom,
          height: 58 + insets.bottom,
        },
        tabBarBackground: () => (
          <View style={StyleSheet.absoluteFill}>
            <BlurView intensity={isDark ? 50 : 75} tint={isDark ? 'dark' : 'light'} style={StyleSheet.absoluteFill} />
            <View style={[StyleSheet.absoluteFill, { backgroundColor: colors.tabBar }]} />
            <View style={{ height: 0.5, backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }} />
          </View>
        ),
      }}
    >
      <Tabs.Screen name="dashboard" options={{
        title: 'Dashboard',
        tabBarIcon: ({ color, focused }) => <GlowIcon name={focused ? 'grid' : 'grid-outline'} focused={focused} color={color} isDark={isDark} glowColor={colors.primaryGlow} />,
      }} />
      <Tabs.Screen name="feed" options={{
        title: 'Feed',
        tabBarIcon: ({ color, focused }) => <GlowIcon name={focused ? 'newspaper' : 'newspaper-outline'} focused={focused} color={color} isDark={isDark} glowColor={colors.primaryGlow} />,
      }} />
      <Tabs.Screen name="portfolio" options={{
        title: 'Portfolio',
        tabBarIcon: ({ color, focused }) => <GlowIcon name={focused ? 'pie-chart' : 'pie-chart-outline'} focused={focused} color={color} isDark={isDark} glowColor={colors.primaryGlow} />,
      }} />
      <Tabs.Screen name="new" options={{
        title: 'Add New',
        tabBarIcon: ({ color, focused }) => <GlowIcon name={focused ? 'add-circle' : 'add-circle-outline'} focused={focused} color={color} isDark={isDark} glowColor={colors.primaryGlow} />,
      }} />
    </Tabs>
  );
}
