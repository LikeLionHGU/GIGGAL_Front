import { useLocation, useNavigate } from "react-router-dom";
import styles from "../styles/searchdetail.module.css";
import Button from "../components/ui/button";
import HomeHeader from '../components/header/HomeHeader.js';

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
    return <p>책 정보를 찾을 수 없습니다.</p>;
  }

  return (
    <div>
      <HomeHeader />
      <button onClick={() => navigate(-1)}>← Back</button>
      <div>
        {book.volumeInfo.imageLinks && (
          <img
            src={book.volumeInfo.imageLinks.thumbnail}
            alt={book.volumeInfo.title}
            className="w-full h-80 object-cover rounded-lg"
          />
        )}
        <h1 className="text-2xl font-bold mt-4">{book.volumeInfo.title}</h1>
        <p className="text-gray-600 mt-2">저자: {book.volumeInfo.authors?.join(", ") || "정보 없음"}</p>
        <p>출간일: {book.volumeInfo.publishedDate}</p>
        <p className="text-gray-600">출판사: {book.volumeInfo.publisher || "정보 없음"}</p>
        <p className="text-gray-600">쪽수: {book.volumeInfo.pageCount || "정보 없음"}</p>
        <p className="mt-4">{book.volumeInfo.description || "설명 없음"}</p>
        <button onClick={() => addToMark(book)} className={styles.button}>
          북마크 추가
        </button>
        <Button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={() => navigate(`/timer?bookId=${book.id}`)}
        >
          책 읽기
        </Button>
      </div>
    </div>
  );
};

export default SearchDetail;
