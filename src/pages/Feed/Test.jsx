import { useMemo, useState, useEffect } from 'react';
import { MaterialReactTable } from 'material-react-table';
import { columns as columnsConfiguration } from './Columns';
import { Spin, Button } from 'antd';
import { useSelector } from 'react-redux';
import ErrorDisplay from '../../components/UI/ErrorDisplay';
import httpService from '../../services/http.service';
import DetailPanel from './detailPanel/DetailPanel';
import { Typography, Chip, Box } from '@mui/material';
import Filters from '../../components/Filters';
import { data as data2 } from './makeData';
import TopToolbarCustomActions from './submission/TopToolbarCustomActions';

const LoaderContainer = ({ percentage }) => (
  <div style={{ textAlign: 'center', padding: '20px' }}>
    <Spin size='large' />
    <div
      style={{
        fontSize: '20px',
        marginTop: '15px',
        color: '#1890ff', // This is the default Ant Design blue. Change as needed.
        fontWeight: 'bold',
        letterSpacing: '1px',
      }}
    >
      {percentage}% loaded
    </div>
  </div>
);

const SelectedProjects = ({ projects }) => (
  <Box>
    <Typography variant={'h5'}>Selected projects: {projects?.length}</Typography>
    <Box sx={{ display: 'flex', flexWrap: 'wrap', p: 0.5, m: 0 }}>
      {projects.map((project, index) => (
        <Chip key={index} label={project} sx={{ m: 0.5 }} />
      ))}
    </Box>
  </Box>
);

const Test = ({ type = 'accepted' }) => {
  const [expandedDescriptions, setExpandedDescriptions] = useState({});
  const [rowSelection, setRowSelection] = useState({});
  const [selectedProjects, setSelectedProjects] = useState([]);
  const [currentFilters, setCurrentFilters] = useState({
    filters: [{ identifier: 'status', choices: [type], mode: 'OR' }],
  });
  const [currentFilters2, setCurrentFilters2] = useState([
    {
      section: 'general',
      filters: [
        { type: 'string', label: 'Project id', key: 'id' },
        { type: 'string', label: 'Project title', key: 'title' },
        { type: 'string', label: 'Project description', key: 'description' },
        { type: 'int', label: 'Team size', min: 0, max: 1000000, key: 'team_size' },
      ],
    },
    {
      section: 'finance',
      filters: [
        { type: 'int', formatting: 'thousands', min: 0, key: 'funding' },
        {
          type: 'date',
          label: 'Investment date',
          min: '1990-01-01',
          max: '2023-09-12',
          key: 'last_round_date',
        },
        {
          type: 'int',
          formatting: 'thousands',
          label: 'Last round quantity',
          min: 0,
          key: 'last_round_qty',
        },
        { type: 'bool', label: 'Had previous exit', key: 'previous_exit' },
        { type: 'bool', label: 'Investment acquired recently', key: 'recent_investment' },
      ],
    },
  ]);

  const [data, setData] = useState([]);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadedPercentage, setLoadedPercentage] = useState(0);
  const [offset, setOffset] = useState(0);

  console.log(data2);
  const { access_token } = useSelector((state) => state.user);

  async function getProjects(filters) {
    setLoading(true);
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
        onDownloadProgress: (progressEvent) => {
          const percentage = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total,
          );
          setLoadedPercentage(percentage);
        },
      };
      const queryParams = new URLSearchParams({
        limit: 100,
        offset: offset,
      });
      const { data } = await httpService.post(
        `/v1/projects/search?${queryParams}`,
        currentFilters, // Use the current filters here
        config,
      );
      setData(data);
    } catch (err) {
      console.log('error', err);
      setError(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getProjects();
  }, [offset]);

  const clients = [
    { id: '1', name: 'Client 1' },
    { id: '2', name: 'Client 2' },
    { id: '3', name: 'Client 3' },
  ];

  const toggleDescription = (id) => {
    setExpandedDescriptions((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handlePublish = (projects, client) => {
    console.log('Publishing projects:', projects, 'to client:', client);
    // TODO: Implement the actual publish logic.
  };

  const columns = useMemo(() => columnsConfiguration, []);

  useEffect(() => {
    const selectedRowIds = Object.keys(rowSelection).filter(
      (rowId) => rowSelection[rowId] === true,
    );

    const selectedProjects = data.results
      ? data.results.filter((row) => selectedRowIds.includes(row.id.toString()))
      : [];

    setSelectedProjects(selectedProjects.map((project) => project.title));
  }, [rowSelection]);

  const handleNext = () => {
    setOffset((prevOffset) => prevOffset + 100);
  };

  const handleGoBack = () => {
    setOffset((prevOffset) => Math.max(prevOffset - 100, 0));
  };
  return (
    <>
      {/* <Index2
        endpoint={`/v1/projects/filters`}
        onFilterApply={getProjects}
        setCurrentFilters={setCurrentFilters2}
        currentFilters={currentFilters2.filters}
      /> */}
      {/* <Filters
        endpoint={`/v1/projects/filters`}
        onFilterApply={getProjects}
        setCurrentFilters={setCurrentFilters}
        currentFilters={currentFilters.filters}
      /> */}

      {/* <Filters /> */}
      <br />
      <div>
        <SelectedProjects projects={selectedProjects} />
      </div>

      <h2 style={{ color: 'red' }}>STATIC TABLE WITH STATIC DATA FOR UI DEV PURPOSES.</h2>
      <MaterialReactTable
        columns={columns}
        data={data2.results}
        // pagination={{ pageIndex: 0, pageSize: 100 }}
        enablePagination={false}
        enableColumnOrdering
        enableGrouping
        enableRowSelection
        onRowSelectionChange={setRowSelection}
        getRowId={(row) => row.id}
        state={{ rowSelection }}
        positionToolbarAlertBanner='bottom'
        renderDetailPanel={DetailPanel}
        renderTopToolbarCustomActions={(tableProps) => (
          <TopToolbarCustomActions
            {...tableProps}
            clients={clients} // supply the list of clients
            onPublish={handlePublish}
          />
        )}
      />
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
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
        ) : error ? (
          <ErrorDisplay errorMessage={error.message} />
        ) : (
          <>
            <br />
            <div>
              <SelectedProjects projects={selectedProjects} />
            </div>
            <MaterialReactTable
              columns={columns}
              data={data.projects}
              // pagination={{ pageIndex: 0, pageSize: 100 }}
              enablePagination={false}
              enableColumnOrdering
              enableGrouping
              enableRowSelection
              onRowSelectionChange={setRowSelection}
              getRowId={(row) => row.id}
              state={{ rowSelection }}
              positionToolbarAlertBanner='bottom'
              renderDetailPanel={DetailPanel}
              renderTopToolbarCustomActions={(tableProps) => (
                <TopToolbarCustomActions
                  {...tableProps}
                  clients={clients} // supply the list of clients
                  onPublish={handlePublish}
                />
              )}
            />
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
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
        )}
      </>
    </>
  );
};

export default Test;
