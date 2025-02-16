import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const parsedHash = new URLSearchParams(window.location.hash.substring(1));
    const idToken = parsedHash.get("id_token");

    if (idToken) {
      fetch("https://janghong.asia/api/auth/google/session", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        credentials: "include",
        body: new URLSearchParams({ credential: idToken }).toString(),
      })
        .then((res) => res.json())
        .then((data) => {
          console.log("Backend response:", data); // 백엔드 응답 확인

          if (data.userEmail != null) {
            // 백엔드에서 이메일을 가져와 로컬스토리지에 저장
            if (data.userEmail) {
              localStorage.setItem("userEmail", data.userEmail);
              console.log("User email saved to localStorage:", data.userEmail); // 이메일 저장 확인
            } else {
              console.error("Email not found in response.");
            }

            navigate("/search"); // 홈 화면으로 이동
          } else {
            console.error("Login failed:", data.message);
          }
        })
        .catch((error) => console.error("Error:", error));
    }
  }, [navigate]);

  return (
    <div className="flex justify-center items-center h-screen">
      <p>로그인 중...</p>
    </div>
  );
};

export default AuthCallback;