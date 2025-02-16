import { useEffect, useState } from "react";

export function useDebounce(callback, delay) {
  const [timer, setTimer] = useState(null);

  useEffect(() => {
    return () => clearTimeout(timer);
  }, [timer]);

  return (...args) => {
    clearTimeout(timer);
    setTimer(setTimeout(() => callback(...args), delay));
  };
}