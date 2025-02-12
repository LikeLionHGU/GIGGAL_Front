import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios"; 

const AuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAuthData = async () => {
      const parsedHash = new URLSearchParams(window.location.hash.substring(1));
      const idToken = parsedHash.get("id_token");

      if (idToken) {
        try {
          const response = await fetch("https://janghong.asia/api/auth/google", {
            method: "POST",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams({ credential: idToken }).toString(),
          });

          const data = await response.json();

          if (data.success) {
            localStorage.setItem("token", data.token); //  토큰 저장
            navigate("/home"); //  홈 화면으로 이동
          } else {
            console.error("Login failed:", data.message);
          }
        } catch (error) {
          console.error("Error:", error);
        }
      } else {
        try {
          //  세션 종료 요청
          const response = await axios.put("https://janghong.asia/api/auth/user/session/out", {
            username: "", // 서버 요구 사항에 맞게 수정 필요
            password: "",
          });
          console.log("Logout response:", response);
        } catch (error) {
          console.error("Logout error:", error);
        }
      }
    };

    fetchAuthData();
  }, [navigate]);

  return (
    <div className="flex justify-center items-center h-screen">
      <p>로그인 완료</p>
    </div>
  );
};

export default AuthCallback;
