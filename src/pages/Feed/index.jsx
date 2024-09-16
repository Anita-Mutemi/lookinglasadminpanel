import React, { useMemo, useState, useEffect } from 'react';
import {
  MaterialReactTable,
  useMaterialReactTable,
} from 'material-react-table';
import { columns as columnsConfiguration } from './Columns';
import { Button } from 'antd';
import { useProjectPublishing } from './hooks/useProjectPublishing';
import DetailPanel from './detailPanel/DetailPanel';
import Filters from '../../components/Filters';
import { useProjects } from './hooks/useProjects';
import { usePagination } from './hooks/usePagination';
import { GeneralErrorBoundary } from '../../components/UI/GeneralErrorBoundry';
import { useRowSelection } from './hooks/usePersistedRowSelection';
import { LoaderContainer } from './other/LoaderContainer';
import { SelectedProjects } from './submission/SelectedProjects';
import { ConfirmSubmissionModal } from './submission/ConfirmSubmission';
import { useFetchClients } from '../../hooks/useFetchClients';
import TopToolbarCustomActions from './submission/TopToolBarCustomActions';
import CircularProgress from '@mui/material/CircularProgress';

const MemoizedFilters = React.memo(Filters);
const MemoizedTable = React.memo(MaterialReactTable, (prevProps, nextProps) => {
  // Iterate through all keys in nextProps
  for (const key of Object.keys(nextProps)) {
    // Skip the comparison for 'currentFilters'
    if (key === 'currentFilters') continue;

    // If any other prop has changed, return false to trigger a re-render
    if (prevProps[key] !== nextProps[key]) {
      return false;
    }
  }

  // If we reach this point, it means none of the props (except possibly 'currentFilters') have changed
  return true;
});

const Feed = ({ type = ['accepted', 'pending', 'review', 'discovered'] }) => {
  // accepted, pending, review, discovered
  const [currentFilters, setCurrentFilters] = useState({
    filters: [{ identifier: 'status', choices: type, mode: 'OR' }],
  });
  const { clients, clientsLoading } = useFetchClients();

  const { offset, handleNext, handleGoBack, refreshOffset } = usePagination();
  const { data, error, loading, loadedPercentage, getProjects } = useProjects(
    type,
    offset,
    currentFilters,
  );

  const {
    rowSelection,
    selectedRows,
    toggleRowSelection,
    setSelectedRows,
    setRowSelection,
    deselectProject,
  } = useRowSelection(data?.projects);

  const resetSelection = () => {
    setRowSelection({});
    setSelectedRows([]);
  };

  const {
    isPublishModalVisible,
    openPublishModal,
    confirmPublish,
    cancelPublish,
    clientId,
    setClientId,
  } = useProjectPublishing(resetSelection);

  const columns = useMemo(() => columnsConfiguration, []);

  const handlePublish = () => {
    openPublishModal(selectedRows);
  };

  const tableInstance = useMaterialReactTable({
    columns,
    data: data?.projects,
    enableRowSelection: true,
    enablePagination: false,
    enableColumnOrdering: true,
    enableGrouping: true,
    positionExpandColumn: 'first',
    memoMode: 'cells', // memoize table rows to improve render performance, but break a lot of features
    muiSkeletonProps: {
      animation: 'wave',
    },
    muiLinearProgressProps: {
      color: 'secondary',
    },
    muiCircularProgressProps: {
      color: 'secondary',
    },
    getRowId: (row) => row.id,
    onRowSelectionChange: (newRowSelection) => {
      setRowSelection(newRowSelection); // Update the selection state for the current page
      Object.values(newRowSelection).forEach((row) => {
        toggleRowSelection(row.original); // Update the cumulative selection across pages
      });
    },
    renderDetailPanel: (row) => (
      <GeneralErrorBoundary>
        <DetailPanel key={row.id} row={row} />
      </GeneralErrorBoundary>
    ),
    renderTopToolbarCustomActions: (tableProps) => (
      <TopToolbarCustomActions
        table={tableInstance}
        clients={clients}
        clientId={clientId}
        setClientId={setClientId}
        onPublish={handlePublish}
        nothingSelected={selectedRows.length === 0}
        loadingClients={clientsLoading}
      />
    ),
    state: { rowSelection },
  });

  useEffect(() => {
    const newSelectedRows = tableInstance.getSelectedRowModel().rows;

    setSelectedRows((currentRows) => {
      // Extract the ids of new selected rows
      const newSelectedIds = new Set(
        newSelectedRows.map((row) => row.original.id),
      );

      // Add new rows not already in currentRows
      const addedRows = newSelectedRows
        .map((row) => row.original)
        .filter(
          (newRow) =>
            !currentRows.some((currentRow) => currentRow.id === newRow.id),
        );

      // Keep rows that are still selected
      const updatedRows = currentRows.filter((currentRow) =>
        newSelectedIds.has(currentRow.id),
      );

      // Combine updated rows with new added rows
      return [...updatedRows, ...addedRows];
    });
  }, [tableInstance, rowSelection]);

  return (
    <>
      <ConfirmSubmissionModal
        isVisible={isPublishModalVisible}
        onConfirm={confirmPublish}
        onCancel={cancelPublish}
        selectedProjects={selectedRows}
        onDeselect={deselectProject}
      />
      <GeneralErrorBoundary customMessage={'Filters are down :('}>
        <MemoizedFilters
          endpoint={`/v1/projects/filters`}
          onFilterApply={(filters) => {
            refreshOffset();
            // getProjects();
          }}
          setCurrentFilters={setCurrentFilters}
          currentFilters={currentFilters.filters}
        />
      </GeneralErrorBoundary>
      <br />
      <div>
        <GeneralErrorBoundary>
          <SelectedProjects
            projects={selectedRows}
            onDeselect={deselectProject}
          />
        </GeneralErrorBoundary>
      </div>
      <div
        style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}
      >
        <Button
          onClick={handleGoBack}
          disabled={offset === 0}
          style={{ marginRight: '10px' }}
          type='primary'
        >
          Go Back
        </Button>
        <Button onClick={handleNext} type='primary'>
          Next
        </Button>
      </div>
      <br />
      <>
        {loading ? (
          <LoaderContainer percentage={loadedPercentage} />
        ) : (
          <GeneralErrorBoundary customMessage={'Feed is down :('}>
            {/* <MemoizedTable table={tableInstance} /> */}
            <MaterialReactTable table={tableInstance} />
          </GeneralErrorBoundary>
        )}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            marginTop: '20px',
          }}
        >
          <Button
            onClick={handleGoBack}
            disabled={offset === 0}
            style={{ marginRight: '10px' }}
            type='primary'
          >
            Go Back
          </Button>
          <Button onClick={handleNext} type='primary'>
            Next
          </Button>
        </div>
        <br />
      </>
    </>
  );
};

export default Feed;
