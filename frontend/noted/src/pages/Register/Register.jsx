import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser } from '../../api/index';
import '../Login/Login.css';

export default function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);
  
  const navigate = useNavigate();
  const registerInputRef = useRef(null);

  useEffect(() => {
    registerInputRef.current?.focus();
  }, []);

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!username || !password) { setError('Заповни всі поля.'); return; }
    if (username.length < 3)    { setError('Логін повинен містити мінімум 3 символи.'); return; }
    if (password.length < 6)    { setError('Пароль повинен містити мінімум 6 символів.'); return; }
    
    setError('');
    setLoading(true);
    try {
      await registerUser({ username, password });
      navigate('/');
    } catch {
      setError('Помилка реєстрації. Логін вже зайнятий.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-page__glow auth-page__glow--purple"></div>
      <div className="auth-page__glow auth-page__glow--blue"></div>

      <div className="container auth-page__container">
        <div className="auth-card">

          <div className="auth-card__header">
            <h1 className="auth-card__title">Реєстрація</h1>
            <p className="auth-card__sub">
              Вже є акаунт? <Link to="/login" className="auth-card__link">Увійти</Link>
            </p>
          </div>

          <form className="auth-card__form" onSubmit={handleSubmit}>
            <div className="auth-field">
              <label className="auth-field__label">Логін</label>
              <input 
                ref={registerInputRef}
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
                placeholder="мінімум 6 символів"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
            </div>

            {error && <div className="auth-error">{error}</div>}

            <button 
              type="submit" 
              className="btn btn-primary auth-card__submit" 
              disabled={loading}
            >
              {loading ? 'Реєстрація...' : 'Створити акаунт'}
            </button>
          </form>

        </div>
      </div>
    </div>
  );
}
