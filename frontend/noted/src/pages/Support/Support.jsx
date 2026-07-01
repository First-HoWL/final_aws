import { useState } from 'react';
import { sendFeedback } from '../../api/index';
import './Support.css';

const SUPPORT_TYPES = [
  { id: 'bug', label: 'Сайт лагає / Баг', desc: 'Повідомити про технічну помилку' },
  { id: 'report', label: 'Жалоба на допис', desc: 'Запит на видалення чужого зізнання' },
  { id: 'other', label: 'Інше питання', desc: 'Зворотній зв’язок з адміном' },
];

export default function Support() {
  const [type, setType]         = useState('bug');
  const [text, setText]         = useState('');
  const [error, setError]       = useState('');
  const [sent, setSent]         = useState(false);
  const [loading, setLoading]   = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) {
      setError('Будь ласка, опиши свою проблему.');
      return;
    }
    if (text.length < 10) {
      setError('Опис занадто короткий (мінімум 10 символів).');
      return;
    }

    setError('');
    setLoading(true);

    try {
      await sendFeedback({ confession_id: null, text: `[${type.toUpperCase()}] ${text}` });
      setSent(true);
      setText('');
    } catch (err) {
      setError('Сталася помилка при відправці. Спробуй ще раз.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="support-page">
      <div className="support-page__glow support-page__glow--purple"></div>
      <div className="support-page__glow support-page__glow--blue"></div>

      <div className="container support-page__container">

        <div className="support-hero">
          <p className="support-hero__label">Служба підтримки</p>
          <h1 className="support-hero__title">Виникли проблеми<br />чи помітили баг?</h1>
          <p className="support-hero__text">
            Якщо сайт лагає, щось не працює або ви знайшли призначення, яке порушує правила — повідомте нам абсолютно анонімно.
          </p>
        </div>

        {sent ? (
          <div className="support-success">
            <h2>Повідомлення надіслано!</h2>
            <p>Дякуємо за допомогу. Ми перевіримо твій репорт найближчим часом.</p>
            <button className="btn btn-ghost" style={{ marginTop: 'var(--space-4)' }} onClick={() => setSent(false)}>
              Надіслати ще раз
            </button>
          </div>
        ) : (
          <form className="support-card" onSubmit={handleSubmit}>

            <div className="support-custom">
              <label className="support-custom__label">Оберіть тему звернення</label>
              <div className="support-tiers">
                {SUPPORT_TYPES.map(item => (
                  <button
                    type="button"
                    key={item.id}
                    className={`support-tier ${type === item.id ? 'active' : ''}`}
                    onClick={() => setType(item.id)}
                  >
                    <span className="support-tier__label">{item.label}</span>
                    <span className="support-tier__desc">{item.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="support-custom">
              <label className="support-custom__label">Опис проблеми</label>
              <div className="support-custom__input-wrap">
                <textarea
                  className="support-custom__textarea"
                  placeholder="Детально опишіть, що сталося, або вкажіть ID запису для видалення..."
                  rows={5}
                  maxLength={1000}
                  value={text}
                  onChange={e => setText(e.target.value)}
                />
                <div className="support-custom__counter">{text.length}/1000</div>
              </div>
            </div>

            {error && <div className="auth-error" style={{ marginBottom: 'var(--space-2)' }}>{error}</div>}

            <button
              type="submit"
              className="btn btn-primary support-btn"
              disabled={loading}
            >
              {loading ? 'Надсилання...' : 'Надіслати репорт'}
            </button>

          </form>
        )}

      </div>
    </div>
  );
}
