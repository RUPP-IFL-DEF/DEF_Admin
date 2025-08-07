import { NavLink } from 'react-router-dom';
import { useEffect, useState } from 'react';

const Sidebar = ({ isOpen }) => {
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
    };

    return (
        <aside className={`sidebar ${isOpen ? 'active' : ''}`}>
            <div>
                <h1 className="logo">Library</h1>
                <nav className="nav-links">
                    <NavLink to="/crud" className="nav-link" end>Home</NavLink>
                    <NavLink to="/crud/book" className="nav-link">Book</NavLink>
                    <NavLink to="/crud/user" className="nav-link">User</NavLink>
                    <NavLink to="/crud/report" className="nav-link">Report</NavLink>
                </nav>
            </div>

            <div className="theme-toggle-wrapper">
                <label className="theme-toggle">
                    <input
                        type="checkbox"
                        onChange={toggleTheme}
                        checked={theme === 'dark'}
                    />
                    <span className="slider">
                        {theme === 'dark' ? '🌙' : '☀️'}
                    </span>
                </label>
            </div>
        </aside>
    );
};

export default Sidebar;
