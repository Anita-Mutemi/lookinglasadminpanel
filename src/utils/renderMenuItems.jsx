import React from 'react';
import { Menu } from 'antd';
import { Link } from 'react-router-dom';

// const renderMenuItems = (menuItems) => {

//   return menuItems.map((menuItem) => {
//     if (menuItem.children && Array.isArray(menuItem.children)) {
//       const childrenItems = renderMenuItems(menuItem.children);
//       return (
//         <Menu.SubMenu key={menuItem.key} icon={menuItem.icon} title={menuItem.label}>
//           {childrenItems}
//         </Menu.SubMenu>
//       );
//     } else {
//       return (
//         <Menu.Item key={menuItem.key} icon={menuItem.icon}>
//           <Link to={menuItem.path}>{menuItem.label}</Link>
//         </Menu.Item>
//       );
//     }
//   });
// };

// export default renderMenuItems;
const renderMenuItems = (menuItems, refs = [], startIndex = 0) => {
  return menuItems.map((menuItem, index) => {
    const currentShortcut = startIndex + index + 1; // Compute the shortcut for the current item

    if (menuItem.children && Array.isArray(menuItem.children)) {
      const childrenItems = renderMenuItems(menuItem.children, refs, currentShortcut);
      return (
        <Menu.SubMenu key={menuItem.key} icon={menuItem.icon} title={menuItem.label}>
          {childrenItems}
        </Menu.SubMenu>
      );
    } else {
      return (
        <Menu.Item key={menuItem.key} icon={menuItem.icon}>
          <Link ref={refs[currentShortcut - 1]} to={menuItem.path}>
            {menuItem.label}{' '}
            <small style={{ color: 'grey' }}>(Shift + {currentShortcut})</small>
          </Link>
        </Menu.Item>
      );
    }
  });
};

export default renderMenuItems;
