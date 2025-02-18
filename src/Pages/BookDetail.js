import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import '../styles/BookDetail.css';
import HomeHeader from '../components/header/Headers.js';
import back from "../img/back.png";
import dash from "../img/dash.png";
import goto from "../img/edong.png";
import mylist from "../img/mylist.png";
import readingbtn from '../img/readingbtn.png';  // '../img/'로 경로를 수정
import Footer from '../components/footer/Footer.js';

const BookDetail = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const bookTitle = params.get("bookTitle");
  const bookPublisher = params.get("bookPublisher");

  const bookTime = params.get("bookTime") || "시간 없음";


  const [book, setBook] = useState(null);  // 선택된 책 정보
  const [records, setRecords] = useState([]);  // 독서 기록

  useEffect(() => {
    // 구글 북스 API 호출
    const fetchBookDetails = async () => {
      const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=intitle:${bookTitle}+inpublisher:${bookPublisher}&key=AIzaSyCOhxzEmFNG0E9GCrAAYeSQ8Q2NYrjC-b0`);
      const data = await response.json();
      const bookData = data.items?.[0]; // 첫 번째 결과 가져오기
      if (bookData) {
        setBook(bookData);
      }
    };
    fetchBookDetails();
    // 로컬스토리지에서 독서 기록 불러오기
    const savedRecords = JSON.parse(localStorage.getItem(`records_${bookTitle}`)) || [];
    setRecords(savedRecords);
  }, [bookTitle, bookPublisher]);

  const getDescription = (description) => {
    if (description && description.length > 200) {
      return description.slice(0, 200) + "...";
    }
    return description || "설명 정보 없음";
  };

  const goToHome = () => {
    navigate("/Home");  // 수정된 경로: "/"
  };

  return (
    <div>
      <HomeHeader />
      
      <div className="back-container">
        <img className="backbtn" src={back} alt="back" onClick={goToHome} />
      </div>
      <img className="goto" src={goto} alt="dash" onClick={goToHome} />

      <div className="dash-container">
        <img className="dash" src={dash} alt="dash" />
        {book && (
          <div>
            <img
              src={book.volumeInfo.imageLinks?.thumbnail}
              alt={book.volumeInfo.title}
              className="bookthumbnail"
            />
            <h2 className="book-title">{book.volumeInfo.title}</h2>
            <p className="text">
              {book.volumeInfo.authors?.join(", ") || "정보 없음"}{" "}
              {book.volumeInfo.pageCount || "정보 없음"}{"p "}
              {book.volumeInfo.publishedDate || "정보 없음"}
            </p>
            <p className="description">{getDescription(book.volumeInfo.description)}</p>
            <img className="rbtn" src={readingbtn} alt="readingbtn" onClick={() => navigate(`/timer?bookId=${book.id}`)} />
            <div className="totaltime">{decodeURIComponent(bookTime)}</div>
          </div>
        )}
      </div>

      <div className="mylist-container">
        <img className="mylist" src={mylist} alt="dash" />
      </div>
      {book && (
        <div>
          <div className="memo-container">
            {records.length > 0 ? (
              records.map((entry, index) => (
                <textarea key={index} className="memocon" value={entry} readOnly />
              ))
            ) : (
              <p>메모가 없습니다.</p>
            )}
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
};

export default BookDetail;
