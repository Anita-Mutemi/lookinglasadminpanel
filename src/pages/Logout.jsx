import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../redux/features/user/userSlice';
const Logout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  React.useEffect(() => {
    dispatch(logout());

    navigate('/');
  }, [dispatch, navigate]);

  return <></>;
};

export default Logout;
