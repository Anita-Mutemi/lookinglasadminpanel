import React, { useEffect, useState } from 'react';
import { Form, Button, Card, Spin, Row, Col, Radio, Select } from 'antd';
import httpService from '../../services/http.service';
import { useSelector } from 'react-redux';
import {
  StringItem,
  BoolItem,
  DateItem,
  EnumItem,
  IntItem,
  IntRangeItem,
  MultipleChoiceItem,
} from './Collection';

const MyForm = ({
  endpoint,
  onFilterApply,
  setCurrentFilters,
  currentFilters = [],
}) => {
  const [form] = Form.useForm();
  const [formItems, setFormItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { access_token } = useSelector((state) => state.user);

  const transformFiltersToFormValues = (filters) => {
    const initialValues = {};
    filters.forEach((filter) => {
      if ('choices' in filter) {
        initialValues[filter.identifier] = filter.choices;

        if (
          filter.identifier === 'verticals' ||
          filter.identifier === 'status'
        ) {
          initialValues[`${filter.identifier}_mode`] = filter.mode;
        }
      } else if ('min' in filter || 'max' in filter) {
        initialValues[filter.identifier] = {
          min: filter.min,
          max: filter.max,
        };
      } else {
        initialValues[filter.identifier] = filter.value;
      }
    });

    return initialValues;
  };

  useEffect(() => {
    const initialValues = transformFiltersToFormValues(currentFilters);
    form.setFieldsValue(initialValues);
  }, [form, currentFilters]);
  const cleanFormValues = (values) => {
    const filters = [];

    for (const key in values) {
      const value = values[key];

      if (!value) continue; // Skip over null, undefined, and empty string values

      // Skip keys that are not meant to be processed directly
      if (key === 'verticals_mode' || key === 'status_mode') {
        continue;
      }

      // Handle multiple_choice fields
      if (Array.isArray(value) && value.length > 0) {
        const filter = {
          identifier: key,
          choices: value,
        };

        // Check if mode is defined for verticals or status
        if (key === 'verticals' && values.verticals_mode) {
          filter.mode = values.verticals_mode;
        } else if (key === 'status' && values.status_mode) {
          filter.mode = values.status_mode;
        }

        filters.push(filter);
      }
      // Handle int range fields
      else if (
        typeof value === 'object' &&
        (value.hasOwnProperty('min') || value.hasOwnProperty('max'))
      ) {
        // Skip if both min and max are undefined or null
        if (value.min === undefined && value.max === undefined) {
          continue;
        }

        const filter = { identifier: key };

        if (value.min !== undefined && value.min !== null) {
          filter.min = value.min.toString(); // Convert to string
        }
        if (value.max !== undefined && value.max !== null) {
          filter.max = value.max.toString(); // Convert to string
        }
        filters.push(filter);
      }
      // Handle boolean fields
      else if (typeof value === 'boolean') {
        filters.push({
          identifier: key,
          value: value,
        });
      }
      // Handle enum and string fields
      else if (typeof value === 'string' && value !== '') {
        filters.push({
          identifier: key,
          value: value,
        });
      }
    }

    return filters;
  };

  const handleFormSubmit = async (values) => {
    const filters = cleanFormValues(values);
    setCurrentFilters({ filters: filters });
    console.log(filters);
    onFilterApply(filters); // Call the passed callback with the filters
  };

  const ModeControlledInput = ({ item, itemKey, form }) => {
    const ComponentMapWithoutMode = {
      string: StringItem,
      int: 'min' in item || 'max' in item ? IntRangeItem : IntItem,
      date: DateItem,
      multiple_choice: MultipleChoiceItem,
      enum: EnumItem,
      bool: BoolItem,
    };

    const Component = ComponentMapWithoutMode[item.type];
    return (
      <div style={{ marginBottom: '16px' }}>
        {['verticals', 'status'].includes(itemKey) && (
          <Form.Item
            name={`${itemKey}_mode`}
            initialValue='OR'
            style={{ marginBottom: '8px' }}
          >
            <Radio.Group>
              <Radio.Button value='AND'>AND</Radio.Button>
              <Radio.Button value='OR'>OR</Radio.Button>
            </Radio.Group>
          </Form.Item>
        )}
        {Component ? (
          <Component item={item} itemKey={itemKey} form={form} />
        ) : null}
      </div>
    );
  };

  const renderFormItem = (section, onBlur) => {
    if (section.section && section.title) {
      // If the object contains "section" and "title," render a card with a title
      return (
        <Card
          title={section.title}
          key={section.section}
          style={{ flexGrow: 1 }}
        >
          {section.filters.map((filter) => {
            const { type, key, label, min, max } = filter;

            if (type === 'string') {
              return (
                <StringItem
                  item={{ type, label }}
                  itemKey={key}
                  form={form}
                  // onBlur={onBlur}
                />
              );
            } else if (type === 'int') {
              if (min !== undefined || max !== undefined) {
                return (
                  <IntRangeItem
                    item={{ type, label, min, max }}
                    itemKey={key}
                    form={form}
                    // onBlur={onBlur}
                  />
                );
              } else {
                return (
                  <IntItem item={{ type, label }} itemKey={key} form={form} />
                );
              }
            } else if (type === 'date') {
              return (
                <DateItem
                  item={{ type, label, min, max }}
                  itemKey={key}
                  form={form}
                />
              );
            } else if (type === 'multiple_choice') {
              return (
                <ModeControlledInput
                  item={filter} // Pass the entire filter object
                  itemKey={key}
                  form={form}
                />
              );
            } else if (type === 'bool') {
              return (
                <BoolItem item={{ type, label }} itemKey={key} form={form} />
              );
            } else if (type === 'enum') {
              return (
                <Form.Item
                  key={key}
                  label={label}
                  name={key}
                  initialValue={form.getFieldValue(key)}
                >
                  <Select
                    placeholder={`Select ${label}`}
                    optionFilterProp='children'
                  >
                    {filter.values.map((option) => (
                      <Select.Option key={option} value={option}>
                        {option}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              );
            }

            return null;
          })}
        </Card>
      );
    } else {
      // If the object doesn't contain "section" and "title," render in a "general" card
      return (
        <Card title='General' key='general' style={{ flexGrow: 1 }}>
          {section.filters.map((filter) => {
            const { type, key, label, min, max } = filter;

            if (type === 'string') {
              return (
                <StringItem item={{ type, label }} itemKey={key} form={form} />
              );
            } else if (type === 'int') {
              if (min !== undefined && max !== undefined) {
                return (
                  <IntRangeItem
                    item={{ type, label, min, max }}
                    itemKey={key}
                    form={form}
                  />
                );
              } else {
                return (
                  <IntItem item={{ type, label }} itemKey={key} form={form} />
                );
              }
            } else if (type === 'date') {
              return (
                <DateItem
                  item={{ type, label, min, max }}
                  itemKey={key}
                  form={form}
                />
              );
            } else if (type === 'multiple_choice') {
              return (
                <ModeControlledInput
                  item={filter} // Pass the entire filter object
                  itemKey={key}
                  form={form}
                />
              );
            } else if (type === 'bool') {
              return (
                <BoolItem item={{ type, label }} itemKey={key} form={form} />
              );
            } else if (type === 'enum') {
              return (
                <Form.Item
                  key={key}
                  label={label}
                  name={key}
                  initialValue={form.getFieldValue(key)}
                >
                  <Select
                    mode='multiple'
                    placeholder={`Select ${label}`}
                    optionFilterProp='children'
                  >
                    {filter.values.map((option) => (
                      <Select.Option key={option} value={option}>
                        {option}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              );
            }

            return null;
          })}
        </Card>
      );
    }
  };

  async function getFilters() {
    setLoading(true);
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      };
      const { data } = await httpService.get(endpoint, config);
      setFormItems(data);
      // setFormItems(exampleJSON); // Assuming data is an array of section objects
    } catch (err) {
      console.log('error', err);
    } finally {
      setLoading(false);
    }
  }
  console.log('rerender filters');
  // const handleValuesChange = (changedValues, allValues) => {
  //   const filters = cleanFormValues(allValues);
  //   setCurrentFilters({ filters: filters });
  // };

  const handleFieldBlur = () => {
    const allValues = form.getFieldsValue();
    const filters = cleanFormValues(allValues);
    setCurrentFilters({ filters: filters });
  };

  useEffect(() => {
    getFilters();
  }, []);

  return (
    <>
      {loading ? (
        <Spin />
      ) : (
        <Form
          form={form}
          layout='horizontal'
          onFinish={handleFormSubmit}
          // onFieldsChange={handleValuesChange} // Add this line
          style={{ display: 'flex', gap: '1rem', flexDirection: 'column' }}
          size='small'
        >
          <Row gutter={16}>
            <Col span={24} style={{ display: 'flex', gap: '0.5rem' }}>
              {formItems.map((section) => renderFormItem(section))}
              {/* {formItems.map((section) =>
                renderFormItem(section, handleFieldBlur),
              )} */}
            </Col>
          </Row>
          <Form.Item
            style={{
              marginTop: '16px',
              width: '100%',
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            <Button
              type='primary'
              htmlType='submit'
              style={{ width: '10rem', alignSelf: 'center' }}
            >
              Search
            </Button>
          </Form.Item>
        </Form>
      )}
    </>
  );
};

const MyMemoizedForm = React.memo(MyForm);

export default MyMemoizedForm;
