// ProtectedRoute.js
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Outlet, Navigate } from 'react-router-dom';
import { getUserDetails } from '../redux/features/user/userActions';
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';

const ProtectedRoute = () => {
  const { userInfo, access_token, loading } = useSelector((state) => state.user);

  const dispatch = useDispatch();

  useEffect(() => {
    if (access_token) {
      dispatch(getUserDetails());
    }
  }, [access_token, dispatch]);

  if (!access_token) {
    return <Navigate to={'/login'} />;
  }

  if (loading) {
    return (
      <Box sx={{ width: '100%', height: '100vh' }}>
        <LinearProgress />
      </Box>
    );
  }

  return <Outlet />;
};
export default ProtectedRoute;
