import React from 'react';
import { Alert } from 'antd';
import { CloseCircleOutlined } from '@ant-design/icons';

const ErrorDisplay = ({ errorMessage }) => {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
      }}
    >
      <Alert
        message='Error'
        description={errorMessage}
        type='error'
        showIcon
        style={{ width: '100%', margin: '1rem' }}
        icon={<CloseCircleOutlined style={{ color: 'red' }} />}
      />
    </div>
  );
};

export default ErrorDisplay;
