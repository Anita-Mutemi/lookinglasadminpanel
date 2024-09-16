// usePagination.js
import { useState, useCallback } from 'react';

export const usePagination = (initialOffset = 0, pageSize = 80) => {
  const [offset, setOffset] = useState(initialOffset);

  const refreshOffset = () => {
    return new Promise((resolve) => {
      setOffset(0);
      resolve(); // Resolve the Promise after setting offset to 0
    });
  };

  const handleNext = useCallback(() => {
    setOffset((prevOffset) => prevOffset + pageSize);
  }, [pageSize]);

  const handleGoBack = useCallback(() => {
    setOffset((prevOffset) => Math.max(prevOffset - pageSize, 0));
  }, [pageSize]);

  return { offset, refreshOffset, handleNext, handleGoBack };
};
