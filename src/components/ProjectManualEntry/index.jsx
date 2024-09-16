import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

import $ from 'jquery'; // Import jQuery

import SearchField from '../SearchField';
import httpService from '../../services/http.service';
import ProjectSnippet from '../UI/ProjectSnippet';
import ProjectCard from '../UI/ProjectCard';


import { Form, Input, Select, Button, Typography, Card, Row, Col, Spin } from 'antd';
import { set } from 'lodash';

const { Title } = Typography;

const ProjectManualEntry = () => {
  const { access_token } = useSelector((state) => state.user);

  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [foundProjects, setFoundProjects] = useState([]);
  const [foundFunds, setFoundFunds] = useState([]);
  // const [foundInvestors, setFoundInvestors] = useState([]);

  const [website, setWebsite] = useState(null);
  const [project, setProject] = useState({});
  const [investor, setInvestor] = useState(null);
  const [fund, setFund] = useState(null);

  const [projectValid, setProjectValid] = useState(false);

  const [error, setError] = useState(null);

  // let f = window.localStorage.getItem('projectInputState');
  // console.log(f);
  // if (f) {
  //   let project = JSON.parse(f);
  //   project = project;
  //   project.id = null;
  //   console.log('got project data from local storage:');
  //   console.log(project);
  // }

  function validateWebsite(url) {
    if (!url) {
      return false;
    }
    const re = new RegExp("^[a-zA-Z0-9]+\\.[a-z]{2,6}$");
    return re.test(url);
  }

  function onSearch(_e, targetObject, queryField, setter) {
    const input = _e.target;

    return httpService
      .get(`/v1/lookup/${targetObject}`, {
        headers: {
          'accept': 'application/json',
          'Authorization': `Bearer ${access_token}`,
          'Content-Type': 'application/json',
        },
        params: {
                  query: input.value,
                  query_field: queryField
                },
      })
      .then((response) => {
        console.log('search successful, result:');
        console.log(response.data);
        setter(response.data);
      })
      .catch((error) => {
        console.log('search failed:');
        console.log(error);
      });
  }

  function onProjectSearch(_e) {
    onSearch(_e, 'project', 'website', setFoundProjects);

    setWebsite(_e.target.value);
    setProject({'website': _e.target.value});
    setProjectValid(false);
  }

  function chooseFund(fund) {
    setFund(fund);
    setFoundFunds([]);
  }

  function chooseProject(project) {
    setProject(project);
    setFoundProjects([]);
  }

  function validateNewProject() {
    if ((!project.website) || !validateWebsite(website)) { setProjectValid(false); }
    else if ((!project.title) || (project.title.length < 3)) { setProjectValid(false); }
    // else if ((!project.description) || (project.description[0].length < 3)) { setProjectValid(false); }
    else if ((!project.linkedin) || (project.linkedin.length < 10)) { setProjectValid(false); }
    else {setProjectValid(true)};
  }

  function handleProjectFieldChange(event) {
    event.preventDefault();

    const target = event.target;
    const name = target.name;
    let value = target.type === 'checkbox' ? target.checked : target.value;

    var projectCopy = project;

    value = value === '' ? null : value; // replace empty strings with null so that pydantic does not try
    // validating them which fails due to min length
    if (name == 'description') {
      value = [value, 'manual'];
    }
    projectCopy[name] = value;

    setProject(projectCopy);
    validateNewProject();
    // this.setState(
    //   {
    //     project: project,
    //   },
    //   () => {
    //     let f = JSON.stringify(project);
    //     window.localStorage.setItem('projectInputState', f);
    //   },
    // );
  }

  function handleSubmit(event) {
    console.log(event);

    var val = {"signal": {
                  "signal_type": "direct",
                  "investing_entity": {
                    "entity_type": "fund",
                    "id": fund.id
                  },
          "picked_up_date": new Date().toISOString().slice(0, 10),
          "signal_source": "linkedin",
          "count": event.count
        },
        "project_create": {...project},
        "linkedin_url": project.linkedin
  }

    setIsLoading(true);

    $.ajax({
      url: 'https://crmv2.alphaterminal.pro/v1/projects/manual_submission',
      type: 'POST',
      headers: {
        'accept': 'application/json',
        'Authorization': `Bearer ${access_token}`,
        'Content-Type': 'application/json',
      },
      contentType: 'application/json',
      data: JSON.stringify(val),
      cache: false,
      success: function (data) {
        if (data.result === 'success') {
          // window.localStorage.removeItem('projectInputState');
          setSubmitted(true);
          setIsLoading(false);
          setProject({});
        } else {
          var error_msg = data.msg;

          var error_text = (
            <div>
              <p>
                <b>{error_msg}</b>
              </p>
              {data.errors ? (
                <ul>
                  {data.errors.map((err) => (
                    <li>
                      error in field <b>{err.loc.join('.')}</b>: {err.msg}
                    </li>
                  ))}
                </ul>
              ) : (
                ''
              )}
            </div>
          );

          setSubmitted(false);
          setError(error_text);
        }
      }.bind(this),
      error: function (xhr, status, err) {
        console.log(xhr, status);
        console.log(err);
        setSubmitted(false);
        setError(xhr.responseText);
      }.bind(this),
      complete: function (xhr, status) {
        setIsLoading(false);
      }.bind(this),
    });
  }

    function objectEmpty(item) {
      return item == null || item === undefined;
    }

    function stubNullValue(value) {
      return value ? value : '';
    }

    console.log('project', project);
    console.log('fund', fund?.id);
    console.log('isvalid',projectValid);

    let new_form = <>
      <Card>
        <Title level={2}>Manual submission</Title>
        <Row gutter={16}>
          <Col span={12}>
            <h4>Submit project</h4>
            <Form
              onFinish={(values) =>
                handleSubmit(values)
              }
              layout='vertical'
            >
              <Form.Item
                name='website'
                label='Project website'
                rules={[
                    { required: true },
                    {
                      validator: (_, value) =>
                      (!value || validateWebsite(value)) ? Promise.resolve() : Promise.reject(new Error('Website is not valid')),
                    }
                ]}
              >
                  <Input
                    addonBefore="https://"
                    placeholder="input search text"
                    allowClear
                    onChange={onProjectSearch}
                    style={{ width: 304 }}
                    />
                    {/* <Select> */}
                    {/* </Select> */}
              </Form.Item>
              {foundProjects.map((project) => {
                  return <div style={{display: 'flex', padding: '10px'}} key={project.id}>
                    <Button onClick={() => chooseProject(project)}>Select</Button>
                    &nbsp;&nbsp;
                    <ProjectSnippet project={project} />
                  </div>
              }
              )}
              <Title level={5}>Project details</Title>
              {
                project.id ? <ProjectCard project={project} /> : 'Select a project'
              }
              {
                (validateWebsite(website) && !project.id) && <>
                  &nbsp;or create new with website {website}
                  <Input
                  name='title'
                  placeholder="enter title"
                  onChange={handleProjectFieldChange}
                  />
                  {/* <Input
                  name='description'
                  placeholder="enter description"
                  onChange={handleProjectFieldChange}
                  /> */}
                  <Input
                  name='logo'
                  placeholder="enter logo"
                  onChange={handleProjectFieldChange}
                  />
                  <Input
                  name='linkedin'
                  placeholder="enter linkedin"
                  onChange={handleProjectFieldChange}
                  />
                </>
              }

              <br/>
              <br/>
              <Title level={5}>Signal details</Title>

              <Form.Item
                name='fund'
                label='Fund'
                required
                rules={[
                  {
                    validator: (_, value) =>
                    (fund?.id > 0) ? Promise.resolve() : Promise.reject(new Error('Fund is required')),
                  }
                ]}
              >
                  <Input
                    placeholder="start typing fund name..."
                    allowClear
                    onChange={(_e) => onSearch(_e, 'fund', 'title', setFoundFunds)}
                    style={{ width: 304 }}
                    />
              </Form.Item>
              {foundFunds.map((fund) => {
                  return <div style={{display: 'flex', padding: '10px'}} key={fund.id}>
                    <Button onClick={() => chooseFund(fund)}>Select</Button>
                    &nbsp;&nbsp;
                    {fund.name}
                  </div>
              })}

              {
                fund && <ProjectSnippet project={fund} />
              }

              <Form.Item
                name='count'
                label='Signal count'
                rules={[
                    { required: true }
                ]}
              >
                  <Input
                    placeholder="how many times fund interacted with project"
                    allowClear
                    style={{ width: 304 }}
                    />
              </Form.Item>

              <Form.Item>
                {project?.id}
                {projectValid}
                <Button type='primary' htmlType='submit'
                disabled={!(fund?.id && (project?.id || projectValid))}
                >
                  Submit
                </Button>
              </Form.Item>

              <Spin spinning={isLoading} />
              {error}
            </Form>
          </Col>
        </Row>
      </Card>
      </>;

    return (
      <div>
        {new_form}
      </div>
    );
}

export default ProjectManualEntry;
