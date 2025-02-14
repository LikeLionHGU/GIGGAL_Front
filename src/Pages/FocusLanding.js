import mainn from "../img/timerlanding.png";
import HomeHeader from '../components/header/HomeHeader.js';



function FocusLanding() {
    

    return (
        <div>
        <HomeHeader/>
        <div style={{ position: "relative", width: "1520px", height: "auto" }}>  
            <img src={mainn} alt="Main" style={{ width: "100%", height: "auto" }} />


        </div>
        </div>
    );
}

export default FocusLanding;
