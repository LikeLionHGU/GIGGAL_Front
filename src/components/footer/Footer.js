import React from 'react';
import Bookgie from "../../img/Bookgie.png";
import SNS from "../../img/sns.png";  
import './Footer.css';


const Footer = () => {
    return (
   
      <div className="footer">
        <div className="container">
        <img src={Bookgie} alt="부기 로고" style={{ height: "50px" }} />
        <div className="footert">책 찾기부터 몰입까지 이어주는 나의 책읽기 도우미<br/>BOOGIE ON AND ON !</div>
        </div>
        <div className="copy">
        Copyright © 2025 Ease Crop. Created by Bookgie
        </div>
        <img src={SNS} alt="부기 로고" className='sns'/>

      </div>
   

    );
  };
  
  export default Footer;