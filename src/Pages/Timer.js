import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../styles/Timer.css"; 
import Header from '../components/header/Header.js';
import Footer from "../components/footer/Footer.js";


function Timer() {
  const [time, setTime] = useState(3000);
  const [percent, setPercent] = useState(0);
  const [mode, setMode] = useState("reading");
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  const [bookmarks, setBookmarks] = useState([]);
  const [selectedBook, setSelectedBook] = useState("");
  const [selectedBookImage, setSelectedBookImage] = useState("");
  const [record, setRecord] = useState("");

  useEffect(() => {
    const savedBookmarks = JSON.parse(localStorage.getItem("bookmarks")) || [];
    setBookmarks(savedBookmarks);

    const queryParams = new URLSearchParams(location.search);
    const bookIdFromURL = queryParams.get("bookId");

    if (bookIdFromURL) {
      setSelectedBook(bookIdFromURL);
    } else {
      setSelectedBook(""); // 🔹 책이 없을 경우 선택되지 않도록 빈 값 유지
    }
    
  }, [location]);

  useEffect(() => {
    const selectedBookData = bookmarks.find((book) => book.id === selectedBook);
    setSelectedBookImage(selectedBookData?.volumeInfo.imageLinks?.thumbnail || "https://via.placeholder.com/150");
  }, [selectedBook, bookmarks]);

  useEffect(() => {
    if (selectedBook && time > 0 && !isPaused) { // 🔹 selectedBook이 있을 때만 실행
      intervalRef.current = setInterval(() => {
        setTime((prevTime) => {
          if (prevTime > 0) {
            const progressValue = ((3000 - prevTime) / 3000) * 100;
            setPercent(progressValue);
            return prevTime - 1;
          } else {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
            if (mode === "reading") {
              setMode("break");
              setTime(600);
            } else {
              setMode("reading");
              setTime(3000);
            }
            return 0;
          }
        });
      }, 1000);
    }
  
    return () => clearInterval(intervalRef.current);
  }, [selectedBook, time, isPaused, mode]); // 🔹 selectedBook이 변경될 때마다 실행
  



  const saveReadingTime = (bookId, addedTime) => {
    if (!bookId) return;
    const currentReadingTime = JSON.parse(localStorage.getItem(`readingTime_${bookId}`)) || 0;
    const newReadingTime = currentReadingTime + addedTime;
    localStorage.setItem(`readingTime_${bookId}`, JSON.stringify(newReadingTime));
  };

  const saveRecordAndComplete = () => {
    if (!selectedBook || record.trim() === "") return;
  
    const existingRecords = JSON.parse(localStorage.getItem(`records_${selectedBook}`)) || [];
    const newRecords = [...existingRecords, record];
    localStorage.setItem(`records_${selectedBook}`, JSON.stringify(newRecords));
  
    saveReadingTime(selectedBook, 3000); 
    alert("독서 기록이 저장되었습니다!"); 
  
    setRecord(""); 
  };
  
  const startTimer = () => {
    setIsPaused(false);
  };

  const stopTimer = () => {
    setIsPaused(true);
  };

  useEffect(() => {
    if (selectedBook) {
      setTime(3000); // 새 책 선택 시 25분 타이머로 초기화
      setPercent(0);  // 진행률 초기화
      setIsPaused(false); // 자동으로 타이머 시작
    }
  }, [selectedBook]);
  

  const getBookmarkedUserCount = () => {
    const allBookmarks = JSON.parse(localStorage.getItem("allUsersBookmarks")) || []; // 전체 사용자 북마크 데이터 가져오기
    return allBookmarks.filter(book => book.id === selectedBook).length; // 해당 책을 북마크한 사용자 수 계산
  };

  const [userCount, setUserCount] = useState(0);

useEffect(() => {
  if (selectedBook) {
    setUserCount(getBookmarkedUserCount());
  }
}, [selectedBook]);

  
  return (
    <div>
    <Header/>
    <div className="timer-container">
      <div className="reading-count">
      <span style={{ color: "#ADCA6C" }}>●</span> 현재 <span className="reading-count-number">{userCount}</span>명이 이 책을 같이 읽고 있어요 !
      </div>

      <div className="timer-layout">
        <div className="timer-wrapper">
        <svg className="timer-svg" width="300" height="300" viewBox="0 0 200 200">
          <circle cx="100" cy="100" r="90" className="timer-circle-bg" />
          <circle
            cx="100"
            cy="100"
            r="90"
            className="timer-circle-progress"
            style={{ strokeDashoffset: 565 - (565 * percent / 100) }}
          />
         
        </svg>
          <div className="centerCircle">
            {Math.floor(time / 60)}:{String(time % 60).padStart(2, "0")}
          </div>
        </div>

        <div className="book-selection">
        <select className="book-dropdown" value={selectedBook || ""} onChange={(e) => setSelectedBook(e.target.value)}>
  <option value="" disabled hidden>Choose the Book Title</option>
  {bookmarks.map((book) => (
    <option key={book.id} value={book.id}>{book.volumeInfo.title}</option>
  ))}
</select>

          {selectedBook && <img src={selectedBookImage} alt="책 표지" className="book-image" />}
        </div>
      </div>

      <div className="timer-buttons-container">
  <div className="top-buttons">
    <button className="reset-button" onClick={() => setTime(3000)}>
      초기화
    </button>
    
    <button className="pause-button" onClick={stopTimer}>
      일시정지
    </button>
  </div>

  <button className="start-button" onClick={startTimer}>
    시작하기
  </button>
</div>




<div className="record-section">
  <div className="recording">✏️ 책을 읽으면서 든 생각들을 기록으로 남겨 보세요!</div>

  <div className="record-container">
    <textarea
      className="record-input"
      value={record}
      onChange={(e) => setRecord(e.target.value)}
      placeholder="기억에 남는 문장이 있나요?"
    />
    <button className="save-record-button" onClick={saveRecordAndComplete}>
      등록하기
    </button>
  </div>
</div>


    </div>
    <Footer/>
    </div>
  );
}

export default Timer;
