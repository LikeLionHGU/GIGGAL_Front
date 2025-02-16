import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "../styles/search.module.css";
import HomeHeader from '../components/header/Headers.js';
import hr from '../img/line.png';  
import boogies from '../img/boogies.png';  
import searchbtn from '../img/searchbtn.png';  
import text from '../img/text.png';  
import bestbox from '../img/bestbox.png';  
import Footer from '../components/footer/Footer.js';

// 구글 책 API URL
const API_URL = "https://www.googleapis.com/books/v1/volumes";

const Search = () => {
  // React의 useState 훅을 사용해 상태 관리
  const [books, setBooks] = useState([]);  // 책 데이터를 저장할 상태
  const [searchTerm, setSearchTerm] = useState("");  // 검색어를 저장할 상태
  const navigate = useNavigate();  // react-router의 navigate 훅, 페이지 이동에 사용

  // 책 검색 함수 (API 호출)
  const fetchBooks = async (searchQuery) => {
    if (!searchQuery) return;  // 검색어가 없으면 함수 종료

    try {
      // Google Books API에서 검색어에 맞는 책 데이터를 요청
      const response = await axios.get(`${API_URL}?q=${searchQuery}&maxResults=40`);
      setBooks(response.data.items || []);  // 받아온 책 데이터를 상태에 저장
      // 받아온 책 데이터를 sessionStorage에 저장 (브라우저 세션 종료 후에도 저장된 데이터를 이용할 수 있게)
      sessionStorage.setItem("lastBooks", JSON.stringify(response.data.items || [])); 
    } catch (err) {
      console.error(err);  // 오류 발생 시 오류 로그 출력
    }
  };



// 검색 함수
const handleSearch = (e) => {
  e.preventDefault(); // 폼 제출 시 페이지 새로고침 방지
  const trimmedSearchTerm = searchTerm.trim(); // 검색어의 앞뒤 공백 제거
  setSearchTerm(trimmedSearchTerm); // 검색어 상태 업데이트
  sessionStorage.setItem("lastQuery", trimmedSearchTerm); // 세션 스토리지에 검색어 저장
  fetchBooks(trimmedSearchTerm); // 바로 책 정보 가져오기
};

// 검색 버튼 클릭 시 실행되는 함수 (BookList.js에서 책누르면 상세정보로 이동하는 함수인 handleBookClick을 변형해서 만듦)
const handleBtnClick = () => {
  if (!searchTerm.trim()) return; // 검색어가 없으면 함수 실행 안하고 종료함
  navigate(`/BookList`, { state: { books, searchTerm } }); // 책목록이랑 검색어를 BookList 페이지로 전달하면서 페이지 이동시키기
};

  
  


 

  return (
    <div>
      <div className={styles['search-container']}>
        <HomeHeader />  {/* 헤더 컴포넌트 */}
        <div className={styles.line} />
        <img src={hr} alt="hr" className={styles.line} />  {/* 라인 이미지 */}
        
        <div className={styles.center}>
          <img src={boogies} alt="boogies" className={styles.boogies} />  {/* 캐릭터 이미지 */}
          <div className={styles.main}>나에게 딱 맞는 책을<br />검색해보세요.</div>  {/* 메인 텍스트 */}
          <div className={styles.mtext}>
            원하는 <span className={styles.highlight}>책의 키워드</span>를 검색해보세요 !
          </div>
        </div>

        <form onSubmit={handleSearch}>
          <div className={styles.con}>
            <div className={styles.bar}>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}  // 입력값이 변경되면 searchTerm 상태 업데이트
                placeholder="Search"
                className={styles.bari}
              />
              <button type="submit" className={styles.sbtn} onClick={handleBtnClick} >
                <img src={searchbtn} alt="검색" className={styles.searchbtn} />
              </button>
            </div>
          </div>
        </form>

        <img src={text} alt="text" className={styles.text} />  {/* 텍스트 이미지 */}
        <img src={bestbox} alt="bestbox" className={styles.bestbox} />  {/* 추천 도서 박스 이미지 */}
      </div>

      <Footer />  {/* 푸터 컴포넌트 */}
    </div>
  );
};

export default Search;
