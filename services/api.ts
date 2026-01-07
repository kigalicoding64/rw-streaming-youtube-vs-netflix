
import { ContentItem, User, UserRole, LanguageCode, ModerationStatus } from '../types';

const STORAGE_KEY = 'rebalive_db';

interface Database {
  users: User[];
  content: ContentItem[];
  currentUser: User | null;
}

const initialDb: Database = {
  users: [
    { id: 'admin-1', name: 'System Admin', role: 'admin', credits: 1000000, subscription: 'vip', language: 'en', email: 'admin@rebalive.rw' },
    { id: 'creator-1', name: 'Bruce Melodie', role: 'creator', credits: 50000, subscription: 'premium', language: 'rw', email: 'bruce@music.rw' }
  ],
  content: [], // Populated by mock data generators in components
  currentUser: null
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
        email
      };
      db.users.push(user);
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

  // Content
  async getContent(type?: string): Promise<ContentItem[]> {
    const db = this.getDb();
    let items = db.content;
    if (type) items = items.filter(i => i.type === type);
    // Admins see all, others only approved
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
      ...item
    } as ContentItem;
    db.content.push(newItem);
    this.saveDb(db);
    return newItem;
  }

  async moderateContent(id: string, status: ModerationStatus, notes?: string, warning?: string) {
    const db = this.getDb();
    const item = db.content.find(i => i.id === id);
    if (item) {
      item.status = status;
      item.moderationNotes = notes;
      item.warning = warning;
      this.saveDb(db);
    }
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
