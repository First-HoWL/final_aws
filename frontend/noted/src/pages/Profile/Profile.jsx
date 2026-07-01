import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMe, logoutUser } from '../../api/index';
import ConfessionCard from '../../components/ConfessionCard/ConfessionCard';
import './Profile.css';

const MOCK_FAVOURITES = [];

export default function Profile({ setUser: setGlobalUser }) {
  const [user, setUser]   = useState(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab]     = useState('my');
  const navigate = useNavigate();

  useEffect(() => {
    getMe().then(data => {
      setUser(data);
      setLoading(false);
      if (!data) navigate('/login');
    }).catch(err => {
      console.error("Помилка завантаження профілю:", err);
      setLoading(false);
      navigate('/login');
    });
  }, [navigate]);

  const handleLogout = async () => {
    await logoutUser();
    if (setGlobalUser) setGlobalUser(null);
    navigate('/');
  };

  if (loading) {
    return (
      <div className="profile-page">
        <div className="container profile-page__loading">Завантаження...</div>
      </div>
    );
  }
  
  if (!user) return null;

  const displayName = user.name || "Користувач";
  const loginName = user.username || user.login || "";
  const avatarLetter = displayName ? displayName[0].toUpperCase() : "U";

  const myNotes = Array.isArray(user.written_notes) ? user.written_notes : [];
  
  const currentList = tab === 'favourites' ? MOCK_FAVOURITES : myNotes;

  return (
    <div className="profile-page">
      <div className="profile-page__glow profile-page__glow--purple"></div>
      <div className="profile-page__glow profile-page__glow--blue"></div>

      <div className="container profile-page__container">

        <div className="profile-header">
          <div className="profile-avatar">{avatarLetter}</div>
          <div>
            <h1 className="profile-username">{displayName}</h1>
            <p className="profile-role">Логін: @{loginName}</p>
          </div>
          <button className="btn btn-ghost profile-logout" onClick={handleLogout}>
            Вийти
          </button>
        </div>

        <div className="profile-tabs">
          <button
            type="button"
            className={`profile-tab ${tab === 'my' ? 'active' : ''}`}
            onClick={() => setTab('my')}
          >
            Мої записи ({myNotes.length})
          </button>
          <button
            type="button"
            className={`profile-tab ${tab === 'favourites' ? 'active' : ''}`}
            onClick={() => setTab('favourites')}
          >
            Збережені
          </button>
        </div>

        <div className="profile-content">
          {currentList.length === 0 ? (
            <div className="profile-empty">
              <p>
                {tab === 'favourites' 
                  ? 'Немає збережених визнань.' 
                  : 'Ти ще нічого не писав.'}
              </p>
            </div>
          ) : (
            <div className="profile-grid">
              {currentList.map(confession => (
                <ConfessionCard key={confession.id} confession={confession} />
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
