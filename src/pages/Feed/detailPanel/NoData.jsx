import { ExclamationCircleOutlined } from '@ant-design/icons';
import { Typography } from 'antd';
import { TagOutlined } from '@mui/icons-material';
const { Text } = Typography;

export const NoDataText = ({ children }) => (
  <Text type='secondary' italic>
    {children || 'Data not available'}
  </Text>
);
export const NoDataUI = ({ children }) => (
  <div style={{ textAlign: 'center', padding: '20px' }}>
    <ExclamationCircleOutlined style={{ fontSize: '24px', color: '#f5222d' }} />
    <Text type='secondary' italic style={{ display: 'block', marginTop: '10px' }}>
      {children || 'Analytics is not available'}
    </Text>
  </div>
);

export const NoTagsUI = () => (
  <div style={{ textAlign: 'center', padding: '20px' }}>
    <TagOutlined style={{ fontSize: '24px', color: '#f5222d' }} />
    <Text type='secondary' italic style={{ display: 'block', marginTop: '10px' }}>
      No tags available
    </Text>
    {/* Uncomment the below line if you have a feature to add tags */}
    {/* <Button type="primary" style={{ marginTop: '10px' }}>Add Tags</Button> */}
  </div>
);
