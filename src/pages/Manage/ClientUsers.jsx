import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
  Form,
  Input,
  Select,
  Button,
  Row,
  Col,
  Spin,
  Card,
  Typography,
} from 'antd';
import Main from './clients/Main';
import httpService from '../../services/http.service';
// import ReactJson from 'react-json-view';

const { Option } = Select;
const { Title } = Typography;

const ClientUsers = () => {
  const { access_token } = useSelector((state) => state.user);

  const [isLoading, setIsLoading] = useState(false);

  const [organizations, setOrganizations] = useState([]);
  const [loading, setLoading] = useState(true); // Add loading state
  const [error, setError] = useState(false);
  const [serverResponse, setServerResponse] = useState({
    data: null,
    endpoint: null,
  });

  const timeZones = [
    'UTC',
    'US/Pacific',
    'US/Mountain',
    'US/Central',
    'US/Eastern',
    'CET',
    'Europe/Istanbul',
    'Asia/Kolkata',
    'Asia/Singapore',
    'Asia/Shanghai',
    'Asia/Tokyo',
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedItems = await httpService.get(`/v1/clients/orgs`, {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        });
        setOrganizations(fetchedItems.data);
        setLoading(false); // Set loading to false when data is fetched
      } catch (err) {
        console.log(err);
        toast.error('Failed to fetch collections.');
        setLoading(false); // Set loading to false on error
      }
    };
    fetchData();
  }, [access_token]);

  const handleSubmit = async (url, values) => {
    setIsLoading(true);

    try {
      setError(false);
      const response = await httpService.post(url, values, {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });
      setServerResponse({ data: response.data, endpoint: url });
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
      setError(true);
      setServerResponse({
        data: error.response ? error.response.data : { error: error.message },
        endpoint: url,
      });
    }
  };

  const isPasswordReset = serverResponse.endpoint?.includes('reset_password');

  const highlightPassword = (key) => {
    return key === 'password' ? { style: { backgroundColor: '#ffcccb' } } : {};
  };
  return (
    <>
      <Card>
        <Title level={2}>New Clients</Title>
        <Row gutter={16}>
          <Col span={12}>
            <h4>Create Organization</h4>
            <Form
              onFinish={(values) => handleSubmit('/v1/clients/orgs', values)}
              layout='vertical'
            >
              <Form.Item
                name='name'
                label='Organization Name'
                rules={[{ required: true }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name='timezone'
                label='Select Timezone (UTC offset)'
                rules={[{ required: true }]}
              >
                <Select>
                  {timeZones.map((zone) => (
                    <Option key={zone} value={zone}>
                      {zone}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item>
                <Button type='primary' htmlType='submit'>
                  Submit
                </Button>
              </Form.Item>
            </Form>
            <Spin spinning={isLoading} />

            <h4 className='mt-4'>Reset user password</h4>
            <Form
              onFinish={(values) =>
                handleSubmit(
                  `/v1/clients/users/${values.username}/reset_password`,
                  values,
                )
              }
              layout='vertical'
            >
              <Form.Item
                name='username'
                label='Username'
                rules={[{ required: true }]}
              >
                <Input />
              </Form.Item>
              <Form.Item>
                <Button type='primary' htmlType='submit'>
                  Submit
                </Button>
              </Form.Item>
            </Form>
            <Spin spinning={isLoading} />
          </Col>
          <Col span={12}>
            <h4>Create user</h4>
            <Form
              onFinish={(values) => handleSubmit('/v1/clients/users', values)}
              layout='vertical'
            >
              <Form.Item
                name='username'
                label='Username'
                rules={[{ required: true }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name='email'
                label='Email'
                rules={[{ required: true, type: 'email' }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name='organization_id'
                label='Organization ID'
                rules={[{ required: true }]}
              >
                <Select>
                  {organizations.map((org) => (
                    <Option key={org.name} value={org.name}>
                      {org.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item
                name='firstname'
                label='Firstname'
                rules={[{ required: true }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name='lastname'
                label='Lastname'
                rules={[{ required: true }]}
              >
                <Input />
              </Form.Item>
              <Form.Item>
                <Button type='primary' htmlType='submit'>
                  Submit
                </Button>
              </Form.Item>
            </Form>
            <Spin spinning={isLoading} />
          </Col>
        </Row>
      </Card>
      <br />
      {serverResponse.data && (
        <Card>
          <Title level={4}>
            Server Response for Endpoint: {serverResponse.endpoint}
          </Title>
          {isPasswordReset && !error && (
            <p style={{ color: 'red' }}>
              New password is located in a password field
            </p>
          )}
          <ReactJson
            src={serverResponse.data}
            theme='rjv-default'
            collapsed={false}
            getItemString={(type, data, itemType, itemString) => (
              <span>
                {type === 'Object' && data.password ? (
                  <span style={{ fontWeight: 'bold' }}>
                    New Password: {data.password}
                  </span>
                ) : (
                  itemString
                )}
              </span>
            )}
          />
        </Card>
      )}
      <br />
      <Card>
        <Title level={2}>Existing clients</Title>
        <Row gutter={16}>
          <Main loading={loading} organizations={organizations} />
        </Row>
      </Card>
      <br />
    </>
  );
};

export default ClientUsers;
