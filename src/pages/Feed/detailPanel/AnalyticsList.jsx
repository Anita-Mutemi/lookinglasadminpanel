import { Collapse, List, Descriptions } from 'antd';
import moment from 'moment';

import { NoDataUI } from './NoData';

const { Panel } = Collapse;

const groupByDataSource = (details) => {
  return details.reduce((acc, detail) => {
    const key = detail.data_source;
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(detail);
    return acc;
  }, {});
};

const AnalyticsList = ({ analytics, project }) => {
  const { tags = [], details = [] } = analytics;
  const groupedDetails = groupByDataSource(details);
  const groupedTags = groupByDataSource(tags);

  // if (!details?.length) {
  //   return <NoDataUI />;
  // }

  return (
    <div>
      <h3>Analytics</h3>
      <Collapse>
        {Object.entries(groupedDetails)?.map(([dataSource, details]) => (
          <Panel header={`Data Source: ${dataSource}`} key={dataSource}>
            <List
              dataSource={details}
              renderItem={(item) => (
                <List.Item>
                  <Descriptions>
                    <Descriptions.Item label='Type'>{item.type}</Descriptions.Item>
                    <Descriptions.Item label='Value'>{item.value}</Descriptions.Item>
                    <Descriptions.Item label='Effective From'>
                      {moment(item.effective_from).format('MMM DD, YYYY')}
                    </Descriptions.Item>
                    <Descriptions.Item label='Effective To'>
                      {item.effective_to === null
                        ? 'N/A'
                        : moment(item.effective_to).format('MMM DD, YYYY')}
                    </Descriptions.Item>
                  </Descriptions>
                </List.Item>
              )}
            />
          </Panel>
        ))}
      </Collapse>
      <Collapse>
        {Object.entries(groupedTags)?.map(([dataSource, tags]) => (
          <Panel header={`Data Source: ${dataSource}`} key={dataSource}>
            <List
              dataSource={tags}
              renderItem={(item) => (
                <List.Item>
                  <Descriptions>
                    <Descriptions.Item label='Type'>{item.type}</Descriptions.Item>
                    <Descriptions.Item label='Value'>{item.value}</Descriptions.Item>
                    <Descriptions.Item label='Effective From'>
                      {moment(item.effective_from).format('MMM DD, YYYY')}
                    </Descriptions.Item>
                    <Descriptions.Item label='Effective To'>
                      {item.effective_to === null
                        ? 'N/A'
                        : moment(item.effective_to).format('MMM DD, YYYY')}
                    </Descriptions.Item>
                  </Descriptions>
                </List.Item>
              )}
            />
          </Panel>
        ))}
      </Collapse>
    </div>
  );
};

export default AnalyticsList;
