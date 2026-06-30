import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getConfession, getRandomConfession, likeConfession, sendFeedback } from '../../api/index';
import TagBadge from '../../components/TagBadge/TagBadge';
import './Confession.css';

import { ReactComponent as HeartIcon } from '../../assets/images/heart-outline.svg';
import { ReactComponent as EyeIcon } from '../../assets/images/eye.svg';

export default function Confession() {
    const { id } = useParams();
    const navigate = useNavigate();
    
    const [confession, setConfession] = useState(null);
    const [loading, setLoading] = useState(true);
    const [liked, setLiked] = useState(false);
    const [likesCount, setLikesCount] = useState(0);
    const [feedbackText, setFeedbackText] = useState('');
    const [feedbackSent, setFeedbackSent] = useState(false);
    
    useEffect(() => {
        setLoading(true);
        getConfession(id).then(data => {
            setConfession(data);
            setLikesCount(data?.likes ?? 0);
            setLoading(false);
        });
    }, [id]);
    
    const handleLike = async () => {
        if (liked) return;
        const result = await likeConfession(id);
        setLikesCount(result.likes);
        setLiked(true);
    };
    
    const handleRandom = async () => {
        const c = await getRandomConfession();
        if (c) navigate(`/confession/${c.id}`);
    };
    
    const handleFeedback = async (e) => {
        e.preventDefault();
        if (!feedbackText.trim()) return;
        await sendFeedback({ confession_id: id, text: feedbackText });
        setFeedbackSent(true);
        setFeedbackText('');
    };

    const translateStatus = (status) => {
        const map = {
            'published': 'Опубліковано',
            'pending': 'На перевірці',
            'rejected': 'Відхилено'
        };
        return map[status] || status;
    };
    
    if (loading) {
        return (
            <div className="confession-page">
                <div className="container confession-page__loading">Завантаження...</div>
            </div>
        );
    }
    
    if (!confession) {
        return (
            <div className="confession-page">
                <div className="container confession-page__empty">Визнання не знайдено.</div>
            </div>
        );
    }
    
    const date = new Date(confession.created_at).toLocaleDateString('uk-UA', {
        day: 'numeric', month: 'long', year: 'numeric',
    });
    
    return (
        <div className="confession-page">
            <div className="container">
        
                <div className="confession-page__back" onClick={() => navigate(-1)}>
                    &larr; Назад
                </div>
        
                <article className="confession-article">
                    <div className="confession-article__meta">
                        <span className={`status-badge status-badge--${confession.status}`}>
                            {translateStatus(confession.status)}
                        </span>
                        <span className="confession-article__date">{date}</span>
                    </div>
            
                    <p className="confession-article__text">« {confession.text} »</p>
            
                    <div className="confession-article__tags">
                        {confession.tags?.map(tag => (
                            <TagBadge key={tag} tag={tag} />
                        ))}
                    </div>
            
                    <div className="confession-article__actions">
                        <button
                            className={`confession-like-btn ${liked ? 'confession-like-btn--liked' : ''}`}
                            onClick={handleLike}
                        >
                            <HeartIcon className="confession-page__icon-heart" />
                            {likesCount}
                        </button>
            
                        <span className="confession-article__views">
                            <EyeIcon className="confession-page__icon-eye" />
                            {confession.views} переглядів
                        </span>
            
                        <button className="btn btn-ghost" onClick={handleRandom} style={{ marginLeft: 'auto' }}>
                            Випадкове
                        </button>
                    </div>
                </article>
        
                <section className="confession-feedback">
                    <h2 className="confession-feedback__title">Анонімна відповідь</h2>
                    <p className="confession-feedback__hint">Ніхто не знає, хто ти. Напиши щось автору.</p>
            
                    {feedbackSent ? (
                        <div className="confession-feedback__success">Твій відгук надіслано!</div>
                    ) : (
                        <form className="confession-feedback__form" onSubmit={handleFeedback}>
                            <textarea
                                className="confession-feedback__input"
                                placeholder="Твій відгук..."
                                value={feedbackText}
                                onChange={e => setFeedbackText(e.target.value)}
                                rows={4}
                                maxLength={500}
                            />
                            <div className="confession-feedback__footer">
                                <span className="confession-feedback__count">{feedbackText.length}/500</span>
                                <button type="submit" className="btn btn-primary" disabled={!feedbackText.trim()}>
                                    Надіслати
                                </button>
                            </div>
                        </form>
                    )}
                </section>
        
            </div>
        </div>
    );
}