import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { Button, Card, Spin, Table, Input, Tag } from 'antd';
import httpService from '../../services/http.service';
import { debounce } from 'lodash';

const InvestorList = () => {
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
        const { data } = await httpService.get(
          `/v1/lookup/investor?query=${query}`,
          config,
        );
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
      const { data } = await httpService.get(`/v1/investors?${queryParams}`, config);
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

  // const columns = useMemo(
  //   () => [
  //     {
  //       title: 'Investor ID',
  //       dataIndex: 'id',
  //       key: 'id',
  //     },
  //     {
  //       title: 'Name',
  //       dataIndex: 'name',
  //       key: 'name',
  //     },
  //     {
  //       title: 'Role',
  //       dataIndex: 'role',
  //       key: 'role',
  //     },
  //     // ... more columns based on your needs
  //   ],
  //   [],
  // );
  const columns = useMemo(
    () => [
      {
        title: 'Investor ID',
        dataIndex: 'id',
        key: 'id',
        render: (id) => (
          <a href={`/investor/${id}`} rel='noreferrer' target='_blank'>
            {id}
          </a>
        ),
      },
      {
        title: 'Name & Role',
        dataIndex: 'name',
        key: 'name',
        render: (text, record) => (
          <>
            <strong>{text}</strong>
            <br />
            <Tag color='blue'>{record.role}</Tag>
          </>
        ),
      },
      {
        title: 'Funds',
        dataIndex: 'funds',
        key: 'funds',
        render: (funds) =>
          funds.map((fund) => (
            <div key={fund.id}>
              {/* {fund.logo && (
                <img
                  src={fund.logo}
                  alt='logo'
                  style={{ width: '20px', height: 'auto', marginRight: '5px' }}
                />
              )} */}
              <a href={`/fund/${fund.id}`} rel='noreferrer' target='_blank'>
                {fund.name}
              </a>
            </div>
          )),
      },
      {
        title: 'Social Media',
        dataIndex: 'twitter',
        key: 'socialMedia',
        render: (text, record) => (
          <>
            {record.twitter && <a href={record.twitter}>Twitter</a>}
            {record.linkedin && <a href={record.linkedin}>LinkedIn</a>}
          </>
        ),
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
            // onRow={(record) => {
            //   return {
            //     onClick: () => {
            //       window.open(`/investor/${record.id}`, '_blank');
            //     },
            //   };
            // }}
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

export default InvestorList;
