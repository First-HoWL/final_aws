import { Link } from 'react-router-dom';
import './Footer.css';
 
export default function Footer() {
    return (
        <footer className="footer">
            <div className="container footer__inner">
                <span className="footer__brand">Confessions</span>
                <nav className="footer__nav">
                    <Link to="/">Лента</Link>
                    <Link to="/submit">Написать</Link>
                    <Link to="/support">Поддержка</Link>
                </nav>
                <span className="footer__copy">Анонімно. Чесно.</span>
            </div>
        </footer>
    );
}