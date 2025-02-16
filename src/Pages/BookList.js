import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from 'axios';
import styles from "../styles/search.module.css";
import Footer from '../components/footer/Footer.js';
import HomeHeader from '../components/header/HomeHeader.js';
import searchbtn from '../img/searchbtn.png';
import nonbookmark from '../img/nonbookmark.png';
import bookmark from '../img/bookmark.png';
import { useEffect } from "react";



const BookList = () => {
  const navigate = useNavigate();
  const location = useLocation();  // useLocation 훅을 사용하여 전달된 state 받아오기
  const [searchTerm, setSearchTerm] = useState(location.state?.searchTerm || "");  // state에서 검색어 받기
  const [searchResults, setSearchResults] = useState(location.state?.books || []);  // state에서 검색 결과 받기
  const [BookRead, setBookRead] = useState({});


  useEffect(() => {
    if (!searchResults.length && searchTerm) {
      fetchBooks(searchTerm);  // 검색 결과가 없으면 다시 검색 실행함.
    }
  }, [searchTerm, searchResults]); //이 배열에 포함된 값(검색어랑, 결과값)이 변경될 때마다 useEffect가 다시 실행됨.
  //searchTerm과 searchResults가 초기값을 갖고 시작함. ---> Search.js에서 handleBtnClick 함수에서
  // 책목록이랑 검색어를 BookList 페이지로 전달하면서 페이지 이동시키기 때문에 Search.js의 검색어와 책목록이 아래 코드의 리턴을 통해서 목록이 화면에 띄워짐.


  // 책의 북마크 상태를 토글하는 함수
  const toggleBookmark = (book) => {
    setBookRead((prev) => ({
      ...prev,
      [book.id]: !prev[book.id],  // 책의 id를 키로 하여 북마크 상태를 변경
    }));
  };

  // 북마크 클릭 시 실행되는 함수
  const handleBookmarkClick = (book) => {
    toggleBookmark(book);  // 북마크 상태 토글
    addToMark(book);  // 로컬 스토리지에 북마크 추가
  };

  // 책 정보를 구글 API로부터 가져오는 함수
  const fetchBooks = async (searchQuery) => {
    if (!searchQuery) return;  // 검색어가 없으면 반환

    try {
      // 구글 책 API에서 검색어에 맞는 책 데이터를 요청
      const response = await axios.get(`https://www.googleapis.com/books/v1/volumes?q=${searchQuery}&maxResults=40`);
      setSearchResults(response.data.items || []);  // 받은 데이터로 검색 결과 업데이트
    } catch (err) {
      console.error(err);  // 오류 발생 시 오류 출력
    }
  };

  // 검색어 입력 후 검색 버튼 클릭 시 실행되는 함수
  const handleSearch = (e) => {
    e.preventDefault();  // 폼 제출 시 페이지 새로고침 방지
    const trimmedSearchTerm = searchTerm.trim();  // 검색어에서 공백 제거 후 상태 업데이트
    setSearchTerm(trimmedSearchTerm);  // 상태 업데이트
    sessionStorage.setItem("lastQuery", trimmedSearchTerm);  // 검색어를 세션 스토리지에 저장
    fetchBooks(trimmedSearchTerm);  // 바로 책 정보 가져오기
  };

  // 책 클릭 시 상세 페이지로 이동하는 함수
  const handleBookClick = (book) => {
    navigate(`/detail/${book.id}`, { state: { book } });  // 책 ID를 이용해 상세 페이지로 이동
  };

  // 북마크를 로컬 스토리지에 추가하는 함수
  const addToMark = (book) => {
    const storedBookmarks = JSON.parse(localStorage.getItem("bookmarks")) || [];  // 로컬 스토리지에서 기존 북마크 목록 가져오기
    if (!storedBookmarks.find((b) => b.id === book.id)) {  // 이미 북마크된 책이 아니면
      const updatedBookmarks = [...storedBookmarks, book];  // 새로 북마크 목록에 추가
      localStorage.setItem("bookmarks", JSON.stringify(updatedBookmarks));  // 업데이트된 북마크 목록을 로컬 스토리지에 저장
    }
  };

  return (
    <div>
      <HomeHeader />  {/* 헤더 컴포넌트 */}
      <div className={styles.b}>
        <form onSubmit={handleSearch}>
          <div className={styles.con}>
            <div className={styles.bar}>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}  // 검색어 입력 시 상태 업데이트
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

      {/* 검색된 책 목록 */}
      <div className={styles.books}>
      {searchResults && searchResults.length > 0 && searchResults.map((book) => (
    <div className={styles.bookcard} key={book.id}>  {/* 각 책 카드 */}
      <div className={styles.infomation}>
        <div className={styles.bookcover} onClick={() => handleBookClick(book)}>
          {/* 책 표지 이미지 */}
          {book.volumeInfo.imageLinks?.thumbnail ? (
            <img src={book.volumeInfo.imageLinks.thumbnail} alt={book.volumeInfo.title} />
          ) : (
            <div className={styles.placeholder}>No Image</div>  // 이미지가 없으면 대체 텍스트
          )}

          <h1>{book.volumeInfo.title}</h1>  {/* 책 제목 */}
          <h2><span className={styles.lowlight}>저자 (글) </span>{book.volumeInfo.authors}</h2>  {/* 저자 */}
        </div>
      </div>

      {/* 북마크 버튼 */}
      <button className={styles.bookmarkButton} onClick={() => handleBookmarkClick(book)}>
        <img
          src={BookRead[book.id] ? bookmark : nonbookmark}  // 북마크 상태에 따라 이미지 변경
          alt="bookmark"
          style={{
            width: "24px",
            height: "auto",
          }}
        />
      </button>
    </div>
  ))}
      </div>
      
      <Footer />  {/* 푸터 컴포넌트 */}
    </div>
  );
};

export default BookList;