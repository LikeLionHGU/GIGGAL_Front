import { useState, useEffect, useRef, useCallback } from "react";
import { useLocation } from "react-router-dom";
import "../styles/Timer.css";
import HomeHeader from "../components/header/HomeHeader.js";
import Footer from "../components/footer/Footer.js";
import TimerBackground from "../img/timer.png"; 
import hr from '../img/hr.png';  
import styles from "../styles/Home.module.css";

function Timer() {
  const [time, setTime] = useState(3000);
  const [percent, setPercent] = useState(0);
  const [mode, setMode] = useState("reading");
  const [isPaused, setIsPaused] = useState(true);
  const intervalRef = useRef(null);
  const location = useLocation();
  const resetIcon = require("../img/reset.png");
  const startIcon = require("../img/start.png");
  const stopIcon = require("../img/stop.png");
  const recordIcon = require("../img/record.png");
  const recordingIcon = require("../img/recording.png");
 


  const [bookmarks, setBookmarks] = useState([]);
  const [selectedBook, setSelectedBook] = useState("");
 
  const [record, setRecord] = useState("");
  const [userCount, setUserCount] = useState(0);

  const [showModal, setShowModal] = useState(false);
  const [selectedTime, setSelectedTime] = useState(""); // 선택한 시간을 저장하는 상태 추가

  const [showAlertModal, setShowAlertModal] = useState(false); // 책 선택 유도 모달 상태 추가



  const setReadingTime = (readingTime, breakTime) => {
    clearInterval(intervalRef.current); // 기존 인터벌 삭제

    setSelectedTime(`${readingTime / 60}분 / ${breakTime / 60}분`);

    setTime(readingTime);
    setMode("reading");
    setIsPaused(true);

    intervalRef.current = setInterval(() => {
      setTime((prevTime) => {
        if (prevTime > 0) {
          setPercent(((readingTime - prevTime) / readingTime) * 100);
          return prevTime - 1;
        } else {
          clearInterval(intervalRef.current);
          setMode("break");
          setTime(breakTime);
          return breakTime;
        }
      });
    }, 1000);
  };


  useEffect(() => {
    const savedBookmarks = JSON.parse(localStorage.getItem("bookmarks")) || [];
    setBookmarks(savedBookmarks);

    const queryParams = new URLSearchParams(location.search);
  const bookIdFromURL = queryParams.get("bookId");
  const bookTitleFromURL = queryParams.get("bookTitle");

  if (bookIdFromURL) {
    setSelectedBook(bookIdFromURL);
    // 책이 북마크 목록에 없으면 추가
    setBookmarks((prevBookmarks) => {
      const isAlreadyBookmarked = prevBookmarks.some(book => book.id === bookIdFromURL);
      if (!isAlreadyBookmarked) {
        return [...prevBookmarks, { id: bookIdFromURL, volumeInfo: { title: bookTitleFromURL } }];
      }
      return prevBookmarks;
    });
  }
   
  }, [location]);

  useEffect(() => {
    if (selectedBook && time > 0 && !isPaused) {
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
  }, [selectedBook, time, isPaused, mode]);

  const saveReadingTime = (bookId, addedTime) => {
    if (!bookId) return;
    const currentReadingTime = JSON.parse(localStorage.getItem(`readingTime_${bookId}`)) || 0;
    localStorage.setItem(`readingTime_${bookId}`, JSON.stringify(currentReadingTime + addedTime));
  };

  const saveRecordAndComplete = () => {
    if (!selectedBook) return; // 책이 선택되지 않으면 종료
    
  
    const existingRecords = JSON.parse(localStorage.getItem(`records_${selectedBook}`)) || [];
    localStorage.setItem(`records_${selectedBook}`, JSON.stringify([...existingRecords, record]));
    saveReadingTime(selectedBook, 3000);
    
    setShowModal(true);
    setRecord("");
    
  };
  
  
  
  

  const startTimer = () => {
    if (!selectedBook) {
      setShowAlertModal(true); // 🔹 책이 선택되지 않으면 모달 표시
      return;
    }
    if (time <= 0 || !isPaused) return;
    setIsPaused(false);
  };
  const stopTimer = () => setIsPaused(true);

  useEffect(() => {
    if (selectedBook) {
      setTime(3000);
      setPercent(0);
      setIsPaused(true);
    }
  }, [selectedBook]);

  const getBookmarkedUserCount = useCallback(() => {
    const allBookmarks = JSON.parse(localStorage.getItem("allUsersBookmarks")) || [];
    return allBookmarks.filter((book) => book.id === selectedBook).length;
  }, [selectedBook]);

  useEffect(() => {
    if (selectedBook) {
      setUserCount(getBookmarkedUserCount());
    }
  }, [selectedBook, getBookmarkedUserCount]);

  return (
    <div className="whole">
       <HomeHeader/>
       <img src={hr} alt="hr" className={styles.hr}/>
      <div className="timer-container">
  <div className="reading-count">
    <span style={{ color: "#ADCA6C" }}>●</span> 현재 {userCount}명이 이 책을 같이 읽고 있어요 !
  </div>

  <div className="timer-layout">
    {/* 타이머 영역 */}
    <div className="timer-wrapper">
    <img src={TimerBackground} alt="Timer Background" className="timer-background" />
    <svg className="timer-svg" width="300" height="300" viewBox="0 0 200 200">
  <circle cx="100" cy="100" r="90" className="timer-circle-bg" />
  <circle
    cx="100"
    cy="100"
    r="90"
    className="timer-circle-progress"
    style={{
      strokeDasharray: 565.48, // 🔹 원 둘레 (2 * π * r)
      strokeDashoffset: 565.48 * (1 - percent / 100), // 🔹 percent 값 반영
    }}
  />
</svg>


      <div className="centerCircle">
      <div style={{ fontSize: "18px", color: "gray" }}><br/>{selectedTime}</div>
        {Math.floor(time / 60)}:{String(time % 60).padStart(2, "0")}
        <div className="time-selection-buttons">
          <button onClick={() => setReadingTime(900, 180)}>15분</button>
          <button onClick={() => setReadingTime(1800, 600)}>30분</button>
          <button onClick={() => setReadingTime(3000, 900)}>50분</button>
        </div>
      </div>
    </div>

    {/* 책 선택 */}
    <div className="book-selection">
        <select 
          className="book-dropdown" 
          value={selectedBook}
          onChange={(e) => setSelectedBook(e.target.value)}
        >
          <option value="" disabled hidden>Choose the Book Title</option>
          {bookmarks.map((book) => (
            <option key={book.id} value={book.id}>
              {book.volumeInfo.title}
            </option>
          ))}
        </select>
      </div>
  </div>

  {/* 타이머 컨트롤 버튼 */}
  <div className="timer-buttons-container">
    <img src={resetIcon} alt="Reset" onClick={() => setTime(3000)} />
    <img src={startIcon} alt="Start" onClick={startTimer} />
    <img src={stopIcon} alt="Stop" onClick={stopTimer} />
  </div>

  {/* 기록하기 섹션 */}
  <div className="record-section">
    <div className="recording"><img src={recordingIcon} alt="Recording"  className="recording-text" ></img></div>
    <div className="record-container">
      <textarea
        className="record-input"
        value={record}
        onChange={(e) => setRecord(e.target.value)}
        placeholder="책을 읽으면서 든 생각들을 기록으로 남겨 보세요!"
      />
      <img src={recordIcon} alt="Save" className="record-icon" onClick={saveRecordAndComplete} />
    </div>
    <button className="complete-reading-btn" onClick={saveRecordAndComplete}>
      <div className="resultbtn">
      독서 완료하기
      </div>
      </button>
  </div>
</div>
{showModal && (
  <div className="modal-overlay" onClick={() => setShowModal(false)}>
    <div className="modal-content" onClick={(event) => event.stopPropagation()}>
      <h2>독서를 완료하셨습니다!</h2>
      <p>방금 읽은 책에 대해서 어떻게 생각하시나요?</p>

      <button>📖 술술 읽혀요</button>
      <button>🧐 읽을만해요</button>
      <button>🔍 관련 지식이 필요해요</button>

      <button className="modal-close-btn" onClick={() => setShowModal(false)}>보내기</button>
    </div>
  </div>
)}

{showAlertModal && (
  <div className="modal-alert-overlay" onClick={() => setShowAlertModal(false)}>
    <div className="modal-alert-content" onClick={(event) => event.stopPropagation()}>
      <h2>독서를 시작하기 전에 책을 선택해주세요!</h2>
      <button className="modal-alert-button" onClick={() => setShowAlertModal(false)}>확인</button>
    </div>
  </div>
)}



      <Footer />
    </div>
  );
}

export default Timer;