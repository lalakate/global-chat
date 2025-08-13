import React, { useEffect, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { Loader } from '../UI/Loader';
import { useVirtualScroll } from '../../hooks/useVirtualScroll';
import { VirtualMessageList } from '../VirtualList/VirtualList';
import { fetchMessages } from '../../features/chat/chatSlice';
import './messages.css';

export const Messages = React.memo(() => {
  const isInitialLoading = useAppSelector(state => state.chat.isInitialLoading);
  const messages = useAppSelector(state => state.chat.messages);
  const isLoading = useAppSelector(state => state.chat.isLoading);
  const isAuthorized = useAppSelector(state => state.auth.isAuthorized);
  const intervalRef = useRef<number | null>(null);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!isAuthorized) {
      return;
    }

    // Очищаем предыдущий интервал
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    // Запускаем polling каждые 3 секунды
    intervalRef.current = setInterval(() => {
      dispatch(fetchMessages(true)); // Silent mode - без показа loader
    }, 3000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [dispatch, isAuthorized]);

  const {
    listRef,
    cache,
    sortedMessages,
    messagesContainerRef,
    messagesEndRef,
    initialScrollToIndex,
  } = useVirtualScroll({
    messages,
    isInitialLoading,
  });

  if (isLoading && sortedMessages.length === 0) {
    return (
      <div className="messages">
        <Loader />
      </div>
    );
  }

  if (sortedMessages.length === 0) {
    return (
      <div className="messages">
        <p>Сообщений пока нет</p>
        <p>Напишите первое сообщение!</p>
      </div>
    );
  }

  return (
    <div className="messages">
      <VirtualMessageList
        messages={sortedMessages}
        cache={cache}
        listRef={listRef}
        messagesContainerRef={messagesContainerRef}
        messagesEndRef={messagesEndRef}
        initialScrollToIndex={initialScrollToIndex}
      />

      {isLoading && <Loader />}
    </div>
  );
});

Messages.displayName = 'Messages';
