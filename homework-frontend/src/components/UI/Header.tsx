import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { logoutUser } from '../../features/auth/authSlice';
import { Button } from './Button';
import './header.css';

export const Header = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(state => state.auth.user);
  const isAuthorized = useAppSelector(state => state.auth.isAuthorized);

  const handleLogout = () => {
    dispatch(logoutUser());
  };

  return (
    <header className="header">
      <h1 className="header-title">Global Chat</h1>

      {isAuthorized && user && user.username ? (
        <div className="user-container">
          <span className="user">Привет, {user.username}!</span>
          <Button className="logout-button" onClick={handleLogout}>
            Выйти
          </Button>
        </div>
      ) : (
        <div>{''}</div>
      )}
    </header>
  );
};
