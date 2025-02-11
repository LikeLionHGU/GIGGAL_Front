import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "../components/ui/card";
import Button from "../components/ui/button";
import styles from "../styles/Home.module.css";

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

      <div className={styles.books}>
        {bookmarks.map((book, index) => {
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
                  <Button
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                    onClick={() => navigate(`/timer?bookId=${book.id}`)}
                  >
                    책 읽기
                  </Button>

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
