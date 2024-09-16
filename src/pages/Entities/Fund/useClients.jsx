import { useState, useEffect } from 'react';
import { message } from 'antd';
import { useFetchClients } from '../../../hooks/useFetchClients';
import httpService from '../../../services/http.service';
import { useSelector } from 'react-redux';

export const useClients = (fundId) => {
  const {
    clients,
    clientsLoading,
    error: fetchClientsError,
  } = useFetchClients();
  const [selectedClients, setSelectedClients] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { access_token } = useSelector((state) => state.user);

  useEffect(() => {
    if (fundId) {
      fetchFundClients(fundId);
    }
  }, [fundId]);

  const fetchFundClients = async (fundId) => {
    setLoading(true);
    try {
      const config = { headers: { Authorization: `Bearer ${access_token}` } };
      const response = await httpService.get(
        `v1/funds/${fundId}/clients`,
        config,
      );
      const fundClients = response.data;
      setSelectedClients(
        fundClients
          .filter((client) => client.funds_portfolio.includes(fundId))
          .map((client) => client.name),
      );
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const toggleClientSelection = (clientName) => {
    setHistory((prev) => [...prev, selectedClients]);
    setSelectedClients((prevSelectedClients) =>
      prevSelectedClients.includes(clientName)
        ? prevSelectedClients.filter((name) => name !== clientName)
        : [...prevSelectedClients, clientName],
    );
  };

  const undoLastChange = () => {
    if (history.length > 0) {
      setSelectedClients(history[history.length - 1]);
      setHistory((prev) => prev.slice(0, -1));
    }
  };

  const postSelectedClients = async (clientID) => {
    try {
      const client = clients.find((c) => c.name === clientID);
      if (client) {
        await httpService.patch(
          `v1/funds/${fundId}/client?organization_id=${client.name}`,
          { organization_id: client.name },
          { headers: { Authorization: `Bearer ${access_token}` } },
        );
        // Update the selected clients state to include the newly added client
        setSelectedClients((prev) => [...prev, client.name]);
        message.success('Funds updated successfully for selected client!');
      }
    } catch (error) {
      console.error('Error:', error);
      message.error('Failed to update funds for selected client.');
    }
  };

  const deSelectClient = async (clientName) => {
    try {
      const client = clients.find((c) => c.name === clientName);
      if (client) {
        await httpService.delete(
          `v1/funds/${fundId}/client?organization_id=${client.name}`,
          { headers: { Authorization: `Bearer ${access_token}` } },
        );
        // Update the selected clients state to reflect the removal
        setSelectedClients((prev) => prev.filter((c) => c !== clientName));
        message.success('Client removed from fund successfully!');
      }
    } catch (error) {
      console.error('Error:', error);
      message.error('Failed to remove client from fund.');
    }
  };

  return {
    clients,
    selectedClients,
    toggleClientSelection,
    postSelectedClients,
    clientsLoading,
    deSelectClient,
    loading,
    error: error || fetchClientsError,
    undoLastChange,
  };
};
