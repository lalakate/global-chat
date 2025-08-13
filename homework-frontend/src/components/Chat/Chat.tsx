import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { fetchMessages } from '../../features/chat/chatSlice';
import { Messages } from '../Message/Messages';
import { MessageInput } from '../Message/MessageInput';
import './chat.css';

export const Chat = () => {
  const dispatch = useAppDispatch();
  const isAuthorized = useAppSelector(state => state.auth.isAuthorized);
  const user = useAppSelector(state => state.auth.user);

  useEffect(() => {
    if (isAuthorized && user?.token) {
      // Загружаем сообщения при входе
      dispatch(fetchMessages(false));

      // Периодически обновляем сообщения каждую секунду для быстрой синхронизации
      const interval = setInterval(() => {
        dispatch(fetchMessages(true)); // silent mode чтобы не показывать загрузку
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [dispatch, isAuthorized, user?.token]);

  if (!isAuthorized || !user) {
    return <p>Упс, произошла ошибка</p>;
  }

  return (
    <div className="chat">
      <div className="chat-content">
        <Messages />
      </div>
      <div className="chat-input">
        <MessageInput />
      </div>
    </div>
  );
};
