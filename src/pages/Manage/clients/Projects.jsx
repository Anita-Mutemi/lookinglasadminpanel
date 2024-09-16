import React from 'react';
import moment from 'moment';
import { useSelector } from 'react-redux';
import { List, Space, Typography, Button, Divider, Card, Tooltip } from 'antd';
import {
  MessageOutlined,
  StarOutlined,
  CalendarOutlined,
  LinkOutlined,
} from '@ant-design/icons';
import httpService from '../../../services/http.service';

const { Text, Title } = Typography;

const Projects = ({ data, organization_id }) => {
  // add logic to post it back after revoking

  const { access_token } = useSelector((state) => state.user);
  console.log(data);
  const handleRevoke = async (uuid) => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      };

      // Add org_id as a query parameter to the URL
      const response = await httpService.post(
        `/v1/clients/projects/${uuid}/revoke/${organization_id}?org_id=${organization_id}`,
        {},
        config,
      );

      if (response.status === 200) {
        // Handle successful response, e.g., show a notification
        console.log(`Successfully revoked project with uuid: ${uuid}`);
      } else {
        console.log('Error revoking project');
      }
    } catch (error) {
      console.error('Failed to revoke project', error);
    }
  };

  return (
    <List
      itemLayout='vertical'
      size='small'
      pagination={{
        pageSize: 5,
        style: { textAlign: 'center', marginTop: '20px', marginBottom: '20px' },
      }}
      dataSource={data.feed_projects}
      renderItem={(item) => (
        <List.Item key={item.project.uuid}>
          {console.log(item)}
          <Card>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div>
                <Text type='secondary' style={{ marginBottom: '0rem' }}>
                  {item.project.uuid}
                </Text>
                <Title
                  level={5}
                  style={{
                    marginBottom: '10px',
                    marginTop: '0.2rem',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  {item.project.title}
                  <Tooltip title='Visit Website'>
                    <a
                      href={item.project.website}
                      target="_blank"
                      style={{ marginLeft: '10px', marginBottom: '5px' }}
                    >
                      <LinkOutlined />
                    </a>
                  </Tooltip>
                </Title>
              </div>
              <Button
                type='primary'
                danger
                onClick={() => handleRevoke(item.project.uuid)}
              >
                Revoke
              </Button>
            </div>
            <Divider />
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <Space align='center' style={{ display: 'flex', alignItems: 'center' }}>
                <span style={{ display: 'flex', alignItems: 'center' }}>
                  <StarOutlined style={{ alignSelf: 'center' }} />
                </span>
                <Text>{item.project_user_entry.rating}</Text>
              </Space>
              <Space align='center' style={{ display: 'flex', alignItems: 'center' }}>
                <span style={{ display: 'flex', alignItems: 'center' }}>
                  <MessageOutlined />
                </span>

                <Text>{item.project_user_entry.feedback || 'No Feedback Available'}</Text>
              </Space>
              <Space align='center' style={{ display: 'flex', alignItems: 'center' }}>
                <span style={{ display: 'flex', alignItems: 'center' }}>
                  <CalendarOutlined />
                </span>

                <Text>
                  {moment(item.project_user_entry.time_recommended).format(
                    'MMM DD, YYYY, hh:mm:ss a',
                  )}
                </Text>
              </Space>
            </div>
          </Card>
        </List.Item>
      )}
    />
  );
};

export default Projects;
