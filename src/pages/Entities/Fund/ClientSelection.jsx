import React from 'react'; // If not already imported
import { Select } from 'antd';
const { Option } = Select;

export const ClientsSelection = ({
  clients,
  selectedClients,
  onChange,
  onDeselect,
  onSelect,
}) => {
  console.log(clients);
  return (
    <Select
      mode='multiple'
      style={{ width: '100%' }}
      placeholder='Select clients'
      onDeselect={onDeselect}
      value={selectedClients}
      // onChange={onChange}
      onSelect={onSelect}
      filterOption={(input, option) =>
        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
      }
    >
      {clients.map((client) => (
        <Option key={client.name} value={client.name}>
          {client.name}
        </Option>
      ))}
    </Select>
  );
};
