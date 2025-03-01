import { useState, useEffect, useRef} from "react";
import { useNavigate,useLocation } from "react-router-dom";
import "../styles/Timer.css";
import HomeHeader from "../components/header/HomeHeader2.js";
import Footer from "../components/footer/Footer.js";
import TimerBackground from "../img/timer.png"; 
import startHover from '../img2/starthover.png';
import startPress from '../img2/startpress.png';
import stopHover from '../img2/stophover.png';
import stopPress from '../img2/stoppress.png';
import sulsul from'../img2/sulsul.png';
import rhks from'../img2/관련지식.png';
import dlfr from'../img2/읽을만.png';
import axios from "axios"; 
import recordHoverIcon from "../img2/recordhover.png";
import recordPressIcon from "../img2/recordpress.png";

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
 

  const [recordSrc,setRecordSrc] = useState(recordIcon);

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
  const [saveTime, setSaveTime] = useState(0);


  const [isRecordSaved, setIsRecordSaved] = useState(false); // 기록 저장 여부 상태 추가
  const [showWarningModal, setShowWarningModal] = useState(false); 

  const [showExitWarning, setShowExitWarning] = useState(false);
  const navigate = useNavigate();

  const [elapsedTime, setElapsedTime] = useState(0); // 흐른 시간 (초 단위 저장)
const startTimeRef = useRef(null); // 시작 시간 저장용

const [selectedDifficulty, setSelectedDifficulty] = useState("");
const [isSubmitting, setIsSubmitting] = useState(false); 

const location = useLocation();
const params = new URLSearchParams(location.search); // ✅ URL 파라미터 파싱
const initialBookTitle = params.get("bookTitle") || "";


const handleDifficultySelect = (difficulty) => {
  if (!selectedBook || isSubmitting) return; // 중복 요청 방지
  setSelectedDifficulty(difficulty);
};

// "보내기" 버튼을 눌렀을 때 실행되는 함수
const submitDifficultyAndExit = async () => {
  if (!selectedBook || !selectedDifficulty || isSubmitting) return; // 선택한 난이도가 없으면 실행하지 않음
  setIsSubmitting(true); // 중복 요청 방지

  const bookData = bookmarks.find((book) => book.googleBookId === selectedBook);
  const bookId = bookData?.bookId; // 백엔드에서 사용하는 bookId 가져오기

  if (!bookId) {
    console.error("📌 해당 Google Book ID에 대한 백엔드 Book ID를 찾을 수 없습니다.");
    setIsSubmitting(false);
    return;
  }

  try {
    const response = await axios.put(`${API_BASE_URL}/book/difficulty/${bookId}`, {
      difficulty: selectedDifficulty,
    });

    if (response.status === 200) {
      console.log("📌 난이도 평가 성공:", response.data);

      setTimeout(() => {
        setShowModal(false); // ✅ "보내기" 버튼을 눌렀을 때 모달 닫기
        setSelectedDifficulty(""); // 상태 초기화
        setIsSubmitting(false);
        navigate("/home"); // ✅ Home.js로 이동
      }, 500);
    }
  } catch (error) {
    console.error("❌ 난이도 평가 실패:", error.response ? error.response.data : error);
    setIsSubmitting(false);
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
  
  

  // const userEmail = (localStorage.getItem("userEmail") || "").trim();// 로컬스토리지에서 유저 이메일 가져오기

  useEffect(() => {
    const fetchBookmarks = async () => {
      try {
        const userEmail = localStorage.getItem("userEmail");
        const response = await axios.get(`https://janghong.asia/book/list/now/reading?userEmail=${encodeURIComponent(userEmail)}`);
        setBookmarks(response.data);
        
        // URL에서 받은 bookTitle과 일치하는 책을 찾아 자동 선택
        const matchedBook = response.data.find(book => book.title === initialBookTitle);
        if (matchedBook) {
          setSelectedBook(matchedBook.googleBookId);
        }
      } catch (error) {
        console.error("북마크 가져오기 실패:", error);
      }
    };

    fetchBookmarks();
  }, [initialBookTitle]);

useEffect(() => {
  const fetchUserCount = async () => {
    if (!selectedBook) {
      setUserCount(0);
      return;
    }

    try {
      //  명세서에 맞춘 엔드포인트로 변경
      const response = await axios.get(`${API_BASE_URL}/book/bookmarkNumber/difficulty/${selectedBook}`);

      console.log(" API 응답 데이터:", response.data);

      //  응답 데이터에서 `bookmarkCount` 값을 가져와서 설정
      setUserCount(response.data.bookmarkCount || 0); 
    } catch (error) {
      console.error(" 북마크 수 가져오기 실패:", error.response ? error.response.data : error);
      setUserCount(0);
    }
  };

  fetchUserCount();
}, [selectedBook]); //  선택된 책이 변경될 때 실행




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
      console.error(" 유저 이메일이 없습니다.");
      return;
    }
  
    //  선택한 Google Book ID를 백엔드 Book ID로 변환
    const bookData = bookmarks.find((book) => book.googleBookId === googleBookId);
    const bookId = bookData?.bookId; // 백엔드에서 사용하는 bookId 가져오기
  
    if (!bookId) {
      console.error(" 해당 Google Book ID에 대한 백엔드 Book ID를 찾을 수 없습니다.");
      return;
    }
  
    try {
      const response = await axios.put(
        `${API_BASE_URL}/book/reading/time/${bookId}`,
        {
          userEmail: userEmail,
          time: addedTimeInMinutes, // 분 단위 변환 후 저장
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );
  
      console.log(` ${bookId}의 ${addedTimeInMinutes}분 저장 완료:`, response.data);
    } catch (error) {
      console.error(" 읽은 시간 저장 실패:", error.response ? error.response.data : error);
    }
  };

  const saveRecordAndComplete = async (isCompletion = false) => {
    if (!selectedBook) return;

    if (isCompletion && record.trim() && !isRecordSaved) {
        setShowWarningModal(true);
        return;
    }

    let latestSaveTime = saveTime; // 기본적으로 기존 값 사용

    if (!isPaused) {
        latestSaveTime = await stopTimer(); // 최신 saveTime 값을 기다린 후 저장
    }

    await saveReadingTime(selectedBook, latestSaveTime); // 최신 값 저장

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
    return new Promise((resolve) => {
        if (!startTimeRef.current) return resolve(); // 타이머가 시작되지 않았으면 무시

        const endTime = Date.now();
        const elapsedSeconds = Math.floor((endTime - startTimeRef.current) / 1000);
        const elapsedMinutes = Math.floor(elapsedSeconds / 60) + ((elapsedSeconds%60)/60);

        console.log(` 흐른 시간: ${elapsedMinutes}분`);
        console.log(elapsedTime);

        setElapsedTime((prevElapsedTime) => {
            const newElapsedTime = prevElapsedTime + elapsedMinutes;
            setSaveTime(newElapsedTime); // 최신 값 반영
            resolve(newElapsedTime); //  완료 후 resolve
            return newElapsedTime;
        });

        setIsPaused(true);
    });
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
      <div className="timer-container">
  <div className="reading-count">
    <br/>
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
  width="50"  
  height="50"  
  className="reset-icon" // CSS 스타일 적용
  onClick={() => {
    setTime(3000);
    setSelectedTime("50분 / 15분"); 
  }}
/>


    <img
        className="icon start"
        src={startSrc}
        alt="Start"
        width="40"  
        height="40" 
        
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
        width="30"  
        height="40" 
        onClick={stopTimer}
        onMouseEnter={() => setStopSrc(stopHover)}
        onMouseLeave={() => setStopSrc(stopIcon)}
        onMouseDown={() => setStopSrc(stopPress)}
        onMouseUp={() => setStopSrc(stopHover)}
      />
  </div>

  <div className="record-section">
    <div className="recording"><img src={recordingIcon} alt="Recording" className="recording-text" style={{width:"125px",height:"auto",marginLeft:"60px"}}></img></div>
    <div className="record-container">
      <textarea
        className="record-input"
        value={record}
        onChange={(e) => setRecord(e.target.value)}
        placeholder="책을 읽으면서 든 생각들을 기록으로 남겨 보세요!"
      />
   <img 
  src={recordSrc} 
  alt="Save" 
  className="record-icon" 
  onClick={handleRecordSave}
  onMouseEnter={() => setRecordSrc(recordHoverIcon)}  // Hover 시 변경
  onMouseLeave={() => setRecordSrc(recordIcon)}  // 기본 이미지로 복귀
  onMouseDown={() => setRecordSrc(recordPressIcon)}  // Press(클릭) 시 변경
  onMouseUp={() => setRecordSrc(recordIcon)}  // 마우스 떼면 기본 이미지 유지
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
      <p>독서를 완료하셨습니다! <br/><br/>
      방금 읽은 책에 대해서 어떻게 생각하시나요?</p>

      {/* 난이도 선택 버튼 */}
      <button 
        className={selectedDifficulty === "easy" ? "selected" : ""} 
        onClick={() => handleDifficultySelect("easy")}
        disabled={isSubmitting}
      >
        <img src={sulsul} alt="술술" style={{width:"85px", height:"34px"}}/>
      </button>
      <button 
        className={selectedDifficulty === "normal" ? "selected" : ""} 
        onClick={() => handleDifficultySelect("normal")}
        disabled={isSubmitting}
      >
       <img src={dlfr} alt="읽을만" style={{width:"auto", height:"30px"}}/>
      </button>
      <button 
        className={selectedDifficulty === "hard" ? "selected" : ""} 
        onClick={() => handleDifficultySelect("hard")}
        disabled={isSubmitting}
      >
        <img src={rhks} alt="관련지식" style={{width:"140px", height:"30px"}}/>
      </button>

      {/* "보내기" 버튼을 추가하여 선택 후 Home으로 이동 */}
      <button className="modal-submit-btn" onClick={submitDifficultyAndExit} disabled={!selectedDifficulty || isSubmitting}>
        보내기
      </button>

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
      <button className="modal-alert-button-exit" onClick={() => setShowWarningModal(false)}>확인</button>
    </div>
  </div>
)}

{showExitWarning && (
  <div className="modal-alert-overlay">
    <div className="modal-alert-content">
      <h2>독서 완료하기를 누르지 않으면 <br/>기록이 저장되지 않습니다.</h2>
      <h2>그래도 페이지를 나가시겠습니까?</h2><br/>
      
      <button className="modal-alert-button" onClick={handleExitConfirm}>나가기</button>
      <button className="modal-alert-button-exit" onClick={handleExitCancel}>계속 독서하기</button>
    </div>
  </div>
)}



      <Footer />
    </div>
  );
}

export default Timer;