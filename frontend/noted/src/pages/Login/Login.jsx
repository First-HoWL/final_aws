import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser } from '../../api/index';
import './Login.css';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);
  
  const navigate = useNavigate();
  const loginInputRef = useRef(null);

  useEffect(() => {
    loginInputRef.current?.focus();
  }, []);

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!username || !password) { setError('Заповни всі поля.'); return; }
    setError('');
    setLoading(true);
    try {
      await loginUser({ username, password });
      navigate('/');
    } catch {
      setError('Невірний логін або пароль.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = (e) => {
    e.preventDefault();
    alert('Функція відновлення паролю буде доступна після налаштування AWS SES (Email сервісу).');
  };

  return (
    <div className="auth-page">
      <div className="auth-page__glow auth-page__glow--purple"></div>
      <div className="auth-page__glow auth-page__glow--blue"></div>

      <div className="container auth-page__container">
        <div className="auth-card">

          <div className="auth-card__header">
            <h1 className="auth-card__title">Вхід</h1>
            <p className="auth-card__sub">
              Немає акаунту? <Link to="/register" className="auth-card__link">Реєстрація</Link>
            </p>
          </div>

          <form className="auth-card__form" onSubmit={handleSubmit}>
            <div className="auth-field">
              <label className="auth-field__label">Логін</label>
              <input
                ref={loginInputRef}
                className="auth-field__input"
                type="text"
                placeholder="username"
                value={username}
                onChange={e => setUsername(e.target.value)}
              />
            </div>

            <div className="auth-field">
              <label className="auth-field__label">Пароль</label>
              <input
                className="auth-field__input"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
              <div className="auth-field__help">
                <button 
                  type="button" 
                  className="auth-card__link-forgot" 
                  onClick={handleForgotPassword}
                >
                  Забули пароль?
                </button>
              </div>
            </div>

            {error && <div className="auth-error">{error}</div>}

            <button 
              type="submit" 
              className="btn btn-primary auth-card__submit" 
              disabled={loading}
            >
              {loading ? 'Вхід...' : 'Увійти'}
            </button>
          </form>

        </div>
      </div>
    </div>
  );
}
