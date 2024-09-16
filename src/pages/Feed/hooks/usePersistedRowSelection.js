import { useState, useCallback } from 'react';

export const useRowSelection = () => {
  const [rowSelection, setRowSelection] = useState({}); // Tracks the selection state of rows on the current page
  const [selectedRows, setSelectedRows] = useState([]); // Tracks all selected rows across pages

  const toggleRowSelection = useCallback((row) => {
    setSelectedRows((prevSelectedRows) => {
      const isRowAlreadySelected = prevSelectedRows.some(
        (selectedRow) => selectedRow.id === row.id,
      );

      if (isRowAlreadySelected) {
        return prevSelectedRows.filter((selectedRow) => selectedRow.id !== row.id);
      } else {
        return [...prevSelectedRows, row];
      }
    });
  }, []);

  const deselectProject = useCallback((projectId) => {
    setSelectedRows((prevSelectedRows) =>
      prevSelectedRows.filter((row) => row.id !== projectId),
    );
  }, []);

  return {
    rowSelection,
    setRowSelection,
    selectedRows,
    setSelectedRows,
    toggleRowSelection,
    deselectProject,
  };
};
