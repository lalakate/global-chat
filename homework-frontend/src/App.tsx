import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from './app/hooks';
import { LoginForm } from './components/Auth/LoginForm';
import { initializeAuth } from './features/auth/authSlice';
import { Loader } from './components/UI/Loader';
import { Header } from './components/UI/Header';
import { Chat } from './components/Chat/Chat';
import './App.css';
import './vendor/normalize.css';
import './vendor/fonts.css';

export const App = () => {
  const dispatch = useAppDispatch();
  const { isAuthorized, user, isLoading } = useAppSelector(state => state.auth);

  useEffect(() => {
    dispatch(initializeAuth());
  }, [dispatch]);

  if (isLoading) {
    return (
      <div className="app">
        <Loader />
      </div>
    );
  }

  const isUserValid =
    isAuthorized && user && user.username && user.username.trim().length > 0;

  return (
    <div className="app">
      <Header />
      {isUserValid ? <Chat /> : <LoginForm />}
    </div>
  );
};
