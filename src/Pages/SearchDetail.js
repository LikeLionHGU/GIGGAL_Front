import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "../styles/searchdetail.module.css";
import Button from "../components/ui/button";

const SearchDetail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const book = location.state?.book;
  const [bookMark, setbookMark] = useState([]); // 북마크 목록
     // 📌 북마크 추가 함수
  const addToMark = (book) => {
    setbookMark((prevMarks) => {
      if (prevMarks.find((mark) => mark.id === book.id)) {
        return prevMarks; // 이미 북마크에 있으면 추가하지 않음
      }
      return [...prevMarks, book]; // 새 책 추가
    });
  };

  if (!book) {
    return <p>책 정보를 찾을 수 없습니다.</p>;
  }

  return (
    <div>
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
