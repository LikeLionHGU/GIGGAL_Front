import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import styles from "../styles/searchdetail.module.css";
import SearchHeader from "../components/header/HomeHeader.js";
import bookmarkIcon from "../img/bookmark.png";
import readingbook from "../img/image.png";
import nonbookmark from "../img/nonbookmark.png";
import bookmark from "../img/bookmark.png";
import communityexample from "../img2/communityexample.png";
import back from "../img/back.png";
import path from "../img2/path.png";
import "../styles/BookDetail.css";

const SearchDetail = () => {
  const { bookId } = useParams(); // URL에서 bookId 가져오기
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [bookRead, setBookRead] = useState({});
  const [activeTab, setActiveTab] = useState("bookInfo");

  // API 호출: bookId로 책 정보 가져오기
  useEffect(() => {
    const fetchBookDetails = async () => {
      try {
        const response = await axios.get(
          `https://www.googleapis.com/books/v1/volumes/${bookId}`
        );
        setBook(response.data);
      } catch (error) {
        console.error("책 정보를 가져오는 데 실패했습니다:", error);
      }
    };

    if (bookId) fetchBookDetails();
  }, [bookId]);

  // 북마크 상태 가져오기
  useEffect(() => {
    const storedBookmarks = JSON.parse(localStorage.getItem("bookmarks")) || [];
    const bookmarksMap = storedBookmarks.reduce((acc, b) => {
      acc[b.id] = true;
      return acc;
    }, {});
    setBookRead(bookmarksMap);
  }, []);

  // 북마크 추가/삭제 기능
  const toggleBookmark = () => {
    if (!book) return;

    const storedBookmarks = JSON.parse(localStorage.getItem("bookmarks")) || [];
    let updatedBookmarks;

    if (bookRead[book.id]) {
      updatedBookmarks = storedBookmarks.filter((b) => b.id !== book.id);
    } else {
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

  // 책 설명 30자 이하로 제한
  const shortDescription = book?.volumeInfo?.subtitle && book.volumeInfo.subtitle.length > 30
    ? book.volumeInfo.subtitle.slice(0, 30) + "..."
    : book?.searchInfo?.textSnippet && book.searchInfo.textSnippet.length > 30
    ? book.searchInfo.textSnippet.slice(0, 30) + "..."
    : book?.volumeInfo?.subtitle || book?.searchInfo?.textSnippet || "설명 없음";

  // 책 정보를 가져오기 전에 로딩 메시지 표시
  if (!book) {
    return <p className={styles.loading}>📚 책 정보를 불러오는 중...</p>;
  }

  const goBack = () => {
    navigate(-1);
  };

  return (
    <div>
      <SearchHeader />
      <div className={styles.container}>
        <div className={styles.innercontainer}>
          {/* 🔙 뒤로 가기 버튼 */}
          <div className="back-container">
            <img className="backbtn" src={back} alt="back" onClick={goBack} />
          </div>
          <img className="goto" src={path} alt="path" />

          {/* 📖 책 정보 카드 */}
          <div className={styles.bookHeader}>
            <div className={styles.bookImageContainer}>
              {book.volumeInfo?.imageLinks?.thumbnail && (
                <img
                  src={book.volumeInfo.imageLinks.thumbnail}
                  alt={book.volumeInfo.title}
                  className={styles.bookCover}
                />
              )}

              {/* 📌 북마크 버튼 */}
              <button
                onClick={toggleBookmark}
                style={{
                  position: "absolute",
                  top: "340px",
                  left: "580px",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                <img
                  src={bookRead[book.id] ? bookmark : nonbookmark}
                  alt="북마크"
                  style={{ height: "30px" }}
                  className={styles.bookmarkIcon}
                />
              </button>
            </div>

            {/* 📝 책 정보 */}
            <div className={styles.bookInfo}>
              <h1 className={styles.bookTitle}>{book.volumeInfo?.title}</h1>

              <div className={styles.bookmarkContainer}>
                <span className={styles.bookmarkText}>
                  <img src={bookmarkIcon} alt="북마크" className={styles.bookmarkIcon} />
                  {bookmarkCount}
                </span>
                <span className={styles.readableText}>📖 읽을만해요</span>
              </div>

              <div className={styles.contain}>
                <span className={styles.bookAuthor}>
                  글 [{book.volumeInfo?.authors?.join(", ") || "정보 없음"}]
                </span>
                <span className={styles.bookPublisher}>
                  {book.volumeInfo?.publisher || "정보 없음"}
                </span>
                <span className={styles.bookPages}>
                  쪽수: {book.volumeInfo?.pageCount || "정보 없음"}
                </span>
              </div>

              <div className={styles.divider}></div>

              <div className={styles.shortDescription}>
                <p>{shortDescription}</p>
              </div>
            </div>

           
            <img
              src={readingbook}
              alt="img"
              onClick={() =>
                navigate(`/timer?bookId=${book.id}&bookTitle=${encodeURIComponent(book.volumeInfo.title)}`)
              }
              style={{
                position: "absolute",
                top: "72%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: "100px",
                height: "auto",
                cursor: "pointer",
              }}
            />
          </div>
        </div>

       
        <div className={styles.tabs}>
          <div
            className={`${styles.tab} ${activeTab === "bookInfo" ? styles.active : ""}`}
            onClick={() => setActiveTab("bookInfo")}
          >
            책 정보
          </div>
          <div
            className={`${styles.tab} ${activeTab === "community" ? styles.active : ""}`}
            onClick={() => setActiveTab("community")}
          >
            커뮤니티
          </div>
        </div>

        
        <div className={styles.bookContent}>
          {activeTab === "bookInfo" ? (
            <p className={styles.bookDescription}>{book.volumeInfo?.description || "설명 없음"}</p>
          ) : (
            <div className={styles.communityContent}>
              <img
                src={communityexample}
                alt="커뮤니티 예제"
                className={styles.communityImage}
                style={{ maxWidth: "70%", height: "auto", marginLeft: "18%" }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchDetail;