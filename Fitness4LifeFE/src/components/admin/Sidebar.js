import { Modal } from 'antd';
import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Sidebar = ({ setMenuItems, isCollapsed }) => {
  const initialIndex = parseInt(localStorage.getItem('activeIndex')) || 0;
  const [activeIndex, setActiveIndex] = useState(initialIndex);
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);


  const menuItems = useMemo(() => [
    { label: 'Dashboard', icon: 'bxs-hand-up', path: '/admin/Statistics' },
    { label: 'User', icon: 'bxs-user-rectangle', path: '/admin/users' },
    // { label: 'Blogs', icon: 'bx-analyse', path: '/admin/Blogs' },
    { label: 'Club', icon: 'bx-buildings', path: '/admin/Club' },
    { label: 'Room', icon: 'bx-message-square-dots', path: '/admin/Room' },
    { label: 'Branch', icon: 'bx-message-square-dots', path: '/admin/Branch' },
    { label: 'Trainer', icon: 'bx-message-square-dots', path: '/admin/Trainer' },
    // { label: 'Booking', icon: 'bxs-hand-up', path: '/admin/Booking' },
    { label: 'Package', icon: 'bx-message-square-dots', path: '/admin/Package' },
    { label: 'Promotion', icon: 'bx-cog', path: '/admin/Promotion' },
    { label: 'Post', icon: 'bx-cog', path: '/admin/post' },
    // { label: 'Settings', icon: 'bx-cog', path: '/admin/home' },
    // { label: 'Dashboard', icon: 'bxs-dashboard', path: '/admin/dashboard' },


  ], []); // Menu items

  useEffect(() => {
    setMenuItems(menuItems); // Pass menu items to parent
  }, [menuItems, setMenuItems]);

  const handleSetActiveIndex = (index) => {
    setActiveIndex(index);
    localStorage.setItem('activeIndex', index);
  };

  const goToHome = () => {
    navigate('/');
  };

  const handleLogout = (message = null) => {
    localStorage.removeItem('tokenData');
    setIsLoggedIn(false);
    setUser(null);


    navigate('/login');

  };

  return (
    <div className={`sidebar ${isCollapsed ? 'close' : ''}`}> {/* Apply collapse class if isCollapsed is true */}

      <a href="#" className="logo" onClick={goToHome}>
        <i className="bx bx-code-alt"></i>
        <div className="logo-name"><span>Fitness4</span>Life</div>
      </a>

      <ul className="side-menu">
        {menuItems.map((item, index) => (
          <li
            key={index}
            className={index === activeIndex ? 'active' : ''}
          >
            <a href={item.path} onClick={() => handleSetActiveIndex(index)}>
              <i className={`bx ${item.icon}`}></i>{item.label}
            </a>
          </li>
        ))}
      </ul>
      <ul className="side-menu">
        <li>
          <a className="logout" onClick={() => handleLogout()}>
            <i className="bx bx-log-out-circle"></i>
            Logout
          </a>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
