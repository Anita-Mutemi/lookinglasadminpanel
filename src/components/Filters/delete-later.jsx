import React, { useEffect, useState } from 'react';
import { Form, Button, Card, Spin, Row, Col, message, Radio } from 'antd';
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

const MyForm = ({ endpoint, onFilterApply, setCurrentFilters, currentFilters = [] }) => {
  const [form] = Form.useForm();
  const [formItems, setFormItems] = useState({});
  const [loading, setLoading] = useState(true);
  const { access_token } = useSelector((state) => state.user);

  const transformFiltersToFormValues = (filters) => {
    const initialValues = {};

    console.log(filters);

    filters.forEach((filter) => {
      if ('choices' in filter) {
        initialValues[filter.identifier] = filter.choices;

        if (filter.identifier === 'verticals' || filter.identifier === 'status') {
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

  console.log(form.getFieldsValue());
  useEffect(() => {
    const initialValues = transformFiltersToFormValues(currentFilters);
    form.setFieldsValue(initialValues);
  }, [form, currentFilters]);

  const cleanFormValues = (values) => {
    const filters = [];

    for (const key in values) {
      const value = values[key];

      if (key === 'verticals_mode' || key === 'status_mode') {
        // Skip processing these values directly here
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
        const filter = { identifier: key };
        if (value.min !== undefined && value.min !== null)
          filter.min = value.min.toString(); // Convert to string
        if (value.max !== undefined && value.min !== null)
          filter.max = value.max.toString(); // Convert to string
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
      else if (typeof value === 'string') {
        filters.push({
          identifier: key,
          value: value,
        });
      }
    }

    return filters; // Return as an array directly
  };

  const handleFormSubmit = async (values) => {
    const filters = cleanFormValues(values);
    setCurrentFilters({ filters: filters });
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
        {Component ? <Component item={item} itemKey={itemKey} form={form} /> : null}
      </div>
    );
  };

  const renderFormItem = (item, key) => {
    const ComponentMap = {
      string: StringItem,
      int: 'min' in item || 'max' in item ? IntRangeItem : IntItem,
      date: DateItem,
      multiple_choice: ['verticals', 'status'].includes(key)
        ? ModeControlledInput
        : MultipleChoiceItem,
      enum: EnumItem,
      bool: BoolItem,
    };
    const Component = ComponentMap[item.type];
    return Component ? <Component item={item} itemKey={key} form={form} /> : null;
  };

  const sectionIndex = Object.keys(formItems).findIndex(
    (itemKey) => formItems[itemKey].type === 'section',
  );

  async function getFilters() {
    setLoading(true);
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      };
      console.log(endpoint);
      const { data } = await httpService.get(endpoint, config);
      setFormItems(data);
    } catch (err) {
      console.log('error', err);
    } finally {
      setLoading(false);
    }
  }

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
          style={{ display: 'flex', gap: '1rem', flexDirection: 'column' }}
          size='small'
        >
          <Row gutter={16}>
            <Col span={12}>
              <Card title='Project Info'>
                {Object.keys(formItems)
                  .slice(0, sectionIndex)
                  .map((itemKey) => renderFormItem(formItems[itemKey], itemKey))}
              </Card>
            </Col>
            <Col span={12}>
              <Card
                title={
                  formItems['section_finance']
                    ? formItems['section_finance'].label
                    : 'None'
                }
                style={{ height: '100%' }}
              >
                {Object.keys(formItems)
                  .slice(sectionIndex + 1)
                  .map((itemKey) => renderFormItem(formItems[itemKey], itemKey))}
              </Card>
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

export default MyForm;
