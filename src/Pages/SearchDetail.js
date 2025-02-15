import { useLocation, useNavigate } from "react-router-dom";
import styles from "../styles/searchdetail.module.css";
import HomeHeader from '../components/header/SearchHeader.js';
import bookmarkIcon from "../img/bookmark.png"; 
import readingbook from "../img/image.png";

const SearchDetail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const book = location.state?.book;

  // 로컬스토리지에서 북마크 개수 가져오기
  const storedBookmarks = JSON.parse(localStorage.getItem("bookmarks")) || [];
  const bookmarkCount = storedBookmarks.length;

  // 짧막한 설명을 30자 이하로 제한
  const shortDescription = book.volumeInfo.subtitle && book.volumeInfo.subtitle.length > 30
    ? book.volumeInfo.subtitle.slice(0, 30) + "..."
    : book.searchInfo?.textSnippet && book.searchInfo.textSnippet.length > 30
    ? book.searchInfo.textSnippet.slice(0, 30) + "..."
    : book.volumeInfo.subtitle || book.searchInfo?.textSnippet || "설명 없음";

  if (!book) {
    return <p className={styles.loading}>📚 책 정보를 찾을 수 없습니다.</p>;
  }

  return (
    <div>
      <HomeHeader />
      <div className={styles.container}>
        <div className={styles.innercontainer}>
        {/* 뒤로 가기 버튼 */}
        <button className={styles.backButton} onClick={() => navigate(-1)}>
          ←
        </button>

        {/* 책 정보 카드 */}
        <div className={styles.bookHeader}>
          {/* 책 이미지 */}
          {book.volumeInfo.imageLinks && (
            <img
              src={book.volumeInfo.imageLinks.thumbnail}
              alt={book.volumeInfo.title}
              className={styles.bookCover}
            />
          )}

          {/* 책 정보 */}
          <div className={styles.bookInfo}>
            {/* 제목 */}
            <h1 className={styles.bookTitle}>{book.volumeInfo.title}</h1>

            {/* 북마크 컨테이너 */}
            <div className={styles.bookmarkContainer}>
              <span className={styles.bookmarkText}>
                <img src={bookmarkIcon} alt="북마크" className={styles.bookmarkIcon} />
                {bookmarkCount}
              </span>
              <span className={styles.readableText}>📖 읽을만해요</span>
            </div>

            {/* 작가, 출판사, 쪽수 */}
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

            {/* 구분선 */}
            <div className={styles.divider}></div>

            {/* 짧막한 설명 */}
            <div className={styles.shortDescription}>
              <p>{shortDescription}</p>
            </div>
          </div>
          <img 
  src={readingbook} 
  alt="Login2"
  onClick={() => navigate(`/timer?bookId=${book.id}&bookTitle=${encodeURIComponent(book.volumeInfo.title)}`)}
  style={{
      position: "absolute", 
      top: "66%", 
      left: "27%", 
      transform: "translate(-50%, -50%)", 
      width: "100px", 
      height: "auto",
      cursor: "pointer" 
  }} 
/>

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
