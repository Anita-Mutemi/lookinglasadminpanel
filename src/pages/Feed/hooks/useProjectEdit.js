import { useState } from 'react';
import { useSelector } from 'react-redux';
import httpService from '../../../services/http.service';

export const useProjectEdit = (project, form) => {
  const [hasChanges, setHasChanges] = useState(false);
  const { access_token } = useSelector((state) => state.user);
  const [updatingStatus, setUpdatingStatus] = useState(null);
  const [currentStatus, setCurrentStatus] = useState(project.status);

  const handleFieldChange = () => {
    setHasChanges(true);
  };

  const handleStatusChange = async (newStatus) => {
    try {
      setUpdatingStatus(newStatus);

      await httpService.patch(
        `/v1/projects/${project.id}`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        },
      );
      form.setFieldsValue({ status: newStatus });
      setCurrentStatus(newStatus);
      setHasChanges(true);
    } catch (error) {
      console.error(error);
    } finally {
      setUpdatingStatus(null);
    }
  };

  const handleSave = async () => {
    const values = form.getFieldsValue();
    try {
      await httpService.patch(
        `/v1/projects/${project.id}`,
        {
          title: values.title,
          status: values.status,
          website: values.website,
          logo: values.logo,
          description: values.description,
        },
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        },
      );
      setHasChanges(false);
    } catch (error) {
      console.error(error);
    }
  };

  return {
    hasChanges,
    updatingStatus,
    currentStatus,
    handleFieldChange,
    handleStatusChange,
    handleSave,
  };
};
