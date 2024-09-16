import React from 'react';
import { Card, Collapse, Typography, Row, Descriptions, Tabs, Avatar } from 'antd';
import Signals from './ProjectSignals';

const { Panel } = Collapse;

const { Paragraph, Link } = Typography;
const { TabPane } = Tabs;

const ProjectCard = ({
  project = {
    id: '',
    title: '',
    status: '',
    website: '',
    logo: '',
    description: '',
    analytics: {},
  },
  fullWidth = false,
}) => {
  const { id, title, status, website, logo, description } = (project || {});

  function renderUrl(url) {
    try {
      return new URL(website).hostname;
    } catch(e) {
      // console.log(url);
      // console.log(e);
      return `invalid url: ${url}`;
    }
  }

  return (
    <div
      style={{
        padding: '10px',
        width: fullWidth ? '100%' : '600px',
      }}
    >
      <Card
        bordered={false}
        style={{
          borderRadius: '20px',
          boxShadow: '0px 0px 14px -5px rgba(0, 0, 0, 0.349)',
        }}
      >
        <Row align='middle' gutter={8}>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <Avatar src={logo} size={40} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <Link
                level={5}
                style={{ marginBottom: 0, position: 'relative' }}
                href={`/project/${id}`}
                target='_blank'
                rel='noreferrer'
                title={`ID: ${id}`}
              >
                {title} {`[${id}]`}
              </Link>
              <a
                href={website}
                target='_blank'
                rel='noreferrer'
                style={{ fontSize: '12px' }}
              >
                {renderUrl(website)}

              </a>
            </div>
          </div>
        </Row>
        <Tabs defaultActiveKey='1' size='small'
        items={[
            {
              label: 'Description',
              key: 1,
              children: <Paragraph ellipsis={{ rows: 3, expandable: true }}>{description}</Paragraph>
            },
            {
              label: 'Analytics',
              key: 2,
              children: <Descriptions column={2} size='small'>
                          <Descriptions.Item label='Founded'>
                            {project.analytics?.founded ?? '-'}
                          </Descriptions.Item>
                          <Descriptions.Item label='Location'>
                            {project.analytics?.location ?? '-'}
                          </Descriptions.Item>
                          <Descriptions.Item label='Last Round'>
                            {project.analytics?.last_round ?? '-'}
                          </Descriptions.Item>
                          <Descriptions.Item label='Size'>
                            {project.analytics?.team_size ?? '-'}
                          </Descriptions.Item>
                          <Descriptions.Item label='Funding'>
                            {project.analytics?.funding ?? '-'}
                          </Descriptions.Item>
                          <Descriptions.Item label='Verticals'>
                            {project.analytics?.verticals?.length > 0 ? project.analytics?.verticals.join(', ') : '-'}
                          </Descriptions.Item>
                        </Descriptions>
          },
          {
            label: 'Signals',
            key: 3,
            children: <>
                  <Signals signals={project.signals} />
            </>
          }
        ]}>
        </Tabs>
      </Card>
    </div>
  );
};

export default ProjectCard;
