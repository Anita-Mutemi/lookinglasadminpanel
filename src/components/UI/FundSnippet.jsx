import React from 'react';
import { Typography, Row, Avatar } from 'antd';


const { Link } = Typography;

const FundSnippet = ({
  fund = {
    id: '',
    title: '',
    website: '',
    logo: '',
  },
}) => {
  const { id, title, website, logo } = (fund || {});

  function renderUrl(url) {
    try {
      return new URL(website).hostname;
    } catch(e) {
      // console.log(url);
      // console.log(e);
      return `invalid url: ${url}`;
    }
  }

  // console.log(fund);

  return (
        <Row align='middle' gutter={8}>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <Avatar src={logo} size={40} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <Link
                level={5}
                style={{ marginBottom: 0, position: 'relative' }}
                href={`/fund/${id}`}
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
  );
};

export default FundSnippet;
