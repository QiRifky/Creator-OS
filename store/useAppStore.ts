import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type {
  Preferences,
  User,
  Session,
  Contest,
  ContestPlatform,
  ContestType,
  ContestStatus,
  UserSettings,
} from './types';

// Simple DJB2 hash for local password storage
function hashPassword(password: string): string {
  let hash = 5381;
  for (let i = 0; i < password.length; i++) {
    hash = ((hash << 5) + hash) + password.charCodeAt(i);
    hash = hash & 0x7FFFFFFF;
  }
  return 'h_' + hash.toString(36);
}

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 9);
}

interface AppState {
  preferences: Preferences;
  users: User[];
  session: Session | null;
  contests: Contest[];
  settings: UserSettings[];
  hydrated: boolean;

  // Auth actions
  signUp: (username: string, password: string, email?: string) => { success: boolean; error?: string };
  login: (username: string, password: string) => { success: boolean; error?: string };
  logout: () => void;
  changePassword: (currentPassword: string, newPassword: string) => { success: boolean; error?: string };
  updateProfile: (data: { displayName?: string; username?: string; email?: string }) => { success: boolean; error?: string };

  // Contest actions
  addContest: (data: Omit<Contest, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => void;
  updateContest: (id: string, data: Partial<Omit<Contest, 'id' | 'userId' | 'createdAt'>>) => void;
  deleteContest: (id: string) => void;

  // Settings actions
  setTheme: (theme: 'dark' | 'light') => void;
  setNotificationReminders: (reminders: number[]) => void;

  // Computed helpers
  getCurrentUser: () => User | null;
  getUserContests: () => Contest[];
  getUserSettings: () => UserSettings;

  // Hydration
  setHydrated: (val: boolean) => void;
}

export type AppStore = AppState;

export const useAppStore = create<AppStore>()(
  persist(
    (set, get) => ({
      preferences: { theme: 'dark' },
      users: [],
      session: null,
      contests: [],
      settings: [],
      hydrated: false,

      setHydrated: (val: boolean) => set({ hydrated: val }),

      signUp: (username, password, email) => {
        const { users } = get();
        if (users.some((u) => u.username.toLowerCase() === username.toLowerCase())) {
          return { success: false, error: 'Username already taken' };
        }
        if (password.length < 6) {
          return { success: false, error: 'Password must be at least 6 characters' };
        }

        const newUser: User = {
          id: generateId(),
          username,
          passwordHash: hashPassword(password),
          email: email || '',
          displayName: username,
          profilePhoto: '',
          createdAt: new Date().toISOString(),
        };

        const newSettings: UserSettings = {
          userId: newUser.id,
          theme: 'dark',
          notificationReminders: [1, 3],
        };

        const newSession: Session = {
          userId: newUser.id,
          isLoggedIn: true,
          loginTimestamp: new Date().toISOString(),
        };

        set({
          users: [...users, newUser],
          settings: [...get().settings, newSettings],
          session: newSession,
          preferences: { theme: 'dark' },
        });

        return { success: true };
      },

      login: (username, password) => {
        const { users } = get();
        const user = users.find(
          (u) => u.username.toLowerCase() === username.toLowerCase()
        );

        if (!user) {
          return { success: false, error: 'Invalid username or password' };
        }

        if (user.passwordHash !== hashPassword(password)) {
          return { success: false, error: 'Invalid username or password' };
        }

        const newSession: Session = {
          userId: user.id,
          isLoggedIn: true,
          loginTimestamp: new Date().toISOString(),
        };

        const userSettings = get().settings.find((s) => s.userId === user.id);
        set({
          session: newSession,
          preferences: { theme: userSettings?.theme || 'dark' },
        });

        return { success: true };
      },

      logout: () => {
        set({ session: null });
      },

      changePassword: (currentPassword, newPassword) => {
        const { session, users } = get();
        if (!session) return { success: false, error: 'Not logged in' };

        const user = users.find((u) => u.id === session.userId);
        if (!user) return { success: false, error: 'User not found' };

        if (user.passwordHash !== hashPassword(currentPassword)) {
          return { success: false, error: 'Current password is incorrect' };
        }

        if (newPassword.length < 6) {
          return { success: false, error: 'New password must be at least 6 characters' };
        }

        set({
          users: users.map((u) =>
            u.id === session.userId
              ? { ...u, passwordHash: hashPassword(newPassword) }
              : u
          ),
        });

        return { success: true };
      },

      updateProfile: (data) => {
        const { session, users } = get();
        if (!session) return { success: false, error: 'Not logged in' };

        if (data.username) {
          const existing = users.find(
            (u) =>
              u.username.toLowerCase() === data.username!.toLowerCase() &&
              u.id !== session.userId
          );
          if (existing) {
            return { success: false, error: 'Username already taken' };
          }
        }

        set({
          users: users.map((u) =>
            u.id === session.userId ? { ...u, ...data } : u
          ),
        });

        return { success: true };
      },

      addContest: (data) => {
        const { session, contests } = get();
        if (!session) return;

        const newContest: Contest = {
          ...data,
          id: generateId(),
          userId: session.userId,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        set({ contests: [...contests, newContest] });
      },

      updateContest: (id, data) => {
        const { contests } = get();
        set({
          contests: contests.map((c) =>
            c.id === id
              ? { ...c, ...data, updatedAt: new Date().toISOString() }
              : c
          ),
        });
      },

      deleteContest: (id) => {
        const { contests } = get();
        set({ contests: contests.filter((c) => c.id !== id) });
      },

      setTheme: (theme) => {
        const { session, settings } = get();
        if (!session) return;

        const exists = settings.some((s) => s.userId === session.userId);
        set({
          preferences: { theme },
          settings: exists
            ? settings.map((s) =>
                s.userId === session.userId ? { ...s, theme } : s
              )
            : [...settings, { userId: session.userId, theme, notificationReminders: [1, 3] }],
        });
      },

      setNotificationReminders: (reminders) => {
        const { session, settings } = get();
        if (!session) return;

        const exists = settings.some((s) => s.userId === session.userId);
        set({
          settings: exists
            ? settings.map((s) =>
                s.userId === session.userId
                  ? { ...s, notificationReminders: reminders }
                  : s
              )
            : [
                ...settings,
                { userId: session.userId, theme: 'dark', notificationReminders: reminders },
              ],
        });
      },

      getCurrentUser: () => {
        const { session, users } = get();
        if (!session) return null;
        return users.find((u) => u.id === session.userId) || null;
      },

      getUserContests: () => {
        const { session, contests } = get();
        if (!session) return [];
        return contests
          .filter((c) => c.userId === session.userId)
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      },

      getUserSettings: () => {
        const { session, settings } = get();
        if (!session) {
          return { userId: '', theme: 'dark' as const, notificationReminders: [1, 3] };
        }
        return (
          settings.find((s) => s.userId === session.userId) || {
            userId: session.userId,
            theme: 'dark' as const,
            notificationReminders: [1, 3],
          }
        );
      },
    }),
    {
      name: 'contestly-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        preferences: state.preferences,
        users: state.users,
        session: state.session,
        contests: state.contests,
        settings: state.settings,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
    }
  )
);
