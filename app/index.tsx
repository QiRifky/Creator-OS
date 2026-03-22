import { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useAppStore } from '@/store/useAppStore';
import { Colors } from '@/constants/Colors';

export default function Index() {
  const router = useRouter();
  const session = useAppStore((s) => s.session);
  const hydrated = useAppStore((s) => s.hydrated);
  const preferences = useAppStore((s) => s.preferences);

  const theme = preferences.theme || 'dark';
  const colors = Colors[theme as keyof typeof Colors];

  useEffect(() => {
    if (!hydrated) return;

    const timer = setTimeout(() => {
      if (session?.isLoggedIn) {
        router.replace('/(tabs)/dashboard');
      } else {
        router.replace('/welcome');
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [hydrated, session, router]);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.background,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <ActivityIndicator size="large" color={colors.primary} />
    </View>
  );
}
