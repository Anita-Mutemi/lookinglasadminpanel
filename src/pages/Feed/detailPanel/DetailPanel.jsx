import React, { useState } from 'react';
import { Collapse, Button, Drawer, Modal } from 'antd';
import DetailDescriptions from './DetailDescriptions';
import ProjectEdit from './ProjectEdit';
import TagsDescriptions from './TagsDescriptions';
import AnalyticsList from './AnalyticsList';
import { GeneralErrorBoundary } from '../../../components/UI/GeneralErrorBoundry';
import AnalyticsForm from './AnalyticsForm';

const { Panel } = Collapse;

// eslint-disable-next-line react/display-name
const DetailPanel = React.memo(({ row }) => {
  console.log(row);

  const {
    row: {
      original: {
        title = 'Default Title',
        status = 'Default Status',
        source = 'Default Source',
        analytics,
      },
    },
  } = row;

  const [open, setOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  const showModalHandler = () => {
    setShowModal(true);
  };

  const hideModal = () => {
    setShowModal(false);
  };

  const projectData = row.row.original;
  const tags = analytics?.tags || [];
  const project = { title, status, source }; // this will be used as project prop in AnalyticsList
  console.log(analytics);
  return (
    <div>
      <GeneralErrorBoundary customMessage={'Detail description component died 💔'}>
        <DetailDescriptions data={project} project={projectData} title='Details' />
      </GeneralErrorBoundary>
      <Collapse>
        <Panel header={`Edit project`}>
          <GeneralErrorBoundary customMessage={'Project Edit component died 💔'}>
            <ProjectEdit project={projectData} />
          </GeneralErrorBoundary>
        </Panel>
      </Collapse>
      <br />
      <Collapse>
        <Panel header={`Analytics`}>
          <GeneralErrorBoundary customMessage={'Analytics list component RIP 🧟‍♂️'}>
            <AnalyticsList analytics={analytics} project={projectData} />
          </GeneralErrorBoundary>
          <br />
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <Button type='primary' onClick={showDrawer}>
              See project tags
            </Button>
            <Button type='primary' onClick={showModalHandler}>
              Edit project analytics
            </Button>
          </div>
          <Drawer
            title={project?.title + ' ' + 'tags'}
            placement='right'
            onClose={onClose}
            open={open}
            size={'large'}
          >
            <GeneralErrorBoundary customMessage={'Tags descriptions component RIP 🧟‍♂️'}>
              <TagsDescriptions tags={tags} />
            </GeneralErrorBoundary>
          </Drawer>
          <Modal
            title='Edit Project Analytics'
            visible={showModal}
            onOk={hideModal}
            onCancel={hideModal}
          >
            <GeneralErrorBoundary customMessage={'Analytics form component RIP 🧟‍♂️'}>
              <AnalyticsForm analytics={analytics} />
            </GeneralErrorBoundary>
          </Modal>
        </Panel>
      </Collapse>
    </div>
  );
});

export default DetailPanel;
