import { User, JournalEntry, HealthData, ChatMessage, Mood } from '../types';

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

const getStorage = (key: string, defaultValue: any) => {
  const stored = sessionStorage.getItem(`sm_${key}`);
  return stored ? JSON.parse(stored) : defaultValue;
};

const setStorage = (key: string, value: any) => {
  sessionStorage.setItem(`sm_${key}`, JSON.stringify(value));
};

export const authService = {
  async loginDemo(): Promise<User> {
    await delay(800);
    const user: User = { id: 'demo-123', name: 'Demo User', email: 'demo@soulmantra.app', isDemo: true };
    setStorage('user', user);
    return user;
  },
  async logout(): Promise<void> {
    await delay(400);
    sessionStorage.clear();
  },
  getUser(): User | null {
    return getStorage('user', null);
  }
};

export const journalService = {
  async getEntries(): Promise<JournalEntry[]> {
    await delay(400);
    return getStorage('journals', [
      { id: '1', title: 'A calm morning', content: 'Woke up early today. The sunrise was beautiful.', date: new Date().toISOString(), moodTag: 'calm', wordCount: 9 }
    ]);
  },
  async saveEntry(entry: Omit<JournalEntry, 'id'>): Promise<JournalEntry> {
    await delay(500);
    const entries = await this.getEntries();
    const newEntry = { ...entry, id: Date.now().toString() };
    const updated = [newEntry, ...entries];
    setStorage('journals', updated);
    return newEntry;
  },
  async deleteEntry(id: string): Promise<void> {
    await delay(400);
    const entries = await this.getEntries();
    setStorage('journals', entries.filter(e => e.id !== id));
  }
};

export const healthService = {
  async getTodayData(): Promise<HealthData> {
    await delay(300);
    const today = new Date().toISOString().split('T')[0];
    const data = getStorage('health_today', {
      date: today,
      sleepHours: 7,
      waterGlasses: 4,
      exerciseMinutes: 30,
      steps: 5000,
      screenTimeHours: 4
    });
    return data;
  },
  async updateTodayData(data: Partial<HealthData>): Promise<HealthData> {
    await delay(300);
    const current = await this.getTodayData();
    const updated = { ...current, ...data };
    setStorage('health_today', updated);
    return updated;
  }
};

export const chatService = {
  async sendMessage(msg: string): Promise<ChatMessage> {
    await delay(1000);
    let reply = "I'm here for you. Tell me more.";
    if (msg.toLowerCase().includes('hello') || msg.toLowerCase().includes('hi')) reply = "Hello! How are you feeling today?";
    if (msg.toLowerCase().includes('sad')) reply = "I'm sorry you're feeling sad. It's okay to have these days. Would you like to try a breathing exercise?";
    
    return {
      id: Date.now().toString(),
      role: 'ai',
      content: reply,
      timestamp: new Date().toISOString()
    };
  }
};

export const moodService = {
  async logMood(mood: Mood, note?: string): Promise<void> {
    await delay(400);
    const history = getStorage('moods', []);
    history.push({ mood, note, date: new Date().toISOString() });
    setStorage('moods', history);
  },
  async getMoodHistory(): Promise<any[]> {
    await delay(300);
    return getStorage('moods', [
      { mood: 'happy', date: new Date(Date.now() - 86400000 * 2).toISOString() },
      { mood: 'calm', date: new Date(Date.now() - 86400000 * 1).toISOString() },
    ]);
  }
}
