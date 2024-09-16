import React, { useState, useEffect } from 'react';
import { Card, Spin } from 'antd';
import { useSelector } from 'react-redux';
import ParsingStats from './ParsingStats';
import httpService from '../../services/http.service';
import { GeneralErrorBoundary } from '../UI/GeneralErrorBoundry';
import Logs from './Logs';

function LinkedinExtension() {
  const [stats, setStats] = useState({
    logs: [],
  });
  const [offset, setOffset] = useState(0); // Changed from currentPage
  const limit = 100; // New state for limit
  const [loading, setLoading] = useState(true);

  const { access_token } = useSelector((state) => state.user);

  const nextPageHandler = () => {
    setOffset((prevOffset) => prevOffset + limit); // Update offset
  };

  const prevPageHandler = () => {
    setOffset((prevOffset) => Math.max(prevOffset - limit, 0)); // Don't go below zero
  };

  useEffect(() => {
    async function getTagsStats() {
      try {
        setLoading(true);
        const config = {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        };
        // Use offset and limit as query parameters
        const { data } = await httpService.get(
          `/v1/monitoring/logs?offset=${offset}&limit=${limit}`,
          config,
        );
        setStats(data);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    }

    getTagsStats();
  }, [access_token, offset, limit]); // Include offset and limit as dependencies

  return (
    <div className='module'>
      <ParsingStats />
      <br />
      <Card>
        {loading ? (
          <Spin />
        ) : (
          <GeneralErrorBoundary customMessage={'Logs are down :('}>
            <Logs
              data={stats.logs}
              eventTypes={stats.event_types}
              onLoadMore={nextPageHandler}
              onLoadLess={prevPageHandler}
              limit={limit}
              // pageNumber={currentPage}
              offset={offset} // Pass the offset instead of pageNumber
              loading={loading}
            />
          </GeneralErrorBoundary>
        )}
      </Card>
    </div>
  );
}

export default LinkedinExtension;
