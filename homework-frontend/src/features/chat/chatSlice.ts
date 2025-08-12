import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type {
  ChatState,
  Message,
  SendMessageResponse,
} from '../../types/types';
import type { RootState } from '../../app/store';
import { api } from '../../services/api';
import { storage } from '../../services/storage';

const initialState: ChatState = {
  messages: storage.getChatMessages(),
  isLoading: false,
  isInitialLoading: true,
  isSendingMessages: false,
  error: null,
};

export const fetchMessages = createAsyncThunk<
  { messages: Message[]; isBackground: boolean },
  boolean | undefined,
  { state: RootState }
>('chat/fetchMessages', async (isBackground = false, { getState }) => {
  const state = getState();
  const token = state.auth.user?.token;

  if (!token) {
    throw new Error('User is not authorized');
  }

  const messages = await api.getChats(token);
  storage.setChatMessages(messages);
  return { messages, isBackground };
});

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
        const isBackground = action.meta.arg;
        if (!isBackground) {
          state.isLoading = true;
        }
        state.error = null;
      })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isInitialLoading = false;
        state.messages = action.payload.messages;
        state.error = null;
      })
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
        if (action.payload.chat) {
          state.messages.push(action.payload.chat);
          storage.setChatMessages(state.messages);
        }
        state.error = null;
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.isSendingMessages = false;
        state.error = action.error.message || 'Ошибка отправки сообщения';
      });
  },
});

export const { clearError } = chatSlice.actions;
export default chatSlice.reducer;
