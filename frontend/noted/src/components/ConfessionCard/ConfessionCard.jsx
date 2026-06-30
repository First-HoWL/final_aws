import { useState } from 'react';
import { Link } from 'react-router-dom';
import TagBadge from '../TagBadge/TagBadge';
import './ConfessionCard.css';
import { ReactComponent as HeartIcon } from '../../assets/images/heart-outline.svg';
import { ReactComponent as EyeIcon } from '../../assets/images/eye.svg';

export default function ConfessionCard({ confession: { id, title, text, tags = [], likes, views, created_at } }) {
    const [isLiked, setIsLiked] = useState(false);
    const [likesCount, setLikesCount] = useState(likes);

    const formattedDate = created_at 
        ? new Date(created_at).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' })
        : 'Нещодавно';

    const handleLike = (e) => {
        e.preventDefault(); // Намертво блокирует переход по ссылке при клике на лайк
        setIsLiked(!isLiked);
        setLikesCount(prev => isLiked ? prev - 1 : prev + 1);
    };

    return (
        <Link to={`/confession/${id}`} className="card">
            {/* Текст заменен на Заголовок, стили сохранены */}
            <p className="card__text card__text--bold-title">
                {title || text || "Анонімне зізнання"}
            </p>

            <div className="card__tags">
                {tags.map(tag => (
                    <TagBadge key={tag} tag={tag} />
                ))}
            </div>

            <div className="card__footer">
                <span className="card__meta">{formattedDate}</span>
                
                <div className="card__stats">
                    <button 
                        onClick={handleLike} 
                        className={`card__stat card__stat--clickable ${isLiked ? 'card__stat--liked' : ''}`}
                        aria-label="Поставити лайк"
                    >
                        <HeartIcon className="card__icon card__icon--heart" />
                        <span>{likesCount}</span>
                    </button>
                
                    <div className="card__stat">
                        <EyeIcon className="card__icon card__icon--eye" />
                        <span>{views}</span>
                    </div>
                </div>
            </div>
        </Link>
    );
}
