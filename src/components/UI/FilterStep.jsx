import React from 'react';
import { Typography, Row, Col, List, Collapse } from 'antd';
const { Panel } = Collapse;
const { Title, Paragraph } = Typography;

const FilterStep = ({
  step,
}) => {
//   const { passed, input, steps } = project;

  return (
    <div
      style={{
        padding: '0',
        width:'100%',
      }}
    >
        <Row align='middle' gutter={8}>
            <Col span={24}>
                <Title level={5}>
                    {step.filter_name}: &nbsp;
                    {step.passed ? <span style={{color: 'green'}}>Passed</span> : <span style={{color: 'red'}}>Failed</span>}
                </Title>
            <List
                dataSource={step.output}
                renderItem={
                (step) => {
                    return <>
                        {console.log(step)}
                        <p>{step.passed ? <span style={{color: 'green'}}>Passed</span> : <span style={{color: 'red'}}>Failed</span>}
                            &nbsp; {step.filter_name}</p>
                        <ul>
                            <li>
                                <p>{step.value ? step.value : 'No value'}</p>
                            </li>
                            <li>
                                Filter output: <Collapse>
                                    <Panel header='Raw Log Details' key='2'>
                                        <pre>{JSON.stringify(step.output, null, 2)}</pre>
                                    </Panel>
                                </Collapse>
                            </li>
                        </ul>
                    </>
                }
            } />
            </Col>
        </Row>
    </div>
  );
};

export default FilterStep;
