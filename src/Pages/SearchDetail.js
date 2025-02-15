import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import styles from "../styles/searchdetail.module.css";
import SearchHeader from '../components/header/Headers.js';
import bookmarkIcon from "../img/bookmark.png";
import readingbook from "../img/image.png";
import nonbookmark from "../img/nonbookmark.png";  
import bookmark from "../img/bookmark.png";  
import community from "../img2/community.png";
import path from "../img2/path.png";
import communityexample from "../img2/communityexample.png";
import back from "../img/back.png";


const SearchDetail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const book = location.state?.book;

  const [BookRead, setBookRead] = useState({});
  const [activeTab, setActiveTab] = useState("bookInfo");

  useEffect(() => {
    // 기존 북마크 확인 (localStorage)
    const storedBookmarks = JSON.parse(localStorage.getItem("bookmarks")) || [];
    const bookmarksMap = storedBookmarks.reduce((acc, b) => {
      acc[b.id] = true;
      return acc;
    }, {});
    setBookRead(bookmarksMap);
  }, []);

  // 북마크 추가/제거 기능 (BookList.js와 동일)
  const toggleBookmark = (book) => {
    if (!book) return;
    
    const storedBookmarks = JSON.parse(localStorage.getItem("bookmarks")) || [];
    let updatedBookmarks;

    if (BookRead[book.id]) {
      // 이미 북마크된 경우 삭제
      updatedBookmarks = storedBookmarks.filter((b) => b.id !== book.id);
    } else {
      // 북마크 추가
      updatedBookmarks = [...storedBookmarks, book];
    }

    localStorage.setItem("bookmarks", JSON.stringify(updatedBookmarks));
    setBookRead((prev) => ({
      ...prev,
      [book.id]: !prev[book.id], 
    }));
  };

  // 북마크 개수 가져오기
  const storedBookmarks = JSON.parse(localStorage.getItem("bookmarks")) || [];
  const bookmarkCount = storedBookmarks.length;

  // 짧막한 설명을 30자 이하로 제한
  const shortDescription = book?.volumeInfo?.subtitle && book.volumeInfo.subtitle.length > 30
    ? book.volumeInfo.subtitle.slice(0, 30) + "..."
    : book?.searchInfo?.textSnippet && book.searchInfo.textSnippet.length > 30
    ? book.searchInfo.textSnippet.slice(0, 30) + "..."
    : book?.volumeInfo?.subtitle || book?.searchInfo?.textSnippet || "설명 없음";

  if (!book) {
    return <p className={styles.loading}>📚 책 정보를 찾을 수 없습니다.</p>;
  }

  return (
    <div>
      <SearchHeader />
      <div className={styles.container}>
        <div className={styles.innercontainer}>
          {/* 뒤로 가기 버튼 */}
          <img className={styles.backButton} src={back} alt="back" onClick={() => navigate(-1)} />

          

          <img
              src={path}
              alt="path"
              style={{
                position: "absolute", 
                top: "56%", 
                left: "35%", 
                transform: "translate(-50%, -50%)", 
                width: "40px", 
                height: "auto",
                cursor: "pointer" 
              }} 
            >
            </img>

          {/* 책 정보 카드 */}
          <div className={styles.bookHeader}>
            {/* 책 이미지 */}
            <div className={styles.bookImageContainer}>
              {book.volumeInfo.imageLinks && (
                <img
                  src={book.volumeInfo.imageLinks.thumbnail}
                  alt={book.volumeInfo.title}
                  className={styles.bookCover}
                />
              )}

              {/* 북마크 버튼 (책 이미지 위) */}
              <button onClick={() => toggleBookmark(book)} style={{ position: "absolute", top: "250px", left: "320px", background: "none", border: "none", cursor: "pointer" }}>
                <img
                  src={BookRead[book.id] ? bookmark : nonbookmark}
                  alt="북마크"
                  style={{height:"30px"}}
                  className={styles.bookmarkIcon}
                />
              </button>
            </div>

            {/* 책 정보 */}
            <div className={styles.bookInfo}>
              {/* 제목 */}
              <h1 className={styles.bookTitle}>{book.volumeInfo.title}</h1>

              {/* 북마크 개수 표시 */}
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

            {/* 책 읽기 버튼 */}
            <img 
              src={readingbook} 
              alt="img"
              onClick={() => navigate(`/timer?bookId=${book.id}&bookTitle=${encodeURIComponent(book.volumeInfo.title)}`)}
              style={{
                position: "absolute", 
                top: "66%", 
                left: "30%", 
                transform: "translate(-50%, -50%)", 
                width: "100px", 
                height: "auto",
                cursor: "pointer" 
              }} 
            />
            <img
              src={community}
              alt="community"
              style={{
                position: "absolute", 
                top: "66%", 
                left: "35%", 
                transform: "translate(-50%, -50%)", 
                width: "40px", 
                height: "auto",
                cursor: "pointer" 
              }} 
            >
            </img>
          </div>
        </div>

        {/* 탭 UI */}
        <div className={styles.tabs}>
        <div className={`${styles.tab} ${activeTab === "bookInfo" ? styles.active : ""}`} onClick={() => setActiveTab("bookInfo")}>
            책 정보
          </div>
          <div className={`${styles.tab} ${activeTab === "community" ? styles.active : ""}`} onClick={() => setActiveTab("community")}>
            커뮤니티
            </div>
        </div>

        {/* 책 설명 */}
        <div className={styles.bookContent}>
        {activeTab === "bookInfo" ? (
            <p className={styles.bookDescription}>{book.volumeInfo.description || "설명 없음"}</p>
          ) : (
            <div className={styles.communityContent}>
              <img src={communityexample} alt="커뮤니티 예제" className={styles.communityImage} style={{ maxWidth: "70%", height: "auto", marginLeft: "18%"}} />
            </div>
          )}
          
        </div>
      </div>
    </div>
  );
};

export default SearchDetail;
