import React from "react";
import { useLocation } from "react-router-dom";
import styles from "../styles/search.module.css";

const BookList = () => {
  const location = useLocation();
  const books = location.state?.books || []; // 전달된 books 데이터 받기

  return (
    <div className={styles.books}>
      {books.length > 0 ? (
        books.map((book) => (
          <div className={styles.bookcard} key={book.id}>
            <h1>{book.volumeInfo.title}</h1>
            {book.volumeInfo.imageLinks?.thumbnail ? (
              <img
                src={book.volumeInfo.imageLinks.thumbnail}
                alt={book.volumeInfo.title}
              />
            ) : (
              <div className={styles.placeholder}>No Image</div>
            )}
          </div>
        ))
      ) : (
        <div>No books found</div>
      )}
    </div>
  );
};

export default BookList;
