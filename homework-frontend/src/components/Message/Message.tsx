import React, { useMemo } from 'react';
import { useAppSelector } from '../../app/hooks';
import type { Message } from '../../types/types';
import './message.css';

type MessageProps = {
  message: Message;
};

export const MessageComponent = React.memo<MessageProps>(
  ({ message }: MessageProps) => {
    const currentUser = useAppSelector(state => state.auth.user);
    const isOwnMessage = currentUser?.username === message.username;

    const formattedTime = useMemo(() => {
      return new Date(message.timestamp).toLocaleTimeString('ru-RU', {
        hour: '2-digit',
        minute: '2-digit',
      });
    }, [message.timestamp]);

    return (
      <div className={`message ${isOwnMessage ? 'own-message' : ''}`}>
        <span className="message-username">{message.username}</span>
        <span className="message-body">{message.body || ''}</span>
        <span className="message-timestamp">{formattedTime}</span>
      </div>
    );
  }
);

MessageComponent.displayName = 'MessageComponent';
