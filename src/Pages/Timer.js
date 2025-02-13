import { useState, useEffect, useRef, useCallback } from "react";
import { useLocation } from "react-router-dom";
import "../styles/Timer.css";
import Header from "../components/header/Header.js";
import Footer from "../components/footer/Footer.js";

function Timer() {
  const [time, setTime] = useState(3000);
  const [percent, setPercent] = useState(0);
  const [mode, setMode] = useState("reading");
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef(null);
  const location = useLocation();
  const resetIcon = require("../img/reset.png");
  const startIcon = require("../img/start.png");
  const stopIcon = require("../img/stop.png");
 


  const [bookmarks, setBookmarks] = useState([]);
  const [selectedBook, setSelectedBook] = useState("");
 
  const [record, setRecord] = useState("");
  const [userCount, setUserCount] = useState(0);

  const setReadingTime = (readingTime, breakTime) => {
    setTime(readingTime);
    setMode("reading");
    setIsPaused(false);
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

    if (bookIdFromURL) {
      setSelectedBook(bookIdFromURL);
    } else {
      setSelectedBook("");
    }
  }, [location]);

  useEffect(() => {
   
   
  }, [selectedBook, bookmarks]);

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
    if (!selectedBook || record.trim() === "") return;
    const existingRecords = JSON.parse(localStorage.getItem(`records_${selectedBook}`)) || [];
    localStorage.setItem(`records_${selectedBook}`, JSON.stringify([...existingRecords, record]));
    saveReadingTime(selectedBook, 3000);
    alert("독서 기록이 저장되었습니다!");
    setRecord("");
  };

  const startTimer = () => setIsPaused(false);
  const stopTimer = () => setIsPaused(true);

  useEffect(() => {
    if (selectedBook) {
      setTime(3000);
      setPercent(0);
      setIsPaused(false);
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
    <div>
      <Header />
      <div className="timer-container">
        <div className="reading-count">
          <span style={{ color: "#ADCA6C" }}>●</span> 현재 <span className="reading-count-number">{userCount}</span>
          명이 이 책을 같이 읽고 있어요 !
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
                style={{ strokeDashoffset: 565 - (565 * percent) / 100 }}
              />
            </svg>
            <div className="centerCircle">{Math.floor(time / 60)}:{String(time % 60).padStart(2, "0")}
            <div className="time-selection-buttons">
            <button onClick={() => setReadingTime(900, 180)}>15분</button>
              <button onClick={() => setReadingTime(1800, 600)}>30분</button>
              <button onClick={() => setReadingTime(3000, 900)}>50분</button>
            </div>
            </div>
          </div>
          <div className="book-selection">
            <select className="book-dropdown" value={selectedBook || ""} onChange={(e) => setSelectedBook(e.target.value)}>
              <option value="" disabled hidden>Choose the Book Title</option>
              {bookmarks.map((book) => (
                <option key={book.id} value={book.id}>{book.volumeInfo.title}</option>
              ))}
            </select>
           
          </div>
        </div>

        <div className="timer-buttons-container">
          <img src={resetIcon} alt="Reset"  onClick={() => setTime(3000)}></img>
          <img src={startIcon} alt="Start" onClick={startTimer} ></img>
          <img src={stopIcon} alt="Stop" onClick={stopTimer}></img>
        </div>

        <div className="record-section">
  <div className="record-container">
    <textarea
      className="record-input"
      value={record}
      onChange={(e) => setRecord(e.target.value)}
      placeholder="책을 읽으면서 든 생각들을 기록으로 남겨 보세요 !"
    />
    <img
      
      alt="Start"
      className="record-icon"
      onClick={saveRecordAndComplete} 
    />
  </div>
</div>


      </div>
      <Footer />
    </div>
  );
}

export default Timer;
