import React from 'react';

const LoadingSpinner = () => {
  return (
    <div style={styles.container}>
      <div style={styles.spinner}></div>
      <p style={styles.text}>Loading...</p>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    backgroundColor: '#f8f9fa',
  },
  spinner: {
    width: '50px',
    height: '50px',
    border: '5px solid rgba(0, 0, 0, 0.1)',
    borderTopColor: '#3498db',
    borderRadius: '50%',
    animation: 'spin 1s ease-in-out infinite',
  },
  text: {
    marginTop: '20px',
    fontSize: '18px',
    color: '#2c3e50',
  },
  '@keyframes spin': {
    to: {
      transform: 'rotate(360deg)',
    },
  },
};

// Add the keyframes animation
const styleSheet = document.createElement('style');
styleSheet.type = 'text/css';
styleSheet.innerText = `
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;
document.head.appendChild(styleSheet);

export default LoadingSpinner;