import { useLocation, useNavigate } from "react-router-dom";
import styles from "../styles/searchdetail.module.css";
import HomeHeader from '../components/header/SearchHeader.js';

const SearchDetail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const book = location.state?.book;

  // 📌 북마크 추가 함수
  const addToMark = (book) => {
    const storedBookmarks = JSON.parse(localStorage.getItem("bookmarks")) || [];

    if (!storedBookmarks.find((mark) => mark.id === book.id)) {
      storedBookmarks.push(book);
      localStorage.setItem("bookmarks", JSON.stringify(storedBookmarks));
    }
  };

  if (!book) {
    return <p className={styles.loading}>📚 책 정보를 찾을 수 없습니다.</p>;
  }

  return (
    <div>
    <HomeHeader />
    <div className={styles.container}>
      <button className={styles.backButton} onClick={() => navigate(-1)}>←</button>
      
      <div className={styles.bookHeader}>
        {book.volumeInfo.imageLinks && (
          <img
            src={book.volumeInfo.imageLinks.thumbnail}
            alt={book.volumeInfo.title}
            className={styles.bookCover}
          />
        )}
        <div className={styles.bookInfo}>
          <h1 className={styles.bookTitle}>{book.volumeInfo.title}</h1>
          <p className={styles.bookAuthor}>저자: {book.volumeInfo.authors?.join(", ") || "정보 없음"}</p>
          <p className={styles.bookPublished}>출간일: {book.volumeInfo.publishedDate || "정보 없음"}</p>
          <p className={styles.bookPublisher}>출판사: {book.volumeInfo.publisher || "정보 없음"}</p>
          <p className={styles.bookPages}>쪽수: {book.volumeInfo.pageCount || "정보 없음"} 페이지</p>
        </div>
      </div>

      <div className={styles.tabs}>
        <div className={`${styles.tab} ${styles.active}`}>책 정보</div>
        <div className={styles.tab}>커뮤니티</div>
      </div>

      <div className={styles.bookContent}>
        <h2>책 소개</h2>
        <p className={styles.bookDescription}>{book.volumeInfo.description || "설명 없음"}</p>
      </div>

      <button onClick={() => addToMark(book)} className={styles.button}>
        ⭐ 북마크 추가
      </button>
      <button
        className={styles.btnRead}
        onClick={() => navigate(`/timer?bookId=${book.id}`)}
      >
        📖 책 읽기
      </button>
    </div>
    </div>
  );
};

export default SearchDetail;
