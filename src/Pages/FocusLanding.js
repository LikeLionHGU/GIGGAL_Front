import { useNavigate } from "react-router-dom";
import mainn from "../img/timerlanding.png";
import HomeHeader from '../components/header/HomeHeader.js';
import goreading from "../img/goreading.png";


function FocusLanding() {
    const navigate = useNavigate();  // useNavigate 훅 사용

    return (
        <div>
            <HomeHeader />
            <div style={{ position: "relative", width: "1380px", height: "auto" }}>
                <img src={mainn} alt="Main" style={{ width: "100vw", height: "auto" }} />
                
                <img 
    src={goreading} 
    alt="Login"
    onClick={() => navigate("/timer")} 
    className="go"
/>

            </div>
        </div>
    );
}

export default FocusLanding;
