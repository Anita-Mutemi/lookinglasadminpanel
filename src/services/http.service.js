import axios from 'axios';
import { toast } from 'react-toastify';
import config from '../config.json';

axios.defaults.baseURL = config.apiEndpoint;

axios.interceptors.response.use(
  (res) => {
    // Check the custom showToast property
    if (res.config.showToast !== false) {
      if (res.request.responseURL !== 'https://crmv2.alphaterminal.pro/users/me') {
        toast.success(
          `${res.request.responseURL.replace(
            'https://crmv2.alphaterminal.pro',
            '',
          )} \n success`,
        );
      }
    }
    return res;
  },
  function (error) {
    const expectedErrors =
      error.response && error.response.status >= 400 && error.response.status < 500;

    // Check the custom showToast property
    if (error.config && error.config.showToast !== false) {
      if (
        !(error && error.response && error.response.data && error.response.data.detail)
      ) {
        toast.error(error.message);
      } else {
        toast.error(error.response.data.detail);
      }

      if (error.response.status === 400) {
        toast.error(error.message);
      }
    }

    if (!expectedErrors) {
      console.log(error);
    }
    return Promise.reject(error);
  },
);

// Define httpService with an optional showToast parameter
const httpService = {
  get: (url, config, showToast = true) => axios.get(url, { ...config, showToast }),
  post: (url, data, config, showToast = true) =>
    axios.post(url, data, { ...config, showToast }),
  patch: (url, data, config, showToast = true) =>
    axios.patch(url, data, { ...config, showToast }),
  put: (url, data, config, showToast = true) =>
    axios.put(url, data, { ...config, showToast }),
  delete: (url, config, showToast = true) => axios.delete(url, { ...config, showToast }),
};

export default httpService;
