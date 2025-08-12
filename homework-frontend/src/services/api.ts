import type {
  ChatsResponse,
  LoginResponse,
  RegisterResponse,
  SendMessageResponse,
} from '../types/types';
import { logger } from '../utils/logger';

const API_BASE_URL = 'http://localhost:3001';

class ApiService {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const method = options.method || 'GET';

    const config: RequestInit = {
      headers: {
        ...options.headers,
        'Content-Type': 'application/json',
      },
      ...options,
    };

    logger.logRequest(
      url,
      method,
      options.body ? JSON.parse(options.body as string) : undefined,
      config.headers
    );

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        let errorMessage = 'Произошла ошибка';

        try {
          const errorData = await response.json();

          logger.logResponse(url, method, response, errorData);

          if (errorData.message) {
            errorMessage = errorData.message;
          } else if (errorData.error) {
            errorMessage = errorData.error;
          }
        } catch (parseError) {
          logger.logResponse(url, method, response, null);

          if (response.status === 401) {
            errorMessage = 'Неправильный логин или пароль';
          } else if (response.status === 404) {
            errorMessage = 'Пользователь не найден';
          } else if (response.status === 409) {
            errorMessage = 'Пользователь с таким именем уже существует';
          } else if (response.status === 400) {
            errorMessage = 'Некорректные данные';
          } else if (response.status >= 500) {
            errorMessage = 'Ошибка сервера';
          }
        }

        throw new Error(errorMessage);
      }

      const data = await response.json();

      logger.logResponse(url, method, response, data);

      return data;
    } catch (error) {
      if (error instanceof Error) {
        logger.logError(url, method, error);
      }

      throw error;
    }
  }

  async register(
    username: string,
    password: string
  ): Promise<RegisterResponse> {
    return this.request<RegisterResponse>('/register', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
  }

  async login(username: string, password: string): Promise<LoginResponse> {
    return this.request<LoginResponse>('/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
  }

  async getChats(token: string): Promise<ChatsResponse> {
    return this.request<ChatsResponse>('/chats', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  async sendMessage(token: string, body: string): Promise<SendMessageResponse> {
    const trimmedBody = body.trim();
    if (!trimmedBody) {
      throw new Error('Сообщение не может быть пустым');
    }

    return this.request<SendMessageResponse>('/chats', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ body: trimmedBody }),
    });
  }

  async validateToken(token: string): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/validate-token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      return response.ok;
    } catch (error) {
      // If endpoint doen't exist token is valid
      return true;
    }
  }
}

export const api = new ApiService();

export const { register, login, getChats, sendMessage, validateToken } = api;
