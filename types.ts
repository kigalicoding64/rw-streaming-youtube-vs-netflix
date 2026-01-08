
export type AppView = 'HOME' | 'WATCH' | 'LISTEN' | 'READ' | 'LIVE' | 'STUDIO' | 'ADMIN' | 'PROFILE' | 'SEARCH' | 'SUBSCRIPTION';
export type ContentType = 'movie' | 'series' | 'music' | 'book' | 'audiobook' | 'tv_channel';
export type MonetizationType = 'free' | 'premium' | 'ppv';
export type ModerationStatus = 'pending' | 'approved' | 'rejected' | 'flagged';
export type UserRole = 'guest' | 'user' | 'creator' | 'admin';
export type LanguageCode = 'en' | 'rw' | 'fr' | 'sw' | 'zh' | 'hi' | 'am' | 'ar';

export interface User {
  id: string;
  name: string;
  role: UserRole;
  credits: number;
  subscription: 'none' | 'basic' | 'premium' | 'vip';
  language: LanguageCode;
  email?: string;
  isSuspended?: boolean;
}

export interface ContentTranslation {
  title: string;
  description: string;
  category: string;
  isAiGenerated: boolean;
  verifiedByAdmin: boolean;
  translationError?: boolean;
}

export interface ContentItem {
  id: string;
  type: ContentType;
  title: string;
  thumbnail: string;
  creator: string;
  duration?: string;
  views: number;
  rating: number;
  category: string;
  price?: number;
  monetization: MonetizationType;
  description: string;
  url?: string;
  timestamp?: string;
  channelAvatar?: string;
  originalLanguage: LanguageCode;
  // Moderation fields
  status: ModerationStatus;
  warning?: string;
  moderationNotes?: string;
  submittedAt: string;
}

export interface StudioMetric {
  label: string;
  value: string;
  change: string;
  trend: 'up' | 'down';
}

export interface ModerationLog {
  id: string;
  contentId: string;
  contentTitle: string;
  adminId: string;
  adminName: string;
  action: ModerationStatus | 'warning_added';
  reason?: string;
  timestamp: string;
}

export interface AuthState {
  user: User | null;
  isLoggedIn: boolean;
  languageSelected: boolean;
}
