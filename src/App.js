import React from "react";
import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";
import FloatingButton from "./components/floatingbtn/FloatingButton";
import Search from "./Pages/Search";
import SearchDetail from "./Pages/SearchDetail";
import Home from "./Pages/Home";
import Timer from "./Pages/Timer";
import BookDetail from "./Pages/BookDetail";
import Login from "./Pages/Login";
import AuthCallback from "./Pages/AuthCallback";
import Main from "./Pages/Main";
import BookList from "./Pages/BookList";  // Import the BookList page

const AppContent = () => {
  const location = useLocation(); // 현재 경로 가져오기
  const excludedPages = ["/timer", "/bookdetail", "/main"]; // 플로팅 버튼이 없어야 할 페이지

  const handleClick = () => {
    alert("플로팅 버튼 클릭!");
  };

  return (
    <div className="p-4">
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/search" element={<Search />} />
        <Route path="/detail/:bookId" element={<SearchDetail />} />
        <Route path="/home" element={<Home />} />
        <Route path="/timer" element={<Timer />} />
        <Route path="/bookdetail" element={<BookDetail />} />
        <Route path="/login" element={<Login />} />
        <Route path="/api/auth/callback" element={<AuthCallback />} />
        <Route path="/booklist" element={<BookList />} />  {/* Add the route for /booklist */}
      </Routes>

      {/* 특정 페이지에서는 플로팅 버튼을 렌더링하지 않음 */}
      {!excludedPages.includes(location.pathname) && <FloatingButton onClick={handleClick} />}
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default App;
