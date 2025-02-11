import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "../components/ui/card";
import Button from "../components/ui/button";

const Home = () => {
  const [bookmarks, setBookmarks] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const savedBookmarks = JSON.parse(localStorage.getItem("bookmarks")) || [];
    setBookmarks(savedBookmarks);
  }, []);

  
  const getReadingTime = (bookId) => {
    return JSON.parse(localStorage.getItem(`readingTime_${bookId}`)) || 0;
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">My book</h1>

      {bookmarks.length === 0 && (
        <div
          className="flex justify-center items-center border-dashed border-2 border-gray-400 w-40 h-40 mx-auto cursor-pointer"
          onClick={() => navigate("/search")}
        >
          <span className="text-4xl text-gray-500">+</span>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
        {bookmarks.length > 0 &&
          bookmarks.map((book, index) => {
            const readingTime = getReadingTime(book.id);

            return (
              <Card key={index} className="p-4 border border-gray-300 rounded-lg shadow-lg relative">
                <div className="absolute top-2 right-2 bg-gray-800 text-white text-sm px-3 py-1 rounded-md">
                  누적 시간: {Math.floor(readingTime / 60)}분
                </div>

                <img
                  src={book.volumeInfo.imageLinks?.thumbnail}
                  alt={book.volumeInfo.title}
                  className="w-full h-60 object-cover rounded-lg"
                />

                <CardContent>
                  <h2 className="text-lg font-semibold mt-2">{book.volumeInfo.title}</h2>

                  <div className="mt-3 flex justify-between">
                    {/* 시간 관리하기 버튼 */}
                    <Button
                      className="bg-blue-500 text-white px-4 py-2 rounded"
                      onClick={() => navigate(`/timer?bookId=${book.id}`)}
                    >
                      시간 관리하기
                    </Button>

                    {/*  내 기록 보기 버튼 */}
                    <Button
                      className="bg-green-500 text-white px-4 py-2 rounded"
                      onClick={() => navigate(`/bookdetail?bookId=${book.id}`)}
                    >
                      내 기록 
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
      </div>
    </div>
  );
};

export default Home;
