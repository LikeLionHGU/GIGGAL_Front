import React, { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import _ from "lodash"; // Lodash 라이브러리 추가
import styles from "../styles/search.module.css";
import HomeHeader from '../components/header/Headers.js';
import hr from '../img/line.png';  
import boogies from '../img/boogies.png';  
import searchbtn from '../img/searchbtn.png';  
import text from '../img/text.png';  
import bestbox from '../img/bestbox.png';  
import Footer from '../components/footer/Footer.js';

// 구글 책 API URL 및 API Key 추가
const API_URL = "https://www.googleapis.com/books/v1/volumes";
const GOOGLE_API_KEY = "AIzaSyCOhxzEmFNG0E9GCrAAYeSQ8Q2NYrjC-b0"; // 🔹 여기에 Google API Key 추가

const Search = () => {
  const [books, setBooks] = useState([]);  
  const [searchTerm, setSearchTerm] = useState("");  
  const navigate = useNavigate();

  // 🔹 디바운스를 적용한 API 요청 함수
  const fetchBooks = useCallback(
    _.debounce(async (searchQuery) => {
      if (!searchQuery) return;

      try {
        const response = await axios.get(`${API_URL}?q=${searchQuery}&maxResults=40&key=${GOOGLE_API_KEY}`);
        setBooks(response.data.items || []);
        sessionStorage.setItem("lastBooks", JSON.stringify(response.data.items || []));
      } catch (err) {
        console.error("❌ API 요청 실패:", err);
      }
    }, 1000), // 1초(1000ms) 동안 추가 요청이 없으면 실행
    []
  );

  // 🔹 검색어 변경 시 API 호출
  const handleSearchChange = (e) => {
    const trimmedSearchTerm = e.target.value.trim();
    setSearchTerm(trimmedSearchTerm);
    fetchBooks(trimmedSearchTerm); // 자동으로 API 요청 (디바운스 적용됨)
  };

  // 🔹 검색 버튼 클릭 시 실행
  const handleBtnClick = () => {
    if (!searchTerm.trim()) return;
  
    navigate(`/BookList`, { state: { books, searchTerm } });
  };
  

  return (
    <div>
      <div className={styles['search-container']}>
        <HomeHeader />
        <div className={styles.line} />
        <img src={hr} alt="hr" className={styles.line} />  

        <div className={styles.center}>
          <img src={boogies} alt="boogies" className={styles.boogies} />
          <div className={styles.main}>나에게 딱 맞는 책을<br />검색해보세요.</div>  
          <div className={styles.mtext}>
            원하는 <span className={styles.highlight}>책의 키워드</span>를 검색해보세요 !
          </div>
        </div>

        {/* 🔹 검색 폼 */}
        <form onSubmit={(e) => e.preventDefault()}>
          <div className={styles.con}>
            <div className={styles.bar}>
              <input
                type="text"
                value={searchTerm}
                onChange={handleSearchChange} // 🔹 입력 시 API 요청 (디바운스 적용됨)
                placeholder="Search"
                className={styles.bari}
              />
              <button type="button" className={styles.sbtn} onClick={handleBtnClick}>
                <img src={searchbtn} alt="검색" className={styles.searchbtn} />
              </button>
            </div>
          </div>
        </form>

        <img src={text} alt="text" className={styles.text} />  
        <img src={bestbox} alt="bestbox" className={styles.bestbox} />  
      </div>

      <Footer />  
    </div>
  );
};

export default Search;
