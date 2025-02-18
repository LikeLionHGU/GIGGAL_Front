import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";
import styles from "../styles/searchdetail.module.css";
import SearchHeader from "../components/header/HomeHeader.js";
import nonbookmark from "../img/nonbookmark.png";
import bookmark from "../img/bookmark.png";
import communityexample from "../img2/communityexample.png";
import back from "../img/back.png";
import path from "../img2/path.png";
import "../styles/BookDetail.css";

const API_BASE_URL = "https://janghong.asia/book";
const GOOGLE_BOOKS_API_KEY = "AIzaSyCOhxzEmFNG0E9GCrAAYeSQ8Q2NYrjC-b0";

const SearchDetail = () => {
  const { googleBookId, bookId } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [bookmarkData, setBookmarkData] = useState(null);
  const [bookRead, setBookRead] = useState({});
  const [activeTab, setActiveTab] = useState("bookInfo");
  const [errorMessage, setErrorMessage] = useState("");
  const lastApiCallTime = useRef(0);

  console.log("📢 googleBookId 값 확인:", googleBookId);

  // ✅ 북마크 데이터 가져오는 함수 (`useCallback` 적용)
  const fetchBookmarkData = useCallback(async () => {
    try {
      console.log("📢 Fetching bookmark data...");
      const response = await axios.get(`${API_BASE_URL}/bookmarkNumber/difficulty/${googleBookId}`);
      console.log("✅ Bookmark Data Response: ", response.data);
      setBookmarkData(response.data);
    } catch (error) {
      console.error("❌ 북마크 정보를 가져오는 데 실패했습니다:", error.response?.data || error.message);
    }
  }, [googleBookId]); // ✅ googleBookId가 변경될 때만 실행

  // ✅ 책 정보 가져오는 함수
  const fetchBookDetails = useCallback(async (retryCount = 3) => {
    console.log("📢 Google Book ID 확인:", googleBookId);
    console.log("📢 Book ID 확인:", bookId);

    if (!bookId) {
      setErrorMessage("❌ 책 ID가 올바르지 않습니다.");
      return;
    }
    
    const currentTime = new Date().getTime();
    if (currentTime - lastApiCallTime.current < 5000) return;
    lastApiCallTime.current = currentTime;

    console.log(`📢 Fetching book details for ID: ${bookId}`);
    const cachedBook = sessionStorage.getItem(`book_${bookId}`);
    if (cachedBook) {
      console.log("📌 Using cached book data");
      setBook(JSON.parse(cachedBook));
      return;
    }

    try {
      const response = await axios.get(
        `https://www.googleapis.com/books/v1/volumes/${googleBookId}?key=${GOOGLE_BOOKS_API_KEY}`
      );
      console.log("✅ API Response: ", response.data);
      setBook(response.data);
      sessionStorage.setItem(`book_${bookId}`, JSON.stringify(response.data));
    } catch (error) {
      console.error("❌ API 요청 실패:", error.response?.data || error.message);
      setErrorMessage("❌ 책 정보를 불러오는 데 실패했습니다. API 키 문제일 수 있습니다.");
      if (retryCount > 0) {
        console.log(`🔄 재시도 남은 횟수: ${retryCount}`);
        setTimeout(() => fetchBookDetails(retryCount - 1), 3000);
      }
    }
  }, [bookId, googleBookId]);

  // ✅ useEffect를 사용하여 `fetchBookDetails`와 `fetchBookmarkData` 호출
  useEffect(() => {
    fetchBookDetails();
    fetchBookmarkData();
  }, [fetchBookDetails, fetchBookmarkData]); // ✅ `fetchBookmarkData` 추가하여 ESLint 경고 해결

  const goBack = () => {
    navigate(-1);
  };

  const toggleBookmark = async () => {
    if (!book) return;
  
    try {
      if (bookRead[book?.id]) {
        await axios.delete(`${API_BASE_URL}/bookmark/${googleBookId}`);
      } else {
        await axios.post(`${API_BASE_URL}/bookmark`, {
          googleBookId,
          title: book.volumeInfo?.title,
          userEmail: "user@example.com", // 실제 사용자 이메일 필요
        });
      }

      setBookRead((prev) => ({
        ...prev,
        [book?.id]: !prev[book?.id],
      }));

      fetchBookmarkData();
    } catch (error) {
      console.error("❌ 북마크 업데이트 실패:", error);
    }
  };

  // 📌 책 설명 (30자 이하로 제한)
  const shortDescription = book?.volumeInfo?.subtitle?.slice(0, 30) + "..." ||
    book?.searchInfo?.textSnippet?.slice(0, 30) + "..." ||
    book?.volumeInfo?.subtitle || book?.searchInfo?.textSnippet || "설명 없음";

  return (
    <div>
      <SearchHeader />
      <div className={styles.container}>
        <div className={styles.innercontainer}>
          
          <div className="back-container">
            <img className="backbtn" src={back} alt="back" onClick={goBack} />
          </div>
          <img className="goto" src={path} alt="path" />

          {errorMessage ? (
            <div className={styles.errorMessage}>{errorMessage}</div>
          ) : book ? (
            <div className={styles.bookHeader}>
              <div className={styles.bookImageContainer}>
                {book?.volumeInfo?.imageLinks?.thumbnail ? (
                  <img src={book.volumeInfo.imageLinks.thumbnail} alt={book.volumeInfo.title} className={styles.bookCover} />
                ) : (
                  <p>❌ 책 표지를 불러올 수 없습니다.</p>
                )}
              </div>
              <div className={styles.bookInfo}>
                <h1 className={styles.bookTitle}>{book?.volumeInfo?.title || "❌ 제목 없음"}</h1>
                <p className={styles.shortDescription}>
                  📌 북마크 수: {bookmarkData?.countOfBookMark || 0} | 난이도 평가: {bookmarkData?.difficultyScore || "없음"}
                </p>
                <p className={styles.shortDescription}>{shortDescription}</p>
              </div>
            </div>
          ) : (
            <p className={styles.loading}>📚 책 정보를 불러오는 중...</p>
          )}
        </div>

        <div className={styles.bookmarkContainer}>
          <button onClick={toggleBookmark}>
            <img src={bookRead[book?.id] ? bookmark : nonbookmark} alt="북마크" className={styles.bookmarkIcon} />
          </button>
          <span>{bookmarkData?.countOfBookMark || 0}</span>
        </div>
        <div className={styles.tabs}>
  <div 
    className={`${styles.tab} ${activeTab === "bookInfo" ? styles.active : ""}`} 
    onClick={() => setActiveTab("bookInfo")}
  >
    책 정보
  </div>
  <div 
    className={`${styles.tab} ${activeTab === "community" ? styles.active : ""}`} 
    onClick={() => setActiveTab("community")}
  >
    커뮤니티
  </div>
</div>

<div className={styles.bookContent}>
  {activeTab === "bookInfo" ? (
    <p className={styles.bookDescription}>{book?.volumeInfo?.description || "설명 없음"}</p>
  ) : (
    <img src={communityexample} alt="커뮤니티 예제" className={styles.communityImage} />
  )}
</div>

      </div>
    </div>
  );
};

export default SearchDetail;
