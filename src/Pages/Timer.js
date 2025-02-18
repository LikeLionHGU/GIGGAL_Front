import { useState, useEffect, useRef} from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Timer.css";
import HomeHeader from "../components/header/HomeHeader.js";
import Footer from "../components/footer/Footer.js";
import TimerBackground from "../img/timer.png"; 
import hr from '../img/hr.png';  
import styles from "../styles/Home.module.css";
import startHover from '../img2/starthover.png';
import startPress from '../img2/startpress.png';
import stopHover from '../img2/stophover.png';
import stopPress from '../img2/stoppress.png';
import axios from "axios"; 

function Timer() {
  const [time, setTime] = useState(3000);
  const [percent, setPercent] = useState(0);
  const [mode, setMode] = useState("reading");
  const [isPaused, setIsPaused] = useState(true);
  const intervalRef = useRef(null);
  const resetIcon = require("../img/reset.png");
  const startIcon = require("../img/start.png");
  const stopIcon = require("../img/stop.png");
  const recordIcon = require("../img/record.png");
  const recordingIcon = require("../img/recording.png");
  const API_BASE_URL = "https://janghong.asia"; 
 


  const [bookmarks, setBookmarks] = useState([]);
  const [selectedBook, setSelectedBook] = useState("");
 
  const [record, setRecord] = useState("");
  const [userCount, setUserCount] = useState(0);

  const [showModal, setShowModal] = useState(false);
  const [selectedTime, setSelectedTime] = useState(""); // 선택한 시간을 저장하는 상태 추가

  const [showAlertModal, setShowAlertModal] = useState(false); // 책 선택 유도 모달 상태 추가

  const [startSrc, setStartSrc] = useState(startIcon);
  const [stopSrc, setStopSrc] = useState(stopIcon);
  const [totalReadingTime, setTotalReadingTime] = useState(3000); // 선택한 총 시간 저장

  const [isRecordSaved, setIsRecordSaved] = useState(false); // 기록 저장 여부 상태 추가
  const [showWarningModal, setShowWarningModal] = useState(false); 

  const [showExitWarning, setShowExitWarning] = useState(false);
  const navigate = useNavigate();

  const [elapsedTime, setElapsedTime] = useState(0); // 흐른 시간 (초 단위 저장)
const startTimeRef = useRef(null); // 시작 시간 저장용

const [selectedDifficulty, setSelectedDifficulty] = useState("");
const [isSubmitting, setIsSubmitting] = useState(false); 

const handleDifficultySelect = async (difficulty) => {
  if (!selectedBook || isSubmitting) return; // 중복 요청 방지
  setSelectedDifficulty(difficulty);
  setIsSubmitting(true); // 요청 시작

  // 📌 선택한 Google Book ID를 백엔드 Book ID로 변환
  const bookData = bookmarks.find((book) => book.googleBookId === selectedBook);
  const bookId = bookData?.bookId; // 📌 백엔드에서 사용하는 bookId 가져오기

  if (!bookId) {
    console.error("📌 해당 Google Book ID에 대한 백엔드 Book ID를 찾을 수 없습니다.");
    setIsSubmitting(false);
    return;
  }

  try {
    const response = await axios.put(`${API_BASE_URL}/book/difficulty/${bookId}`, {
      difficulty: difficulty,
    });

    if (response.status === 200) {
      console.log("📌 난이도 평가 성공:", response.data);
      setTimeout(() => {
        setShowModal(false); // 0.5초 후 모달 닫기
        setSelectedDifficulty(""); // 상태 초기화
        setIsSubmitting(false);
      }, 500);
    }
  } catch (error) {
    console.error("❌ 난이도 평가 실패:", error.response ? error.response.data : error);
    setIsSubmitting(false); // 요청 실패 시 다시 버튼 활성화
  }
};

  useEffect(() => {
    const handleBackButton = (event) => {
      if (!isRecordSaved) {
        event.preventDefault(); 
        setShowExitWarning(true); // 경고 모달 표시
        window.history.pushState(null, "", window.location.href); // 현재 페이지 유지
      }
    };
  
   
    window.history.pushState(null, "", window.location.href);
    window.addEventListener("popstate", handleBackButton);
  
    return () => {
      window.removeEventListener("popstate", handleBackButton);
    };
  }, [isRecordSaved]);
  
  const handleExitConfirm = () => {
    setShowExitWarning(false);
    navigate("/home"); 
  };
  
  const handleExitCancel = () => {
    setShowExitWarning(false);
  };

  const setReadingTime = (readingTime, breakTime) => {
    clearInterval(intervalRef.current); // 기존 인터벌 삭제
  
    setSelectedTime(`${readingTime / 60}분 / ${breakTime / 60}분`);
    setTime(readingTime);
    setTotalReadingTime(readingTime); // 선택한 시간 저장 후 percent 업데이트
    setMode("reading");
    setIsPaused(true);
  
    setTimeout(() => {
      setPercent(0); // totalReadingTime 업데이트 이후 percent 초기화
    }, 10); // 비동기 업데이트를 위한 약간의 지연 시간 추가
  
    intervalRef.current = setInterval(() => {
      setTime((prevTime) => {
        if (prevTime > 0) {
          setPercent(((readingTime - prevTime) / readingTime) * 100); // 🔹 선택한 readingTime을 기준으로 진행률 계산
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
  
  

  const userEmail = (localStorage.getItem("userEmail") || "").trim();// 로컬스토리지에서 유저 이메일 가져오기

// 📌 북마크 리스트 가져올 때 Google Book ID와 백엔드 Book ID를 함께 저장
useEffect(() => {
  const fetchBookmarks = async () => {
    if (!userEmail) {
      console.error("유저 이메일이 없습니다. 북마크 목록을 불러올 수 없습니다.");
      return;
    }

    try {
      const response = await axios.get(
        `${API_BASE_URL}/book/list/now/reading?userEmail=${encodeURIComponent(userEmail)}`
      );

      console.log("📌 백엔드에서 가져온 북마크 리스트:", response.data);

      // 📌 Google Book ID와 백엔드 Book ID를 매핑하여 저장
      setBookmarks(response.data.map(book => ({
        googleBookId: book.googleBookId,
        bookId: book.bookId, // 백엔드 ID 추가
        title: book.title
      })));
    } catch (error) {
      console.error("❌ 북마크 리스트 가져오기 실패:", error.response ? error.response.data : error);
    }
  };

  fetchBookmarks();
}, [userEmail]);




  useEffect(() => {
    if (selectedBook && time > 0 && !isPaused) {
      intervalRef.current = setInterval(() => {
        setTime((prevTime) => {
          if (prevTime > 0) {
            setPercent(((totalReadingTime - prevTime) / totalReadingTime) * 100); // 🔹 저장된 totalReadingTime 기준 진행률 업데이트
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
              setTotalReadingTime(3000);
            }
            return 0;
          }
        });
      }, 1000);
    }
    return () => clearInterval(intervalRef.current);
  }, [selectedBook, time, isPaused, mode, totalReadingTime]); //  totalReadingTime 추가
  
  const saveReadingTime = async (googleBookId, addedTimeInMinutes) => {
    if (!googleBookId || addedTimeInMinutes <= 0) return;
  
    const userEmail = localStorage.getItem("userEmail");
    if (!userEmail) {
      console.error("📌 유저 이메일이 없습니다.");
      return;
    }
  
    // 📌 선택한 Google Book ID를 백엔드 Book ID로 변환
    const bookData = bookmarks.find((book) => book.googleBookId === googleBookId);
    const bookId = bookData?.bookId; // 백엔드에서 사용하는 bookId 가져오기
  
    if (!bookId) {
      console.error("📌 해당 Google Book ID에 대한 백엔드 Book ID를 찾을 수 없습니다.");
      return;
    }
  
    try {
      const response = await axios.put(
        `${API_BASE_URL}/book/reading/time/${bookId}`,
        {
          userEmail: userEmail,
          time: addedTimeInMinutes, // ✅ 분 단위 변환 후 저장
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );
  
      console.log(`📌 ${bookId}의 ${addedTimeInMinutes}분 저장 완료:`, response.data);
    } catch (error) {
      console.error("📌 읽은 시간 저장 실패:", error.response ? error.response.data : error);
    }
  };
  const saveRecordAndComplete = async (isCompletion = false) => {
    if (!selectedBook) return;
  
    if (isCompletion && record.trim() && !isRecordSaved) {
      setShowWarningModal(true);
      return;
    }
  
    await saveReadingTime(selectedBook, elapsedTime); // 흐른 시간 (분) 저장
  
    setRecord("");
    setIsRecordSaved(false);
  
    if (isCompletion) {
      setShowModal(true);
    }
  };
  
  
  
  //메모 저장
  const handleRecordSave = async () => {
    if (!record.trim()) {
      console.error(" 기록이 비어 있어 저장할 수 없습니다.");
      return;
    }
  
    const userEmail = localStorage.getItem("userEmail") || "";
    if (!userEmail || !selectedBook) {
      console.error("유저 이메일 또는 선택한 책(Google Book ID)이 없습니다.");
      return;
    }
  
    const currentDate = new Date().toISOString().split("T")[0]; // 현재 날짜 (YYYY-MM-DD 형식)
  
    const requestData = {
      userEmail: userEmail,
      content: record.trim(),
      date: currentDate //  날짜를 string으로 변환하여 포함
    };
  
    console.log("메모 저장 요청 데이터:", JSON.stringify(requestData, null, 2)); // 데이터 확인용
  
    try {
      // Google Book ID(selectedBook)를 사용하여 API 호출
      const response = await axios.post(`${API_BASE_URL}/memo/add/${selectedBook}`, requestData, {
        headers: {
          "Content-Type": "application/json"
        }
      });
  
      console.log("메모 저장 성공:", response.data);
      setRecord(""); // 저장 후 입력 필드 초기화
    } catch (error) {
      console.error("메모 저장 실패:", error.response ? error.response.data : error);
      if (error.response) {
        console.error(" 백엔드 응답 상태 코드:", error.response.status);
        console.error("백엔드 응답 데이터:", error.response.data);
      }
    }
  };

  
  
  
  
  
  
  

  const startTimer = () => {
    if (!selectedBook) {
      setShowAlertModal(true);
      return;
    }
    if (time <= 0 || !isPaused) return;
  
    startTimeRef.current = Date.now(); //  시작 시간 기록
    setIsPaused(false);
  };
  
  const stopTimer = () => {
    if (!startTimeRef.current) return; // 타이머가 시작되지 않았으면 무시
    
    const endTime = Date.now(); // ✅ 현재 시간 저장
    const elapsedSeconds = Math.floor((endTime - startTimeRef.current) / 1000); // ✅ 흐른 시간 (초 단위)
    const elapsedMinutes = Math.floor(elapsedSeconds / 60); // ✅ 초 → 분 변환
  
    setElapsedTime(elapsedMinutes); // ✅ 상태에 저장
    setIsPaused(true);
  
    console.log(`📌 흐른 시간: ${elapsedMinutes}분`);
  
    if (elapsedMinutes > 0) {
      saveReadingTime(selectedBook, elapsedMinutes);
    }
  };

  useEffect(() => {
    if (selectedBook) {
      setTime(3000);
      setPercent(0);
      setIsPaused(true);
    }
  }, [selectedBook]);

  // const getBookmarkedUserCount = useCallback(() => {
  //   const allBookmarks = JSON.parse(localStorage.getItem("allUsersBookmarks")) || [];
  //   return allBookmarks.filter((book) => book.id === selectedBook).length;
  // }, [selectedBook]);

 // 선택한 책이 변경될 때 `userCount` 업데이트
useEffect(() => {
  if (selectedBook) {
    const selectedBookData = bookmarks.find((book) => book.bookId === selectedBook);
    
    if (selectedBookData) {
      console.log(" 선택된 책의 북마크 수 업데이트:", selectedBookData.countOfBookMark);
      setUserCount(selectedBookData.countOfBookMark);
    } else {
      console.log(" 선택된 책을 찾을 수 없음");
      setUserCount(0);
    }
  }
}, [selectedBook, bookmarks]); //  `selectedBook` 또는 `bookmarks` 변경될 때 실행


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
      strokeDasharray: 565.48, 
      strokeDashoffset: 565.48 * (1 - percent / 100), 
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

   
    <div className="book-selection">
    <select 
  className="book-dropdown" 
  value={selectedBook}
  onChange={(e) => setSelectedBook(e.target.value)} // 🔹 googleBookId 저장
>
  <option value="" disabled hidden>Choose the Book Title</option>
  {bookmarks.length > 0 ? (
    bookmarks.map((book) => (
      <option key={book.googleBookId} value={book.googleBookId}> 
        {book.title}
      </option>
    ))
  ) : (
    <option value="" disabled>북마크된 책이 없습니다.</option>
  )}
</select>


</div>

  </div>

 
  <div className="timer-buttons-container">
  <img 
  src={resetIcon} 
  alt="Reset" 
  onClick={() => {
    setTime(3000); // 시간을 50분으로 초기화
    setSelectedTime("50분 / 15분"); 
  }} 
/>
    <img
        className="icon start"
        src={startSrc}
        alt="Start"
        onClick={startTimer}
        onMouseEnter={() => setStartSrc(startHover)} // Hover 시 변경
        onMouseLeave={() => setStartSrc(startIcon)} // 원래 이미지로 복귀
        onMouseDown={() => setStartSrc(startPress)} // Press(클릭) 시 변경
        onMouseUp={() => setStartSrc(startHover)} // 마우스 떼면 Hover 상태 유지
      />
    <img
        className="icon stop"
        src={stopSrc}
        alt="Stop"
        onClick={stopTimer}
        onMouseEnter={() => setStopSrc(stopHover)}
        onMouseLeave={() => setStopSrc(stopIcon)}
        onMouseDown={() => setStopSrc(stopPress)}
        onMouseUp={() => setStopSrc(stopHover)}
      />
  </div>

  <div className="record-section">
    <div className="recording"><img src={recordingIcon} alt="Recording"  className="recording-text" ></img></div>
    <div className="record-container">
      <textarea
        className="record-input"
        value={record}
        onChange={(e) => setRecord(e.target.value)}
        placeholder="책을 읽으면서 든 생각들을 기록으로 남겨 보세요!"
      />
   <img 
  src={recordIcon} 
  alt="Save" 
  className="record-icon" 
  onClick={handleRecordSave} 
/>


    </div>
    <button className="complete-reading-btn" onClick={() => saveRecordAndComplete(true)}>  
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

           
            <button 
              className={selectedDifficulty === "easy" ? "selected" : ""} 
              onClick={() => handleDifficultySelect("easy")}
              disabled={isSubmitting} //  요청 중이면 버튼 비활성화
            >
              📖 술술 읽혀요
            </button>
            <button 
              className={selectedDifficulty === "normal" ? "selected" : ""} 
              onClick={() => handleDifficultySelect("normal")}
              disabled={isSubmitting}
            >
              🧐 읽을만해요
            </button>
            <button 
              className={selectedDifficulty === "hard" ? "selected" : ""} 
              onClick={() => handleDifficultySelect("hard")}
              disabled={isSubmitting}
            >
              🔍 관련 지식이 필요해요
            </button>

            <button className="modal-close-btn" onClick={() => setShowModal(false)}>닫기</button>
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

{showWarningModal && (
  <div className="modal-alert-overlay" onClick={() => setShowWarningModal(false)}>
    <div className="modal-alert-content" onClick={(event) => event.stopPropagation()}>
      <h2>작성하신 메모를 저장해주세요!</h2>
      <button className="modal-alert-button" onClick={() => setShowWarningModal(false)}>확인</button>
    </div>
  </div>
)}

{showExitWarning && (
  <div className="modal-alert-overlay">
    <div className="modal-alert-content">
      <h2>독서 완료하기를 누르지 않으면 <br/>기록이 저장되지 않습니다.</h2>
      <p>그래도 페이지를 나가시겠습니까?</p>
      
      <button className="modal-alert-button" onClick={handleExitConfirm}>나가기</button>
      <button className="modal-alert-button exit" onClick={handleExitCancel}>계속 독서하기</button>
    </div>
  </div>
)}



      <Footer />
    </div>
  );
}

export default Timer;