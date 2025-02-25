import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const ForbiddenPage = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Check if user is logged in and determine their homepage
    const checkUserAndRedirect = () => {
      const tokenData = localStorage.getItem('tokenData');
      if (!tokenData) {
        // If not logged in, redirect to login after 5 seconds
        setTimeout(() => {
          navigate('/login');
        }, 5000);
        return;
      }

      try {
        const { access_token } = JSON.parse(tokenData);
        const decodedToken = jwtDecode(access_token);
        
        // Set up automatic redirect to appropriate homepage after 5 seconds
        setTimeout(() => {
          if (decodedToken.role === 'ADMIN') {
            navigate('/admin/dashboard');
          } else {
            navigate('/user/profile');
          }
        }, 5000);
      } catch (error) {
        // If token parsing fails, redirect to login
        setTimeout(() => {
          navigate('/login');
        }, 5000);
      }
    };

    checkUserAndRedirect();
  }, [navigate]);

  return (
    <div className="forbidden-page" style={styles.container}>
      <div style={styles.content}>
        <div style={styles.statusCode}>403</div>
        <h1 style={styles.title}>Access Forbidden</h1>
        <div style={styles.divider}></div>
        <p style={styles.message}>
          You don't have permission to access this page.
        </p>
        <p style={styles.submessage}>
          You'll be redirected to your homepage in 5 seconds.
        </p>
        <div style={styles.actions}>
          <Link to="/" style={styles.homeButton}>
            Go to Home
          </Link>
          <Link to="/login" style={styles.loginButton}>
            Login
          </Link>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    padding: '20px',
    backgroundColor: '#f8f9fa',
    fontFamily: 'Arial, sans-serif',
  },
  content: {
    textAlign: 'center',
    maxWidth: '600px',
    padding: '40px',
    backgroundColor: '#fff',
    borderRadius: '8px',
    boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
  },
  statusCode: {
    fontSize: '96px',
    fontWeight: 'bold',
    color: '#e74c3c',
    marginBottom: '10px',
  },
  title: {
    fontSize: '32px',
    fontWeight: 'bold',
    color: '#2c3e50',
    margin: '0 0 20px 0',
  },
  divider: {
    width: '80px',
    height: '4px',
    backgroundColor: '#e74c3c',
    margin: '0 auto 30px',
    borderRadius: '2px',
  },
  message: {
    fontSize: '18px',
    color: '#34495e',
    marginBottom: '20px',
    lineHeight: '1.6',
  },
  submessage: {
    fontSize: '16px',
    color: '#7f8c8d',
    marginBottom: '30px',
  },
  actions: {
    display: 'flex',
    justifyContent: 'center',
    gap: '20px',
    marginTop: '20px',
  },
  homeButton: {
    padding: '12px 24px',
    backgroundColor: '#3498db',
    color: '#fff',
    borderRadius: '4px',
    textDecoration: 'none',
    fontWeight: 'bold',
    transition: 'background-color 0.3s',
  },
  loginButton: {
    padding: '12px 24px',
    backgroundColor: '#2ecc71',
    color: '#fff',
    borderRadius: '4px',
    textDecoration: 'none',
    fontWeight: 'bold',
    transition: 'background-color 0.3s',
  },
};

export default ForbiddenPage;