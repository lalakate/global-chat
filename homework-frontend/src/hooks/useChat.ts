import { api } from '../services/api';
import type { SendMessageResponse, ChatsResponse } from '../types/types';
import { useApi } from './useApi';

const useGetChats = () => {
  return useApi<ChatsResponse>(api.getChats);
};

const useSendMessage = () => {
  return useApi<SendMessageResponse>(api.sendMessage);
};

export const useChat = () => {
  const getChatsApi = useGetChats();
  const sendMessageApi = useSendMessage();

  const getChats = async (token: string) => {
    return getChatsApi.execute(token);
  };

  const sendMessage = async (token: string, body: string) => {
    return sendMessageApi.execute(token, body);
  };

  return {
    getChats: {
      execute: getChats,
      loading: getChatsApi.loading,
      error: getChatsApi.error,
      data: getChatsApi.data,
      reset: getChatsApi.reset,
    },
    sendMessage: {
      execute: sendMessage,
      loading: sendMessageApi.loading,
      error: sendMessageApi.error,
      data: sendMessageApi.data,
      reset: sendMessageApi.reset,
    },
  };
};
