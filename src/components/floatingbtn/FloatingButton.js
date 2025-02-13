import React from "react";
import { useNavigate } from "react-router-dom";  // useNavigate 훅을 추가
import fbtn from '../../img/floatingbtn.png';  // 경로 수정: components/floating -> img
import "./FloatingButton.css";  // CSS 파일

const FloatingButton = () => {
  const navigate = useNavigate();  // navigate 훅을 사용하여 페이지 이동

  const goToSearch = () => {
    navigate("/Timer");  // "/Timer" 경로로 이동
  };

  return (
    <img
      src={fbtn}
      alt="floating button"
      className="floating-btn"
      onClick={goToSearch}  // 클릭 시 goToSearch 함수 호출
    />
  );
};

export default FloatingButton;
