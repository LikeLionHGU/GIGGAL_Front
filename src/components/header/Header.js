import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

const Header = () => {
  return (
    <div>
    <header className="header">
      <h1 className="header-title">
        <Link to="/">Chill</Link>
        </h1>
      <nav className="header-nav">
        <Link to="/timer">Pomodoro</Link>
        <Link to="/search">Search</Link>
        <Link to="/">My Books</Link>
        <Link to="/login">Login</Link>
      </nav>
    </header>
    <hr className="gnb-line" />
    </div>
  );
};

export default Header;