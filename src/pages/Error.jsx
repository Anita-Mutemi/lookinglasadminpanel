import { Result } from 'antd';
import ErrorSvg from '../assets/error.svg';

const Error = () => {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        background: '#f0f2f5',
      }}
    >
      <Result
        icon={<img src={ErrorSvg} style={{ width: '10rem' }} />}
        title='Oops, something went wrong...'
        subTitle='Horse glitch, no worries! Trot to our homepage while we ketamine-fix it!'
      />
    </div>
  );
};

export default Error;
