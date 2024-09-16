import React, { useState } from 'react';
import { Typography, Collapse, Tooltip } from 'antd';
import Projects from './Projects';
import httpService from '../../../services/http.service';
import { useSelector } from 'react-redux';

const { Panel } = Collapse;
const { Title, Text } = Typography;

const Clients = ({ organizations }) => {
  const { access_token } = useSelector((state) => state.user);
  const [userProjects, setUserProjects] = useState({});
  const [loading, setLoading] = useState(true);

  const getSubscriptionIcon = (subscription) => {
    let icon = '';
    console.log(subscription);
    switch (subscription) {
      case 'trial':
        icon = '🕰️';
        break;
      case 'premium':
        icon = '💰';
        break;
      default:
        icon = '🆓';
        break;
    }

    return <Tooltip title={subscription}>{icon}</Tooltip>;
  };

  const fetchUserProjects = async (username, orgName) => {
    setLoading(true);
    try {
      const response = await httpService.get(`/v1/clients/users/${username}/projects`, {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });

      setUserProjects((prevUserProjects) => ({
        ...prevUserProjects,
        [orgName]: {
          ...prevUserProjects[orgName],
          [username]: response.data,
        },
      }));
    } catch (error) {
      console.error(`Error fetching projects for ${username}:`, error);
    } finally {
      setLoading(false);
    }
  };
  console.log(organizations);
  return (
    <div style={{ display: 'flex', gap: '1rem', flexDirection: 'column' }}>
      {organizations.map((org, orgIndex) => (
        <Collapse key={orgIndex}>
          <Panel
            header={
              <div>
                {getSubscriptionIcon(org.membership)} {org.name} | {org.users.length + ' users'}
              </div>
            }
            key={orgIndex}
          >
            {org.users.map((client, clientIndex) => (
              <div key={clientIndex}>
                <div
                  style={{
                    display: 'flex',
                    gap: '0rem',
                    flexDirection: 'column',
                    borderBottom: '1px solid lightgray',
                  }}
                >
                  <Title level={4} style={{ margin: '0rem', padding: '0rem' }}>
                    {client.username}
                  </Title>
                  <Text type='secondary'>{client.email}</Text>
                </div>
                <br />
                <div>
                  <Text>Todays summary</Text>
                  <br />
                  <Text type='secondary'>local time 22/07/2023, 12:35:58</Text>
                  <br />
                  <Text type='secondary'>timezone: {org.timezone}</Text>
                  <br />
                  {client.summary_today
                    ? client.summary_today
                    : 'Summary is not yet generated'}
                </div>
                <Collapse
                  style={{ marginTop: '1rem', marginBottom: '1rem' }}
                  onChange={(expanded) => {
                    if (expanded) {
                      fetchUserProjects(client.username, org.name);
                    }
                  }}
                >
                  <Panel
                    header={`${client.username} projects`}
                    key={orgIndex + clientIndex}
                  >
                    {!loading ? (
                      <Projects
                        data={userProjects[org.name]?.[client.username] || []}
                        organization_id={org.name}
                        key={orgIndex}
                      />
                    ) : (
                      <>loading</>
                    )}
                  </Panel>
                </Collapse>
              </div>
            ))}
          </Panel>
        </Collapse>
      ))}
    </div>
  );
};

export default Clients;
