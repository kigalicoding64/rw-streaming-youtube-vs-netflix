
import { ContentItem, User, UserRole, LanguageCode, ModerationStatus, ModerationLog, ContentTranslation } from '../types';

const STORAGE_KEY = 'rebalive_db';
const TRANSLATION_KEY = 'rebalive_translations';

interface Database {
  users: User[];
  content: ContentItem[];
  currentUser: User | null;
  moderationLogs: ModerationLog[];
}

const initialDb: Database = {
  users: [
    { id: 'admin-1', name: 'System Admin', role: 'admin', credits: 1000000, subscription: 'vip', language: 'en', email: 'admin@rebalive.rw', isSuspended: false },
    { id: 'creator-1', name: 'Bruce Melodie', role: 'creator', credits: 50000, subscription: 'premium', language: 'rw', email: 'bruce@music.rw', isSuspended: false },
    { id: 'user-1', name: 'Jean Claude', role: 'user', credits: 1500, subscription: 'basic', language: 'rw', email: 'user@test.com', isSuspended: false }
  ],
  content: [
    {
      id: 'm-1',
      type: 'movie',
      title: 'The Unseen Hero',
      description: 'A powerful story about selflessness in a changing nation.',
      category: 'Trending',
      creator: 'Rwanda Films Ltd',
      originalLanguage: 'en',
      thumbnail: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&q=80&w=1000',
      views: 450000,
      rating: 4.8,
      monetization: 'premium',
      status: 'approved',
      submittedAt: new Date().toISOString()
    }
  ],
  currentUser: null,
  moderationLogs: []
};

class ApiService {
  private getDb(): Database {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : initialDb;
  }

  private saveDb(db: Database) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
  }

  // Translation Persistence
  getTranslation(contentId: string, lang: LanguageCode): ContentTranslation | null {
    const translations = JSON.parse(localStorage.getItem(TRANSLATION_KEY) || '{}');
    return translations[`${contentId}_${lang}`] || null;
  }

  saveTranslation(contentId: string, lang: LanguageCode, data: ContentTranslation) {
    const translations = JSON.parse(localStorage.getItem(TRANSLATION_KEY) || '{}');
    translations[`${contentId}_${lang}`] = data;
    localStorage.setItem(TRANSLATION_KEY, JSON.stringify(translations));
  }

  // Auth
  async login(email: string, role: UserRole = 'user'): Promise<User> {
    const db = this.getDb();
    let user = db.users.find(u => u.email === email);
    const savedLang = localStorage.getItem('rebalive_lang') as LanguageCode;

    if (!user) {
      user = {
        id: Math.random().toString(36).substr(2, 9),
        name: email.split('@')[0],
        role: role,
        credits: 1000,
        subscription: 'none',
        language: savedLang || 'en',
        email,
        isSuspended: false
      };
      db.users.push(user);
    }
    
    if (user.isSuspended) {
      throw new Error("Your account has been suspended. Please contact support.");
    }

    // Sync language from storage to profile
    if (savedLang) user.language = savedLang;

    db.currentUser = user;
    this.saveDb(db);
    return user;
  }

  logout() {
    const db = this.getDb();
    db.currentUser = null;
    this.saveDb(db);
  }

  getCurrentUser(): User | null {
    return this.getDb().currentUser;
  }

  // User Management
  async getAllUsers(): Promise<User[]> {
    return this.getDb().users;
  }

  async toggleUserSuspension(userId: string): Promise<User | undefined> {
    const db = this.getDb();
    const user = db.users.find(u => u.id === userId);
    if (user) {
      user.isSuspended = !user.isSuspended;
      this.saveDb(db);
    }
    return user;
  }

  // Content
  async getAllContent(): Promise<ContentItem[]> {
    return this.getDb().content;
  }

  async uploadContent(item: Partial<ContentItem>): Promise<ContentItem> {
    const db = this.getDb();
    const newItem: ContentItem = {
      id: Math.random().toString(36).substr(2, 9),
      status: 'pending',
      submittedAt: new Date().toISOString(),
      views: 0,
      rating: 0,
      monetization: 'free',
      description: '',
      originalLanguage: 'en', // Default to English if not specified
      ...item
    } as ContentItem;
    db.content.push(newItem);
    this.saveDb(db);
    return newItem;
  }

  async moderateContent(id: string, status: ModerationStatus, notes?: string, warning?: string) {
    const db = this.getDb();
    const item = db.content.find(i => i.id === id);
    const admin = db.currentUser;

    if (item && admin) {
      item.status = status;
      item.moderationNotes = notes;
      item.warning = warning;

      const log: ModerationLog = {
        id: Math.random().toString(36).substr(2, 9),
        contentId: item.id,
        contentTitle: item.title,
        adminId: admin.id,
        adminName: admin.name,
        action: warning ? 'warning_added' : status,
        reason: notes,
        timestamp: new Date().toISOString()
      };
      db.moderationLogs.unshift(log);
      this.saveDb(db);
    }
  }

  async getModerationLogs(): Promise<ModerationLog[]> {
    return this.getDb().moderationLogs;
  }

  async updateLanguage(userId: string, lang: LanguageCode) {
    const db = this.getDb();
    const user = db.users.find(u => u.id === userId);
    if (user) {
      user.language = lang;
      if (db.currentUser?.id === userId) db.currentUser.language = lang;
      this.saveDb(db);
    }
  }
}

export const api = new ApiService();
