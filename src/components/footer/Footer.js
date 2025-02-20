import React from 'react';
import Bookgie from "../../img/Bookgie.png";
import SNS from "../../img/sns.png";  
import './Footer.css';


const Footer = () => {
    return (
   
      <div className="footer">
        <div className="container">
        <img src={Bookgie} alt="부기 로고" style={{ height: "50px" }} />
        <div className="footert">
  독서 습관 형성해주는 부기와<span style={{ display: "block", height: "10px" }}></span>
  BOOGIE ON AND ON !
</div>

        </div>
        <div className="copy">
        Copyright © 2025 Ease Corp. Created by Bookgie
        </div>
        <img src={SNS} alt="부기 로고" className='sns'/>

      </div>
   

    );
  };
  
  export default Footer;