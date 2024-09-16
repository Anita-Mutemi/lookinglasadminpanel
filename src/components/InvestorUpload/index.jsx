import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Form, Upload, Button, message, Typography, Card } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import httpService from '../../services/http.service';

const { Dragger } = Upload;
const { Title, Text } = Typography;


const InvestorUpload = () => {
  const { access_token } = useSelector((state) => state.user);
  const [form] = Form.useForm();
  const [fileType, setFileType] = useState('investors');

  const onFinish = (values) => {
    if (!values.file || !values.file.fileList || values.file.fileList.length === 0) {
      alert('Please select a file');
      return;
    }

    const formData = new FormData();

    formData.append('file', values.file.fileList[0].originFileObj);
    formData.append('file_type_id', fileType);

    // You can handle the file upload logic here
    // For example, make an API call to "/linkedin/upload" with the formData

    httpService.post(
      `/uploads/investors`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    );

    message.success('File uploaded successfully!');
  };

  return (
    <Card>
      <Title level={3}>Data entry</Title>
      <Title level={5}>LinkedIn data uploads</Title>
      <hr />

      <Form form={form} name='linkedinUploadInvestors' onFinish={onFinish}>
        <Form.Item name='file' valuePropName='file'>
          <Dragger beforeUpload={() => false}>
            <p className='ant-upload-drag-icon'>
              <InboxOutlined />
            </p>
            <p className='ant-upload-text'>Click or drag file to this area to upload</p>
            <Text className='ant-upload-hint'>
              Support for a single or bulk upload. Strictly prohibit from uploading
              company data or other band files
            </Text>
          </Dragger>
        </Form.Item>
        <input type='hidden' name='file_type_id' value={fileType} />
        <Form.Item>
          <Button type='primary' htmlType='submit'>
            Upload
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default InvestorUpload;
