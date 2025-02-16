import React from 'react';
import { NavLink, useLocation ,useNavigate} from 'react-router-dom';
import './SearchHeader.css';
import Bookgie from "../../img/Bookgie.png";
import Logout from "../../img/Logout.png";
import mypage from "../../img/mypage.png";
import axios from 'axios';

const SearchHeader = () => {
  const location = useLocation();
  const navigate = useNavigate(); 

 
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
          
          <img src={Logout} alt="logoutbtn" onClick={handleLogout} style={{ cursor: "pointer", height: "2.5rem" }} />
          <img src={mypage} alt="mypagebtn" style={{ cursor: "pointer", height: "2.5rem" }} />
        </div>
      </header>
    </div>
  );
};

export default SearchHeader;
