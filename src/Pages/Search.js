import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Button from "../components/ui/button";
import styles from "../styles/search.module.css";
import HomeHeader from '../components/header/HomeHeader.js';

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
      <HomeHeader />
      <form onSubmit={handleSearch}>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="책 검색..."
        />
        <Button type="submit">검색</Button>
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
  );
};

export default Search;
