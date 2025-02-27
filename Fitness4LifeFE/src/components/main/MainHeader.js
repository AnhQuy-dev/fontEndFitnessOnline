import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Modal, Dropdown, Menu } from 'antd';
import { jwtDecode } from 'jwt-decode';
import { getUserByEmail } from '../../serviceToken/authService';
import LoadingSpinner from '../error/LoadingSpinner';

const MainHeader = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  // Function to handle storage events (when localStorage changes)
  const handleStorageChange = (e) => {
    if (e.key === 'tokenData') {
      if (e.newValue) {
        checkAuthAndLoadUser();
      } else {
        // Token was removed
        setIsLoggedIn(false);
        setUser(null);
      }
    }
  };

  useEffect(() => {
    // Check authentication status and load user data on component mount
    checkAuthAndLoadUser();
    
    // Listen for localStorage changes
    window.addEventListener('storage', handleStorageChange);
    
    // Cleanup event listener
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);
  
  // Re-check auth when location changes (e.g., after login redirect)
  useEffect(() => {
    checkAuthAndLoadUser();
  }, [location.pathname]);

  const checkAuthAndLoadUser = async () => {
    setIsLoading(true);
    try {
      const tokenData = localStorage.getItem('tokenData');
      if (!tokenData) {
        setIsLoggedIn(false);
        setUser(null);
        setIsLoading(false);
        return;
      }

      const { access_token } = JSON.parse(tokenData);
      if (!access_token) {
        handleLogout();
        return;
      }

      // Decode token to get user email
      const decodedToken = jwtDecode(access_token);
      const currentTime = Math.floor(Date.now() / 1000);
      
      // Check if token is expired
      if (decodedToken.exp && decodedToken.exp < currentTime) {
        handleLogout('Your session has expired');
        return;
      }
      
      const userEmail = decodedToken?.sub;
      if (!userEmail) {
        handleLogout('Invalid user data');
        return;
      }

      // Try to get user data from cached token data first
      const parsedTokenData = JSON.parse(tokenData);
      if (parsedTokenData.user) {
        setUser(parsedTokenData.user);
        setIsLoggedIn(true);
        setIsLoading(false);
      } else {
        // Fetch fresh user data if not in token
        try {
          const userData = await getUserByEmail(userEmail, access_token);
          if (userData) {
            setUser(userData);
            
            // Update token data with user info for future use
            const updatedTokenData = {
              ...parsedTokenData,
              user: userData
            };
            
            // Update localStorage without triggering the storage event for this component
            const currentListening = window.removeEventListener('storage', handleStorageChange);
            localStorage.setItem('tokenData', JSON.stringify(updatedTokenData));
            if (currentListening) {
              window.addEventListener('storage', handleStorageChange);
            }
            
            setIsLoggedIn(true);
          } else {
            handleLogout('Could not retrieve user data');
          }
        } catch (userError) {
          console.error('Error fetching user data:', userError);
          // Don't logout here, just show with default avatar
          setIsLoggedIn(true);
        }
      }
    } catch (error) {
      console.error('Authentication error:', error);
      handleLogout();
    } finally {
      setIsLoading(false);
    }
  };
  const handleLogout = (message = null) => {
    localStorage.removeItem('tokenData');
    setIsLoggedIn(false);
    setUser(null);
    
    if (message) {
      // Display message if provided
      Modal.info({
        title: 'Session Information',
        content: message,
        onOk: () => navigate('/login'),
      });
    }
  };

  const confirmLogout = () => {
    Modal.confirm({
      title: 'Bạn có chắc chắn muốn đăng xuất?',
      okText: 'Đăng xuất',
      cancelText: 'Hủy',
      onOk: () => {
        handleLogout();
        navigate('/login');
      },
    });
  };

  const profileMenu = (
    <Menu>
      <Menu.Item key="profile">
        <Link to={user?.role === 'ADMIN' ? '/admin/profile' : '/user/profile'}>
          Profile
        </Link>
      </Menu.Item>
      {user?.role === 'ADMIN' && (
        <Menu.Item key="admin-dashboard">
          <Link to="/admin/dashboard">Admin Dashboard</Link>
        </Menu.Item>
      )}
      <Menu.Item key="history-booking">
        <Link to="/history-booking">Booking History</Link>
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="logout" onClick={confirmLogout}>
        Logout
      </Menu.Item>
    </Menu>
  );

  const menuExplore = (
    <Menu>
      <Menu.Item key="blog">
        <Link to="/blog">Blog</Link>
      </Menu.Item>
      <Menu.Item key="contact">
        <Link to="/contact-us">Contact</Link>
      </Menu.Item>
      <Menu.Item key="forum">
        <Link to="/forums">Forum</Link>
      </Menu.Item>
    </Menu>
  );

  const menuB = (
    <Menu>
      <Menu.Item key="trainers">
        <a href="#our-team">Trainers</a>
      </Menu.Item>
      <Menu.Item key="clubs">
        <Link to="/clubs">Clubs</Link>
      </Menu.Item>
      <Menu.Item key="gallery">
        <a href="#portfolio">Gallery</a>
      </Menu.Item>
    </Menu>
  );

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <header id="header">
      <nav id="main-nav" className="navbar navbar-default navbar-fixed-top" role="banner">
        <div className="container">
          <div className="navbar-header">
            <button
              type="button"
              className="navbar-toggle"
              data-toggle="collapse"
              data-target=".navbar-collapse"
            >
              <span className="sr-only">Toggle navigation</span>
              <span className="icon-bar"></span>
              <span className="icon-bar"></span>
              <span className="icon-bar"></span>
            </button>
            <div style={{ textAlign: 'center', marginTop: '20px', marginBottom: '20px' }}>
              <Link to="/" className="logo">
                <div className="logo-name" style={{ fontSize: '28px' }}>
                  <span>FITNESS</span>4LIFE
                </div>
              </Link>
            </div>
          </div>

          <div className="collapse navbar-collapse navbar-right">
            <ul className="nav navbar-nav">
              <li className="scroll active">
                <a href="#home">Home</a>
              </li>
              <li className="scroll">
                <Dropdown overlay={menuB} trigger={['click']}>
                  <a className="ant-dropdown-link" onClick={(e) => e.preventDefault()}>
                    Branches <span className="caret"></span>
                  </a>
                </Dropdown>
              </li>
              <li className="scroll">
                <Link to="/bookingMain">Booking</Link>
              </li>

              <li className="scroll">
                <Link to="/packageMain">Membership</Link>
              </li>

              <li className="scroll">
                <Dropdown overlay={menuExplore} trigger={['click']}>
                  <a className="ant-dropdown-link" onClick={(e) => e.preventDefault()}>
                    Explore <span className="caret"></span>
                  </a>
                </Dropdown>
              </li>
              {!isLoggedIn ? (
                <>
                  <li className="scroll">
                    <Link className="btn btn-outline-light me-2" to="/login">
                      Login
                    </Link>
                  </li>
                </>
              ) : (
                <li className="scroll">
                  <Dropdown overlay={profileMenu} trigger={['click']}>
                    <a className="ant-dropdown-link" onClick={(e) => e.preventDefault()}>
                      <a className="profile">
                        {user?.profile?.avatar ? (
                          <img
                            src={user.profile.avatar}
                            alt="Profile"
                            style={{
                              width: '40px',
                              height: '40px',
                              borderRadius: '50%',
                              objectFit: 'cover'
                            }}
                          />
                        ) : (
                          <div
                            style={{
                              width: '40px',
                              height: '40px',
                              borderRadius: '50%',
                              backgroundColor: '#3498db',
                              color: 'white',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '18px',
                              fontWeight: 'bold'
                            }}
                          >
                            {user?.name?.charAt(0) || user?.email?.charAt(0) || 'U'}
                          </div>
                        )}
                      </a>
                    </a>
                  </Dropdown>
                </li>
              )}
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default MainHeader;