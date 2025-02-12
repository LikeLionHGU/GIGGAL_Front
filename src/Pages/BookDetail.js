import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Card, CardContent } from "../components/ui/card";
import Button from "../components/ui/button";
import HomeHeader from '../components/header/HomeHeader.js';

const BookDetail = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const bookId = queryParams.get("bookId");

  const [book, setBook] = useState(null);  // 선택된 책 정보
  const [records, setRecords] = useState([]);  // 독서 기록
  const [totalReadingTime, setTotalReadingTime] = useState(0);  // 총 독서 시간

  useEffect(() => {
    const savedBookmarks = JSON.parse(localStorage.getItem("bookmarks")) || [];
    const selectedBook = savedBookmarks.find((b) => b.id === bookId);
    if (selectedBook) {
      setBook(selectedBook);
      const savedRecords = JSON.parse(localStorage.getItem(`records_${bookId}`)) || [];
      setRecords(savedRecords);
      const savedReadingTime = JSON.parse(localStorage.getItem(`readingTime_${bookId}`)) || 0;
      setTotalReadingTime(savedReadingTime);
    }
  }, [bookId]);

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}:${String(minutes).padStart(2, "0")}`;
  };

  const goToHome = () => {
    navigate("/Home");  // 수정된 경로: "/"
  };

  return (
    <div className="p-4">
      <HomeHeader />
      <Button onClick={goToHome}>뒤로가기</Button>

      {book && (
        <Card className="p-6 border border-gray-300 rounded-lg shadow-lg">
          <img src={book.volumeInfo.imageLinks?.thumbnail} alt={book.volumeInfo.title} className="w-48 h-72 object-cover mx-auto" />

          <CardContent>
            <h2 className="text-2xl font-bold mt-4">{book.volumeInfo.title}</h2>
            <p className="text-gray-600">저자: {book.volumeInfo.authors?.join(", ") || "정보 없음"}</p>
            <p className="text-gray-600">출판사: {book.volumeInfo.publisher || "정보 없음"}</p>
            <p className="text-gray-600">쪽수: {book.volumeInfo.pageCount || "정보 없음"}</p>

            <div className="mt-4 bg-gray-200 p-3 rounded-lg text-center">
              <h3 className="text-lg font-semibold">총 독서 시간</h3>
              <p className="text-2xl font-bold">{formatTime(totalReadingTime)}</p>
            </div>

            <div className="mt-6">
              <h3 className="text-lg font-semibold">내 독서 기록</h3>
              {records.length > 0 ? (
                <div className="space-y-4">
                  {records.map((entry, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <textarea
                        className="border p-2 rounded-lg w-full h-20"
                        value={entry}
                        readOnly
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">저장된 기록이 없습니다.</p>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default BookDetail;
