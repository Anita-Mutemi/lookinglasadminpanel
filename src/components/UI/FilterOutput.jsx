import React from 'react';
import { Typography, Row, Col, List, Collapse } from 'antd';
const { Panel } = Collapse;
const { Title, Paragraph, Text } = Typography;
// import ReactJson from 'react-json-view';

import ProjectCard from './ProjectCard';
import { GeneralErrorBoundary } from './GeneralErrorBoundry';

const FilterOutput = ({ filters }) => {
  //   const { passed, input, steps } = project;

  if (!filters || filters.length == 0 || !filters[0]) {
        return <pre>data: {filters}</pre>;
  }

  function renderInput(inp) {
    if (inp.constructor == Object) {
      if ('project_data' in inp) {
        return <ProjectCard project={inp['project_data']} fullWidth />;
      }

      return 'cannot render input';
    }

    if (typeof inp == 'string') {
      return <pre>{inp}</pre>;
    }

    return inp;
  }

  function renderOutput(out) {
    if (out instanceof Array && out.length > 0) {
      console.log('value is Array!');
      if (out[0].constructor == Object) {
        return (
          <GeneralErrorBoundary customMessage={'Filter output error'}>
            <FilterOutput filters={out} />
          </GeneralErrorBoundary>
        );
      }
      return out;
    }
  }

  function renderFilter(filter) {
    let filterType = filter.filter_config?.filter_type;

    if (!filterType) {
      return (
        <>
          {filter.input ? renderInput(filter.input) : 'no input'}
          <br />
          {renderOutput(filter.output)}
        </>
      );
    }

    let header = (
      <>
        <b>{filter.filter_config?.display_name}:&nbsp;</b>
        {filter.passed ? (
          <span style={{ color: 'green' }}>Passed</span>
        ) : (
          <span style={{ color: 'red' }}>Failed</span>
        )}
      </>
    );
    let body = null;

    if (filter.input && filter.input != null) {
      switch (filterType) {
        case 'pipeline':
          return (
            <>
              {filter.input?.signal ? (
                <Paragraph>
                  Signal from fund &nbsp;
                  <a
                    href={`/fund/${filter.input.signal.fund_id}`}
                    target='_blank'
                  >
                    {filter.input.signal.fund_id}
                  </a>
                </Paragraph>
              ) : (
                ''
              )}

              {filter.output?.map((step) => renderFilter(step)) ||
                'filter output is empty'}
            </>
          );
        case 'combined':
          header += 'Combined Filter output';
          body +=
            filter.output?.map((step) => renderFilter(step)) ||
            'filter output is empty';
          break;
        case 'gpt':
          header = (
            <>
              {header}
              <br />
              GPT Filter
            </>
          );
          body = (
            <>
              <br />
              <pre>{filter.input}</pre>
            </>
          );
          break;
        case 'range':
          header = (
            <>
              {header}
              <br />
              Range filter
            </>
          );
          // header += 'Range Filter';
          body = (
            <Paragraph>
              <br />
              <Text>Input: {filter.input ? filter.input : 'no input'}</Text>
              <br />
              <Text>Min: [{filter.filter_config.min_value}]</Text>
              <br />
              <Text>Max: [{filter.filter_config.max_value}]</Text>
              <br />
              <Text>
                Nones valid: [
                {filter.filter_config.none_value_should_pass ? 'yes' : 'no'}]
              </Text>
            </Paragraph>
          );
          break;
        // return 'Range Filter output';
        case 'regex':
          header = (
            <>
              {header}
              <br />
              Regex filter
            </>
          );
          body = (
            <Paragraph>
              Value <pre>{filter.input}</pre>{' '}
              {filter.passed ? "didn't match" : 'matched'}&nbsp; pattern{' '}
              <pre>{filter.filter_config.pattern}</pre>{' '}
              {!filter.passed ? (
                <>
                  The match was <pre>{filter.output}</pre>
                </>
              ) : (
                ''
              )}
            </Paragraph>
          );
          break;
        case 'tags':
          header = <>{header}<br/>Tags filter</>;
          body = <Paragraph>

            Project had tags <pre>{filter.input.join(', ')}</pre> which &nbsp; {
              filter.filter_config.mode == 'include' ? 'didn\'t include required' : 'included restricted'
            } &nbsp;tags <pre>{filter.filter_config.tags.join(', ')}</pre>
          </Paragraph>;
          break;
      }
    } else {
      body = (
        <Paragraph>
          {filter.filter_config?.none_value_should_pass
            ? 'Filter had no input, hence it passed'
            : 'Filter had no input, hence it failed'}
        </Paragraph>
      );
    }

    return (
      <>
        {header}
        <br />
        {body}
      </>
    );
  }

  return (
    <div
      style={{
        width: '100%',
      }}
    >
         <Row align='middle' gutter={8}>
            <Col span={24}>
            {/* <Text>Filters output</Text> */}
            <List
                dataSource={filters}
                renderItem={
                (filter) => {
                    return <div
                            style={{border: '1px solid #ccc', borderRadius: '10px', padding: '15px', marginTop: '10px'}}
                            >
                        {/* <Paragraph>
                            {filter.filter_config?.display_name}: &nbsp;
                            {filter.passed ? <span style={{color: 'green'}}>Passed</span> : <span style={{color: 'red'}}>Failed</span>}
                            <br />
                            <Text type="secondary">id: {filter.filter_config?.id}</Text>
                        </Paragraph> */}

                  {renderFilter(filter)}

                  <Collapse size='small' style={{ overflow: 'auto' }}>
                    <Panel header='Raw filter data' key='2'>
                      <ReactJson src={filter} indentWidth={1} />
                      {/* <pre>{JSON.stringify(filter, null, 2)}</pre> */}
                    </Panel>
                  </Collapse>
                </div>
            }}
          />
        </Col>
      </Row>
    </div>
  );
};

export default FilterOutput;
