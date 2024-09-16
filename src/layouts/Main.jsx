import React, { useEffect, useRef } from 'react';
import { Layout, theme } from 'antd';
import { Menu, Breadcrumb } from 'antd';
import { useState } from 'react';
import renderMenuItems from '../utils/renderMenuItems';
import menuItems from '../routes';
import { useLocation, Link } from 'react-router-dom';
import logo from '../assets/logo.svg';
const { Header, Content, Footer, Sider } = Layout;

const App = ({ children }) => {
  const location = useLocation(); // Get the current location
  const [collapsed, setCollapsed] = useState(false);

  const menuRefs = menuItems.map(() => useRef(null)); // Create refs for all menu items

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.shiftKey && e.keyCode >= 49 && e.keyCode <= 57) {
        const index = e.keyCode - 49;
        if (menuRefs[index] && menuRefs[index].current) {
          menuRefs[index].current.click(); // Simulate click on the ref
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const {
    token: { colorBgContainer },
  } = theme.useToken();

  // Generate the breadcrumb items based on the current location
  const generateBreadcrumbs = () => {
    const pathSegments = location.pathname.split('/').filter((segment) => segment !== ''); // Split the path into segments

    // Map the path segments to breadcrumb items
    const breadcrumbItems = pathSegments.map((segment, index) => {
      const path = `/${pathSegments.slice(0, index + 1).join('/')}`; // Construct the path for each breadcrumb item
      const menuItem = findMenuItem(path); // Find the menu item based on the path

      return (
        <Breadcrumb.Item key={index}>
          <span>{menuItem ? menuItem.label.toLowerCase() : segment.toLowerCase()}</span>
        </Breadcrumb.Item>
      );
    });

    return breadcrumbItems;
  };

  // Find the menu item based on the given path
  const findMenuItem = (path) => {
    const menuItem = menuItems.find((item) => item.path === path);
    return menuItem;
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider width={200} collapsible collapsed={collapsed} onCollapse={setCollapsed}>
        <div className='demo-logo-vertical' />
        <div
          style={{
            width: '100%',
            height: '64px',
            // background: '#002140',
            marginTop: '10px',
            paddingBottom: '10px',
            borderBottom: '1px solid gray',
            overflow: 'hidden',
            position: 'relative',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <div
            style={{
              display: 'flex',
              gap: '0.50rem',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <div style={{ border: '1px solid white', borderRadius: '5px' }}>
              <img src={logo} alt='logo' style={{ width: '2rem' }} />
            </div>
            {!collapsed && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '-1rem' }}>
                <div
                  style={{
                    fontWeight: 'bold',
                    fontSize: '0.95rem',
                    color: '#fff',
                    whiteSpace: 'nowrap',
                  }}
                >
                  LOOKING GLASS
                </div>
                <div
                  style={{
                    // fontWeight: 'bold',
                    fontSize: '0.75rem',
                    color: '#fff',
                    marginTop: '-0.2rem',
                    whiteSpace: 'nowrap',
                  }}
                >
                  admin panel
                </div>
              </div>
            )}
          </div>
        </div>
        <Menu theme='dark' defaultSelectedKeys={['1']} mode='inline'>
          {renderMenuItems(menuItems, menuRefs)}
        </Menu>
      </Sider>
      <Layout>
        <Header
          style={{
            padding: 0,
            height: '4.6rem',
            background: 'white',
            boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.2)',
          }}
        >
          <h4></h4>
        </Header>
        <Breadcrumb style={{ margin: '16px' }}>
          <Breadcrumb.Item>
            <Link to='/'>home</Link>
          </Breadcrumb.Item>
          {generateBreadcrumbs()}
        </Breadcrumb>
        <Content style={{ margin: '0 16px' }}>{children}</Content>
        <Footer
          style={{
            textAlign: 'center',
            height: '1.15rem',
            color: '#747474c2',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: colorBgContainer,
          }}
        >
          ARBM | LOOKING GLASS | ADMIN PANEL ©2023
        </Footer>
      </Layout>
    </Layout>
  );
};

export default App;
