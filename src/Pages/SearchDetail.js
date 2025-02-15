import { useLocation, useNavigate } from "react-router-dom";
import styles from "../styles/searchdetail.module.css";
import HomeHeader from '../components/header/SearchHeader.js';
import bookmarkIcon from "../img/bookmark.png"; 

const SearchDetail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const book = location.state?.book;

   // 로컬스토리지에서 북마크 개수 가져오기
   const storedBookmarks = JSON.parse(localStorage.getItem("bookmarks")) || [];
   const bookmarkCount = storedBookmarks.length;

  if (!book) {
    return <p className={styles.loading}>📚 책 정보를 찾을 수 없습니다.</p>;
  }

  return (
    <div>
      <HomeHeader />
      <div className={styles.container}>
        {/* 뒤로 가기 버튼 */}
        <button className={styles.backButton} onClick={() => navigate(-1)}>
          ←
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
             {/* 북마크 컨테이너 */}
        
        <div className={styles.bookmarkContainer}>
              <span className={styles.bookmarkText}>
                <img src={bookmarkIcon} alt="북마크" className={styles.bookmarkIcon} />
                {bookmarkCount}
              </span>
              <span className={styles.readableText}>📖 읽을만해요</span>
            </div>
            <div className={styles.contain}>
  <span className={styles.bookAuthor}>
    글 [{book.volumeInfo.authors?.join(", ") || "정보 없음"}]
  </span>
  <span className={styles.bookPublisher}>
    {book.volumeInfo.publisher || "정보 없음"}
  </span>
  <span className={styles.bookPages}>
    쪽수: {book.volumeInfo.pageCount || "정보 없음"}
  </span>
  
</div>
<div className={styles.divider}></div>

          </div>
        </div>

        {/* 탭 UI */}
        <div className={styles.tabs}>
          <div className={`${styles.tab} ${styles.active}`}>책 정보</div>
          <div className={styles.tab}>커뮤니티</div>
        </div>

        {/* 책 설명 */}
        <div className={styles.bookContent}>
          <p className={styles.bookDescription}>
            {book.volumeInfo.description || "설명 없음"}
          </p>
        </div>

       
      </div>
    </div>
  );
};

export default SearchDetail;
