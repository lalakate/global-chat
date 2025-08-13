import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { ChatState, SendMessageResponse } from '../../types/types';
import type { RootState } from '../../app/store';
import { getChats } from '../../services/api';
import { api } from '../../services/api';
import { storage } from '../../services/storage';

const initialState: ChatState = {
  messages: [], // Начинаем с пустого массива, данные загрузим с сервера
  isLoading: false,
  isInitialLoading: true,
  isSendingMessages: false,
  error: null,
  lastMessageCount: 0,
  lastUpdateTime: 0,
};

export const fetchMessages = createAsyncThunk(
  'chat/fetchMessages',
  async (isSilent: boolean = false, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const token = state.auth.user?.token;

      if (!token) {
        throw new Error('Не авторизован');
      }

      const response = await getChats(token);

      // Возвращаем данные вместе с флагом silent mode
      return {
        messages: response || [],
        isSilent,
        timestamp: Date.now(),
      };
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Ошибка загрузки сообщений'
      );
    }
  }
);

export const sendMessage = createAsyncThunk<
  SendMessageResponse,
  string,
  { state: RootState }
>('chat/sendMessage', async (body: string, { getState }) => {
  const state = getState();
  const token = state.auth.user?.token;

  if (!token) {
    throw new Error('User is not authorized');
  }

  const trimmedBody = body.trim();
  if (!trimmedBody) {
    throw new Error('Сообщение не может быть пустым');
  }
  const response = await api.sendMessage(token, trimmedBody);
  return response;
});

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    clearError: state => {
      state.error = null;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchMessages.pending, (state, action) => {
        const isSilent = action.meta.arg;
        if (!isSilent) {
          state.isLoading = true;
        }
        state.error = null;
      })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        const { messages, timestamp } = action.payload;

        // Просто обновляем сообщения с сервера
        state.messages = messages;
        state.lastMessageCount = messages.length;
        state.lastUpdateTime = timestamp;

        // Сохраняем в localStorage
        storage.setChatMessages(messages);

        state.isLoading = false;
        state.isInitialLoading = false;
        state.error = null;
      })
      // .addCase(fetchMessages.fulfilled, (state, action) => {
      //   state.isLoading = false;
      //   state.isInitialLoading = false;
      //   state.messages = action.payload.messages;
      //   state.error = null;
      // })
      .addCase(fetchMessages.rejected, (state, action) => {
        state.isLoading = false;
        state.isInitialLoading = false;
        state.error = action.error.message || 'Ошибка загрузки сообщений';
      })
      .addCase(sendMessage.pending, state => {
        state.isSendingMessages = true;
        state.error = null;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.isSendingMessages = false;
        state.error = null;
        
        // Добавляем сообщение сразу для мгновенного отображения
        if (action.payload.chat) {
          state.messages.push(action.payload.chat);
          storage.setChatMessages(state.messages);
        }
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.isSendingMessages = false;
        state.error = action.error.message || 'Ошибка отправки сообщения';
      });
  },
});

export const { clearError } = chatSlice.actions;
export default chatSlice.reducer;
