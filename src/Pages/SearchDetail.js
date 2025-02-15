import { useLocation, useNavigate } from "react-router-dom";
import styles from "../styles/searchdetail.module.css";
import HomeHeader from '../components/header/SearchHeader.js';

const SearchDetail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const book = location.state?.book; // Search.js에서 전달된 책 정보

  if (!book) {
    return <p className={styles.loading}>📚 책 정보를 찾을 수 없습니다.</p>;
  }

  return (
    <div>
      <HomeHeader />
      <div className={styles.container}>
        {/* 뒤로 가기 버튼 */}
        <button className={styles.backButton} onClick={() => navigate(-1)}>
          🔙 뒤로가기
        </button>

        {/* 책 정보 카드 */}
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
            <p className={styles.bookAuthor}>
              저자: {book.volumeInfo.authors?.join(", ") || "정보 없음"}
            </p>
            <p className={styles.bookPublisher}>
              출판사: {book.volumeInfo.publisher || "정보 없음"}
            </p>
            <p className={styles.bookPages}>
              쪽수: {book.volumeInfo.pageCount || "정보 없음"}
            </p>
          </div>
        </div>

        {/* 책 설명 */}
        <div className={styles.bookContent}>
          <h2>책 소개</h2>
          <p className={styles.bookDescription}>
            {book.volumeInfo.description || "설명 없음"}
          </p>
        </div>

        {/* 버튼 영역 */}
        <a
          href={book.volumeInfo.infoLink}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.button}
        >
          📖 구글 도서에서 보기
        </a>
      </div>
    </div>
  );
};

export default SearchDetail;
