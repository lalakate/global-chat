import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from './store';

const selectChatState = (state: RootState) => state.chat;
const selectAuthState = (state: RootState) => state.auth;

export const selectMessages = createSelector(
  [selectChatState],
  chat => chat.messages
);

export const selectChatIsLoading = createSelector(
  [selectChatState],
  chat => chat.isLoading
);

export const selectIsInitialLoading = createSelector(
  [selectChatState],
  chat => chat.isInitialLoading
);

export const selectUser = createSelector([selectAuthState], auth => auth.user);

export const selectAuthIsLoading = createSelector(
  [selectAuthState],
  auth => auth.isLoading
);

export const selectIsAuthorized = createSelector(
  [selectAuthState],
  auth =>
    auth.isAuthorized &&
    !!auth.user &&
    !!auth.user.username &&
    auth.user.username.trim().length > 0
);

export const selectSortedMessages = createSelector([selectMessages], messages =>
  [...messages].sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  )
);
