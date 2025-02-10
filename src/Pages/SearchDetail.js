import { useLocation, useNavigate } from "react-router-dom";

const SearchDetail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const book = location.state?.book; // Search.js에서 전달된 책 정보

  if (!book) {
    return <p>책 정보를 찾을 수 없습니다.</p>;
  }

  return (
    <div className="p-6">
      <button className="mb-4 bg-gray-500 text-white px-4 py-2 rounded" onClick={() => navigate(-1)}>
        🔙 뒤로가기
      </button>
      <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-md">
        {book.volumeInfo.imageLinks && (
          <img src={book.volumeInfo.imageLinks.thumbnail} alt={book.volumeInfo.title} className="w-full h-80 object-cover rounded-lg" />
        )}
        <h1 className="text-2xl font-bold mt-4">{book.volumeInfo.title}</h1>
        <p className="text-gray-600 mt-2">저자: {book.volumeInfo.authors?.join(", ") || "정보 없음"}</p>
        <p className="text-gray-600">출판사: {book.volumeInfo.publisher || "정보 없음"}</p>
        <p className="text-gray-600">쪽수: {book.volumeInfo.pageCount || "정보 없음"}</p>
        <p className="mt-4">{book.volumeInfo.description || "설명 없음"}</p>
        <a href={book.volumeInfo.infoLink} target="_blank" rel="noopener noreferrer" className="mt-4 inline-block bg-blue-500 text-white px-4 py-2 rounded">
          구글 도서에서 보기
        </a>
      </div>
    </div>
  );
};

export default SearchDetail;
