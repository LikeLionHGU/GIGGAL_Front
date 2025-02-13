import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';
import Bookgie from "../../img/Bookgie.png";
import './HomeHeader.css';

const Header = () => {
  return (
    <div>
    <header className="header">
      <h1 className="header-title">
          <Link to="/home">
            <img src={Bookgie} alt="부기 로고" style={{ cursor: "pointer", height: "50px" }} />
          </Link>
        </h1>
      <nav className="header-nav">
        <Link to="/search">책 탐색하기</Link>
        <Link to="/timer">뽀커스 모드 </Link>
        <Link to="/home">나의 책</Link>
      </nav>
    </header>
    <hr className="gnb-line" />
    </div>
  );
};

export default Header;