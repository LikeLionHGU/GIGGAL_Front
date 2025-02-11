import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/ui/button";
import styles from "../styles/Home.module.css";
import HomeHeader from '../components/header/HomeHeader.js';

const Home = () => {
  const [bookmarks, setBookmarks] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);
  const [Alertopen, setAlertopen] = useState(false);
  const [isBookRead, setIsBookRead] = useState({});

  const navigate = useNavigate();
  const goToTimer = () => {
    navigate("/Timer");  // 수정된 경로: "/"
  };
  const goToSearch = () => {
    navigate("/Search");  // 수정된 경로: "/"
  };

  const handleButtonClick = (book) => {
    // 책을 이미 읽은 상태일 때만 모달을 띄우도록 설정
    if (isBookRead[book.id]) {
      setSelectedBook(book);  // 선택된 책 설정
      setAlertopen(true);  // 모달을 열기
    } else {
      setIsBookRead((prevState) => ({
        ...prevState,
        [book.id]: true,  // 책을 읽었다고 상태 변경
      }));
    }
  };

  const closeAlert = () => {
    setAlertopen(false);
    setSelectedBook(null);
  };

  useEffect(() => {
    const savedBookmarks = JSON.parse(localStorage.getItem("bookmarks")) || [];
    setBookmarks(savedBookmarks);
  }, []);

  // 책의 누적 독서 시간 가져오기
  const getReadingTime = (bookId) => {
    return JSON.parse(localStorage.getItem(`readingTime_${bookId}`)) || 0;
  };

  return (
    <div>
      <HomeHeader/>
      <h1>My book</h1>
      <Button onClick={goToSearch}>+</Button>

      <div className={styles.books}>
        {bookmarks.map((book, index) => {
          const readingTime = getReadingTime(book.id);

          return (
       
            <div key={index} className="p-4 border border-gray-300 rounded-lg shadow-lg relative">
              <div className="absolute top-2 right-2 bg-gray-800 text-white text-sm px-3 py-1 rounded-md">
                누적 시간: {Math.floor(readingTime / 60)}분
              </div>

              <img
                src={book.volumeInfo.imageLinks?.thumbnail}
                alt={book.volumeInfo.title}
                className="w-full h-60 object-cover rounded-lg"
              />

              <div>
              <button
                className={styles.complete}
                onClick={() => handleButtonClick(book)}
                style={{ backgroundColor: isBookRead[book.id] ? "red" : "grey" }}
              >
                완독 버튼
              </button>
                <h2 className="text-lg font-semibold mt-2">{book.volumeInfo.title}</h2>
                <div className="mt-3 flex justify-between">
                  <Button
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                    onClick={() => navigate(`/timer?bookId=${book.id}`)}
                  >
                    책 읽기
                  </Button>

                  <Button
                    className="bg-green-500 text-white px-4 py-2 rounded"
                    onClick={() => navigate(`/bookdetail?bookId=${book.id}`)}
                  >
                    내 기록
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
     
      {/* 모달 */}
      {Alertopen && (
        <div className={styles.modalbg}>
          <div className={styles.modal}>
            <h2>완독 확인</h2>
            <p>{selectedBook?.volumeInfo.title}을(를) 다시 읽을겁니까?</p>
            <Button onClick={goToTimer}>재독서</Button>
            <button onClick={closeAlert}>취소</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
