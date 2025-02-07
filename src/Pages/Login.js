import React from "react";

const CLIENT_ID = "10952883782-tfnggg0q9gns90bihel2caaioshjunq6.apps.googleusercontent.com";
const REDIRECT_URI = "http://localhost:3000/auth/callback";  // 개발 환경용

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
