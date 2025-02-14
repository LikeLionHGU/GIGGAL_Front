import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "../styles/search.module.css";
import HomeHeader from '../components/header/Headers.js';
import hr from '../img/line.png';  // '../img/'로 경로를 수정
import boogies from '../img/boogies.png';  // '../img/'로 경로를 수정
import searchbtn from '../img/searchbtn.png';  // '../img/'로 경로를 수정
import text from '../img/text.png';  // '../img/'로 경로를 수정
import bestbox from '../img/bestbox.png';  // '../img/'로 경로를 수정
import Footer from '../components/footer/Footer.js';

const API_URL = "https://www.googleapis.com/books/v1/volumes";

const Search = () => {
  const [books, setBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [query, setQuery] = useState(() => sessionStorage.getItem("lastQuery") || "");
  const navigate = useNavigate();

  const addToMark = (book) => {
    const storedBookmarks = JSON.parse(localStorage.getItem("bookmarks")) || [];
    if (!storedBookmarks.find((b) => b.id === book.id)) {
      const updatedBookmarks = [...storedBookmarks, book];
      localStorage.setItem("bookmarks", JSON.stringify(updatedBookmarks));
    }
  };

  const fetchBooks = async (searchQuery) => {
    if (!searchQuery) return;

    try {
      const response = await axios.get(`${API_URL}?q=${searchQuery}&maxResults=40`);
      setBooks(response.data.items || []);
      sessionStorage.setItem("lastBooks", JSON.stringify(response.data.items || []));
    } catch (err) {
      console.error(err); // 오류 처리
    }
  };

  useEffect(() => {
    const savedBooks = JSON.parse(sessionStorage.getItem("lastBooks") || "[]");
    setBooks(savedBooks);
    fetchBooks(query);
  }, [query]);

  const handleSearch = (e) => {
    e.preventDefault();
    setQuery(searchTerm.trim());
    sessionStorage.setItem("lastQuery", searchTerm.trim());
  };

  const handleBookClick = (book) => {
    navigate(`/detail/${book.id}`, { state: { book } });
  };

  return (
    <div>

    <div className={styles['search-container']}>  {/* 이곳에 search-container 클래스 추가 */}
    <HomeHeader />
    <div className={styles.line}/>
    <img src={hr} alt="hr" className={styles.line}/>
    <div className={styles.center}> 
      <img src={boogies} alt="hr" className={styles.boogies}/>
      <div className={styles.main}>나에게 딱 맞는 책을<br/>검색해보세요.</div>
      <div className={styles.mtext}>
  원하는 <span className={styles.highlight}>책의 키워드</span>를 검색해보세요 !
</div>


      </div>
   
      <form onSubmit={handleSearch} >
        <div className={styles.con}>
             <div className={styles.bar}>
  <input
    type="text"
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
    placeholder="Search"
    className={styles.bari}
  />
      <div>
        
      </div>
      <div className={styles.sbtn} onClick={handleSearch}>
  </div>
  <img src={searchbtn} alt="hr" className={styles.searchbtn} onClick={handleSearch}/>
  


</div>
        </div>
        <img src={text} alt="hr" className={styles.text}/>
        <img src={bestbox} alt="hr" className={styles.bestbox}/>
      </form>
      <div className={styles.books}>
        {books.map((book) => (
          <div className={styles.bookcard} key={book.id}>
            <button onClick={() => addToMark(book)} className={styles.button}>
              북마크 추가
            </button>
            <div onClick={() => handleBookClick(book)}>
              {book.volumeInfo.imageLinks?.thumbnail ? (
                <img src={book.volumeInfo.imageLinks.thumbnail} alt={book.volumeInfo.title} />
              ) : (
                <div className={styles.placeholder}>No Image</div>
              )}
              <h1>{book.volumeInfo.title}</h1>
            </div>
          </div>
        ))}
      </div>
    </div>
    <Footer/>
    </div>
    
  );
};

export default Search;
