import React from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Headers.css';
import Bookgie from "../../img/Bookgie.png";
import Logout from "../../img/Logout.png";
import mypage from "../../img/mypage.png";

const HomeHeader = () => {
  const location = useLocation();
  const navigate = useNavigate(); // ✅ 페이지 이동을 위한 useNavigate 추가

  // ✅ 로그아웃 함수
  const handleLogout = async () => {
    try {
      const response = await axios.put("https://janghong.asia/api/auth/user/session/out");
  
      if (response.data.status === "logout") {
        alert("로그아웃되었습니다.");
        localStorage.clear(); // ✅ 로그인 정보 삭제
        sessionStorage.clear();
  
        setTimeout(() => {
          console.log("✅ navigate('/') 실행됨");
          navigate("/"); // ✅ 0.1초 후 이동
        }, 100);
      }
    } catch (error) {
      console.error("❌ 로그아웃 실패:", error);
      alert("로그아웃 중 오류가 발생했습니다.");
    }
  };
  

  return (
    <div>
      <header className="Homeheaders">
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
          {/* ✅ 로그아웃 버튼 클릭 시 handleLogout 실행 */}
          <img src={Logout} alt="logoutbtn" onClick={handleLogout} style={{ cursor: "pointer", height: "2.5rem" }} />
          <img src={mypage} alt="mypagebtn" style={{ cursor: "pointer", height: "2.5rem" }} />
        </div>
      </header>
    </div>
  );
};

export default HomeHeader;
