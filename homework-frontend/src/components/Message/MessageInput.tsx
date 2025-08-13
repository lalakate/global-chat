import React, { useCallback, useEffect, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { sendMessage, fetchMessages } from '../../features/chat/chatSlice';
import { Button } from '../UI/Button';
import './message-input.css';

export const MessageInput = () => {
  const [message, setMessage] = React.useState('');
  const dispatch = useAppDispatch();
  const { isSendingMessages } = useAppSelector(state => state.chat);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, []);

  const handleSendMessage = useCallback(
    async (e?: React.FormEvent) => {
      if (e) {
        e.preventDefault();
      }

      if (!message.trim()) {
        return; // Не отправляем пустые сообщения
      }

      try {
        await dispatch(sendMessage(message)).unwrap();
        setMessage('');

        // Сразу обновляем сообщения с сервера после отправки
        dispatch(fetchMessages(true));

        if (textareaRef.current) {
          textareaRef.current.focus();
        }
      } catch (error) {
        // Обработка ошибки отправки
      }
    },
    [dispatch, message]
  );

  const handleKeyPress = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSendMessage();
      }
    },
    [handleSendMessage]
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setMessage(e.target.value);
    },
    []
  );

  return (
    <div className="message-input-container">
      <div className="input-wrapper">
        <textarea
          ref={textareaRef}
          value={message}
          onChange={handleChange}
          onKeyDown={handleKeyPress}
          disabled={isSendingMessages}
          className="message-textarea"
          placeholder="Введите сообщение... (Enter для отправки)"
          rows={5}
          maxLength={1000}
        />
        <Button
          type="button"
          className="send-button"
          onClick={() => handleSendMessage()}
          disabled={
            !message.trim() || message.trim().length === 0 || isSendingMessages
          }
        >
          {isSendingMessages ? (
            <span className="sending-indicator">📤</span>
          ) : (
            '➤'
          )}
        </Button>
      </div>

      <div className="input-info">
        <span className="char-count">{message.length}/1000</span>
      </div>
    </div>
  );
};
