import React from 'react';
import {
  PieChartOutlined,
  UserOutlined,
  MailOutlined,
  DatabaseOutlined,
  LoginOutlined,
  TeamOutlined,
  NodeIndexOutlined,
  VerticalAlignBottomOutlined,
  UsergroupAddOutlined,
  LogoutOutlined,
  InsertRowLeftOutlined,
  CloudUploadOutlined,
  CodeOutlined,
  CalculatorOutlined,
} from '@ant-design/icons';

export const links = [
  { path: '/', label: 'Home', icon: <PieChartOutlined />, key: 'Home'},
  { path: '/feed', label: 'Projects Feed', icon: <CalculatorOutlined />, key: 'Projects'},
  { path: '/clients', label: 'Client Users', icon: <UsergroupAddOutlined />, key: 'Client'},
  // { path: '/emails', label: 'Client Emails', icon: <MailOutlined /> },
  // {
  // label: 'Discovery',
  // icon: <DatabaseOutlined />,
  // children: [
  // { path: '/discovery/source_a', label: 'Source A', icon: <DatabaseOutlined /> },
  // { path: '/discovery/progress', label: 'PB Logs', icon: <CodeOutlined /> },
  // ],
  // },
  {
    path: '/discovery/source_b',
    label: 'Manual submission',
    icon: <VerticalAlignBottomOutlined />,
    key: 'submission'
  },
  { path: '/collections', label: 'Collections', icon: <CalculatorOutlined />, key: 'Collections'},
  { path: '/funds', label: 'Funds', icon: <InsertRowLeftOutlined />, key: 'Funds'},
  { path: '/investors', label: 'Investors', icon: <TeamOutlined />, key: 'Investors'},
  { path: '/discovery/extension', label: 'Extension Logs', icon: <CodeOutlined />, key: 'Extension'},
  // { path: '/matching', label: 'Project Matching', icon: <NodeIndexOutlined /> },
  // {
  //   label: 'Reconciliate',
  //   icon: <DeploymentUnitOutlined />,
  //   children: [
  //     {
  //       path: '/reconciliate/investors',
  //       label: 'Reconciliate Investors',
  //       icon: <DeploymentUnitOutlined />,
  //     },
  //     {
  //       path: '/reconciliate/personals',
  //       label: 'Reconciliate Personals',
  //       icon: <DeploymentUnitOutlined />,
  //     },
  //     {
  //       path: '/reconciliate/projects',
  //       label: 'Reconciliate Projects',
  //       icon: <DeploymentUnitOutlined />,
  //     },
  //   ],
  // },
  { path: '/linkedin/upload', label: 'Investors Upload', icon: <CloudUploadOutlined />, key: 'linkedin_upload' },
  // { path: '/login', label: 'Login', icon: <LoginOutlined /> },
  { path: '/logout', label: 'Logout', icon: <LogoutOutlined />, key: 'logout' },
];

// Ensure children property is defined for each menu item
links.forEach((item) => {
  if (!item.children) {
    item.children = ''; // Set children property to an empty string if undefined
  }
});

export default links;
