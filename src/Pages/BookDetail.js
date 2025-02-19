import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import '../styles/BookDetail.css';
import HomeHeader from '../components/header/HomeHeader.js';
import back from "../img/back.png";
import dash from "../img/dash.png";
import goto from "../img/edong.png";
import mylist from "../img/mylist.png";
import mylisticon from "../img/mylist-icon.png";
import readingbtn from '../img/readingbtn.png';  // '../img/'로 경로를 수정
import trash from '../img/trash.png';  // '../img/'로 경로를 수정
import closebtn from '../img/closebtn.png';  // '../img/'로 경로를 수정
import x from '../img/x.png';  // '../img/'로 경로를 수정
import yes from '../img/yes.png';  // '../img/'로 경로를 수정
import Footer from '../components/footer/Footer.js';
import axios from "axios"; 

const BookDetail = () => {
  const MAX_LENGTH = 150; // 최대 글자 수
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const bookTitle = params.get("bookTitle");
  const bookPublisher = params.get("bookPublisher");
  const API_BASE_URL = "https://janghong.asia"; 

  const bookTime = params.get("bookTime") || "시간 없음";
  const [book, setBook] = useState(null);
  const [records, setRecords] = useState([]);
  const [selectedMemo, setSelectedMemo] = useState(null); // 선택된 메모 상태
  const [showModal, setShowModal] = useState(false); // 모달 열림 상태

  const [showDeleteModal, setShowDeleteModal] = useState(false); // 삭제 모달 상태
const [memoToDelete, setMemoToDelete] = useState(null); // 삭제할 메모 저장

// 삭제 모달 열기 함수
const openDeleteModal = (entry) => {
  setMemoToDelete(entry);
  setShowDeleteModal(true);
};

// 삭제 모달 닫기
const closeDeleteModal = () => {
  setShowDeleteModal(false);
  setMemoToDelete(null);
};


// 삭제 확정 함수
const confirmDelete = async () => {
  if (memoToDelete) {
    await handleDelete(memoToDelete);
    closeDeleteModal();
  }
};

  useEffect(() => {
    // 구글 북스 API 호출
    const fetchBookDetails = async () => {
      const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=intitle:${bookTitle}+inpublisher:${bookPublisher}&key=AIzaSyCOhxzEmFNG0E9GCrAAYeSQ8Q2NYrjC-b0`);
      const data = await response.json();
      const bookData = data.items?.[0]; // 첫 번째 결과 가져오기
      if (bookData) {
        setBook(bookData);
      }
    };
    fetchBookDetails();

  }, [bookTitle, bookPublisher]);


  // 모달 열기 함수
  const openModal = (memo) => {
    setSelectedMemo(memo); // 클릭한 메모를 상태에 저장
    setShowModal(true); // 모달 열기
  };

    // 모달 닫기 함수
    const closeModal = () => {
      setShowModal(false);
      setSelectedMemo(null);
    };
 //메모 조회하기
useEffect(() => {
    const fetchMemos = async () => {
      const userEmail = localStorage.getItem("userEmail") || "";
      if (!userEmail || !book?.id) {
        console.error("유저 이메일 또는 책 ID가 없습니다.");
        return;
      }

      try {
        const response = await axios.get(`${API_BASE_URL}/memo/list/${book.id}?userEmail=${userEmail}`);
        console.log("메모 조회 성공:", response.data);
        setRecords(response.data);
      } catch (error) {
        console.error("메모 조회 실패:", error.response ? error.response.data : error);
      }
    };
    if (book?.id) {
      fetchMemos();
    }
  }, [book]);


  const handleDelete = async (entry) => {
    if (!entry || !entry.memoId) {  // memoId가 없는 경우를 처리
      console.error("memoId가 없습니다.");
      return;
    }
  
    try {
      const userEmail = localStorage.getItem("userEmail") || "";
      if (!userEmail) {
        console.error("사용자 이메일이 없습니다.");
        return;
      }
  
      const { memoId} = entry;
  
      const deleteUrl = `${API_BASE_URL}/memo/delete/${memoId}`;
      console.log("삭제 요청 URL:", deleteUrl);
  
      await axios.delete(deleteUrl);
      console.log("메모 삭제 성공");
  
      setRecords((prevRecords) => prevRecords.filter((item) => item.memoId !== memoId));

    } catch (error) {
      console.error("메모 삭제 실패:", error.response ? error.response.data : error);
    }
  };
  
  
      
  
  

  

  const getDescription = (description) => {
    if (description && description.length > 200) {
      return description.slice(0, 200) + "...";
    }
    return description || "설명 정보 없음";
  };

  const goToHome = () => {
    navigate("/Home");  // 수정된 경로: "/"
  };

  return (
    <div>
      <HomeHeader />
      
      <div className="back-container">
        <img className="backbtn" src={back} alt="back" onClick={goToHome} />
      </div>
      <img className="goto" src={goto} alt="dash" onClick={goToHome} />

      <div className="dash-container">
        <img className="dash" src={dash} alt="dash" />
        {book && (
          <div>
            <img
              src={book.volumeInfo.imageLinks?.thumbnail}
              alt={book.volumeInfo.title}
              className="bookthumbnail"
            />
            <h2 className="book-title">{book.volumeInfo.title}</h2>
            <p className="text">
              {book.volumeInfo.authors?.join(", ") || "정보 없음"}{" |  "}
              {book.volumeInfo.pageCount || "정보 없음"}{"p |  "}
              {book.volumeInfo.publishedDate || "정보 없음"}
            </p>
            <p className="description">{getDescription(book.volumeInfo.description)}</p>
            <img className="rbtn" src={readingbtn} alt="readingbtn" onClick={() => navigate(`/timer?bookId=${book.id}`)} />
            <div className="totaltime">{decodeURIComponent(bookTime)}</div>
          </div>
        )}
      </div>

      
        <img className="mylist" src={mylist} alt="dash" />
        <img className="mylisticon" src={mylisticon} alt="dash" />
   
      {book && (
        <div>
          <div className="memo-container">
          {console.log("렌더링 시점의 메모 목록:", records)}
          {records.length > 0 ? (
  records.map((entry) => {
    console.log("entry.memoId 확인:", entry.memoId);  // memoId 확인 로그 추가
    return (
      <div key={entry.memoId} className="memo-entry">

       <div className="memo-box">
       <div className="memocon"  onClick={() => openModal(entry)}><div className="date">{entry.date}</div><br /><br /><div className="content">
  {entry.content.length > MAX_LENGTH
    ? <>
        {entry.content.slice(0, MAX_LENGTH)}<div className="more">... 더보기</div>
      </>
    : entry.content}
</div>

<img
  src={trash}
  alt="dash"
  onClick={(e) => {
    e.stopPropagation(); // 이벤트 전파 방지
    openDeleteModal(entry); // 삭제 모달 열기
  }}
  className="delete-button"
/>
</div></div>
 
      </div>
    );
  })
) : (
  <div className="nocontent">아직 기록이 없어요.<br/>지금 책을 읽고 기록을 추가해보세요!</div>
)}



          </div>
        </div>
      )}

{showModal && selectedMemo && (
        <div className="modal">
          <div className="modalcon">
            <p><div className="mdate">{selectedMemo.date}</div></p> 
            <div className="border">
            <div className="contentt">{selectedMemo.content}</div>
            </div>
            <img src={closebtn} alt="closebtn" className="mbutton" onClick={closeModal}/>
          </div>
        </div>
      )}


{showDeleteModal && (
  <div className="tmodal">
    <div className="tmodalcon">
      <div className="ttext">기록을 삭제하시겠습니까?</div>

      <div className="tbtns">
              <img src={x} className="x" alt="x"  onClick={closeDeleteModal}/>
      <img src={yes} alt="yes" className="yes"onClick={confirmDelete}/>
    
            </div>

    
    </div>
  </div>
)}
      <Footer />
    </div>
  );
};

export default BookDetail;