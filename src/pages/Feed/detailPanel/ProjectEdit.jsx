import { Form, Input, Button, Badge, Space, Spin, Select, Typography } from 'antd';
import {
  CheckCircleOutlined,
  HourglassOutlined,
  ExclamationCircleOutlined,
  CloseCircleOutlined,
} from '@ant-design/icons';
import { useProjectEdit } from '../hooks/useProjectEdit';

const getStatus = (status) => {
  if (status === 'accepted') return 'success';
  if (status === 'pending') return 'processing';
  if (status === 'discovered') return 'processing';
  if (status === 'not_in_scope') return 'warning';
  if (status === 'rejected') return 'error';
  return 'default';
};

const { TextArea } = Input;
const { Option } = Select;
const { Paragraph, Link } = Typography;

const ProjectEdit = ({ project }) => {
  const {
    status = 'default', // Add a default status
    title = '',
    logo = '',
    website = '',
    description = '',
    markdown = '',
    linkType = '',
    linkUrl = '',
  } = project || {};

  console.log(project);

  const [form] = Form.useForm();

  const {
    hasChanges,
    updatingStatus,
    currentStatus,
    handleFieldChange,
    handleStatusChange,
    handleSave,
  } = useProjectEdit(project, form);

  return (
    <div style={{ width: '100%' }}>
      <Form form={form} layout='vertical' onValuesChange={handleFieldChange}>
        <Space direction='vertical' style={{ width: '100%' }} size={16}>
          <Form.Item name='title'>
            <Input placeholder='Project title' defaultValue={title} />
          </Form.Item>
          <Form.Item name='status' initialValue={status} style={{ position: 'absolute' }}>
            <Input type='hidden' />
          </Form.Item>
          <Form.Item name='logo'>
            <Input
              addonBefore={
                <img
                  style={{ width: '32px', height: '32px', borderRadius: '50%' }}
                  src={project?.logo}
                  alt='logo'
                />
              }
              defaultValue={logo}
              placeholder='logo url'
            />
          </Form.Item>

          <Form.Item name='website'>
            <Input addonBefore='Website' placeholder='website' defaultValue={website} />
          </Form.Item>

          <Form.Item name='description'>
            <TextArea rows={4} placeholder='Description' defaultValue={description} />
          </Form.Item>

          <Form.Item name='markdown'>
            <TextArea rows={4} placeholder='Markdown' defaultValue={markdown} />
          </Form.Item>
          {/* implement change projeect status */}
          <div>
            <Badge
              status={getStatus(status)}
              text={status}
              style={{ padding: '0.5rem' }}
            />
            <div style={{ display: 'flex', gap: '1rem' }}>
              <Button
                type='primary'
                icon={
                  updatingStatus?.toLowerCase() === 'accepted' ? (
                    <Spin />
                  ) : (
                    <CheckCircleOutlined />
                  )
                }
                disabled={currentStatus.toLowerCase() === 'accepted'}
                onClick={() => handleStatusChange('Accepted')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textAlign: 'center',
                }}
              >
                Accept
              </Button>

              <Button
                icon={
                  updatingStatus?.toLowerCase() === 'pending' ? (
                    <Spin />
                  ) : (
                    <HourglassOutlined />
                  )
                }
                disabled={currentStatus.toLowerCase() === 'pending'}
                onClick={() => handleStatusChange('Pending')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textAlign: 'center',
                }}
              >
                Pending
              </Button>

              <Button
                icon={
                  updatingStatus?.toLowerCase() === 'not_in_scope' ? (
                    <Spin />
                  ) : (
                    <ExclamationCircleOutlined />
                  )
                }
                disabled={currentStatus.toLowerCase() === 'not_in_scope'}
                onClick={() => handleStatusChange('Not_in_scope')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textAlign: 'center',
                }}
              >
                Out of Scope
              </Button>

              <Button
                type='primary'
                danger
                icon={
                  updatingStatus?.toLowerCase() === 'rejected' ? (
                    <Spin />
                  ) : (
                    <CloseCircleOutlined />
                  )
                }
                disabled={currentStatus.toLowerCase() === 'rejected'}
                onClick={() => handleStatusChange('Rejected')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textAlign: 'center',
                }}
              >
                Reject
              </Button>
            </div>
          </div>
          <Form.Item name='linkUrl'>
            <Input.Group compact>
              <Select style={{ width: '30%' }} defaultValue='linkedin'>
                <Option value='crunchbase'>Crunchbase</Option>
                <Option value='pitchbook'>Pitchbook</Option>
                <Option value='linkedin'>Linkedin</Option>
              </Select>
              <Input style={{ width: '50%' }} placeholder='website' />
              <Button type='primary' style={{ width: '20%' }}>
                Save Link
              </Button>
            </Input.Group>
          </Form.Item>
          <div>
            <Paragraph>Project links:</Paragraph>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {project?.links?.length > 0 ? (
                project?.links?.map((link) => (
                  <Link href={link.url} title={link.url} key={link.url}>
                    {link.name}
                  </Link>
                ))
              ) : (
                <Paragraph type='secondary'>No links</Paragraph>
              )}
            </div>
          </div>
          <Button type='primary' onClick={handleSave} disabled={!hasChanges}>
            Submit Changes
          </Button>
        </Space>
      </Form>
    </div>
  );
};

export default ProjectEdit;
