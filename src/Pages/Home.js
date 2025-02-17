import React, { useState, useEffect ,useCallback} from "react";
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

const API_BASE_URL = "https://janghong.asia/book";

const Home = () => {
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState("예정");
  const [completedBooks, setCompletedBooks] = useState({});
  const [Alertopen, setAlertopen] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const navigate = useNavigate();

  // useEffect(() => {
  //   fetchBooks();
  // }, [selectedFilter]);

  const userEmail = localStorage.getItem("userEmail");
  const fetchReadingTime = useCallback(async (bookId) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/reading/time/${bookId}?userEmail=${encodeURIComponent(userEmail)}`
      );
  
      // 🔹 백엔드에서 제공하는 값이 이미 "1시간 30분" 등의 문자열이라면 변환 없이 그대로 사용
      return response.data.time || "0분"; 
    } catch (error) {
      console.error(`📌 ${bookId}의 읽은 시간 가져오기 실패:`, error.response ? error.response.data : error);
      return "0분"; // 오류 발생 시 기본값
    }
  }, [userEmail]);
  

  

  // 📌 API 호출 (필터별)
  const fetchBooks = useCallback(async () => {
    if (!userEmail) {
      console.error("📌 유저 이메일이 없습니다. 책 목록을 가져올 수 없습니다.");
      return;
    }

    try {
      let response;
      const encodedEmail = encodeURIComponent(userEmail);

      if (selectedFilter === "예정") {
        response = await axios.get(`${API_BASE_URL}/list/before/reading?userEmail=${encodedEmail}`);
      } else if (selectedFilter === "진행") {
        response = await axios.get(`${API_BASE_URL}/list/now/reading?userEmail=${encodedEmail}`);
      } else if (selectedFilter === "완료") {
        response = await axios.get(`${API_BASE_URL}/list/after/reading?userEmail=${encodedEmail}`);
      }

      const books = response.data || [];

      // 📌 각 책의 읽은 총합 시간을 가져와 상태에 추가 저장
      const booksWithReadingTime = await Promise.all(
        books.map(async (book) => {
          const readingTime = await fetchReadingTime(book.bookId);
          return { ...book, readingTime }; // 읽은 시간 추가
        })
      );
      setFilteredBooks(booksWithReadingTime);

      console.log(`📌 ${selectedFilter} 책 목록:`, response.data);

      // ✅ "완독" 처리된 책 저장
      if (selectedFilter === "완료") {
        const completedMap = {};
        response.data.forEach((book) => {
          completedMap[book.bookId] = true;
        });
        setCompletedBooks(completedMap);
      }
    } catch (error) {
      console.error("📌 책 목록 가져오기 실패:", error.response ? error.response.data : error);
    }
  }, [selectedFilter, userEmail, fetchReadingTime]); // ✅ `useCallback`을 사용하여 의존성 문제 해결

  // 📌 `useEffect`에서 `fetchBooks` 호출
  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  // 📌 체크 버튼 클릭 이벤트 (완독 처리)
  const handleCheckButtonClick = async (book) => {
    console.log("📌 체크 버튼 클릭 - 선택한 책:", book);

    if (completedBooks[book.bookId]) {
      // ✅ 이미 체크된 상태면 모달 표시
      setSelectedBook(book);
      setAlertopen(true);
    } else {
      // ✅ 처음 체크하면 "완독 API" 호출
      const userEmail = localStorage.getItem("userEmail");
      if (!userEmail) {
        console.error("📌 유저 이메일이 없습니다.");
        return;
      }

      try {
        const response = await axios.put(
          `${API_BASE_URL}/complete/${book.bookId}?userEmail=${encodeURIComponent(userEmail)}`, // ✅ Query Parameter로 변경
          {}, // 요청 바디는 필요 없음
          {
            headers: {
              "Content-Type": "application/json", // JSON 요청임을 명시
            },
          }
        );
      
        console.log("📌 완독 처리 성공:", response.data);
      
        setCompletedBooks((prev) => ({
          ...prev,
          [book.bookId]: true,
        }));
      } catch (error) {
        console.error("📌 완독 처리 실패:", error.response ? error.response.data : error);
      }
      
    }
  };

  // 📌 모달 닫기
  const closeAlert = () => {
    setAlertopen(false);
    setSelectedBook(null);
  };

  // 📌 "다시 읽기" 클릭 시 타이머 페이지 이동
  const handleRetryReading = () => {
    if (selectedBook) {
      navigate(`/timer?bookId=${selectedBook.bookId}`);
      closeAlert();
    }
  };

  const goToSearch = () => {
    navigate("/Search");
  };

  const handleReadingButtonClick = async (book) => {
    try {
      const response = await axios.put(
        `${API_BASE_URL}/reading/${book.bookId}?userEmail=${encodeURIComponent(userEmail)}`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
  
      console.log("읽는중으로 변경 성공공", response.data);
  
      setCompletedBooks((prev) => ({
        ...prev,
        [book.bookId]: true,
      }));
    } catch (error) {
      console.error("📌 완독 처리 실패:", error.response ? error.response.data : error);
    }
  }; 

  return (
    <div>
      <HomeHeader />
      <div className={styles.Mybook}>나의 책</div>
      <div className={styles.text}>오늘은 어떤 책을 읽을지 골라보세요!</div>
      <img src={hr} alt="hr" className={styles.hr} />

      {/* 🔹 필터 버튼 추가 */}
      <div className={styles.filterContainer}>
        <label>
          <input
            type="radio"
            value="예정"
            checked={selectedFilter === "예정"}
            onChange={() => setSelectedFilter("예정")}
          />
          독서 예정인 책
        </label>
        <label>
          <input
            type="radio"
            value="진행"
            checked={selectedFilter === "진행"}
            onChange={() => setSelectedFilter("진행")}
          />
          독서 진행 중인 책
        </label>
        <label>
          <input
            type="radio"
            value="완료"
            checked={selectedFilter === "완료"}
            onChange={() => setSelectedFilter("완료")}
          />
          다 읽은 책
        </label>
      </div>

      <div className={styles.books}>
        <img src={bookadd} alt="add" className={styles.bookadd} onClick={goToSearch} />

        {filteredBooks.length > 0 ? (
          filteredBooks.map((book) => (
            <div key={book.bookId} className={styles.bookcard}>
              <img src={book.thumbnail} alt={book.title} className={styles.bookcover} />
              <div className={styles.title}>{book.title}</div>

              <div className={styles.complete}>
                <button
                  className={styles.checkbox}
                  onClick={() => handleCheckButtonClick(book)}
                  style={{
                    backgroundImage: `url(${completedBooks[book.bookId] ? checkImg : whiteImg})`,
                    backgroundSize: "cover",
                    width: "24px",
                    height: "24px",
                    border: "none",
                    cursor: "pointer",
                  }}
                />
                <div className={styles.completet}>완독</div>
              </div>

              <div className={styles.time}>
  <img src={clock} alt="time" className={styles.clock} />
  <div className={styles.sigan}>
    {book.time} {/* 백엔드에서 가져온 총합 시간을 표시 */}
  </div>
</div>


              <div className={styles.btns}>

              <img
  src={readingbtn}
  alt="readingbtn"
  className={styles.readingbtn}
  onClick={async () => {
    await handleReadingButtonClick(book); // ✅ 읽는중으로 변경 API 호출
    navigate(`/timer?bookId=${book.bookId}`); // ✅ API 호출 후 타이머 페이지로 이동
  }}
/>


             
<img
  src={recordbtn}
  alt="recordbtn"
  className={styles.recordbtn}
  onClick={() => navigate(`/bookdetail?bookTitle=${book.title}&bookPublisher=${book.publisher}`)}
/>




              </div>
            </div>
          ))
        ) : (
          <p className={styles.noBooks}>해당 필터에 맞는 책이 없습니다.</p>
        )}
      </div>

      {/* ✅ 모달 창 추가 */}
      {Alertopen && (
        <div className={styles.modalbg}>
          <div className={styles.modal}>
            <div className={styles.modalt}>이미 완독한 도서입니다.</div>
            <div className={styles.modalp}>{selectedBook?.title}을(를) 다시 읽을까요?</div>
            <div className={styles.mbtns}>
              <img src={cancel} alt="cancel" onClick={closeAlert} />
              <img src={retry} alt="retry" onClick={handleRetryReading} />
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

export default Home;