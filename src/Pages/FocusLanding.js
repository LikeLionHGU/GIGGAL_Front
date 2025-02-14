import { useNavigate } from "react-router-dom";
import mainn from "../img/timerlanding.png";
import HomeHeader from '../components/header/HomeHeader.js';
import goreading from "../img/goreading.png";

function FocusLanding() {
    const navigate = useNavigate();  // useNavigate 훅 사용

    return (
        <div>
            <HomeHeader />
            <div style={{ position: "relative", width: "1520px", height: "auto" }}>
                <img src={mainn} alt="Main" style={{ width: "100%", height: "auto" }} />
                
                <img 
                    src={goreading} 
                    alt="Login"
                    onClick={() => navigate("/timer")}  // 함수 전달
                    style={{
                        position: "absolute", 
                        top: "86.4%", 
                        left: "50%", 
                        transform: "translate(-50%, -50%)", 
                        width: "280px", 
                        height: "auto",
                        cursor: "pointer" 
                    }} 
                />
            </div>
        </div>
    );
}

export default FocusLanding;
