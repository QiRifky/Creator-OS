import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import { FontMap } from '@/constants/Typography';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useCallback } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { ThemeProvider } from '@/components/theme-context';
import type { ThemeMode } from '@/constants/Colors';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts(FontMap);
  const hydrated = useAppStore((s) => s.hydrated);
  const preferences = useAppStore((s) => s.preferences);
  const setTheme = useAppStore((s) => s.setTheme);
  const session = useAppStore((s) => s.session);

  const theme: ThemeMode = (preferences.theme as ThemeMode) || 'dark';

  useEffect(() => {
    if ((loaded || error) && hydrated) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error, hydrated]);

  const handleToggleTheme = useCallback(() => {
    const next = theme === 'dark' ? 'light' : 'dark';
    if (session) {
      setTheme(next);
    } else {
      // If not logged in, just update preferences directly
      useAppStore.setState({ preferences: { theme: next } });
    }
  }, [theme, session, setTheme]);

  if (!loaded && !error) {
    return null;
  }

  if (!hydrated) {
    return null;
  }

  return (
    <ThemeProvider mode={theme} onToggle={handleToggleTheme}>
      <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />
      <Stack
        screenOptions={{
          headerShown: false,
          animation: 'fade',
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="welcome" options={{ animation: 'fade' }} />
        <Stack.Screen name="login" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="signup" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="(tabs)" options={{ animation: 'fade' }} />
        <Stack.Screen name="settings" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen
          name="edit-contest"
          options={{
            animation: 'slide_from_bottom',
            presentation: 'modal',
          }}
        />
      </Stack>
    </ThemeProvider>
  );
}
