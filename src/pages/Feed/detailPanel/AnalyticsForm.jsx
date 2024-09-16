import React, { useState } from 'react';
import {
  Form,
  Input,
  Select,
  Checkbox,
  DatePicker,
  InputNumber,
  Button,
  Drawer,
} from 'antd';
import { useSelector } from 'react-redux';

import { Collapse, Card, Space } from 'antd';
import httpService from '../../../services/http.service';

const { Option } = Select;

const { Panel } = Collapse;

const AddLeaderDrawer = ({ visible, onClose, onSubmit }) => {
  const onFinish = (values) => {
    console.log('Received values of new leader form:', values);
    onSubmit(values);
  };

  return (
    <Drawer title='Add New Leader' placement='bottom' onClose={onClose} visible={visible}>
      <Form onFinish={onFinish} layout='inline'>
        <Form.Item
          name='name'
          label='Name:'
          rules={[{ required: true, message: 'Please input the name!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item name='email' label='Email:'>
          <Input />
        </Form.Item>
        <Form.Item name='role' label='Role:'>
          <Input />
        </Form.Item>
        <Form.Item name='linkedin' label='LinkedIn:'>
          <Input />
        </Form.Item>
        <Form.Item name='img' label='Image URL:'>
          <Input />
        </Form.Item>
        <Form.Item name='project_ids' label='Project IDs:'>
          <Input />
        </Form.Item>
        <Form.Item name='recommended' valuePropName='checked'>
          <Checkbox>Recommended Leader</Checkbox>
        </Form.Item>
        <Form.Item style={{ justifySelf: 'right' }}>
          <br />
          <Button type='primary' htmlType='submit'>
            Upload Leader
          </Button>
          <Button onClick={onClose} style={{ marginLeft: '8px' }}>
            Cancel
          </Button>
        </Form.Item>
      </Form>
    </Drawer>
  );
};

const LeaderInputs = ({ leaders }) => {
  const onLeaderFormFinish = (leaderId, values) => {
    console.log('Leader ID:', leaderId, 'Values:', values);
    // Here you can send a PATCH request with the updated values
  };

  const removeLeader = (leaderId) => {
    console.log('Remove leader with ID:', leaderId);
    // Logic to remove the leader, which can involve updating the state
    // or sending a DELETE request
  };

  return (
    <Collapse accordion>
      {leaders?.map((leader) => (
        <Panel header={leader.name + ' - ' + leader.role} key={leader.id}>
          <Form
            onFinish={(values) => onLeaderFormFinish(leader.id, values)}
            initialValues={{
              email: leader.email,
              role: leader.role,
              linkedin: leader.linkedin,
              img: leader.img,
              project_ids: leader.project_ids.join(', '),
              recommended: leader.recommended,
            }}
          >
            <Space direction='vertical' size='middle'>
              <Card size='small' title='Personal Details'>
                <Space direction='vertical'>
                  <Form.Item name='email' label='Email:'>
                    <Input size='small' />
                  </Form.Item>
                  <Form.Item name='role' label='Role:'>
                    <Input size='small' />
                  </Form.Item>
                  <Form.Item name='linkedin' label='LinkedIn:'>
                    <Input size='small' />
                  </Form.Item>
                  <Form.Item name='recommended' valuePropName='checked'>
                    <Checkbox>Recommended Leader</Checkbox>
                  </Form.Item>
                </Space>
              </Card>
              <Card size='small' title='Other Details'>
                <Space direction='vertical'>
                  <Form.Item name='img' label='Image URL:'>
                    <Input size='small' />
                  </Form.Item>
                  <Form.Item name='project_ids' label='Project IDs:'>
                    <Input size='small' />
                  </Form.Item>
                </Space>
              </Card>
              <Space>
                <Button type='primary' htmlType='submit'>
                  Update Leader
                </Button>
                <Button type='danger' onClick={() => removeLeader(leader.id)}>
                  Remove Leader
                </Button>
              </Space>
            </Space>
          </Form>
        </Panel>
      ))}
    </Collapse>
  );
};

const AnalyticsForm = (props) => {
  const { analytics } = props;
  const { access_token } = useSelector((state) => state.user); // Assume you have this from Redux

  const [hasAnalyticsChanges, setHasAnalyticsChanges] = useState(false);
  const [updatingAnalytics, setUpdatingAnalytics] = useState(null);
  const [drawerVisible, setDrawerVisible] = useState(false);

  const handleDrawerClose = () => {
    setDrawerVisible(false);
  };

  const form = Form.useForm()[0]; // Assume you are using Form.useForm()

  const handleAnalyticsChange = () => {
    setHasAnalyticsChanges(true);
  };

  const handleAnalyticsSave = async () => {
    const analyticsValues = form.getFieldsValue().analytics;
    try {
      setUpdatingAnalytics(true);
      await httpService.patch(`/project/${project.id}/analytics`, analyticsValues, {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });
      setHasAnalyticsChanges(false);
    } catch (error) {
      console.log(error);
    } finally {
      setUpdatingAnalytics(null);
    }
  };

  const handleNewLeaderSubmit = (values) => {
    console.log('Submit new leader:', values);
    // Implement the POST request logic here
    handleDrawerClose();
  };

  return (
    <>
      <Form
        name='analyticsForm'
        // onFinish={onFinish}
        initialValues={{ analytics }}
        onValuesChange={handleAnalyticsChange}
        form={form}
      >
        <Form.Item name={['analytics', 'enriched']} valuePropName='checked'>
          <Checkbox>Enriched</Checkbox>
        </Form.Item>

        <Form.Item name={['analytics', 'founded']}>
          <Input place='founded year' />
        </Form.Item>
        <Form.Item
          name={['analytics', 'funding']}
          rules={[{ required: true, message: 'Please input the funding!' }]}
        >
          <Input placeholder='Funding' />
        </Form.Item>

        <Form.Item name={['analytics', 'industry']}>
          <Select placeholder='Select an industry'>
            {/* Replace with your industry options */}
            <Option value='industry1'>Industry 1</Option>
            <Option value='industry2'>Industry 2</Option>
          </Select>
        </Form.Item>

        <Form.Item name={['analytics', 'last_round']}>
          <Input placeholder='Last Round' />
        </Form.Item>

        <Form.Item name={['analytics', 'last_round_amount']}>
          <InputNumber placeholder='Last Round Amount' />
        </Form.Item>

        <Form.Item name={['analytics', 'leaders']}>
          <Select mode='multiple' placeholder='Select leaders'>
            {/* Replace with your leaders options */}
            <Option value='leader1'>Leader 1</Option>
            <Option value='leader2'>Leader 2</Option>
          </Select>
        </Form.Item>

        <Form.Item name={['analytics', 'location']}>
          <Input placeholder='Location' />
        </Form.Item>

        <Form.Item name={['analytics', 'previous_exit']} valuePropName='checked'>
          <Checkbox>Previous Exit</Checkbox>
        </Form.Item>

        <Form.Item name={['analytics', 'recent_investment']} valuePropName='checked'>
          <Checkbox>Recent Investment</Checkbox>
        </Form.Item>

        <Form.Item name={['analytics', 'stage']}>
          <Input placeholder='Stage' />
        </Form.Item>

        <Form.Item>
          <Button
            type='primary'
            onClick={handleAnalyticsSave}
            disabled={!hasAnalyticsChanges}
          >
            Save Analytics
          </Button>
        </Form.Item>
      </Form>
      <LeaderInputs leaders={analytics.leaders} />
      <br />
      <Button type='primary' onClick={() => setDrawerVisible(true)} warning>
        Add New Leader
      </Button>
      <AddLeaderDrawer
        visible={drawerVisible}
        onClose={handleDrawerClose}
        onSubmit={handleNewLeaderSubmit}
      />
    </>
  );
};

export default AnalyticsForm;

// Usage example:
// <AnalyticsForm analytics={{ enriched: false, founded: null, funding: '', industry: null, last_round: null, last_round_amount: null, leaders: [], location: null, previous_exit: false, project_id: 31708, recent_investment: false, stage: '' }} />
