
import { ContentItem, User, UserRole, LanguageCode, ModerationStatus, ModerationLog } from '../types';

const STORAGE_KEY = 'rebalive_db';

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
  content: [],
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

  // Auth
  async login(email: string, role: UserRole = 'user'): Promise<User> {
    const db = this.getDb();
    let user = db.users.find(u => u.email === email);
    if (!user) {
      user = {
        id: Math.random().toString(36).substr(2, 9),
        name: email.split('@')[0],
        role: role,
        credits: 1000,
        subscription: 'none',
        language: 'en',
        email,
        isSuspended: false
      };
      db.users.push(user);
    }
    
    if (user.isSuspended) {
      throw new Error("Your account has been suspended. Please contact support.");
    }

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

  async getContent(type?: string): Promise<ContentItem[]> {
    const db = this.getDb();
    let items = db.content;
    if (type) items = items.filter(i => i.type === type);
    
    const user = db.currentUser;
    if (user?.role === 'admin') return items;
    
    return items.filter(i => i.status === 'approved');
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

      // Add Log
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

  // Payments
  async purchaseContent(userId: string, contentId: string): Promise<boolean> {
    const db = this.getDb();
    const user = db.users.find(u => u.id === userId);
    const content = db.content.find(c => c.id === contentId);
    if (user && content && content.price && user.credits >= content.price) {
      user.credits -= content.price;
      this.saveDb(db);
      return true;
    }
    return false;
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
