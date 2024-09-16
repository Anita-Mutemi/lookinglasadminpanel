import React from 'react';
import { Avatar, Typography, Row, Col, List, Collapse } from 'antd';
const { Panel } = Collapse;
const { Title, Paragraph, Text } = Typography;
import FilterOutput from '../UI/FilterOutput';
import ErrorBoundary from './ErrorBoundry';

const FilterEvent = ({ event, compactMode = false }) => {
  //   const { passed, input, steps } = project;

  const renderEvent = () => {
    let out = <FilterOutput filters={event.data} />;

    let style = {
      paddingTop: '15px',
      width: '100%',
    };

    if (compactMode) {
      style['padding'] = '0';

      out = (
        <>
          <Title level={5} style={{ margin: '0' }}>Failed filter</Title>
          <FilterOutput filters={event?.data.length > 0 && [event?.data[0]?.output?.at(-1)]} />

          <Collapse size='small' padding={0}>
            <Panel header='Log details' key='2' padding={0}>
              {out}
            </Panel>
          </Collapse>
        </>
      );
    }

    return <div style={style}>{out}</div>;
  };

  const renderProjectName = () => {
    if (event?.data?.[0]?.input?.project_data?.title) {
      return event.data[0].input.project_data.title;
    }
    // throw new Error("Cannot read properties of undefined (reading '0')");
  };

  const getProjectName = () => {
    return <ErrorBoundary>{renderProjectName()}</ErrorBoundary>;
  };

  const renderProjectLogo = () => {
    if (event?.data?.[0]?.input?.project_data?.logo) {
      return <img src={event.data[0].input.project_data.logo} />
    } else {
      // throw new Error("Cannot read properties of undefined (reading '0')");
    }
  };

  const getProjectLogo = () => {
    return <ErrorBoundary>{renderProjectLogo()}</ErrorBoundary>;
  };

  return (
    <>
      <Row>
        <Col span={compactMode ? 8 : 24}>
          <ErrorBoundary>
            <Title level={5}>
              <Avatar size={'small'} src={getProjectLogo()}>
                {getProjectName() ? getProjectName()[0] : 'P'}
              </Avatar>
              &nbsp;
              <span ellipsis="true" style={{ width: '15ch' }}>
                {getProjectName()}
              </span>
              : &nbsp;
              {event.display_name || event.event_name}
            </Title>
            <Text type='secondary'>{event.details}</Text>
          </ErrorBoundary>
        </Col>
        <Col span={compactMode ? 16 : 24}>
          <ErrorBoundary>{renderEvent()}</ErrorBoundary>
        </Col>
      </Row>
    </>
  );
};

export default FilterEvent;
