import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import './HomeHeader.css';
import Bookgie from "../../img/Bookgie.png";
import Logout from "../../img/Logout.png";
import mypage from "../../img/mypage.png";

const HomeHeader = () => {
  const location = useLocation();
  const handleLogOut =()=> {
  console.log("logout!!!!");
  }
  return (
    <div>
      <header className="Homeheader">
        <h1 className="Home-header-title">
          <NavLink to="/search">
            <img src={Bookgie} alt="부기 로고" style={{ cursor: "pointer", height: "50px" }} />
          </NavLink>
        </h1>
        <nav className="nav">
          <NavLink to="/search">책 탐색하기</NavLink>
          <NavLink to="/timerlanding">뽀커스 모드</NavLink>
          <NavLink to="/home" className={location.pathname.includes("/bookdetail") ? "active" : ""}>
            나의 책
          </NavLink>
        </nav>
        <div className="my">
          <img src={Logout} alt="logoutbtn" style={{ cursor: "pointer", height: "2.5rem" }} onClick={handleLogOut} />
          <img src={mypage} alt="mypagebtn" style={{ cursor: "pointer", height: "2.5rem" }} />
        </div>
      </header>
    </div>
  );
};

export default HomeHeader;
