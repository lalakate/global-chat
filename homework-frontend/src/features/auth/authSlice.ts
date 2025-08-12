import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../services/api';
import { storage } from '../../services/storage';
import type {
  AuthState,
  LoginResponse,
  RegisterResponse,
} from '../../types/types';

const savedUser = storage.getUser();
const savedToken = storage.getToken();

const isValidSavedData =
  savedUser &&
  savedUser.username &&
  savedUser.username.trim().length > 0 &&
  savedToken;

if (!isValidSavedData && (savedUser || savedToken)) {
  storage.clearAuth();
}

const initialState: AuthState = {
  user: isValidSavedData ? savedUser : null,
  isAuthorized: !!isValidSavedData,
  isLoading: false,
  error: null,
};

export const loginUser = createAsyncThunk<
  LoginResponse,
  { username: string; password: string }
>('auth/login', async ({ username, password }, { rejectWithValue }) => {
  try {
    const response = await api.login(username, password);

    const user = {
      username: username,
      token: response.token,
    };

    storage.setToken(response.token);
    storage.setUser(user);

    return response;
  } catch (error) {
    let errorMessage = 'Unknown error';
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return rejectWithValue(errorMessage);
  }
});

export const registerUser = createAsyncThunk<
  RegisterResponse,
  { username: string; password: string }
>('auth/register', async ({ username, password }, { rejectWithValue }) => {
  try {
    const response = await api.register(username, password);

    return response;
  } catch (error) {
    let errorMessage = 'Unknown error';
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return rejectWithValue(errorMessage);
  }
});

export const logoutUser = createAsyncThunk('auth/logout', async () => {
  storage.clearAuth();
});

export const initializeAuth = createAsyncThunk('auth/initialize', async () => {
  const token = storage.getToken();
  const user = storage.getUser();

  if (!token || !user || !user.username || user.username.trim().length === 0) {
    storage.clearAuth();
    throw new Error('No valid auth data');
  }

  try {
    const isValid = await api.validateToken(token);
    if (!isValid) {
      storage.clearAuth();
      throw new Error('Invalid token');
    }
  } catch (error) {
    // If validateToken not relized continue
  }

  return { user, token };
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: state => {
      state.error = null;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(loginUser.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = {
          username: action.meta.arg.username,
          token: action.payload.token,
        };
        state.isAuthorized = true;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          (action.payload as string) ||
          action.error.message ||
          'Ошибка входа в систему';
        state.isAuthorized = false;
        state.user = null;
      })

      .addCase(registerUser.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, state => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          (action.payload as string) ||
          action.error.message ||
          'Ошибка регистрации';
      })

      .addCase(logoutUser.pending, state => {
        state.isLoading = true;
      })
      .addCase(logoutUser.fulfilled, state => {
        state.user = null;
        state.isAuthorized = false;
        state.error = null;
        state.isLoading = false;
      })

      .addCase(initializeAuth.pending, state => {
        state.isLoading = true;
      })
      .addCase(initializeAuth.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.isAuthorized = true;
        state.isLoading = false;
        state.error = null;
      })
      .addCase(initializeAuth.rejected, state => {
        state.user = null;
        state.isAuthorized = false;
        state.isLoading = false;
        state.error = null;
        storage.clearAuth();
      });
  },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;
