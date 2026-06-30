import { useNavigate } from 'react-router-dom';
import './Pending.css';
import { ReactComponent as ClockIcon } from '../../assets/images/clock.svg';

export default function Pending() {
    const navigate = useNavigate();

    return (
        <div className="pending-page">
            <div className="container">
                <div className="pending-card">

                    <div className="pending-card__icon">
                        <ClockIcon className="pending-page__icon-clock" />
                    </div>

                    <span className="status-badge status-badge--pending">
                        на перевірці
                    </span>

                    <h1 className="pending-card__title">Визнання надіслано</h1>

                    <p className="pending-card__text">
                        Твій запис автоматично перевіряється. Зазвичай це займає кілька секунд.
                        Після перевірки він з'явиться у стрічці.
                    </p>

                    <div className="pending-card__steps">
                        <div className="pending-step pending-step--done">
                            <span className="pending-step__dot"></span>
                            <span>Відправлено</span>
                        </div>
                        <div className="pending-step pending-step--active">
                            <span className="pending-step__dot"></span>
                            <span>Перевірка</span>
                        </div>
                        <div className="pending-step">
                            <span className="pending-step__dot"></span>
                            <span>Опубліковано</span>
                        </div>
                    </div>

                    <div className="pending-card__actions">
                        <button className="btn btn-primary" onClick={() => navigate('/')}>
                            До стрічки
                        </button>
                        <button className="btn btn-ghost" onClick={() => navigate('/submit')}>
                            Написати ще
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
}
