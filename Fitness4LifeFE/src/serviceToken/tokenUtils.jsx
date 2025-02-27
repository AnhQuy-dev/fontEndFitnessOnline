import { jwtDecode } from 'jwt-decode';
import { getUserByEmail } from './authService';

// return accesstoken, refreshtoken
export const getTokenData = () => {
  const tokenString = localStorage.getItem('tokenData');
  if (!tokenString) return null;

  try {
    return JSON.parse(tokenString);
  } catch (error) {
    console.error('Failed to parse token data:', error);
    return null;
  }
};



// giai ma token => user
export const getDecodedToken = () => {
  const tokenData = getTokenData();
  if (!tokenData || !tokenData.access_token) return null;

  try {
    return jwtDecode(tokenData.access_token);
  } catch (error) {
    console.error('Failed to decode token:', error);
    return null;
  }
};


// Check if token is valid and not expired goc
export const isTokenValid = () => {
  const tokenData = getTokenData();
  if (!tokenData || !tokenData.access_token) return false;

  try {
    const decodedToken = jwtDecode(tokenData.access_token);
    const currentTime = Math.floor(Date.now() / 1000);

    // Check if token has expiration and is not expired
    return decodedToken.exp && decodedToken.exp > currentTime;
  } catch (error) {
    return false;
  }
};






// Get current user information from token
export const getCurrentUser = async () => {
  const tokenData = getTokenData();
  if (!tokenData) return null;

  // If user info is already in token data and token is still valid
  if (tokenData.user && isTokenValid()) {
    return tokenData.user;
  }

  // Otherwise fetch fresh user information
  try {
    const decodedToken = getDecodedToken();
    if (!decodedToken || !decodedToken.sub) return null;

    const userDetails = await getUserByEmail(decodedToken.sub, tokenData.access_token);

    // Update token data with user information
    const updatedTokenData = {
      ...tokenData,
      user: userDetails
    };
    localStorage.setItem('tokenData', JSON.stringify(updatedTokenData));

    return userDetails;
  } catch (error) {
    console.error('Failed to get current user:', error);
    return null;
  }
};

// Calculate remaining token lifetime in seconds
export const getTokenRemainingTime = () => {
  const decodedToken = getDecodedToken();
  if (!decodedToken || !decodedToken.exp) return 0;

  const currentTime = Math.floor(Date.now() / 1000);
  return Math.max(0, decodedToken.exp - currentTime);
};

// Clear authentication data from localStorage
export const clearAuthData = () => {
  localStorage.removeItem('tokenData');
};