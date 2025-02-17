import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import styles from "../styles/Home.module.css";
import HomeHeader from "../components/header/HomeHeader.js";
import Footer from "../components/footer/Footer.js";
import hr from "../img/hr.png";
import bookadd from "../img/bookadd.png";
import clock from "../img/clock.png";
import readingbtn from "../img/readingbtn.png";
import recordbtn from "../img/recordbtn.png";
import checkImg from "../img/check.png";
import whiteImg from "../img/white.png";
import cancel from "../img/cancel.png";
import retry from "../img/retry.png";

const Home = () => {
  const [bookmarks, setBookmarks] = useState([]); // 📌 북마크한 책 리스트 상태
  const [selectedBook, setSelectedBook] = useState(null);
  const [Alertopen, setAlertopen] = useState(false);
  const [isBookRead, setIsBookRead] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBookmarks = async () => {
      const userEmail = localStorage.getItem("userEmail");
      if (!userEmail) {
        console.error("📌 유저 이메일이 없습니다. 북마크 목록을 가져올 수 없습니다.");
        return;
      }
    
      try {
        const encodedEmail = encodeURIComponent(userEmail); // ✅ URL 인코딩 적용
        const response = await axios.get(
          `https://janghong.asia/book/list/before/reading?userEmail=${encodedEmail}`,
          {
            headers: { "Content-Type": "application/json" },
          }
        );
    
        console.log("📌 백엔드에서 받은 응답 데이터:", response.data); // 📌 응답 데이터 출력
    
        if (!response.data || response.data.length === 0) {
          console.warn("📌 북마크 데이터가 없습니다.");
        }
    
        setBookmarks(response.data); // 📌 상태 업데이트
      } catch (error) {
        console.error("📌 북마크 목록 가져오기 실패:", error.response ? error.response.data : error);
      }
    };
    
    fetchBookmarks();
  }, []);
  

  const goToTimer = () => {
    navigate("/Timer");
  };

  const goToSearch = () => {
    navigate("/Search");
  };

  const handleButtonClick = (book) => {
    if (isBookRead[book.bookId]) {
      setSelectedBook(book);
      setAlertopen(true);
    } else {
      setIsBookRead((prevState) => ({
        ...prevState,
        [book.bookId]: true,
      }));
    }
  };

  const closeAlert = () => {
    setAlertopen(false);
    setSelectedBook(null);
  };

  // 📌 책의 누적 독서 시간 가져오기
  const getReadingTime = (bookId) => {
    return JSON.parse(localStorage.getItem(`readingTime_${bookId}`)) || 0;
  };

  return (
    <div>
      <HomeHeader />
      <div className={styles.Mybook}>나의 책</div>
      <div className={styles.text}>오늘은 어떤 책을 읽을지 골라보세요!</div>
      <img src={hr} alt="hr" className={styles.hr} />

      <div className={styles.books}>
        <img src={bookadd} alt="add" className={styles.bookadd} onClick={goToSearch} />

        {bookmarks.map((book) => {
          const readingTime = getReadingTime(book.bookId); // 📌 API에서 받은 bookId 사용

          return (
            <div key={book.bookId} className={styles.bookcard}>
              <img src={book.thumbnail} alt={book.title} className={styles.bookcover} />
              <div className={styles.title}>{book.title}</div>

              <div className={styles.complete}>
                <button
                  className={styles.checkbox}
                  onClick={() => handleButtonClick(book)}
                  style={{
                    backgroundImage: `url(${isBookRead[book.bookId] ? checkImg : whiteImg})`,
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
                <img src={clock} alt="time" className={styles.clock} />
                <div className={styles.sigan}>{Math.floor(readingTime / 60)}시간</div>
              </div>

              <div className={styles.btns}>
                <img
                  src={readingbtn}
                  alt="readingbtn"
                  className={styles.readingbtn}
                  onClick={() => navigate(`/timer?bookId=${book.bookId}`)}
                />
                <img
                  src={recordbtn}
                  alt="recordbtn"
                  className={styles.recordbtn}
                  onClick={() => navigate(`/bookdetail?bookId=${book.bookId}`)}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* 📌 모달 창 */}
      {Alertopen && (
        <div className={styles.modalbg}>
          <div className={styles.modal}>
            <div className={styles.modalt}>이미 완독한 도서입니다.</div>
            <div className={styles.modalp}>{selectedBook?.title}을(를) 다시 읽을까요?</div>
            <div className={styles.mbtns}>
              <img src={cancel} alt="cancel" onClick={closeAlert} />
              <img src={retry} alt="retry" onClick={goToTimer} />
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default Home;
