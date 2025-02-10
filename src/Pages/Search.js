import React, { useState, useEffect } from "react";
import { Card, CardContent } from "../components/ui/card";
import Button from "../components/ui/button";
import { useNavigate } from "react-router-dom";

const API_URL = "https://www.googleapis.com/books/v1/volumes";

const Search = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPageFilter, setSelectedPageFilter] = useState("");
  const [appliedPageFilter, setAppliedPageFilter] = useState("");
  const [hasSearched, setHasSearched] = useState(false);
  const [bookmarks, setBookmarks] = useState(() => {
    return JSON.parse(localStorage.getItem("bookmarks")) || [];
  });

  const navigate = useNavigate();

  useEffect(() => {
    localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
  }, [bookmarks]);

  const fetchBooks = (searchQuery) => {
    if (!searchQuery) return;
    setLoading(true);

    fetch(`${API_URL}?q=${searchQuery}&maxResults=40`)
      .then((response) => response.json())
      .then((data) => {
        setBooks(data.items || []);
        setLoading(false);
        setHasSearched(true);
      })
      .catch((err) => {
        setError(err);
        setLoading(false);
      });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchBooks(searchTerm.trim());
    setAppliedPageFilter(selectedPageFilter);
  };

  const addBookmark = (book) => {
    if (!bookmarks.find((b) => b.id === book.id)) {
      setBookmarks([...bookmarks, book]);
    }
  };

  const filteredBooks = books.filter((book) => {
    const pageCount = book.volumeInfo.pageCount || 0;
    if (appliedPageFilter === "50") return pageCount <= 50;
    if (appliedPageFilter === "100") return pageCount <= 100;
    if (appliedPageFilter === "200") return pageCount <= 200;
    if (appliedPageFilter === "300") return pageCount <= 300;
    return true;
  });

  return (
    <div className="p-4">
      <form onSubmit={handleSearch} className="mb-4 flex justify-center gap-2">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="책 검색..."
          className="border p-2 rounded-lg"
        />
        <select
          value={selectedPageFilter}
          onChange={(e) => setSelectedPageFilter(e.target.value)}
          className="border p-2 rounded-lg"
        >
          <option value="">전체 보기</option>
          <option value="50">50쪽 이하</option>
          <option value="100">100쪽 이하</option>
          <option value="200">200쪽 이하</option>
          <option value="300">300쪽 이하</option>
        </select>
        <Button type="submit">검색</Button>
      </form>

      {hasSearched && (
        <>
          {loading && <p>Loading...</p>}
          {error && <p>Error loading books: {error.message}</p>}

          {/* 📌 한 줄에 4개씩 배치 (반응형 지원) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredBooks.length > 0 ? (
              filteredBooks.map((book, index) => (
                <Card key={index} className="p-4 border border-gray-300 rounded-lg shadow-lg">
                  {book.volumeInfo.imageLinks ? (
                    <img
                      src={book.volumeInfo.imageLinks.thumbnail}
                      alt={book.volumeInfo.title}
                      className="w-full h-60 object-cover rounded-lg cursor-pointer"
                      onClick={() => navigate(`/detail/${book.id}`, { state: { book } })}
                    />
                  ) : (
                    <div className="w-full h-60 bg-gray-300 rounded-lg" />
                  )}
                  <CardContent>
                    <h2 className="text-xl font-semibold mt-2">{book.volumeInfo.title}</h2>
                    <p className="text-gray-600">저자: {book.volumeInfo.authors?.join(", ") || "정보 없음"}</p>
                    <p className="text-gray-600">출판사: {book.volumeInfo.publisher || "정보 없음"}</p>
                    <p className="text-gray-600">쪽수: {book.volumeInfo.pageCount || "정보 없음"}</p>
                    <button
                      className="mt-2 bg-blue-500 text-white px-4 py-2 rounded"
                      onClick={() => navigate(`/detail/${book.id}`, { state: { book } })}
                    >
                      자세히 보기
                    </button>
                    <button
                      className="mt-2 ml-2 bg-yellow-400 text-white px-4 py-2 rounded"
                      onClick={() => addBookmark(book)}
                    >
                      북마크 추가 ⭐
                    </button>
                  </CardContent>
                </Card>
              ))
            ) : (
              <p className="text-center text-gray-600">검색 결과가 없습니다.</p>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Search;
