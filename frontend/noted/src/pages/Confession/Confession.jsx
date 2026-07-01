import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getConfession, getRandomConfession, likeConfession } from '../../api/index';
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
    
    useEffect(() => {
        setLoading(true);
        getConfession(id).then(data => {
            const cleanData = Array.isArray(data) ? data : data;
            setConfession(cleanData);
            setLikesCount(cleanData?.likes ?? 0);
            setLoading(false);
        }).catch(err => {
            console.error("Помилка завантаження зізнання:", err);
            setLoading(false);
        });
    }, [id]);
    
    const handleLike = async () => {
        if (liked) return;

        try {
            const result = await likeConfession(id);
            
            if (result && result.likes !== undefined) {
                setLikesCount(result.likes);
                setLiked(true);
            }
        } catch (err) {
            console.error("Помилка при збереженні лайка на сторінці:", err);
        }
    };
    
    const handleRandom = async () => {
        const c = await getRandomConfession();
        const cleanRandom = Array.isArray(c) ? c : c;
        if (cleanRandom) navigate(`/confession/${cleanRandom.id}`);
    };

    const translateStatus = (status) => {
        if (!status) return 'На перевірці';
        const map = {
            'published': 'Опубліковано',
            'pending': 'На перевірці',
            'rejected': 'Відхилено'
        };
        return map[status.toLowerCase()] || status;
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
    
    const dateSource = confession.created_at || confession.date;
    const date = dateSource 
        ? new Date(dateSource).toLocaleDateString('uk-UA', { day: 'numeric', month: 'long', year: 'numeric' })
        : 'Нещодавно';
    
    return (
        <div className="confession-page">
            <div className="container">
        
                <div className="confession-page__back" onClick={() => navigate(-1)}>
                    &larr; Назад
                </div>
        
                <article className="confession-article">
                    <div className="confession-article__meta">
                        <span className={`status-badge status-badge--${confession.status ? confession.status.toLowerCase() : 'pending'}`}>
                            {translateStatus(confession.status)}
                        </span>
                        <span className="confession-article__date">{date}</span>
                    </div>

                    {/* ВЫВОДИМ ЗАГОЛОВОК НА СТРАНИЦЕ */}
                    <h1 className="confession-article__title-text">
                        {confession.title || "Анонімне зізнання"}
                    </h1>
            
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
                            {confession.views || 0} переглядів
                        </span>
            
                        <button className="btn btn-ghost" onClick={handleRandom} style={{ marginLeft: 'auto' }}>
                            Випадкове
                        </button>
                    </div>
                </article>
        
            </div>
        </div>
    );
}
