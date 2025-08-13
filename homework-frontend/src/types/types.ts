export type User = {
  username: string;
  token: string;
};

export type Message = {
  username: string;
  body: string;
  timestamp: string;
  id?: number;
};

export type AuthState = {
  user: User | null;
  isAuthorized: boolean;
  isLoading: boolean;
  error: string | null;
};

export type ChatState = {
  messages: Message[];
  isLoading: boolean;
  isInitialLoading: boolean;
  isSendingMessages: boolean;
  error: string | null;
  lastMessageCount: number; // Добавляем счетчик для отслеживания изменений
  lastUpdateTime: number;
};

export type RegisterResponse = {
  message: string;
  user: User;
};

export type LoginRequest = {
  username: string;
  password: string;
};

export type LoginResponse = {
  token: string;
  user?: User;
};

export type ChatsResponse = Message[];

export type SendMessageResponse = {
  message: string;
  chat: Message;
};

export type ApiError = {
  message: string;
  error?: string;
};
