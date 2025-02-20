import React from "react";
import "../Pages/Modal.css"; // 스타일 파일을 별도로 만들어서 사용할 수 있습니다.

const Modal = ({ onClose, children }) => {
  return (
    <div className="modal">
      <div className="modal-content">
        {children}
        <button className="close-btn" onClick={onClose}>닫기</button>
      </div>
    </div>
  );
};

export default Modal;
