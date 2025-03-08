import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../assets/css/Admin/dashboardAdmin.css';
import { Avatar, notification, Dropdown, Menu, Modal } from 'antd';
import { UserOutlined, LogoutOutlined, HomeOutlined } from "@ant-design/icons";
import { getDecodedToken, getTokenData } from '../../serviceToken/tokenUtils';
import { getUserByEmail } from '../../serviceToken/authService';

const Navbar = ({ menuItems, onToggleSidebar }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredItems, setFilteredItems] = useState([]);
  const navigate = useNavigate();
  const tokenData = getTokenData();
  const decodeToken = getDecodedToken();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const tokenData = getTokenData();
        const decodeToken = getDecodedToken();

        if (decodeToken && decodeToken.sub && tokenData && tokenData.access_token) {
          const response = await getUserByEmail(decodeToken.sub, tokenData.access_token);
          setUserData(response);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        notification.error({
          message: "Error",
          description: "Failed to load user data",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const getAvatarUrl = () => {
    if (userData && userData.profile && userData.profile.avatar) {
      return userData.profile.avatar.startsWith("http")
        ? userData.profile.avatar
        : "https://via.placeholder.com/150";
    }
    return "https://via.placeholder.com/150";
  };

  const handleSearch = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    setFilteredItems(
      term ? menuItems.filter((item) => item.label.toLowerCase().includes(term.toLowerCase())) : []
    );
  };

  const handleSuggestionClick = (path) => navigate(path);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && filteredItems.length > 0) {
      navigate(filteredItems[0].path);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (filteredItems.length > 0) {
      navigate(filteredItems[0].path);
    }
  };

  const handleLogout = (message = null) => {
    localStorage.removeItem('tokenData');
    // These states would need to be passed from a parent component or context
    // setIsLoggedIn(false);
    // setUser(null);

    if (message) {
      // Display message if provided
      Modal.info({
        title: 'Session Information',
        content: message,
        onOk: () => navigate('/login'),
      });
    } else {
      navigate('/login');
    }
  };

  const confirmLogout = () => {
    Modal.confirm({
      title: 'Are you sure you want to log out?',
      okText: 'Logout',
      cancelText: 'Cancel',
      onOk: () => {
        handleLogout();
      },
    });
  };

  const handleHomeClick = () => {
    navigate('/');
  };

  // Menu for the dropdown
  const menu = (
    <Menu>
      <Menu.Item key="1" icon={<HomeOutlined />} onClick={handleHomeClick}>
        Home
      </Menu.Item>
      <Menu.Item key="2" icon={<LogoutOutlined />} onClick={confirmLogout}>
        Logout
      </Menu.Item>
    </Menu>
  );

  return (
    <nav>
      <i className="bx bx-menu" onClick={onToggleSidebar}></i>
      <form onSubmit={handleSubmit}>
        <div className="form-input">
          <input
            type="search"
            placeholder="Search..."
            value={searchTerm}
            onChange={handleSearch}
            onKeyDown={handleKeyDown}
          />
          <button className="search-btn" type="submit">
            <i className="bx bx-search"></i>
          </button>
        </div>
        {filteredItems.length > 0 && (
          <ul className="search-suggestions">
            {filteredItems.map((item, index) => (
              <li key={index}>
                <a href="#" onClick={() => handleSuggestionClick(item.path)}>
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        )}
      </form>
      <input type="checkbox" id="theme-toggle" hidden />
      <label htmlFor="theme-toggle" className="theme-toggle"></label>
      <a href="#" className="notif">
        <i className="bx bx-bell"></i>
        <span className="count">12</span>
      </a>
      <Dropdown overlay={menu} trigger={['hover']}>
        <div className="profile">
          <Avatar
            size={32}
            src={loading ? null : `${getAvatarUrl()}?t=${Date.now()}`}
            icon={<UserOutlined />}
          />
        </div>
      </Dropdown>
    </nav>
  );
};

export default Navbar;