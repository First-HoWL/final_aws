import { useNavigate } from 'react-router-dom';
import './NotFound.css';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="notfound-page">
      <div className="notfound-page__glow notfound-page__glow--purple"></div>
      <div className="notfound-page__glow notfound-page__glow--blue"></div>

      <div className="container notfound-page__container">
        <div className="notfound-inner">
          <span className="notfound-code">404</span>
          <h1 className="notfound-title">Сторінка не знайдена</h1>
          <p className="notfound-text">
            Можливо, цей секрет був видалений назавжди або посилання ніколи не існувало.
          </p>
          <div className="notfound-actions">
            <button className="btn btn-primary" onClick={() => navigate('/')}>
              До стрічки
            </button>
            <button className="btn btn-ghost" onClick={() => navigate(-1)}>
              Назад
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
