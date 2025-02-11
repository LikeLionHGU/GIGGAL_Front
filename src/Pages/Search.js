import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Button from "../components/ui/button";
import styles from "../styles/search.module.css";

const API_URL = "https://www.googleapis.com/books/v1/volumes";

const Search = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [query, setQuery] = useState(() => sessionStorage.getItem("lastQuery") || ""); // 이전 검색어 유지
  const navigate = useNavigate();

  const fetchBooks = async (searchQuery) => {
    if (!searchQuery) return;
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(`${API_URL}?q=${searchQuery}&maxResults=40`);
      setBooks(response.data.items || []);
      sessionStorage.setItem("lastBooks", JSON.stringify(response.data.items || [])); // 검색 결과 저장
    } catch (err) {
      setError(err);
    }

    setLoading(false);
  };

  useEffect(() => {
    const savedBooks = JSON.parse(sessionStorage.getItem("lastBooks") || "[]");
    setBooks(savedBooks);
    fetchBooks(query);
  }, [query]);

  const handleSearch = (e) => {
    e.preventDefault();
    setQuery(searchTerm.trim());
    sessionStorage.setItem("lastQuery", searchTerm.trim()); // 검색어 저장
  };

  const handleBookClick = (book) => {
    navigate(`/detail/${book.id}`, { state: { book } });
  };

  return (
    <div>
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
          <div
            key={book.id}
            className={styles.bookCard}
            onClick={() => handleBookClick(book)}
          >
            {book.volumeInfo.imageLinks?.thumbnail ? (
              <img src={book.volumeInfo.imageLinks.thumbnail} alt={book.volumeInfo.title} />
            ) : (
              <div className={styles.placeholder}>No Image</div>
            )}
            <h1>{book.volumeInfo.title}</h1>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Search;
