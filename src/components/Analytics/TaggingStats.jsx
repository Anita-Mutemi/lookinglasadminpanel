import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import httpService from '../../services/http.service';

import {
  Card,
  Divider,
  Statistic,
  Row,
  Col,
  Typography,
  Tag,
  Space,
  Spin,
} from 'antd';
import { TagOutlined, CheckCircleOutlined } from '@ant-design/icons';

const { Title } = Typography;

const TaggingStats = () => {
  const { access_token } = useSelector((state) => state.user);

  const [loading, setLoading] = useState(true);
  const [tagStats, setTagStats] = useState({});
  const [byStatus, setByStatus] = useState({});
  const [byTag, setByTag] = useState({});
  const fetchInProgress = useRef(false);

  async function getTagsStats() {
    if (fetchInProgress.current) return;
    fetchInProgress.current = true;

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      };

      let [tag_stats, by_tag_data] = await Promise.all([
        httpService.get(`/v1/monitoring/tags`, config),
        httpService.get(`/v1/monitoring/tags/by_type`, config),
      ]);

      setTagStats(tag_stats.data);
      setByStatus(tag_stats.data.by_status || {});
      setByTag(by_tag_data.data || {});
    } catch (err) {
      console.error(err);
      // Implement additional error handling here if needed
    } finally {
      setLoading(false);
      fetchInProgress.current = false;
    }
  }

  // async function getTagsStats() {
  //   try {
  //     const config = {
  //       headers: {
  //         Authorization: `Bearer ${access_token}`,
  //       },
  //     };

  //     let [tag_stats, by_tag_data] = await Promise.all([
  //                                           httpService.get(`/v1/monitoring/tags`, config, false),
  //                                            httpService.get(`/v1/monitoring/tags/by_type`, config, false)
  //                                         ]);
  //         // don't add byStatus data to tagStats
  //         setTagStats((({ by_status, ...o }) => o)(tag_stats.data));

  //         setByStatus(tag_stats.data.by_status);
  //         setByTag(by_tag_data.data);
  //   } catch (err) {
  //     console.log(err);
  //   } finally {
  //     setLoading(false);
  //   }
  // }

  // useEffect(() => {
  //   async function fetchData() {
  //     await getTagsStats();
  //     if (loading) {
  //       setLoading(false);
  //     }
  //   }

  //   fetchData(); // Initial fetch
  //   const intervalId = setInterval(fetchData, 8000); // Fetch every 8 seconds

  //   return () => clearInterval(intervalId); // Clear interval on component unmount
  // }, [loading]);

  useEffect(() => {
    const fetchData = async () => {
      await getTagsStats();
    };

    fetchData(); // Initial fetch

    const fetchInterval = 10000; // Time in milliseconds
    let intervalId = setTimeout(function request() {
      fetchData();
      intervalId = setTimeout(request, fetchInterval);
    }, fetchInterval);

    return () => clearTimeout(intervalId);
  }, [access_token]);

  function statusToColor(status) {
    switch (status.toLowerCase()) {
      case 'accepted':
        return 'green';
      case 'published':
        return 'lime';
      case 'pending':
        return 'gold';
      case 'review':
        return 'orange';
      case 'discovered':
        return 'blue';
      default:
        return 'grey';
    }
  }

  function ratioToColor(lower, upper) {
    const percent = lower / upper;
    const hue = percent * 120;
    return `hsl(${hue}, 70%, 50%)`;
  }

  function showTagStats(tag, index) {
    // let tagName = tag[0];
    let projectStatus = tag[1];
    let currentValue = tag[2];
    let maxValue = byStatus[tag[1]];

    return (
      <>
        <Tag color={statusToColor(projectStatus)}>{projectStatus}</Tag>
        <Tag color={ratioToColor(currentValue, maxValue)}>
          {`${currentValue} / ${maxValue}`}
        </Tag>
        <br />
      </>
    );
  }

  return (
    <div>
      <Card className='mt-3'>
        <Title
          level={4}
          style={{
            display: 'flex',
            alignItems: 'center',
            textAlign: 'center',
            gap: '0.5rem',
          }}
        >
          <TagOutlined /> Tagging stats
        </Title>
        {!loading ? (
          <>
            <Row gutter={16}>
              <Col span={6}>
                <Card bordered={false}>
                  <Statistic
                    title='Fully tagged projects'
                    value={tagStats?.projects_fully_tagged}
                    suffix={`/${tagStats?.total_accepted} (accepted)`}
                  />
                </Card>
              </Col>
              <Col span={6}>
                <Card bordered={false}>
                  <Statistic
                    title='Projects missing a tag'
                    value={tagStats?.accepted_not_tagged}
                  />
                  {byStatus &&
                    Object.keys(byStatus)?.map((status, index) => (
                      <Tag key={index} color={statusToColor(status)}>
                        {status}: {byStatus[status]}
                      </Tag>
                    ))}
                </Card>
              </Col>
            </Row>
          </>
        ) : (
          <Spin />
        )}
      </Card>
      <Card className='mt-3'>
        <Title
          level={4}
          style={{
            display: 'flex',
            alignItems: 'center',
            textAlign: 'center',
            gap: '0.5rem',
          }}
        >
          <CheckCircleOutlined />
          Enabled tags{' '}
        </Title>
        {!loading ? (
          <>
            <Row>
              <Col span={24}>
                <Row>
                  <Col span={4}>
                    {byTag?.enabled_entries?.map((tag, index) => (
                      <Row>
                        <Tag key={index} color='blue'>
                          {tag}
                        </Tag>
                      </Row>
                    ))}
                  </Col>
                  <Col span={8}>
                    <Title level={4}>Tags</Title>

                    {Object.entries(
                      Object.groupBy(byTag?.tagged_tags, (arr) => arr[0]),
                    ).map(([tagName, vals]) => (
                      <>
                        <Title level={5}>{tagName}</Title>

                        {vals.map((tag, index) => showTagStats(tag, index))}
                        <br />
                      </>
                    ))}
                  </Col>

                  <Col span={8}>
                    <Title level={4}>Details</Title>

                    {Object.entries(
                      Object.groupBy(byTag?.tagged_details, (arr) => arr[0]),
                    ).map(([tagName, vals]) => (
                      <>
                        <Title level={5}>{tagName}</Title>

                        {vals.map((tag, index) => showTagStats(tag, index))}
                        <br />
                      </>
                    ))}
                  </Col>
                </Row>
              </Col>
            </Row>
          </>
        ) : (
          <Spin />
        )}
      </Card>
    </div>
  );
};

export default TaggingStats;
