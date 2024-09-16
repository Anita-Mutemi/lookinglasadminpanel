import { Modal } from 'antd';
import { SelectedProjects } from './SelectedProjects'; // Adjust the import path as needed

export const ConfirmSubmissionModal = ({
  isVisible,
  onConfirm,
  onCancel,
  onDeselect,
  selectedProjects,
}) => {
  return (
    <Modal
      title='Confirm Publication'
      visible={isVisible}
      onOk={onConfirm}
      onCancel={onCancel}
      okText='Confirm'
      cancelText='Cancel'
    >
      <p>Are you sure you want to publish the following projects?</p>
      <SelectedProjects projects={selectedProjects} onDeselect={onDeselect} />
    </Modal>
  );
};
