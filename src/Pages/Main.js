import main from "../img/mainlanding.png";
import Footer from "../components/footer/Footer.js";

function Main() {
    return (
        <div>
            <img src={main} alt="Main" style={{ width: "1520px", height: "auto"}}/>
            <Footer/>
        </div>

    );
}

export default Main;

