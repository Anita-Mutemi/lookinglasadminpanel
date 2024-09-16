import React, { useState, useEffect } from 'react';
import { Switch, Input, Button, Card, Typography, Divider } from 'antd';
import httpService from '../../../services/http.service';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { ClientsSelection } from './ClientSelection';
import { useClients } from './useClients';
import { GeneralErrorBoundary } from '../../../components/UI/GeneralErrorBoundry';

const { TextArea } = Input;

const FundPage = () => {
  const { id: fundId } = useParams();
  const { access_token } = useSelector((state) => state.user);

  const [state, setState] = useState({
    loading: true,
    fund: {},
    enabled: true,
    logoUrl: '',
  });

  const {
    clients,
    selectedClients,
    clientsLoading,
    deSelectClient,
    toggleClientSelection,
    undoLastChange,
    postSelectedClients,
  } = useClients(fundId);

  const handleFundRelease = async () => {
    // Implement the logic to send selected client IDs to the server
    console.log('Selected Client IDs:', selectedClients);
    // Replace with actual request logic
  };

  useEffect(() => {
    const fetchFund = async () => {
      try {
        const response = await httpService.get(
          `/v1/funds/${fundId}`,
          getHeaders(),
        );
        const data = response.data;
        setState((prevState) => ({
          ...prevState,
          fund: data,
          enabled: data.enabled,
          logoUrl: data.logo,
          loading: false,
        }));
      } catch (error) {
        toast.error('Failed to fetch fund details.');
        setState((prevState) => ({ ...prevState, loading: false }));
      }
    };

    fetchFund();
  }, [fundId, access_token]);

  const handleEnabledChange = (checked) => {
    setState((prevState) => ({ ...prevState, enabled: checked }));
    sendChange({ enabled: checked });
  };

  const handleInputChange = (event, key) => {
    const { value } = event.target;
    setState((prevState) => ({
      ...prevState,
      fund: { ...prevState.fund, [key]: value },
    }));
  };

  const handleLogoSubmit = () => {
    const { logoUrl } = state;
    sendChange({ logo: logoUrl });
  };

  const sendChange = async (data) => {
    try {
      setState((prevState) => ({ ...prevState, loading: true }));
      await httpService.patch(`/v1/funds/${state.fund.id}`, data, getHeaders());
      setState((prevState) => ({ ...prevState, loading: false }));
      toast.success('Successfully saved changes.');
    } catch (error) {
      setState((prevState) => ({ ...prevState, loading: false }));
      toast.error('Failed to save update!');
    }
  };

  const getHeaders = () => ({
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  });

  const handleSaveChanges = async () => {
    try {
      setState((prevState) => ({ ...prevState, loading: true }));
      await httpService.patch(
        `/v1/funds/${state.fund.id}`,
        {
          ...state.fund,
          enabled: state.enabled,
          // logo: state.logoUrl,
        },
        getHeaders(),
      );
      setState((prevState) => ({ ...prevState, loading: false }));
      toast.success('Successfully saved all changes.');
    } catch (error) {
      setState((prevState) => ({ ...prevState, loading: false }));
      toast.error('Failed to save all changes!');
    }
  };

  if (state.loading) {
    return <div>Loading...</div>;
  }

  return (
    <Card bordered={false} style={{ maxWidth: 800, margin: '50px auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Header logoUrl={state.logoUrl} fundName={state.fund.name} />
        <a
          href={`https://terminal.twotensor.com/fund/${state.fund.uuid}`}
          target='noreferrer'
          type='_blank'
        >
          View in the terminal
        </a>
      </div>
      <Divider>Clients</Divider>
      {clientsLoading ? (
        <div>Loading...</div>
      ) : (
        <>
          <GeneralErrorBoundary>
            <ClientsSelection
              clients={clients}
              selectedClients={selectedClients}
              onChange={toggleClientSelection}
              onSelect={postSelectedClients}
              onDeselect={deSelectClient}
            />
          </GeneralErrorBoundary>
        </>
      )}
      <Divider>Details</Divider>
      <GeneralErrorBoundary>
        <FundDetails
          state={state}
          onEnabledChange={handleEnabledChange}
          onInputChange={handleInputChange}
          onLogoSubmit={handleLogoSubmit}
          onSaveChanges={handleSaveChanges}
        />
      </GeneralErrorBoundary>
    </Card>
  );
};

const Header = ({ logoUrl, fundName }) => (
  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
    <img
      src={logoUrl}
      alt='fund logo'
      style={{
        alignSelf: 'normal',
        width: 40,
        height: 40,
        borderRadius: '50%',
        border: '1px solid #aaa',
      }}
    />
    <Typography.Title level={2}>{fundName}</Typography.Title>
  </div>
);

const FundDetails = ({
  state,
  onEnabledChange,
  onInputChange,
  onLogoSubmit,
  onSaveChanges,
}) => (
  <>
    {/* <ToggleDetails enabled={state.enabled} onEnabledChange={onEnabledChange} />
    <LogoDetails
      logoUrl={state.logoUrl}
      onInputChange={onInputChange}
      onLogoSubmit={onLogoSubmit}
    /> */}
    {Object.keys(state.fund).map((key) => {
      if (['enabled', 'logoUrl', 'loading', 'fund'].includes(key)) return null; // Skip these keys

      // Define a new variable to hold the title text
      let titleText =
        key === 'motivation'
          ? 'Notable Investments'
          : key.charAt(0).toUpperCase() + key.slice(1);

      return (
        <div style={{ marginBottom: 16 }} key={key}>
          <Typography.Title level={5}>{key}:</Typography.Title>
          {key !== 'thesis' && (
            <Input
              value={state.fund[key]}
              onChange={(e) => onInputChange(e, key)}
              readOnly={
                // Fixed 'readonly' to 'readOnly' to match React's expected property name
                key === 'id' ||
                key === 'uuid' ||
                key === 'priority' ||
                key === 'type'
              }
              disabled={
                key === 'id' ||
                key === 'uuid' ||
                key === 'priority' ||
                key === 'type'
              }
              placeholder={key}
            />
          )}
          {key === 'thesis' && (
            <TextArea
              value={state.fund[key]}
              rows={5}
              onChange={(e) => onInputChange(e, key)}
              readOnly={
                // Fixed 'readonly' to 'readOnly' to match React's expected property name
                key === 'id' ||
                key === 'uuid' ||
                key === 'priority' ||
                key === 'type'
              }
              disabled={
                key === 'id' ||
                key === 'uuid' ||
                key === 'priority' ||
                key === 'type'
              }
              placeholder={key}
            />
          )}
        </div>
      );
    })}
    <Button type='primary' onClick={onSaveChanges} style={{ marginTop: 16 }}>
      Save Changes
    </Button>
  </>
);

const ToggleDetails = ({ enabled, onEnabledChange }) => (
  <div
    style={{
      display: 'flex',
      justifyContent: 'space-between',
      marginBottom: 16,
    }}
  >
    <div>
      <Switch checked={enabled} onChange={onEnabledChange} />
      <span style={{ marginLeft: 8 }}>Enable fund</span>
    </div>
  </div>
);

const LogoDetails = ({ logoUrl, onInputChange, onLogoSubmit }) => (
  <div style={{ marginBottom: 16 }}>
    <Typography.Title level={5}>Logo URL:</Typography.Title>
    <Input
      value={logoUrl}
      onChange={(e) => onInputChange(e, 'logoUrl')}
      placeholder='Logo URL'
    />
    <Button type='primary' onClick={onLogoSubmit} style={{ marginTop: 8 }}>
      Update Logo
    </Button>
  </div>
);

export default FundPage;
