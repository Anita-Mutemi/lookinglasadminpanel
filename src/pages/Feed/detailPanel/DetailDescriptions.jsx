import { Card, Tag, Typography } from 'antd';
import { NoDataText } from './NoData';
import Signals from '../../../components/UI/ProjectSignals';
import moment from 'moment';
const { Text } = Typography;

const DetailDescriptions = ({ project }) => (
  <Card
    style={{ marginBottom: '20px' }}
    title={
      <div style={{ display: 'flex', gap: '0.2rem' }}>
        <Text strong>
          <img
            src={project?.logo || 'placeholder-image-url.png'} // Use a placeholder image URL if you have one
            alt='logo'
            style={{ width: '24px', height: '24px', marginRight: '10px' }}
          />
          {project?.title || <NoDataText />}
          {project?.id && (
            <a href={`/project/${project.id}`} style={{ marginLeft: '0.25rem' }}>
              [{project.id}]
            </a>
          )}
        </Text>
        <NoDataText>
          <a href={project?.url || '#'}>{project?.website || 'URL not available'}</a>
        </NoDataText>
      </div>
    }
  >
    <NoDataText>Status: {project?.status}</NoDataText>
    <br />
    <NoDataText>
      Status changed on{' '}
      {project?.status_changed
        ? moment(project.status_changed).format('MMM DD, YYYY, hh:mm:ss a')
        : '-'}
    </NoDataText>
    <br />
    <NoDataText>
      Discovered on{' '}
      {project?.discovered_date
        ? moment(project.discovered_date).format('MMM DD, YYYY, hh:mm:ss a')
        : '-'}
    </NoDataText>
    <br />
    <NoDataText>
      Last parsed on{' '}
      {project?.last_parsed
        ? moment(project.last_parsed).format('MMM DD, YYYY, hh:mm:ss a')
        : '-'}
    </NoDataText>
    <br />
    <NoDataText style={{ color: 'red' }}>
      Updated on {project?.updated ? moment(project.updated).format('MMM DD, YYYY') : '-'}
    </NoDataText>
    <br />
    <Text strong style={{ display: 'block', marginTop: '20px' }}>
      Interested funds:
    </Text>
    {project?.funds?.length ? (
      project?.funds?.map((fund) => (
        <Tag color='processing' key={fund.id}>
          <a href={`/fund/${fund.id}`} target='__blank'>
            {fund.name}
          </a>
        </Tag>
      ))
    ) : (
      <NoDataText>No interested funds</NoDataText>
    )}
    <Signals signals={project?.signals} />
  </Card>
);

export default DetailDescriptions;
