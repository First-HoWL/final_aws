import { Link, NavLink, useNavigate } from "react-router-dom";
import "./Navbar.css";

// TODO: заменить на контекст/хук авторизации
const MOCK_USER = null;

export default function Navbar() {
    const navigate = useNavigate();
    const user = MOCK_USER;

    return (
        <header className="navbar">
            <div className="container navbar__inner">
                <Link to="/" className="navbar__logo">
                    Noted
                </Link>

                
                <nav className="navbar__nav">
                    <NavLink 
                        to="/" 
                        className={({isActive}) => isActive ? 'navbar__link active' : "navbar__link"} 
                        end
                    >
                        Лента
                    </NavLink>
                    
                    <NavLink 
                        to="/support" 
                        className={({isActive}) => isActive ? 'navbar__link active' : "navbar__link"} 
                        end
                    >
                        Поддержка
                    </NavLink>
                </nav>

                <div className="navbar__actions">
                    <button className="btn btn-primary" onClick={() => navigate('/submit')}>
                        + Признаться
                    </button>
            
                    {user ? (
                        <NavLink to="/profile" className="navbar__avatar">
                            {user.username[0].toUpperCase()}
                        </NavLink>
                    ) : (
                        <NavLink to="/login" className="btn btn-ghost">Войти</NavLink>
                    )}
                </div>
            </div>
        </header>
    );
}
