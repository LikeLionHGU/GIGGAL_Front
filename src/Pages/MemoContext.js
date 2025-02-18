// MemoContext.js
import React, { createContext, useState, useContext } from "react";

// MemoContext 생성
const MemoContext = createContext();

// MemoProvider 컴포넌트
export const MemoProvider = ({ children }) => {
  const [memoId, setMemoId] = useState(null);

  return (
    <MemoContext.Provider value={{ memoId, setMemoId }}>
      {children}
    </MemoContext.Provider>
  );
};

// useMemoContext 훅을 만들어서 쉽게 접근할 수 있게 함
export const useMemoContext = () => {
  return useContext(MemoContext);
};
