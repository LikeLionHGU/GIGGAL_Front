import React from "react";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import fbtn from '../../img/floatingbtn.png';  // 경로 수정: components/floating -> img
import tooltipImage from '../../img/tooltip.png';  // 툴팁 이미지 경로 추가
import "./FloatingButton.css";  // CSS 파일

const FloatingButton = () => {
  const navigate = useNavigate();  // navigate 훅을 사용하여 페이지 이동

  const goToSearch = () => {
    navigate("/Timer");  // "/Timer" 경로로 이동
  };

  const location = useLocation();

  if (location.pathname === "/") {
    return null; 
  }

  return (
    <div className="floating-btn-container">
      <img
        src={fbtn}
        alt="floating button"
        className="floating-btn"
        onClick={goToSearch}  // 클릭 시 goToSearch 함수 호출
      />
      <div className="tooltip">
        <img src={tooltipImage} alt="tooltip" />
      </div>
    </div>
  );
};

export default FloatingButton;
