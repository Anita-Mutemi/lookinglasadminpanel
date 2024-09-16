import { useState } from 'react';
import {
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
} from '@mui/material';

const ClientSelect = ({ clients, onClientSelect, loading, clientId }) => (
  <FormControl variant='outlined' size='small' style={{ minWidth: 150 }}>
    <InputLabel id='client-select-label'>Select a Client</InputLabel>
    <Select
      labelId='client-select-label'
      value={clientId?.name} // Set the selected value
      onChange={(event) => {
        console.log(event.target.value);
        onClientSelect(event.target.value);
      }}
      label='Select a Client'
      disabled={loading}
    >
      {loading ? (
        <MenuItem value=''>
          <CircularProgress size={24} />
        </MenuItem>
      ) : (
        clients.map((client) => (
          ['trial', 'premium'].includes(client.membership?.toLowerCase()) && (<MenuItem key={client.name} value={client.name}>
            {client.name}
          </MenuItem>)
        ))
      )}
    </Select>
  </FormControl>
);
const TopToolbarCustomActions = ({
  table,
  clients,
  onPublish,
  nothingSelected,
  loadingClients,
  clientId,
  setClientId,
}) => {
  const handleClientSelect = (clientId) => {
    console.log(clientId);
    setClientId(clientId);
  };

  const handlePublish = () => {
    if (clientId) {
      const selectedProjects = table
        .getSelectedRowModel()
        .flatRows.map((row) => row.getValue('name'));
      onPublish(clientId);
    }
  };

  return (
    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
      <ClientSelect
        clients={clients}
        clientId={clientId} // Pass the selected client
        onClientSelect={handleClientSelect}
        loading={loadingClients}
      />
      <Button
        color='primary'
        disabled={nothingSelected || clientId === ''}
        onClick={handlePublish}
        variant='contained'
        size='small'
      >
        Publish
      </Button>
    </div>
  );
};

export default TopToolbarCustomActions;
