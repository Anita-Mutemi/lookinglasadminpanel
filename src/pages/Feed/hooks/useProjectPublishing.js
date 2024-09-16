import { useState } from 'react';
import { useSelector } from 'react-redux';
import { message } from 'antd';
import httpService from '../../../services/http.service';

export const useProjectPublishing = () => {
  const [clientId, setClientId] = useState('');
  const [isPublishModalVisible, setIsPublishModalVisible] = useState(false);
  const [projectsToPublish, setProjectsToPublish] = useState([]);
  const { access_token } = useSelector((state) => state.user); // Extract access token from Redux store

  const openPublishModal = (projects) => {
    setProjectsToPublish(projects);
    setIsPublishModalVisible(true);
  };

  const confirmPublish = async () => {
    console.log(clientId);
    try {
      const config = {
        headers: { Authorization: `Bearer ${access_token}` }, // Include the authorization token in the request headers
      };
      const projectUuids = projectsToPublish.map((project) => project.uuid);
      const response = await httpService.post(
        `v1/clients/projects/publish/{client_org_id}?org_id=${clientId}`,
        projectUuids,
        config,
      );
      message.success(
        'Projects published successfully, ' + JSON.stringify(response.data),
      );
    } catch (error) {
      console.error('Error publishing projects:', error);
      message.error('Failed to publish projects');
    } finally {
      setIsPublishModalVisible(false);
    }
  };

  const cancelPublish = () => {
    setIsPublishModalVisible(false);
  };

  return {
    isPublishModalVisible,
    openPublishModal,
    confirmPublish,
    cancelPublish,
    clientId,
    setClientId,
  };
};
