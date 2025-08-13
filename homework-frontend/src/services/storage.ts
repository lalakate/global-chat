import type { Message, User } from '../types/types';

const STORAGE_KEYS = {
  TOKEN: 'chat_token',
  USER: 'chat_user',
  CHAT_MESSAGES: 'chat_messages',
} as const;

class StorageService {
  setToken(token: string): void {
    localStorage.setItem(STORAGE_KEYS.TOKEN, token);
  }

  getToken(): string | null {
    return localStorage.getItem(STORAGE_KEYS.TOKEN);
  }

  setUser(user: User): void {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  }

  getUser(): User | null {
    const data = localStorage.getItem(STORAGE_KEYS.USER);
    return data ? JSON.parse(data) : null;
  }

  setChatMessages(messages: Message[]): void {
    localStorage.setItem(STORAGE_KEYS.CHAT_MESSAGES, JSON.stringify(messages));
  }

  // Используется только как fallback для офлайн режима
  getChatMessages(): Message[] {
    const messages = localStorage.getItem(STORAGE_KEYS.CHAT_MESSAGES);
    const parsed: Message[] = messages ? JSON.parse(messages) : [];

    const migratedMessages = parsed.map((message, index) => {
      if (!message.timestamp) {
        const fallbackTime = new Date(
          Date.now() - (parsed.length - index) * 60000
        ).toISOString();
        return { ...message, timestamp: fallbackTime };
      }
      return message;
    });

    return migratedMessages;
  }

  clearAuth(): void {
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
  }

  clearAll(): void {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
  }
}

export const storage = new StorageService();
