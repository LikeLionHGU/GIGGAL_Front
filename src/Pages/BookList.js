import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import styles from "../styles/search.module.css";
import Footer from "../components/footer/Footer.js";
import HomeHeader from "../components/header/HomeHeader.js";
import searchbtn from "../img/searchbtn.png";
import nonbookmark from "../img/nonbookmark.png";
import nobookmarklist from "../img/nobookmarklist.png";
import nolevellist from "../img/nolevellist.png";
import bookmark from "../img/bookmark.png";
import { useDebounce } from "../hooks/useDebounce";

//  Axios 인스턴스 생성 (기본 URL 설정)
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
  const [userEmail, setUserEmail] = useState(""); 
  const [sortType, setSortType] = useState("전체보기"); // 🔹 정렬 타입 추가

  //  로컬스토리지에서 유저 이메일 가져오기
  useEffect(() => {
    const storedEmail = localStorage.getItem("userEmail");
    if (storedEmail) {
      setUserEmail(storedEmail);
    }
  }, []);

  //  Google Books API 요청
  const fetchBooks = async (searchQuery) => {
    if (!searchQuery) return;

    try {
      const response = await axios.get(
        `https://www.googleapis.com/books/v1/volumes?q=${searchQuery}&maxResults=40&key=AIzaSyCOhxzEmFNG0E9GCrAAYeSQ8Q2NYrjC-b0`
      );
      setSearchResults(response.data.items || []);
    } catch (err) {
      console.error(" 책 가져오는거 실패", err);
    }
  };

  // 북마크순 API 요청 함수 수정
const fetchBooksByBookmark = async () => {
  if (!searchTerm || searchTerm.trim() === "") {
    console.error(" 검색어가 비어있습니다. 북마크순 정렬을 할 수 없습니다.");
    return;
  }

  try {
    const encodedSearchTerm = encodeURIComponent(searchTerm.trim());
    const response = await axios.get(`https://janghong.asia/book/ranking/bookmark?keyword=${encodedSearchTerm}`);
    setSearchResults(response.data || []);
  } catch (err) {
    console.error(" 북마크순 가져오기 실패", err);
  }
};


const debouncedSearchTerm = useDebounce(searchTerm, 500); //  searchTerm만 디바운스

useEffect(() => {
  if (debouncedSearchTerm) {
    fetchBooks(debouncedSearchTerm); // 디바운스된 값이 변경될 때만 실행
  }
}, [debouncedSearchTerm]);  // 디바운스된 값만 의존성으로 설정
 
  

  //  정렬 버튼 클릭 핸들러
  const handleSortChange = (type) => {
    setSortType(type);
  
    if (type === "전체보기") {
      fetchBooks(searchTerm);
    } else if (type === "북마크순") {
      fetchBooksByBookmark();
    } else if (type === "난이도순") { // 난이도순 정렬 기능 추가
      fetchBooksByDifficulty();
    }
  };

  // 북마크 추가 (백엔드 API 호출)
  const toggleBookmark = async (book) => {
    if (!book || !userEmail) {
      console.error("북마크 추가 실패: 유저 이메일이 없습니다.");
      return;
    }

    const requestData = {
      userEmail: userEmail,
      title: book.volumeInfo.title,
      author: book.volumeInfo.authors?.join(", ") || "정보 없음",
      pageCount: book.volumeInfo.pageCount || 0,
      publisher: book.volumeInfo.publisher || "정보 없음",
      thumbnail: book.volumeInfo.imageLinks?.thumbnail || "",
      googleBookId: book.id || "정보 없음" 
    };
    
    

    console.log("북마크 요청 데이터:", requestData);

    try {
      const response = await apiClient.post(`/bookmark`, requestData);
      console.log("북마크 추가 성공:", response.data.message);

      setBookmarkedBooks((prev) => ({
        ...prev,
        [book.id]: true,
      }));
    } catch (error) {
      console.error(" 북마크 추가 실패:", error);
    }
  };

 
  const handleSearch = (e) => {
    e.preventDefault();  // 폼 제출 시 페이지 새로고침 방지
    const trimmedSearchTerm = searchTerm.trim();  // 검색어에서 공백 제거 후 상태 업데이트
    setSearchTerm(trimmedSearchTerm);  // 상태 업데이트
    sessionStorage.setItem("lastQuery", trimmedSearchTerm);  // 검색어를 세션 스토리지에 저장
    fetchBooks(trimmedSearchTerm);  // 바로 책 정보 가져오기
  };

  
  const handleBookClick = (book) => {
    if (!book || !book.id) {
      console.error("책 ID가 존재하지 않습니다.");
      return;
    }
  
    const googleBookId = book.id;
    const bookId = book.volumeInfo?.industryIdentifiers?.[0]?.identifier || "unknown";
  
    navigate(`/searchdetail/${googleBookId}/${bookId}`);
  };
  
  
  const fetchBooksByDifficulty = async () => {
    if (!searchTerm || searchTerm.trim() === "") {
      console.error("검색어가 비어있습니다. 난이도순 정렬을 할 수 없습니다.");
      return;
    }
  
    try {
      const encodedSearchTerm = encodeURIComponent(searchTerm.trim());
      const response = await axios.get(`https://janghong.asia/book/ranking/difficulty?keyword=${encodedSearchTerm}`);
  
      console.log(" 백엔드 응답 데이터:", response.data); // 🔹 응답 확인
  
      // 🔹 `difficultyScore`를 float 형식으로 변환 후 정렬
      const sortedBooks = [...response.data]
        .map(book => ({
          ...book,
          difficultyScore: typeof book.difficultyScore === "number" 
            ? book.difficultyScore // 이미 숫자라면 그대로 사용
            : parseFloat(book.difficultyScore) || 0 // 혹시 문자열이면 float 변환
        }))
        .sort((a, b) => b.difficultyScore - a.difficultyScore); // 🔹 높은 점수가 먼저 나오도록 정렬
  
      console.log(" 정렬된 책 목록:", sortedBooks); // 🔹 정렬된 데이터 확인
      setSearchResults(sortedBooks || []);
    } catch (err) {
      console.error("난이도순 가져오기 실패:", err);
    }
  };

  // 정렬된 책 목록이 없을 경우 메시지를 보여주는 부분
const renderNoResultsMessage = () => {
  if (sortType === "북마크순") {
    return <img
    src={nobookmarklist}
    alt="nbl"
    className={styles.nobookmarklist}
  />
  }
  if (sortType === "난이도순") {
    return <img
    src={nolevellist}
    alt="nbl"
    className={styles.nobookmarklist}
  />;
  }
  return null;
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
      <div className={styles.filterButtons}>
  <label className={styles.filterLabel}>
    <input
      type="radio"
      className={sortType === "전체보기" ? styles.active : styles.inactive}
      onClick={() => handleSortChange("전체보기")}
      name="sort"
    />
    전체 보기
  </label>
  <label className={styles.filterLabel}>
    <input
      type="radio"
      className={sortType === "난이도순" ? styles.active : styles.inactive}
      onClick={() => handleSortChange("난이도순")}
      name="sort"
    />
    난이도순
  </label>
  <label className={styles.filterLabel}>
    <input
      type="radio"
      className={sortType === "북마크순" ? styles.active : styles.inactive}
      onClick={() => handleSortChange("북마크순")}
      name="sort"
    />
    북마크순
  </label>
</div>



     
      <div className={styles.books}>
      {searchResults.length === 0 ? (
        <div className={styles.noResultsMessage}>
          {renderNoResultsMessage()}
        </div>
      ) : (
        searchResults.map((book) => (
          <div className={styles.bookcard} key={book.id || book.bookId}>
            <div className={styles.infomation}>
              <div className={styles.bookcover} onClick={() => handleBookClick(book)}>
                {book.volumeInfo?.imageLinks?.thumbnail || book.thumbnail ? (
                  <img src={book.volumeInfo?.imageLinks?.thumbnail || book.thumbnail} alt={book.title} />
                ) : (
                  <div className={styles.placeholder}>No Image</div>
                )}

                <h1>{book.title || book.volumeInfo?.title}</h1>
                <h2>
                  <span className={styles.lowlight}>저자 (글) </span>
                  {book.author || book.volumeInfo?.authors?.join(", ")}
                </h2>
                {book.countOfBookMark && <p>북마크 {book.countOfBookMark}개</p>}
              </div>
            </div>

           
            <button className={styles.bookmarkButton} onClick={() => toggleBookmark(book)}>
              <img
                src={bookmarkedBooks[book.id] ? bookmark : nonbookmark}
                alt="북마크"
                style={{ width: "24px", height: "auto" }}
              />
            </button>
          </div>
        ))
      )}
      </div>

      <Footer />
    </div>
  );
};

export default BookList;