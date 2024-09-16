import { useEffect } from 'react';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Alert, Button, Checkbox, Form, Input } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { userLogin, getUserDetails } from '../redux/features/user/userActions';
import styled, { keyframes } from 'styled-components';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.svg';

const Login = () => {
  // eslint-disable-next-line no-unused-vars
  const { loading, error, userInfo, access_token } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getUserDetails());
  }, []);

  useEffect(() => {
    if (access_token && userInfo) {
      navigate('/');
    }
  }, [access_token, dispatch, navigate, userInfo]);

  const onFinish = async (values) => {
    // eslint-disable-next-line no-unused-vars
    const { username, password, remember } = values;
    dispatch(userLogin({ username, password }));
  };

  return (
    <LoginWrapper>
      <Wrapper>
        <LogoWrapper error={error}>
          <Logo src={logo} alt='logo' />
          Admin Panel Login
        </LogoWrapper>
        {error && (
          <AlertWrapper isVisible={error}>
            <Alert message={error} type='error' showIcon />
          </AlertWrapper>
        )}

        <Form
          name='normal_login'
          className='login-form'
          initialValues={{
            remember: true,
          }}
          onFinish={onFinish}
        >
          <Form.Item
            name='username'
            rules={[
              {
                required: true,
                message: 'Please input your Username!',
              },
            ]}
          >
            <Input
              prefix={<UserOutlined className='site-form-item-icon' />}
              placeholder='Username'
            />
          </Form.Item>
          <Form.Item
            name='password'
            rules={[
              {
                required: true,
                message: 'Please input your Password!',
              },
            ]}
          >
            <Input
              prefix={<LockOutlined className='site-form-item-icon' />}
              type='password'
              placeholder='Password'
            />
          </Form.Item>
          <Form.Item>
            <Form.Item name='remember' valuePropName='checked' noStyle>
              <Checkbox>Remember me</Checkbox>
            </Form.Item>
          </Form.Item>

          <Form.Item>
            <Button
              type='primary'
              htmlType='submit'
              className='login-form-button'
              style={{ width: '100%' }}
            >
              Log in
            </Button>
          </Form.Item>
        </Form>
      </Wrapper>
    </LoginWrapper>
  );
};

const LoginWrapper = styled.div`
  height: 100%;
  min-height: 100vh;
  width: 100%;
  display: flex;
  justify-content: center;
  background: #f9f9f9;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
  border-radius: 0.5rem;
  justify-content: center;
  background: white;
  box-shadow: 0 1px 6px rgba(0, 0, 0, 0.2);
  padding: 2.5rem;
  transition: all 0.3s;
`;

const LogoWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const Logo = styled.img`
  width: 2rem;
  background-color: black;
  border-radius: 0.35rem;
`;

const fadeIn = keyframes`
  0% { opacity: 0; transform: translateY(-20px); }
  100% { opacity: 1; transform: translateY(0); }
`;

const AlertWrapper = styled.div`
  animation: ${(props) => (props.isVisible ? fadeIn : 'none')} 0.3s forwards;
`;

export default Login;
