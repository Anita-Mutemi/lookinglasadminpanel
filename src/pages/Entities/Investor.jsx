import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Typography, Divider, List, Avatar, Spin, Card, Tag } from 'antd';
import { TwitterOutlined, LinkedinOutlined } from '@ant-design/icons';
import httpService from '../../services/http.service';

const { Title, Text, Link } = Typography;

const Investor = () => {
  const { id } = useParams();
  const { access_token } = useSelector((state) => state.user);
  const [investor, setInvestor] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInvestor = async () => {
      setLoading(true);
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        };
        const { data } = await httpService.get(`/v1/investors/${id}`, config);
        setInvestor(data);
      } catch (err) {
        console.log('Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchInvestor();
  }, [id, access_token]);

  return (
    <div style={{ padding: '24px', maxWidth: '800px', margin: 'auto' }}>
      {loading ? (
        <Spin />
      ) : (
        <>
          <Title level={2} style={{ textAlign: 'center' }}>
            {investor.name}
          </Title>
          <Divider />
          <Card style={{ borderRadius: '12px' }}>
            <Text strong>Type: </Text>
            <Tag color='blue'>{investor.type || 'N/A'}</Tag>
            <Text strong>Role: </Text>
            <Tag color='green'>{investor.role}</Tag>
          </Card>
          <Divider />
          <Title level={3}>Funds</Title>
          <List
            itemLayout='horizontal'
            dataSource={investor.funds}
            renderItem={(fund) => (
              <List.Item>
                <List.Item.Meta
                  avatar={<Avatar src={fund.logo} />}
                  title={fund.name}
                  description={fund.type || 'N/A'}
                />
              </List.Item>
            )}
          />
          <Divider />
          <Title level={3}>Social Media</Title>
          <List>
            {investor.twitter && (
              <List.Item>
                <TwitterOutlined />{' '}
                <Link href={investor.twitter} target='_blank' rel='noopener noreferrer'>
                  Twitter
                </Link>
              </List.Item>
            )}
            {investor.linkedin && (
              <List.Item>
                <LinkedinOutlined />{' '}
                <Link href={investor.linkedin} target='_blank' rel='noopener noreferrer'>
                  LinkedIn
                </Link>
              </List.Item>
            )}
          </List>
        </>
      )}
    </div>
  );
};

export default Investor;
