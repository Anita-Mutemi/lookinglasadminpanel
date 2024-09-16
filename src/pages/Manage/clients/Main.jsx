import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Spin } from 'antd'; // Import the Spin component
import httpService from '../../../services/http.service';

import Clients from './Clients';

const Main = ({organizations, setOrganizations, loading, setLoading}) => {
  // const { access_token } = useSelector((state) => state.user);

  // const [organizations, setOrganizations] = useState([]);
  // const [loading, setLoading] = useState(true); // Add loading state

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const fetchedItems = await httpService.get(`/v1/clients/orgs`, {
  //         headers: {
  //           Authorization: `Bearer ${access_token}`,
  //         },
  //       });
  //       setOrganizations(fetchedItems.data);
  //       setLoading(false); // Set loading to false when data is fetched
  //     } catch (err) {
  //       console.log(err);
  //       toast.error('Failed to fetch collections.');
  //       setLoading(false); // Set loading to false on error
  //     }
  //   };
  //   fetchData();
  // }, [access_token]);

  return (
    <div style={{ width: '100%' }}>
      {/* Conditionally render the loader while loading */}
      {loading ? (
        <Spin size='large' tip='Loading...' style={{ marginTop: '20px' }} />
      ) : (
        <Clients organizations={organizations} />
      )}
    </div>
  );
};

export default Main;
