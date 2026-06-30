import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getConfessions, getRandomConfession, MOCK_TAGS } from '../../api/index';
import ConfessionCard from '../../components/ConfessionCard/ConfessionCard';
import TagBadge from '../../components/TagBadge/TagBadge';
import './Home.css';

export default function Home() {
    const [confessions, setConfessions] = useState([]);
    const [activeTags, setActiveTags]   = useState([]); // Массив для мультивыбора тегов
    const [sort, setSort]               = useState('new');
    const [loading, setLoading]         = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        setLoading(true);
        // Отправляем массив выбранных тегов на фильтрацию
        getConfessions({ tags: activeTags, sort }).then(data => {
            setConfessions(Array.isArray(data) ? data : []);
            setLoading(false);
        })
        .catch(err => {
            console.error("Критическая ошибка при запросе к Django:", err);
            setConfessions([]); 
            setLoading(false);
        });
    }, [activeTags, sort]);

    const handleRandom = async () => {
        const confession = await getRandomConfession();
        if (confession) navigate(`/confession/${confession.id}`);
    };

    // Добавление или удаление тега из списка активных фильтров
    const toggleTag = (tag) => {
        setActiveTags(prev => 
            prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
        );
    };

    return (
        <div className="home">
            <div className="container">

                <section className="home__hero">
                    <p className="home__hero-label">анонімно · без реєстрації</p>
                    <h1 className="home__hero-title">Скажи те,<br />чого не кажеш вголос</h1>
                    <div className="home__hero-actions">
                        <button className="btn btn-primary" onClick={() => navigate('/submit')}>
                            Написати визнання
                        </button>
                        <button className="btn btn-ghost" onClick={handleRandom}>
                            Випадкове
                        </button>
                    </div>
                </section>

                <section className="home__filters">
                    <div className="home__tags">
                        {MOCK_TAGS.map(tag => (
                        <TagBadge
                            key={tag}
                            tag={tag}
                            onClick={() => toggleTag(tag)}
                            active={activeTags.includes(tag)} // Подсветка, если тег выбран
                        />
                        ))}
                    </div>

                    <div className="home__sort">
                        <button
                            className={`home__sort-btn ${sort === 'new' ? 'active' : ''}`}
                            onClick={() => setSort('new')}
                        >
                            Нові
                        </button>
                        <button
                            className={`home__sort-btn ${sort === 'popular' ? 'active' : ''}`}
                            onClick={() => setSort('popular')}
                        >
                            Популярні
                        </button>
                    </div>
                </section>

                <section className="home__feed">
                    {loading ? (
                        <div className="home__loading">Завантаження...</div>
                    ) : confessions.length === 0 ? (
                        <div className="home__empty">
                            <p>Нічого не знайдено</p>
                            <button className="btn btn-ghost" onClick={() => setActiveTags([])}>
                                Скинути фільтри
                            </button>
                        </div>
                    ) : (
                        <div className="home__grid">
                            {confessions.map(c => (
                                <ConfessionCard key={c.id} confession={c} />
                            ))}
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
}
