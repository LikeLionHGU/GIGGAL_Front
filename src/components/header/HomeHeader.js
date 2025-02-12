import React from 'react';
import { Link } from 'react-router-dom';
import './HomeHeader.css';
import logo from "../../img/Logo.png";

const HomeHeader = () => {
  return (
    <div>
    <header className="Homeheader">
      <h1 className="Home-header-title">
          <Link to="/home">
            <img src={logo} alt="부기 로고" style={{ cursor: "pointer", height: "50px" }} />
          </Link>
        </h1>
      <nav className="nav">
        <Link to="/home">My북</Link>
        <Link to="/search">책 탐색하기</Link>
        <Link to="/timer">Focus Mode</Link>
        <Link to="/login">Logout</Link>
      </nav>
    </header>
    <hr className="gnb-line" />
    </div>
  );
};

export default HomeHeader;