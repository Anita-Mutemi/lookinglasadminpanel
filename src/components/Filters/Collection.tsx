import React from 'react';
import {
  Form,
  Input,
  DatePicker,
  InputNumber,
  Select,
  Space,
  Switch,
} from 'antd';

const { RangePicker } = DatePicker;
const { Option } = Select;

export const StringItem = ({ item, itemKey, onBlur }) => (
  <Form.Item key={itemKey} name={itemKey}>
    <Input placeholder={item.label} onBlur={onBlur} />
  </Form.Item>
);

export const IntItem = ({ item, itemKey, onBlur }) => (
  <Form.Item key={itemKey} name={itemKey} label={item.label}>
    <InputNumber
      placeholder={item.label}
      style={{ width: '10rem' }}
      onBlur={onBlur}
    />
  </Form.Item>
);
export const IntRangeItem = ({ item, itemKey }) => (
  <Form.Item key={itemKey} label={item.label ?? itemKey}>
    <Space>
      <Form.Item
        name={[itemKey, 'min']} // Adjusted this line
        // initialValue={'0'}
        noStyle
      >
        <InputNumber placeholder='min' />
      </Form.Item>
      <Form.Item
        name={[itemKey, 'max']} // Adjusted this line
        // initialValue={'1000'}
        noStyle
      >
        <InputNumber placeholder='max' />
      </Form.Item>
    </Space>
  </Form.Item>
);

export const DateItem = ({ item, itemKey }) => (
  <Form.Item key={itemKey} label={item.label} name={itemKey}>
    <RangePicker />
  </Form.Item>
);

export const MultipleChoiceItemWithoutSelectAll = ({ item, itemKey }) => (
  <Form.Item key={itemKey} label={item.label} name={itemKey}>
    <Select mode='multiple'>
      {item.values.map((value) => (
        <Option key={value} value={value}>
          {value}
        </Option>
      ))}
    </Select>
  </Form.Item>
);

export const MultipleChoiceItem = ({ item, itemKey, form }) => {
  const handleSelectChange = (selectedItems) => {
    if (selectedItems.includes('all')) {
      form.setFieldsValue({
        [itemKey]: item.values,
      });
    } else if (
      !selectedItems.includes('all') &&
      selectedItems.length !== item.values.length
    ) {
      const newSelectedItems = selectedItems.filter((val) => val !== 'all');
      form.setFieldsValue({
        [itemKey]: newSelectedItems,
      });
    }
  };

  return (
    <Form.Item key={itemKey} label={item.label} name={itemKey}>
      <Select mode='multiple' onChange={handleSelectChange}>
        {/* <Option key='all' value='all'>
          Select All
        </Option> */}
        {item.values.map((value) => (
          <Option key={value} value={value}>
            {value}
          </Option>
        ))}
      </Select>
    </Form.Item>
  );
};

export const EnumItem = ({ item, itemKey }) => (
  <Form.Item key={itemKey} label={item.label} name={itemKey}>
    <Select>
      {item.values.map((value) => (
        <Option key={value} value={value}>
          {value}
        </Option>
      ))}
    </Select>
  </Form.Item>
);

export const BoolItem = ({ item, itemKey }) => (
  <Form.Item
    key={itemKey}
    label={item.label}
    name={itemKey}
    valuePropName='checked'
  >
    <Switch />
  </Form.Item>
);
