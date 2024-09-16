import { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import httpService from '../../../services/http.service';
import axios from 'axios'; // Ensure axios is imported

export const useProjects = (type, offset, currentFilters) => {
  const [data, setData] = useState({ projects: [] });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadedPercentage, setLoadedPercentage] = useState(0);
  const cancelTokenSourceRef = useRef(null); // Reference to store the current cancel token
  const [requestCount, setRequestCount] = useState(0); // New state to track request count

  const { access_token } = useSelector((state) => state.user);

  // Function to fetch projects
  const getProjects = async () => {
    setLoading(true);
    setRequestCount((prevCount) => prevCount + 1); // Increment request count
    console.log('haha');
    // Cancel the previous request
    if (cancelTokenSourceRef.current) {
      cancelTokenSourceRef.current.cancel('Cancelled due to new request');
    }

    console.log(loading);

    // Create a new CancelToken
    cancelTokenSourceRef.current = axios.CancelToken.source();

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
        onDownloadProgress: (progressEvent) => {
          const percentage = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total,
          );
          setLoadedPercentage(percentage);
        },
        cancelToken: cancelTokenSourceRef.current.token, // Attach the cancel token to the request
      };
      const queryParams = new URLSearchParams({
        limit: 100,
        offset: offset,
      });
      const response = await httpService.post(
        `/v1/projects/search?${queryParams}`,
        currentFilters,
        config,
      );
      setData(response.data);
      setError(null);
    } catch (err) {
      if (axios.isCancel(err)) {
        console.log('Request canceled:', err.message); // Handle cancellation here
        setRequestCount((prevCount) => prevCount - 1); // Decrement request count on cancellation
        return;
      } else {
        console.error('Error fetching projects:', err);
        setError(err);
      }
    } finally {
      setRequestCount((prevCount) => {
        const newCount = prevCount - 1;
        if (newCount === 0) {
          setLoading(false); // Only set loading to false when no more requests are pending
        }
        return newCount;
      });
    }
  };

  // Effect to fetch projects when dependencies change
  useEffect(() => {
    console.log('effect here');
    getProjects();
  }, [offset, currentFilters]);

  return {
    data,
    error,
    loading,
    loadedPercentage,
    getProjects,
  };
};
