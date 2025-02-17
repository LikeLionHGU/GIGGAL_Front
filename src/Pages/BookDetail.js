import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import '../styles/BookDetail.css';
import HomeHeader from '../components/header/Headers.js';
import back from "../img/back.png";
import dash from "../img/dash.png";
import goto from "../img/edong.png";
import mylist from "../img/mylist.png";
import readingbtn from '../img/readingbtn.png';
import Footer from '../components/footer/Footer.js';

const API_BASE_URL = "https://janghong.asia/memo"; // 📌 백엔드 API 기본 URL

const BookDetail = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const googleBookId = queryParams.get("bookId"); // 📌 Google Books ID
  const [book, setBook] = useState(null);
  const [records, setRecords] = useState([]); // 📌 API에서 가져온 메모 데이터 저장
  const [loading, setLoading] = useState(true); // 📌 로딩 상태 추가

  useEffect(() => {
    const userEmail = localStorage.getItem("userEmail") || "";
    if (!googleBookId || !userEmail) {
      console.error("📌 Google Books ID 또는 유저 이메일이 없습니다.");
      setLoading(false);
      return;
    }

    // 📌 1️⃣ Google Books API에서 책 정보 가져오기
    const fetchBookDetails = async () => {
      try {
        const response = await axios.get(`https://www.googleapis.com/books/v1/volumes/${googleBookId}`);
        if (response.data) {
          setBook(response.data);
        }
      } catch (error) {
        console.error("📌 책 정보를 가져오는 데 실패했습니다:", error);
      }
    };

    // 📌 2️⃣ 백엔드에서 사용자의 메모 데이터 가져오기
    const fetchUserMemos = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/list/${googleBookId}?userEmail=${encodeURIComponent(userEmail)}`);
        console.log("📌 메모 조회 성공:", response.data);
        setRecords(response.data || []);
      } catch (error) {
        console.error("❌ 메모를 불러오는 데 실패했습니다:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookDetails();
    fetchUserMemos();
  }, [googleBookId]);

  const getDescription = (description) => {
    return description && description.length > 200 ? description.slice(0, 200) + "..." : description || "설명 정보 없음";
  };

  const goToHome = () => {
    navigate("/Home");
  };

  return (
    <div>
      <HomeHeader />
      <div className="back-container">
        <img className="backbtn" src={back} alt="back" onClick={goToHome} />
      </div>
      <img className="goto" src={goto} alt="goto" onClick={goToHome} />

      <div className="dash-container">
        <img className="dash" src={dash} alt="dash" />
        {book && (
          <div>
            <img
              src={book.volumeInfo?.imageLinks?.thumbnail}
              alt={book.volumeInfo?.title}
              className="book-thumbnail"
            />
            <h2 className="book-title">{book.volumeInfo?.title}</h2>
            <p className="text">
              {book.volumeInfo?.authors?.join(", ") || "정보 없음"}{" "}
              {book.volumeInfo?.pageCount || "정보 없음"}p{" "}
              {book.volumeInfo?.publishedDate || "정보 없음"}
            </p>
            <p className="description">{getDescription(book.volumeInfo?.description)}</p>
            <img
              className="rbtn"
              src={readingbtn}
              alt="readingbtn"
              onClick={() => navigate(`/timer?bookId=${googleBookId}`)}
            />
          </div>
        )}
      </div>

      <div className="mylist-container">
        <img className="mylist" src={mylist} alt="mylist" />
      </div>

      <div className="memo-container">
        <h3>📌 내 메모</h3>
        {loading ? (
          <p>⏳ 메모를 불러오는 중...</p>
        ) : records.length > 0 ? (
          records.map((entry, index) => (
            <div key={index} className="memo-entry">
              <p className="memo-content">✏️ {entry.content}</p>
              <p className="memo-date">📅 {entry.date}</p>
            </div>
          ))
        ) : (
          <p>📝 저장된 메모가 없습니다.</p>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default BookDetail;
