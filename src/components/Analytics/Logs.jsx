import React, { useState } from 'react';
import {
  Row,
  Col,
  Checkbox,
  Radio,
  List,
  Space,
  Collapse,
  Typography,
  Button,
  Spin,
} from 'antd';
import {
  ExclamationCircleOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons';
import ProjectCard from '../UI/ProjectCard';
import ProjectSnippet from '../UI/ProjectSnippet';
import FilterEvent from '../UI/FilteringEvent';
import Filters from '../Filters';
import Paragraph from 'antd/es/skeleton/Paragraph';
import { GeneralErrorBoundary } from '../UI/GeneralErrorBoundry';
const { Panel } = Collapse;
const { Title, Text } = Typography;

const Logs = ({
  data,
  eventTypes,
  onLoadMore,
  onLoadLess,
  loading,
  limit,
  pageNumber,
  offset,
}) => {
  const [position, setPosition] = useState('both');
  const [align, setAlign] = useState('center');
  const [viewMode, setViewMode] = useState(1);

  const hasProjectData = (item) => {
    const projectEvents = [
      'ProjectEvent',
      'ProjectProcessed',
      'project_created',
      'project_updated',
    ];

    let eventData = JSON.parse(item.message);
    if (projectEvents.includes(item.event) || eventData?.project_data) {
      return true;
      if (eventData?.project?.website) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  };

  const hasFilterEvent = (item) => {
    const filterEvents = ['FilteringEvent', 'NoMatches'];
    if (filterEvents.includes(item.event)) {
      return true;
    }
    return false;
  };

  const renderContents = (item, prevItem) => {
    if (hasProjectData(item)) {
      let event = JSON.parse(item.message);
      let project_data = event.project_data || event.data?.project_data;

      if (prevItem !== null) {
        let prevEvent = JSON.parse(prevItem?.message);
        let prev_project_data = prevEvent.data?.project_data || prevEvent.project_data;

        console.log(project_data.id, prev_project_data?.id);
        console.log(project_data.title, prev_project_data?.title);
        if (project_data?.id == prev_project_data?.id) {
          return null; //<p>skipped</p>;
        }
      }

      return (
        <>
          <Title level={5}>{event.display_name}</Title>
          <GeneralErrorBoundary customMessage={'Project card log is dead :('}>
            {
              (event.event_name == 'project_rejected' || event.event_name.includes('historic'))
              ? <ProjectSnippet project={{ ...project_data }} />
              : <ProjectCard project={{ ...project_data }} fullWidth />
            }
          </GeneralErrorBoundary>
        </>
      );
    } else if (hasFilterEvent(item)) {
      return (
        <>
          <GeneralErrorBoundary customMessage={'Filter event log is dead :('}>
            <FilterEvent
              event={JSON.parse(item.message)}
              compactMode={viewMode === 1}
            />
          </GeneralErrorBoundary>
        </>
      );
    } else {
      return <pre>{JSON.stringify(JSON.parse(item.message), null, 2)}</pre>;
    }
  };

  function getRangeVal(lower, upper, rand) {
    let range = upper - lower;
    // console.log(`range: ${range}`);
    // console.log(`lower + rand * range = ${lower} + ${rand} * ${range}`);
    return lower + rand * range;
  }

  function getBackgroundColor(stringInput) {
    // console.log(stringInput);

    let hueRange = [165, 320];
    let satRange = [40, 100];
    let lightRange = [30, 80];

    let stringUniqueHash = [...stringInput].reduce((acc, char) => {
      return char.charCodeAt(0) + ((acc << 5) - acc);
    }, 0);

    let pos = (stringUniqueHash % 100) / 100;

    let hsl = {
      h: getRangeVal(hueRange[0], hueRange[1], pos),
      s: getRangeVal(satRange[0], satRange[1], pos),
      l: getRangeVal(lightRange[0], lightRange[1], pos),
    };

    // console.log(`rand pos: ${pos}`);
    // console.log(`hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`);

    return `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;
  }

  const getGroupId = (item) => JSON.parse(item.message)?.group_id;

  const changeViewMode = (e) => {
    setViewMode(e.target.value);
  };

  // const gap = viewMode === 1 ? 0 : '8px';

  let lastDate = null;

  return (
    <>
      <Typography.Title level={4}>Logs</Typography.Title>
      <GeneralErrorBoundary customMessage='Filters are not working :('>
        <Filters />
      </GeneralErrorBoundary>
      {!loading ? (
        <>
          <div
            style={{
              textAlign: 'center',
              marginTop: 12,
              height: 32,
              lineHeight: '32px',
              display: 'flex',
              gap: '1rem',
            }}
          >
            <Text>View mode</Text>
            <Radio.Group onChange={changeViewMode} value={viewMode}>
              <Radio value={1}>Compact</Radio>
              <Radio value={2}>Expanded</Radio>
            </Radio.Group>
          </div>

          <div
            style={{
              textAlign: 'center',
              marginTop: 12,
              marginBottom: 12,
              height: 64,
              // lineHeight: '32px',
              display: 'flex',
              gap: '1rem',
            }}
          >
            <Checkbox.Group options={eventTypes} />
          </div>

          <div
            style={{
              textAlign: 'center',
              marginTop: 12,
              height: 32,
              lineHeight: '32px',
              display: 'flex',
              gap: '1rem',
            }}
          >
            <Button onClick={onLoadLess} disabled={offset <= 0 ? true : false}>
              {offset <= 0 ? 'Prev page' : `Prev ${limit} logs`}
            </Button>
            <Button onClick={onLoadMore}>Next {limit} logs</Button>
          </div>
          <List
            dataSource={data}
            renderItem={(item, index) => (
              renderContents(item, (index > 0) ? data[index - 1] : null) == null ? '' : (
              <List.Item>
                <Space direction='vertical' style={{ width: '100%' }}>
                  {/* {index > 0 ? console.log(new Date(data[index - 1].timestamp).getDate()) : ''} */}
                  {index == 0 ||
                  new Date(item.timestamp).getHours() !=
                    new Date(data[index - 1].timestamp).getHours() ? (
                    <Title level={4}>
                      <hr />
                      {new Date(
                        new Date(item.timestamp).getTime() + 1 * 60 * 60 * 1000,
                      ).toLocaleString('en-gb', {
                        day: 'numeric',
                        month: 'short',
                        hour: '2-digit',
                      }) +
                        // display hours nicely
                        ':00'}
                      <hr />
                    </Title>
                  ) : (
                    ''
                  )}
                  <Row>
                    <Col span={2}>
                      {viewMode === 1 ? '' : <br />}
                      <span>
                        <span
                          style={{
                            height: getGroupId(item) ? '8px' : '4px',
                            width: getGroupId(item) ? '8px' : '4px',
                            borderRadius: '50%',
                            display: 'inline-block',
                            backgroundColor: getGroupId(item)
                              ? getBackgroundColor(getGroupId(item))
                              : '#BBB',
                          }}
                        ></span>
                        &nbsp;
                        {new Date(item.timestamp).toLocaleTimeString('en-GB', {
                          hour: 'numeric',
                          minute: 'numeric',
                          second: 'numeric',
                        })}
                      </span>
                    </Col>
                    <Col span={22}>
                      <div style={{ display: 'inline-block', width: '90%' }}>
                        {renderContents(item, (index > 0) ? data[index - 1] : null)}
                      </div>
                    </Col>
                  </Row>
                  {viewMode === 1 ? (
                    ''
                  ) : (
                    <Text type='secondary'>
                      {`${item.event} event`}
                      &nbsp; | &nbsp;
                      <span style={{ color: 'grey' }}>
                        {getGroupId(item)
                          ? getGroupId(item).substring(0, 5)
                          : ''}
                      </span>
                      &nbsp; | &nbsp;
                      {new Date(item.timestamp).toLocaleDateString('en-GB', {
                        year: 'numeric',
                        month: 'numeric',
                        day: 'numeric',
                      })}
                      <div style={{ display: 'inline-block' }}>
                        <Collapse size='small' ghost>
                          <Panel
                            header={<Text type='secondary'>raw output</Text>}
                            key='2'
                          >
                            <pre>
                              {JSON.stringify(
                                JSON.parse(item.message),
                                null,
                                2,
                              )}
                            </pre>
                          </Panel>
                        </Collapse>
                      </div>
                    </Text>
                  )}
                </Space>
              </List.Item>
            ))}
          />
          <div
            style={{
              textAlign: 'center',
              marginTop: 12,
              height: 32,
              lineHeight: '32px',
              display: 'flex',
              gap: '1rem',
            }}
          >
            <Button
              onClick={onLoadLess}
              disabled={pageNumber <= 0 ? true : false}
            >
              Prev page
            </Button>
            <Button onClick={onLoadMore}>Next page</Button>
          </div>
        </>
      ) : (
        <Spin />
      )}
    </>
  );
};

export default Logs;
