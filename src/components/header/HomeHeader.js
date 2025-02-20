import React from 'react';
import { NavLink, useLocation,useNavigate } from 'react-router-dom';
import './HomeHeader.css';
import Bookgie from "../../img/Bookgie.png";
import Logout from "../../img/Logout.png";
import mypage from "../../img/mypage.png";
import axios from 'axios';

const HomeHeader = () => {
  const location = useLocation();
  const navigate = useNavigate(); 


  // 페이지마다 다른 배경색 설정
  const headerStyle = {
    backgroundColor:
      location.pathname === '/search' ? 'rgba(248, 255, 234, 0)' :  // 홈 페이지
      location.pathname === '/searchdetail' ? 'rgba(255, 255, 255, 1)' :  // About 페이지
      '#F8FFEA', // 그 외의 페이지
    fontFamily: 'Pretendard-Regular',
    padding: '0.5rem 3.5rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  };

 
 
  const handleLogout = async () => {
    try {
      const response = await axios.put("https://janghong.asia/api/auth/user/session/out");
  
      if (response.data.status === "logout") {
        alert("로그아웃되었습니다.");
        localStorage.clear(); 
        sessionStorage.clear();
  
        setTimeout(() => {
          console.log("✅ navigate('/') 실행됨");
          navigate("/");
        }, 100);
      }
    } catch (error) {
      console.error("❌ 로그아웃 실패:", error);
      alert("로그아웃 중 오류가 발생했습니다.");
    }
  };
  

  return (
    <div>
      <header style={headerStyle} className="Homeheader">
        <h1 className="Home-header-title">
          <NavLink to="/search">
            <img src={Bookgie} alt="부기 로고" style={{ cursor: "pointer", height: "50px" }} />
          </NavLink>
        </h1>
        <nav className="nav">
        <NavLink 
  to="/search" 
  className={({ isActive }) => isActive ? "active" : ""}
>
  책 탐색하기
</NavLink>
          <NavLink to="/timerlanding">뽀커스 모드</NavLink>
          <NavLink to="/home" className={location.pathname.includes("/bookdetail") ? "active" : ""}>
            나의 책
          </NavLink>
        </nav>
        <div className="my">
          
          <img src={Logout} alt="logoutbtn" onClick={handleLogout} style={{ cursor: "pointer", height: "2.5rem" }} />
          <img src={mypage} alt="mypagebtn" style={{ cursor: "pointer", height: "2.5rem" }} />
        </div>
      </header>
    </div>
  );
};

export default HomeHeader;
