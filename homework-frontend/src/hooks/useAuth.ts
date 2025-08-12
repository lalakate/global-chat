import { api } from '../services/api';
import type { LoginResponse, RegisterResponse } from '../types/types';
import { useApi } from './useApi';

const useRegister = () => {
  return useApi<RegisterResponse>(api.register);
};

const useLogin = () => {
  return useApi<LoginResponse>(api.login);
};

export const useAuth = () => {
  const registerApi = useRegister();
  const loginApi = useLogin();

  const register = async (username: string, password: string) => {
    return registerApi.execute(username, password);
  };

  const login = async (username: string, password: string) => {
    return loginApi.execute(username, password);
  };

  return {
    register: {
      execute: register,
      loading: registerApi.loading,
      error: registerApi.error,
      data: registerApi.data,
      reset: registerApi.reset,
    },
    login: {
      execute: login,
      loading: loginApi.loading,
      error: loginApi.error,
      data: loginApi.data,
      reset: loginApi.reset,
    },
  };
};
