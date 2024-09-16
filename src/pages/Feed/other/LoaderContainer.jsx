import { Spin } from 'antd';

export const LoaderContainer = ({ percentage }) => (
  <div style={{ textAlign: 'center', padding: '20px' }}>
    <Spin size='large' />
    <div
      style={{
        fontSize: '20px',
        marginTop: '15px',
        color: '#1890ff', // This is the default Ant Design blue. Change as needed.
        fontWeight: 'bold',
        letterSpacing: '1px',
      }}
    >
      {percentage}% loaded
    </div>
  </div>
);
