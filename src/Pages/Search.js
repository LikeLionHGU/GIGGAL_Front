import React, { useState, useEffect } from "react";
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

const API_URL = "https://www.googleapis.com/books/v1/volumes";

const Search = () => {
  const [books, setBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [query, setQuery] = useState(() => sessionStorage.getItem("lastQuery") || "");
  const navigate = useNavigate();

  const fetchBooks = async (searchQuery) => {
    if (!searchQuery) return;

    try {
        const response = await axios.get(`${API_URL}?q=${searchQuery}&maxResults=40`);
        setBooks(response.data.items || []);
        sessionStorage.setItem("lastBooks", JSON.stringify(response.data.items || [])); // 최신 결과로 저장
    } catch (err) {
        console.error(err); // 오류 처리
    }
};

  
  useEffect(() => {
    if (query) {
        fetchBooks(query);  // 새로운 쿼리로 검색
    }
}, [query]);

  

  const handleSearch = (e) => {
    e.preventDefault();
    setQuery(searchTerm.trim());
    sessionStorage.setItem("lastQuery", searchTerm.trim()); // 검색어 저장
    fetchBooks(searchTerm.trim()); // 검색 결과 불러오기
    // 검색 후 BookList 페이지로 이동하며 books 전달
    navigate("/booklist", { state: { books } });
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
