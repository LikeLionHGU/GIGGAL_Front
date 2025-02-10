import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Search from "./Pages/Search";
import SearchDetail from "./Pages/SearchDetail";
import Home from "./Pages/Home";
import Timer from "./Pages/Timer";
import BookDetail from "./Pages/BookDetail";
import Login from "./Pages/Login";
import AuthCallback from "./Pages/AuthCallback";


const App = () => {
  return (
    <Router>
      <div className="p-4">
        <Routes>
          <Route path="/search" element={<Search />} />
          <Route path="/detail/:bookId" element={<SearchDetail />} />
          <Route path="/" element={<Home />} />
          <Route path="/timer" element={<Timer />}/>
          <Route path="/bookdetail" element={<BookDetail />} />
          <Route path="/login" element={<Login/>}/>
          <Route path="/auth/callback" element={<AuthCallback />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
