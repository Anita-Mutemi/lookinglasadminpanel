import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { Button, Card, Spin, Table, Input } from 'antd';
import httpService from '../../services/http.service';
import { debounce } from 'lodash';

const FundsList = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [offset, setOffset] = useState(0);
  const [limit] = useState(100);
  const [searchQuery, setSearchQuery] = useState('');

  const { access_token } = useSelector((state) => state.user);

  const debouncedSearch = useCallback(
    debounce(async (query) => {
      if (!query) return;
      setLoading(true);
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        };
        const { data } = await httpService.get(`/v1/lookup/fund?query=${query}`, config);
        setData(data);
      } catch (err) {
        console.log('error', err);
      } finally {
        setLoading(false);
      }
    }, 300),
    [access_token],
  );

  async function getFunds() {
    setLoading(true);
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      };
      const queryParams = new URLSearchParams({
        limit: limit,
        offset: offset,
      });
      const { data } = await httpService.get(`/v1/funds?${queryParams}`, config);
      setData(data);
    } catch (err) {
      console.log('error', err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!searchQuery) {
      getFunds();
    }
  }, [offset, searchQuery]);

  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (query) {
      debouncedSearch(query);
    } else {
      getFunds();
    }
  };

  const handleNext = () => {
    setOffset((prevOffset) => prevOffset + limit);
  };

  const handleGoBack = () => {
    setOffset((prevOffset) => Math.max(prevOffset - limit, 0));
  };

  const columns = useMemo(
    () => [
      {
        title: 'Fund ID',
        dataIndex: 'id',
        key: 'id',
      },
      {
        title: 'Fund Name',
        dataIndex: 'name',
        key: 'name',
        render: (text, record) => (
          <div style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
            {record.logo ? (
              <div
                style={{
                  borderRadius: '50%',
                  overflow: 'hidden',
                  width: '40px',
                  height: '40px',
                  marginRight: '10px',
                }}
              >
                <img
                  src={record.logo}
                  alt='logo'
                  style={{ width: '100%', height: 'auto' }}
                />
              </div>
            ) : null}
            {text}
          </div>
        ),
      },
      {
        title: 'Type',
        dataIndex: 'type',
        key: 'type',
      },
      {
        title: 'UUID',
        dataIndex: 'uuid',
        key: 'uuid',
      },
    ],
    [],
  );

  return (
    <>
      <Card>
        <Input.Search
          placeholder='Search for funds'
          value={searchQuery}
          onChange={handleSearch}
          style={{ marginBottom: '20px' }}
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
        {loading ? (
          <Spin />
        ) : (
          <Table
            dataSource={data}
            columns={columns}
            pagination={false}
            rowKey='id'
            onRow={(record) => {
              return {
                onClick: () => {
                  window.open(`/fund/${record.uuid}`, '_blank');
                },
              };
            }}
          />
        )}
      </Card>
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
        <br />
      </div>
    </>
  );
};

export default FundsList;
