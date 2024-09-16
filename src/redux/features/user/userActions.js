import { createAsyncThunk } from '@reduxjs/toolkit';
import httpService from '../../../services/http.service';
import axios from 'axios';

export const userLogin = createAsyncThunk(
  'user/login',
  async (values, { rejectWithValue }) => {
    function getFormData(object) {
      console.log(object);
      const formData = new FormData();
      Object.keys(object).forEach((key) => formData.append(key, object[key]));
      return formData;
    }
    try {
      const config = {
        headers: {},
      };
      const { data } = await httpService.post('/auth', getFormData(values), config);
      localStorage.setItem('access_token', data.access_token);

      return data;
    } catch (error) {
      if (error.response && error.response.status === 401) {
        return rejectWithValue('Invalid password');
      } else if (error.response && error.response.data.message) {
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue('Something went wrong');
      }
    }
  },
);

export const getUserDetails = createAsyncThunk(
  '/v1/users/me',
  async (arg, { getState, rejectWithValue }) => {
    try {
      const { user } = getState();

      const config = {
        headers: {
          Authorization: `Bearer ${user.access_token}`,
        },
      };
      const { data } = await httpService.get(`/users/me`, config);
      return data;
    } catch (error) {
      if (error.response && error.response.data.message) {
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue(error.message);
      }
    }
  },
);
