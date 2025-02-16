import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import styles from "../styles/search.module.css";
import Footer from "../components/footer/Footer.js";
import HomeHeader from "../components/header/HomeHeader.js";
import searchbtn from "../img/searchbtn.png";
import nonbookmark from "../img/nonbookmark.png";
import bookmark from "../img/bookmark.png";
import { useDebounce } from "../hooks/useDebounce";

// 📌 Axios 인스턴스 생성 (기본 URL 설정)
const apiClient = axios.create({
  baseURL: "https://janghong.asia/book",
  timeout: 5000,
});

const BookList = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState(location.state?.searchTerm || "");
  const [searchResults, setSearchResults] = useState(location.state?.books || []);
  const [bookmarkedBooks, setBookmarkedBooks] = useState({});
  const [userEmail, setUserEmail] = useState(""); // 📌 유저 이메일 상태 추가

  // 📌 로컬스토리지에서 유저 이메일 가져오기
  useEffect(() => {
    const storedEmail = localStorage.getItem("userEmail");
    if (storedEmail) {
      setUserEmail(storedEmail);
    }
  }, []);

  // 📌 Google Books API 요청
  const fetchBooks = async (searchQuery) => {
    if (!searchQuery) return;

    try {
      const response = await axios.get(
        `https://www.googleapis.com/books/v1/volumes?q=${searchQuery}&maxResults=10&key=AIzaSyCOhxzEmFNG0E9GCrAAYeSQ8Q2NYrjC-b0`
      );
      setSearchResults(response.data.items || []);
    } catch (err) {
      console.error("📌 책 가져오는거 실패", err);
    }
  };

  const debouncedFetchBooks = useDebounce(fetchBooks, 500);

  useEffect(() => {
    if (searchTerm) {
      debouncedFetchBooks(searchTerm);
    }
  }, [searchTerm]);

  // 📌 북마크 추가 (백엔드 API 호출)
  const toggleBookmark = async (book) => {
    if (!book || !userEmail) {
      console.error("📌 북마크 추가 실패: 유저 이메일이 없습니다.");
      return;
    }

    // 요청 본문 로그 추가
    const requestData = {
      email: userEmail,
      title: book.volumeInfo.title,
      author: book.volumeInfo.authors?.join(", ") || "정보 없음",
      pageCount: book.volumeInfo.pageCount || 0,
      publisher: book.volumeInfo.publisher || "정보 없음",
      thumbnail: book.volumeInfo.imageLinks?.thumbnail || "",
    };

    console.log("📌 북마크 요청 데이터:", requestData); // 요청 데이터 확인

    try {
      const response = await apiClient.post(`/bookmark`, requestData);

      // 응답 데이터 로그 추가
      console.log("📌 북마크 추가 성공:", response.data.message);
      
      // 상태 업데이트 (북마크 추가)
      setBookmarkedBooks((prev) => ({
        ...prev,
        [book.id]: true,
      }));

    } catch (error) {
      console.error("📌 북마크 추가 실패:", error);
    }
  };

  // 📌 검색 실행
  const handleSearch = (e) => {
    e.preventDefault();
    setSearchTerm(searchTerm.trim());
  };

  // 📌 책 클릭 시 상세 페이지 이동
  const handleBookClick = (book) => {
    navigate(`/detail/${book.id}`, { state: { book } });
  };

  return (
    <div>
      <HomeHeader />
      <div className={styles.b}>
        <form onSubmit={handleSearch}>
          <div className={styles.con}>
            <div className={styles.bar}>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search"
                className={styles.bari}
              />
              <button type="submit" className={styles.sbtn}>
                <img src={searchbtn} alt="검색" className={styles.buttonsearch} />
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* 📚 검색된 책 목록 */}
      <div className={styles.books}>
        {searchResults.map((book) => (
          <div className={styles.bookcard} key={book.id}>
            <div className={styles.infomation}>
              <div className={styles.bookcover} onClick={() => handleBookClick(book)}>
                {/* 📖 책 표지 */}
                {book.volumeInfo.imageLinks?.thumbnail ? (
                  <img src={book.volumeInfo.imageLinks.thumbnail} alt={book.volumeInfo.title} />
                ) : (
                  <div className={styles.placeholder}>No Image</div>
                )}

                <h1>{book.volumeInfo.title}</h1>
                <h2>
                  <span className={styles.lowlight}>저자 (글) </span>
                  {book.volumeInfo.authors}
                </h2>
              </div>
            </div>

            {/* ⭐ 북마크 버튼 */}
            <button className={styles.bookmarkButton} onClick={() => toggleBookmark(book)}>
              <img
                src={bookmarkedBooks[book.id] ? bookmark : nonbookmark}
                alt="북마크"
                style={{ width: "24px", height: "auto" }}
              />
            </button>
          </div>
        ))}
      </div>

      <Footer />
    </div>
  );
};

export default BookList;
