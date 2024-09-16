import React from 'react';
import { Card, Collapse, Typography, Row, Descriptions, Tabs, Avatar } from 'antd';
import Signals from './ProjectSignals';

const { Panel } = Collapse;

const { Paragraph, Link } = Typography;
const { TabPane } = Tabs;

const ProjectSnippet = ({
  project = {
    id: '',
    title: '',
    status: '',
    website: '',
    logo: '',
  },
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
    // <div
    //   style={{
    //     padding: '5px',
    //     width: '500px',
    //   }}
    // >
            <div style={{ flexDirection: 'column', gap: '0.4rem' }}>
              {
                logo && <Avatar src={logo} size={40} />
              }
              <Link
                level={5}
                style={{ marginBottom: 0, position: 'relative' }}
                href={`/project/${id}`}
                target='_blank'
                rel='noreferrer'
                title={`ID: ${id}`}
              >
                {title} {`[${id}]`}
              </Link>&nbsp;- {status} - &nbsp;
              <a
                href={website}
                target='_blank'
                rel='noreferrer'
                style={{ fontSize: '12px' }}
              >
                {renderUrl(website)}

              </a>
            </div>
    // </div>
  );
};

export default ProjectSnippet;
