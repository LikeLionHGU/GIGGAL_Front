import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const processLogin = async () => {
      try {
        const parsedHash = new URLSearchParams(window.location.hash.substring(1));
        const idToken = parsedHash.get("id_token");

        if (idToken) {
          const response = await axios.post("https://janghong.asia/api/auth/google", 
            new URLSearchParams({ credential: idToken }).toString(), 
            { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
          );

          if (response.data.success) {
            localStorage.setItem("token", response.data.token); // 토큰 저장
            navigate("/home"); // 홈 화면으로 이동
          } else {
            console.error("Login failed:", response.data.message);
          }
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };

    processLogin();
  }, [navigate]);

  return (
    <div className="flex justify-center items-center h-screen">
      <p>로그인 완료</p>
    </div>
  );
};

export default AuthCallback;
