import React, { useState, useEffect } from "react";  
import { useNavigate } from "react-router-dom";  
import axios from 'axios';  
import styles from "../styles/search.module.css";
import Footer from '../components/footer/Footer.js';
import HomeHeader from '../components/header/HomeHeader.js';
import searchbtn from '../img/searchbtn.png';  
import nonbookmark from '../img/nonbookmark.png';  
import bookmark from '../img/bookmark.png';  

const BookList = () => {
  const navigate = useNavigate();  
  const [searchTerm, setSearchTerm] = useState("");  
  const [searchResults, setSearchResults] = useState([]);  
  const [BookRead, setBookRead] = useState({});

  const toggleBookmark = (book) => {
    setBookRead((prev) => ({
      ...prev,
      [book.id]: !prev[book.id], 
    }));
  };

  const handleBookmarkClick = (book) => {
    toggleBookmark(book); 
    addToMark(book);      
  };

  const fetchBooks = async (searchQuery) => {
    if (!searchQuery) return;

    try {
      const response = await axios.get(`https://www.googleapis.com/books/v1/volumes?q=${searchQuery}&maxResults=40`);
      setSearchResults(response.data.items || []);  
    } catch (err) {
      console.error(err);  
    }
  };

  useEffect(() => {
    if (searchTerm) {
      fetchBooks(searchTerm);
    }
  }, [searchTerm]);

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchTerm(searchTerm.trim());
    sessionStorage.setItem("lastQuery", searchTerm.trim()); 
  };

  const handleBookClick = (book) => {
    navigate(`/detail/${book.id}`, { state: { book } });  
  };

  const addToMark = (book) => {
    const storedBookmarks = JSON.parse(localStorage.getItem("bookmarks")) || [];
    if (!storedBookmarks.find((b) => b.id === book.id)) {
      const updatedBookmarks = [...storedBookmarks, book];
      localStorage.setItem("bookmarks", JSON.stringify(updatedBookmarks));
    }
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

      <div className={styles.books}>
        {searchResults?.length === 0 ? (
          <div>검색된 책이 없습니다.</div>
        ) : (
          searchResults.map((book) => (
            <div className={styles.bookcard} key={book.id}> 
            <div className={styles.infomation}>
              <div className={styles.bookcover} onClick={() => handleBookClick(book)}>
                {book.volumeInfo.imageLinks?.thumbnail ? (
                  <img src={book.volumeInfo.imageLinks.thumbnail} alt={book.volumeInfo.title} />
                ) : (
                  <div className={styles.placeholder}>No Image</div>
                )}
               

                <h1>{book.volumeInfo.title}</h1>
                <h2><span className={styles.lowlight}>저자 (글) </span>{book.volumeInfo.authors}</h2>
                </div>
              </div>

              <button className={styles.bookmarkButton} onClick={() => handleBookmarkClick(book)}>
                <img
                  src={BookRead[book.id] ? bookmark : nonbookmark}
                  alt="bookmark"
                  style={{
                    width: "24px",
                    height: "auto",
                  }}
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
