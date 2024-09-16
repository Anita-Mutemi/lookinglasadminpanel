import React, { useState, useEffect } from 'react';
import {
  Card,
  Typography,
  Collapse,
  Input,
  Button,
  Avatar,
  Tag,
  Timeline,
  Spin,
  Divider,
  Badge,
  Row,
  Col,
  Descriptions,
} from 'antd';
import httpService from '../../services/http.service';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import Signals from '../../components/UI/ProjectSignals';
import { LinkedinOutlined } from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;
const { Panel } = Collapse;

const ProjectPage = () => {
  const { id } = useParams();
  const { access_token } = useSelector((state) => state.user);
  const [state, setState] = useState({ loading: true, project: {}, interestedFunds: [] });

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await httpService.get(`/v1/projects/${id}`, getHeaders());
        const interestedFunds = httpService.get(`/v1/projects/${id}/timeline?detailed=false`, getHeaders());
        const data = response.data;
        setState((prevState) => ({
          ...prevState,
          project: data,
          interestedFunds: interestedFunds.data,
          loading: false,
        }));
      } catch (error) {
        toast.error('Failed to fetch project details.');
        setState((prevState) => ({ ...prevState, loading: false }));
      }
    };

    const getHeaders = () => {
      return {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      };
    };

    fetchProject();
  }, [id, access_token]);

  if (state.loading) {
    return <Spin style={{ textAlign: 'center', paddingTop: '50px' }} size='large' />;
  }

  const analytics = state.project.analytics;

  return (
    <div style={{ padding: '20px', background: '#f5f5f5' }}>
      <Card
        bordered={false}
        style={{ borderRadius: '20px', boxShadow: '0 4px 8px 0 rgba(0,0,0,0.1)' }}
      >
        <Row align="middle">
          <Col span={2} style={{ textAlign: 'center', verticalAlign: 'middle' }}>
            {/* <Avatar src={state.project.logo} size={100} /> */}
            <Avatar src={<img src={`https://static.twotensor.com/images/projects/${state.project.uuid}.jpg`} />} size={100} />
          </Col>
          <Col span={20}>
            <Title level={2} style={{ marginBottom: 0, position: 'relative' }}>
              {state.project.title}
              <Badge
                status={state.project.status === 'Pending' ? 'warning' : 'success'}
                text={state.project.status}
                style={{ position: 'absolute', top: '0rem' }}
              />
            </Title>
            <br />
            <Paragraph>
              <Text type="secondary">ID: </Text><Text copyable>{state.project.id}</Text> <Text type="secondary" >&nbsp; - &nbsp; UUID: </Text><Text copyable>{state.project.uuid}</Text>
            </Paragraph>
            <a href={state.project.website} target='_blank' rel='noreferrer'>
              {state.project.website}
            </a>
            <Tag color='blue' style={{ marginLeft: '10px' }}>
              {analytics?.stage ?? 'N/A'}
            </Tag>
            <br />
            <br />
            {
              state.project.linkedin_profile?.linkedin_url ?
              <a href={state.project.linkedin_profile?.linkedin_url} target='_blank' rel='noreferrer'><LinkedinOutlined /> linkedin</a>
              : ''
            }
            <br />
            <br />
            <Descriptions size='small' column={1}>
              <Descriptions.Item label='Status Changed'>
                {new Date(state.project.status_changed).toLocaleDateString()}
              </Descriptions.Item>
            </Descriptions>
          </Col>

        </Row>
        <Divider />

        <Title level={4}>Project Description</Title>
        <Paragraph>{state.project.description || state.project.linkedin_profile?.about || '-'}</Paragraph>
        <Divider />

        <Title level={4}>Analytics</Title>
        <Descriptions column={2}>
          <Descriptions.Item label='Founded'>
            {analytics.founded ?? '-'}
          </Descriptions.Item>
          <Descriptions.Item label='Location'>
            {analytics.location ?? '-'}
          </Descriptions.Item>
          <Descriptions.Item label='Last Funding Round'>
            {analytics.last_round ?? '-'}
          </Descriptions.Item>
          <Descriptions.Item label='Team Size'>
            {analytics.team_size ? analytics.team_size : '-'}
          </Descriptions.Item>
          <Descriptions.Item label='Funding'>
            {analytics.funding ? analytics.funding : '-'}
          </Descriptions.Item>
          <Descriptions.Item label='Verticals'>
            {analytics?.verticals?.length > 0 ? analytics.verticals.join(', ') : '-'}
          </Descriptions.Item>
        </Descriptions>
        <Divider />

        <Title level={4}>Signals</Title>
        {console.log(state.project)}

        <Signals signals={state.project.signals} funds={state.interestedFunds} />

        {
          state.project.signals?.map((signal) => (
           <>
            <p>{signal._id}</p>
            {
              signal.dates?.map((signal_date, i) => (
                <p>
                  {(new Date(signal_date.year, signal_date.month - 1, 1)).toLocaleString('en-GB', {month: 'long', year: 'numeric'})},
                  count: {signal.source_count}
                </p>
              ))
            }

            <Collapse bordered={false} ghost>
            <Panel header='Raw signal' key={signal._id}>
              <pre>{JSON.stringify(signal)}</pre>
            </Panel>
          </Collapse>
           </>
          ))
        }
        <Divider />

        <Collapse bordered={false} ghost>
          <Panel header='Edit Project Details' key='1'>
            <Text>Title:</Text>
            <Input defaultValue={state.project.title} />
            <Text>Description:</Text>
            <Input.TextArea defaultValue={state.project.description} />
            <Button type='primary' style={{ marginTop: '10px' }}>
              Save Changes
            </Button>
          </Panel>
        </Collapse>
      </Card>
    </div>
  );
};

export default ProjectPage;
