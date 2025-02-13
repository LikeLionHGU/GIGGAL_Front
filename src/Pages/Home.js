import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/ui/button";
import styles from "../styles/Home.module.css";
import HomeHeader from '../components/header/HomeHeader.js';
import Footer from '../components/footer/Footer.js';
import hr from '../img/hr.png';  // '../img/'로 경로를 수정
import bookadd from '../img/bookadd.png';  // '../img/'로 경로를 수정
import clock from '../img/clock.png';  // '../img/'로 경로를 수정
import readingbtn from '../img/readingbtn.png';  // '../img/'로 경로를 수정
import recordbtn from '../img/recordbtn.png';  // '../img/'로 경로를 수정
import checkImg from "../img/check.png"; 
import whiteImg from "../img/white.png";
import cancel from "../img/cancel.png"; 
import retry from "../img/retry.png";



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
              navigate("/home"); // 홈 화면으로 이동
            } else {
              console.error("Login failed:", data.message);
            }
          })
          .catch((error) => console.error("Error:", error));
      }
    }, [navigate]);

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
      <div className={styles.Mybook}>나의 책</div>
      <div className={styles.text}>오늘은 어떤 책을 읽을지 골라보세요 !</div>
      <img src={hr} alt="hr" className={styles.hr}/>
      <div className={styles.books}>
      <img src={bookadd} alt="hr" className={styles.bookadd} onClick={goToSearch}/>
        {bookmarks.map((book) => {
          const readingTime = getReadingTime(book.id); // 책의 읽은 시간


          return (
       
            <div>
              <div className={styles.bookcard}>
              <img
                src={book.volumeInfo.imageLinks?.thumbnail}
                alt={book.volumeInfo.title}
              />
                <div className={styles.title}>
              {book.volumeInfo.title}
            </div>

              
              <div className={styles.complete}>
              <button
  className={styles.checkbox}
  onClick={() => handleButtonClick(book)}
  style={{
    backgroundImage: `url(${isBookRead[book.id] ? checkImg : whiteImg})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    width: "24px",
    height: "24px",
    border: "none",
  }}
/>
              <div className={styles.completet}>완독</div>
              </div>

              <div className={styles.time}>
              <img src={clock} alt="time" className={styles.clock}/>
                <div className={styles.sigan}>{Math.floor(readingTime / 60)}시간</div>
               </div>

              <div className={styles.btns}>
              <img src={readingbtn} alt="readingbtn"  onClick={() => navigate(`/timer?bookId=${book.id}`)}/>
              <img src={recordbtn} alt="recordbtn"   onClick={() => navigate(`/bookdetail?bookId=${book.id}`)}/>
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
            <div className={styles.modalt}>이미 완독한 도서 입니다.</div>
            <div className={styles.modalp}>{selectedBook?.volumeInfo.title}을(를) 다시 읽을까요?</div>
            <div className={styles.mbtns}>
            <img src={cancel} alt="cancel" onClick={closeAlert}/>
            <img src={retry} alt="retry" onClick={goToTimer}/>
            </div>
          </div>
        </div>
      )}
       <Footer/>
    </div>
  );
};

export default Home;
