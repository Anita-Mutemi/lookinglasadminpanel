import React, { useState, useEffect } from 'react';
import {
  Card,
  Statistic,
  Row,
  Col,
  Progress,
  Typography,
  Tag,
  Space,
  Spin,
} from 'antd';
import { useSelector } from 'react-redux';
import httpService from '../../services/http.service';

import { SyncOutlined } from '@ant-design/icons';
const { Title } = Typography;

function ParsingStats() {
  const [stats, setStats] = useState({
    signalsInQueue: 0,
    signalsProcessed: 0,
    signalsLastHour: 0,
    signals10Min: 0,
    throughputRate: 0,
    likesInQueue: 0,
    likesProcessed: 0,
  });

  const [loading, setLoading] = useState(true);
  const { access_token } = useSelector((state) => state.user);

  async function getParsingStats() {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      };

      const { data } = await httpService.get(
        `/v1/monitoring/parsing`,
        config,
        false,
      );
      setStats(data);
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    async function fetchData() {
      await getParsingStats();
      if (loading) {
        setLoading(false);
      }
    }

    fetchData(); // Initial fetch
    const intervalId = setInterval(fetchData, 15000); // Fetch every 3 seconds

    return () => clearInterval(intervalId); // Clear interval on component unmount
  }, [loading]);
  return (
    <div style={{ width: '100%' }}>
      <Card>
        <Title
          level={4}
          style={{
            display: 'flex',
            alignItems: 'center',
            textAlign: 'center',
            gap: '0.5rem',
          }}
        >
          <SyncOutlined /> Parsing stats
        </Title>
        {!loading ? (
          stats.parsers?.map((parser_stats) => (
            <div key={parser_stats.type}>
              <Title level={5}>{parser_stats.type}</Title>
              <Row gutter={16}>
                <Col span={6}>
                  <Statistic
                    title='New projects since midnight'
                    value={parser_stats.new_projects}
                  />
                </Col>
                <Col span={6}>
                  <Statistic
                    title='Signals in Queue'
                    value={parser_stats.queued}
                  />
                </Col>
                <Col span={6}>
                  <Statistic
                    title='Signals Processed'
                    value={parser_stats.processed}
                  />
                  <p>({parser_stats.signals_last_hour} in the last hour)</p>
                </Col>
                <Col span={6}>
                  <Statistic
                    title='Throughput Rate (signals)'
                    value={`${
                      parser_stats?.signals_10_min
                        ? parser_stats?.signals_10_min / 10
                        : '-'
                    } per minute`}
                  />
                  <p>
                    (
                    {parser_stats?.signals_10_min
                      ? parser_stats?.signals_10_min
                      : '-'}{' '}
                    in last 10 min)
                  </p>
                </Col>
              </Row>
            </div>
          ))
        ) : (
          <Spin />
        )}
      </Card>
    </div>
  );
}

export default ParsingStats;
