import React, { useEffect } from 'react';
import { Form, Input, Select, Button, Row, Col, Spin, Card, Typography } from 'antd';
import Filters from '../../components/Filters';
import { userLogin, getUserDetails } from '../../redux/features/user/userActions';
import { useSelector, useDispatch } from 'react-redux';

import ProjectManualEntry from '../../components/ProjectManualEntry';
const SourceB = () => {
  const dispatch = useDispatch();
  const { loading, error, userInfo, access_token } = useSelector((state) => state.user);

  useEffect(() => {
    // Fetch the access_token if not available
    if (!access_token) {
      dispatch(getUserDetails()); // Make sure this action fetches and stores the access_token
    };
  }, [access_token, dispatch]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <ProjectManualEntry accessToken={access_token} />
    </div>
  );
};

export default SourceB;
