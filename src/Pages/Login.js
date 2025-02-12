import React from "react";


// 이 부분에서 client_id가 FE분 걸로 되어 있던 것 같음. (네(세혁) 걸로 안들어가져 있었음)

const CLIENT_ID = process.env.REACT_APP_CLIENT_ID;
const REDIRECT_URI = process.env.REACT_APP_REDIRECT_URI;
 // 개발 환경용


const Login = () => {
  const handleLogin = () => {
    const googleAuthUrl = 
      "https://accounts.google.com/o/oauth2/auth?" +
      `client_id=${CLIENT_ID}&` +
      `redirect_uri=${REDIRECT_URI}&` +
      "response_type=id_token&" +
      "scope=https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile";

    window.location.href = googleAuthUrl; // 구글 로그인 페이지로 이동
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <button 
        onClick={handleLogin} 
        className="bg-blue-500 text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-blue-600"
      >
        구글 로그인
      </button>
    </div>
  );
};

export default Login;
