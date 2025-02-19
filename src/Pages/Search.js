import React, { useState, useEffect} from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "../styles/search.module.css";
import HomeHeader from '../components/header/HomeHeader.js';
import hr from '../img/line.png';  
import boogies from '../img/boogies.png';  
import searchbtn from '../img/searchbtn.png';  
import text from '../img/text.png';  
import Footer from '../components/footer/Footer.js';

const API_BASE_URL = "https://janghong.asia/book"; // 백엔드 API URL

const Search = () => {
  // eslint-disable-next-line no-unused-vars
const [books, setBooks] = useState([]);
 
  const [searchTerm, setSearchTerm] = useState("");  
  const [recommendBooks, setRecommendBooks] = useState([]); // 추천 책 리스트
  const navigate = useNavigate();

    

  // 🔹 백엔드 API에서 추천 책 데이터 가져오기
  useEffect(() => {
    const fetchRecommendBooks = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/ranking/recommendation`);
        setRecommendBooks(response.data || []);
      } catch (err) {
        console.error("❌ 추천 책 API 요청 실패:", err);
      }
    };

    fetchRecommendBooks();
  }, []);

  // 🔹 검색어 변경 시 API 호출
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
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
                onChange={handleSearchChange} 
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

        {/* 🔹 bestbox를 배경으로 하고 그 안에 책 리스트를 표시 */}
        <div className={styles.bestboxContainer}>
          <div className={styles.bestboxContent}>
            <ul className={styles.bookList}>
              {recommendBooks.length > 0 ? (
                recommendBooks.map((book) => (
                  <li key={book.bookId} className={styles.bookItem}>
                    <img src={book.thumbnail || "https://via.placeholder.com/100"} alt={book.title} className={styles.booki} />
                    <div className={styles.bookInfo}>
                      <h4 className={styles.bookTitle}>{book.title}</h4>
                    </div>
                  </li>
                ))
              ) : (
                <p className={styles.noResults}></p>
              )}
            </ul>
          </div>
        </div>
      </div>

      <Footer />  
    </div>
  );
};

export default Search;
