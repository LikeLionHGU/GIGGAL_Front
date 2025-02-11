import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const SearchDetail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const book = location.state?.book;

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
      </div>
    </div>
  );
};

export default SearchDetail;
