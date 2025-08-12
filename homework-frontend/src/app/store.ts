import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import chatReducer from '../features/chat/chatSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    chat: chatReducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppStore = typeof store;
