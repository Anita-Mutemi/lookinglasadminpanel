import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux'; // Import useSelector
import httpService from '../services/http.service';

export const useFetchClients = () => {
  const [clients, setClients] = useState([]);
  const [clientsLoading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { access_token } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchClients = async () => {
      setLoading(true);
      try {
        const config = {
          headers: { Authorization: `Bearer ${access_token}` }, // Include the authorization token in the request headers
        };
        const response = await httpService.get(
          'v1/clients/orgs?offset=0&limit=100',
          config,
        );
        setClients(response.data); // Adjust based on actual response structure
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    // Only fetch clients if the access_token is available
    if (access_token) {
      fetchClients();
    }
  }, [access_token]);

  return { clients, clientsLoading, error };
};
