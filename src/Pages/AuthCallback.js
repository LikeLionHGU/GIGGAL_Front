import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const parsedHash = new URLSearchParams(window.location.hash.substring(1));
    const idToken = parsedHash.get("id_token");

    if (idToken) {
      // 백엔드로 토큰 전송
      // fetch("http://localhost:8080/api/auth/google", {  // 이 부분에서 백엔드는 /api/auth/google로 했는데, /api/oauth/google로 되어 있었음.
      fetch("https://janghong.asia/api/auth/google", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({ credential: idToken }).toString(),   // 이 부분에서 받아오는 형식이 잘못되었었음.
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            localStorage.setItem("token", data.token); // 토큰 저장
            navigate("/"); // 홈 화면으로 이동
          } else {
            console.error("Login failed:", data.message);
          }
        })
        .catch((error) => console.error("Error:", error));
    }
  }, [navigate]);

  return (
    <div className="flex justify-center items-center h-screen">
      <p>로그인 완료</p>
    </div>
  );
};

export default AuthCallback;
