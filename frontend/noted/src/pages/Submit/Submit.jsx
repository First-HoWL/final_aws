import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { submitConfession, MOCK_TAGS } from '../../api/index';
import TagBadge from '../../components/TagBadge/TagBadge';
import './Submit.css';

export default function Submit() {
  const [title, setTitle]       = useState('');
  const [text, setText]         = useState('');
  const [selectedTags, setSelectedTags] = useState([]); // Стейт изменен на массив для мультивыбора
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');
  
  const navigate = useNavigate();
  const titleInputRef = useRef(null);

  useEffect(() => {
    titleInputRef.current?.focus();
  }, []);

  const toggleTag = (tag) => {
    setSelectedTags(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !text.trim()) {
      setError('Заповни і заголовок, і текст визнання.');
      return;
    }
    if (selectedTags.length === 0) {
      setError('Обери хоча б одну категорію (можна кілька).');
      return;
    }
    if (text.length < 10) {
      setError('Занадто коротке зізнання. Напиши детальніше.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      // Передаем массив всех выбранных текстовых тегов
      await submitConfession({ title, text, tags: selectedTags });
      navigate('/pending');
    } catch (err) {
      setError('Сталася помилка при відправці. Спробуй ще раз.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="submit-page">
      <div className="submit-page__glow submit-page__glow--pink"></div>
      <div className="submit-page__glow submit-page__glow--purple"></div>

      <div className="container submit-page__container">
        <div className="submit-card">
          
          <div className="submit-card__header">
            <h1 className="submit-card__title">Створити визнання</h1>
            <p className="submit-card__sub">Твій запис опублікується абсолютно анонімно після автоперевірки</p>
          </div>

          <form className="submit-card__form" onSubmit={handleSubmit}>
            
            <div className="submit-field">
              <label className="submit-field__label">Заголовок визнання</label>
              <input
                ref={titleInputRef}
                type="text"
                className="auth-field__input"
                placeholder="Коротка суть або клікбейт..."
                value={title}
                onChange={e => setTitle(e.target.value)}
                maxLength={100}
              />
            </div>

            <div className="submit-field">
              <label className="submit-field__label">Категорії (оберіть кілька)</label>
              <div className="submit-field__tags">
                {MOCK_TAGS.map(tag => (
                  <TagBadge 
                    key={tag}
                    tag={tag}
                    onClick={() => toggleTag(tag)} // Мультивыбор по клику
                    active={selectedTags.includes(tag)} // Подсветка всех выбранных
                  />
                ))}
              </div>
            </div>

            <div className="submit-field">
              <label className="submit-field__label">Твоє визнання</label>
              <textarea
                className="submit-field__textarea"
                placeholder="Розкажи все в деталях тут..."
                value={text}
                onChange={e => setText(e.target.value)}
                maxLength={1000}
                rows={6}
              />
              <div className="submit-field__counter">
                {text.length}/1000
              </div>
            </div>

            {error && <div className="submit-error">{error}</div>}

            <div className="submit-card__actions">
              <button type="submit" className="btn btn-primary submit-card__btn" disabled={loading}>
                {loading ? 'Надсилання...' : 'Опублікувати'}
              </button>
              <button type="button" className="btn btn-ghost" onClick={() => navigate('/')} disabled={loading}>
                Скасувати
              </button>
            </div>

          </form>

        </div>
      </div>
    </div>
  );
}
