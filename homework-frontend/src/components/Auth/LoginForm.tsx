import type React from 'react';
import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import {
  clearError,
  loginUser,
  registerUser,
} from '../../features/auth/authSlice';
import { Button } from '../UI/Button';
import './login-form.css';
import { useFormValidation } from '../../hooks/useFormValidation';

export const LoginForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);

  const dispatch = useAppDispatch();
  const { isLoading, error } = useAppSelector(state => state.auth);

  const {
    validationErrors,
    isTouched,
    setFieldTouched,
    setAllFieldsTouched,
    resetValidation,
    formIsValid,
  } = useFormValidation(username, password, isRegistering);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setAllFieldsTouched();

    if (!formIsValid) {
      return;
    }

    try {
      if (isRegistering) {
        await dispatch(registerUser({ username, password })).unwrap();
        await dispatch(loginUser({ username, password })).unwrap();
      } else {
        await dispatch(loginUser({ username, password })).unwrap();
      }

      setUsername('');
      setPassword('');
      resetValidation();
    } catch (error) {
      // Error handling is in authSlice
    }
  };

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
    if (!isTouched.username) {
      setFieldTouched('username');
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    if (!isTouched.password) {
      setFieldTouched('password');
    }
  };

  const handleToggleMode = () => {
    setIsRegistering(!isRegistering);
    dispatch(clearError());
    setUsername('');
    setPassword('');
    resetValidation();
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <h2 className="form-title">
          {isRegistering ? 'Регистрация' : 'Вход в систему'}
        </h2>

        {error && <div className="error-message">{error}</div>}

        <form className="form" onSubmit={handleSubmit}>
          <div className="input-group">
            <input
              type="text"
              placeholder="Имя пользователя"
              value={username}
              onChange={handleUsernameChange}
              onBlur={() => setFieldTouched('username')}
              required
              className={`input ${validationErrors.username ? 'input-error' : ''}`}
            />
            {validationErrors.username && (
              <div className="validation-error">
                {validationErrors.username}
              </div>
            )}
          </div>

          <div className="input-group">
            <input
              type="password"
              placeholder="Пароль"
              value={password}
              onChange={handlePasswordChange}
              onBlur={() => setFieldTouched('password')}
              required
              className={`input ${validationErrors.password ? 'input-error' : ''}`}
            />
            {validationErrors.password && (
              <div className="validation-error">
                {validationErrors.password}
              </div>
            )}
          </div>

          <Button type="submit" disabled={isLoading}>
            {isLoading
              ? isRegistering
                ? 'Регистрация...'
                : 'Вход...'
              : isRegistering
                ? 'Зарегистрироваться'
                : 'Войти'}
          </Button>
        </form>
      </div>

      <Button type="button" onClick={handleToggleMode} className="ask-button">
        {isRegistering
          ? 'Уже есть аккаунт? Войти'
          : 'Нет аккаунта? Зарегистрироваться'}
      </Button>
    </div>
  );
};
