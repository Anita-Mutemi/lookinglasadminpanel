import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import Main from '../src/layouts/Main';
import Home from './pages/Home';
import Error from './pages/Error';
import ProtectedRoute from './pages/ProtectedRoute';
import Test from './pages/Feed/Test';
import ClientUsers from './pages/Manage/ClientUsers';
import Collections from './pages/Collections';
import ClientEmails from './pages/Manage/ClientEmails';
import Feed from './pages/Feed';
import SourceB from './pages/Discovery/SourceB';
import ExtensionLogs from './pages/Discovery/ExtensionLogs';
import ProjectMatching from './pages/Matching/ProjectMatching';
import ReconciliateInvestors from './pages/Matching/ReconciliateInvestors';
import ReconciliatePersonals from './pages/Matching/ReconciliatePersonals';
import ReconciliateProjects from './pages/Matching/ReconciliateProjects';
import SourceBUploads from './pages/Uploads/SourceBUploads';
import { store } from './redux/store';
import { Provider } from 'react-redux';
import Login from './pages/Login';
import Logout from './pages/Logout';
import 'antd/dist/reset.css';
import './index.css';
import { CookiesProvider } from 'react-cookie';
import { GeneralErrorBoundary } from './components/UI/GeneralErrorBoundry';
import InvestorProfile from './pages/Entities/Investor';
import FundPage from './pages/Entities/Fund';
import FundListPage from './pages/FundsList';
import InvestorListPage from './pages/InvestorList';
import ProjectPage from './pages/Entities/Project';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// https://admin.alphaterminal.pro/login
// content-length
// 	199
// content-type
// 	text/html; charset=utf-8
// date
// 	Wed, 31 May 2023 10:24:23 GMT
// location
// 	/login
// server
// 	nginx/1.18.0 (Ubuntu)
// set-cookie
// 	session=.eJwNzEEKgCAQBdCrDLOWDuAp2ofEUD-VJgPHFhHePVdv9z5eDxVLMPbLx9QGfMFMItjxrBADbQnbSe_9VNI75kI7mmQ1krJTqy9JlFwmDj24EVZYYn-IGvoPXGwhwQ.ZHcgVw.jRK1bdBIK-2-misqe2WX5HF7eZs; HttpOnly; Path=/
// vary
// 	Cookie
// X-Firefox-Spdy
// 	h2

// username=test&password=testpasword0000&remember=on

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <Main>
        <Outlet />
      </Main>
    ),
    errorElement: <Error />,
    children: [
      {
        path: '/',
        element: <ProtectedRoute />,
        children: [
          {
            path: '/',
            element: <Home />,
          },
          {
            path: '/clients',
            element: <ClientUsers />,
          },
          {
            path: '/investor/:id',
            element: <InvestorProfile />,
          },
          {
            path: '/fund/:id',
            element: <FundPage />,
          },
          {
            path: '/funds',
            element: <FundListPage />,
          },
          {
            path: '/investors',
            element: <InvestorListPage />,
          },
          {
            path: '/project/:id',
            element: <ProjectPage />,
          },
          {
            path: '/feed',
            element: (
              <GeneralErrorBoundary>
                <Feed />
              </GeneralErrorBoundary>
            ),
          },
          {
            path: '/feedTest',
            element: <Test />,
          },
          {
            path: '/Collections',
            element: <Collections />,
          },
          {
            path: '/emails',
            element: <ClientEmails />,
          },
          {
            path: '/discovery', // Update the path to match /discovery
            children: [
              {
                path: 'source_b', // Use a relative path without the /discovery prefix
                element: <SourceB />,
              },
              {
                path: 'extension', // Use a relative path without the /discovery prefix
                element: <ExtensionLogs />,
              },
            ],
          },
          {
            path: '/matching',
            element: <ProjectMatching />,
          },
          {
            path: '/reconciliate/investors',
            element: <ReconciliateInvestors />,
          },
          {
            path: '/reconciliate/personals',
            element: <ReconciliatePersonals />,
          },
          {
            path: '/reconciliate/projects',
            element: <ReconciliateProjects />,
          },
          {
            path: '/linkedin/upload',
            element: <SourceBUploads />,
          },
        ],
      },
    ],
  },
  {
    path: '/login',
    element: <Login />,
    errorElement: <Error />,
  },
  {
    path: '/logout',
    element: <Logout />,
    errorElement: <Error />,
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <CookiesProvider>
    <Provider store={store}>
      <RouterProvider router={router} />
      <ToastContainer />
    </Provider>
  </CookiesProvider>,
);
