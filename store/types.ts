export interface Preferences {
  theme?: 'dark' | 'light';
}

export interface User {
  id: string;
  username: string;
  passwordHash: string;
  email: string;
  displayName: string;
  profilePhoto: string;
  createdAt: string;
}

export interface Session {
  userId: string;
  isLoggedIn: boolean;
  loginTimestamp: string;
}

export type ContestPlatform = 'X' | 'TikTok' | 'Facebook' | 'Instagram' | 'Dribbble' | 'Other';
export type ContestType = 'Design' | 'Video' | 'Photo' | 'Writing' | 'Music' | 'Other';
export type ContestStatus = 'Draft' | 'Submitted' | 'Shortlisted' | 'Won' | 'Lost';

export interface Contest {
  id: string;
  userId: string;
  name: string;
  platform: ContestPlatform;
  type: ContestType;
  prize: number;
  link: string;
  deadline: string;
  status: ContestStatus;
  createdAt: string;
  updatedAt: string;
}

export interface UserSettings {
  userId: string;
  theme: 'dark' | 'light';
  notificationReminders: number[];
}
