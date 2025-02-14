import main from "../img/mainlanding.png";
import login from "../img/Login.png"; 
import login2 from "../img/Login2.png";
import Footer from "../components/footer/Footer.js";

// 🔹 환경변수에서 Google OAuth 정보 가져오기
const CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID;
const REDIRECT_URI = process.env.REACT_APP_REDIRECT_URI;

function Main() {
    // 🔹 Google 로그인 URL 설정
    const handleGoogleLogin = () => {
        const googleAuthUrl = 
            "https://accounts.google.com/o/oauth2/auth?" +
            `client_id=${CLIENT_ID}&` +
            `redirect_uri=${REDIRECT_URI}&` +
            "response_type=id_token&" +
            "scope=https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile";

        window.location.href = googleAuthUrl; // 🔹 구글 로그인 페이지로 이동
    };

    return (
        <div style={{ position: "relative", width: "1520px", height: "auto" }}>  
            <img src={main} alt="Main" style={{ width: "100%", height: "auto" }} />

            {/* 🔹 login.png 클릭 시 Google 로그인 실행 */}
            <img 
                src={login} 
                alt="Login"
                onClick={handleGoogleLogin} // 🔹 클릭 시 구글 로그인 실행
                style={{
                    position: "absolute", 
                    top: "2.3%", 
                    left: "88%", 
                    transform: "translate(-50%, -50%)", 
                    width: "200px", 
                    height: "auto",
                    cursor: "pointer" 
                }} 
            />

            {/* 🔹 login2.png 클릭 시에도 Google 로그인 실행 */}
            <img 
                src={login2} 
                alt="Login2"
                onClick={handleGoogleLogin} // 🔹 클릭 시 구글 로그인 실행 (변경됨!)
                style={{
                    position: "absolute", 
                    top: "14%", 
                    left: "50%", 
                    transform: "translate(-50%, -50%)", 
                    width: "280px", 
                    height: "auto",
                    cursor: "pointer" 
                }} 
            />

            <Footer />
        </div>
    );
}

export default Main;
