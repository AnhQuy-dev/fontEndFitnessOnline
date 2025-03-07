import React, { useEffect, useState } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { toast } from 'react-toastify';
import ForbiddenPage from '../components/error/ForbiddenPage';

/**
 * Component for protecting routes based on user role
 * @param {Object} props
 * @param {string[]} props.allowedRoles - Array of roles allowed to access the route
 * @returns React component
 */
const ProtectedRoute = ({ allowedRoles }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [unauthorized, setUnauthorized] = useState(false);
  const location = useLocation();

  useEffect(() => {
    // Check authentication status
    const checkAuth = () => {
      const tokenData = localStorage.getItem('tokenData');
      if (!tokenData) {
        setIsLoading(false);
        return;
      }

      try {
        const { access_token } = JSON.parse(tokenData);
        const decodedToken = jwtDecode(access_token);
        
        // Check if token is expired
        const currentTime = Math.floor(Date.now() / 1000);
        if (decodedToken.exp && decodedToken.exp < currentTime) {
          // Token expired
          localStorage.removeItem('tokenData');
          toast.error('Your session has expired. Please login again.');
          setIsLoading(false);
          return;
        }

        setUserRole(decodedToken.role);
        setIsAuthenticated(true);
        setIsLoading(false);
      } catch (error) {
        console.error('Authentication error:', error);
        localStorage.removeItem('tokenData');
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [location.pathname]);

  if (isLoading) {
    // Return loading indicator or null
    return <div className="loading">Loading...</div>;
  }

  // If user is not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If user is authenticated but not authorized for this route
  if (!allowedRoles.includes(userRole)) {
    // Show custom 403 Forbidden page instead of redirecting
    return <ForbiddenPage />;
  }

  // If user is authenticated and authorized, render the child routes
  return <Outlet />;
};

/**
 * Component for admin-only routes
 */
export const AdminRoute = () => {
  return <ProtectedRoute allowedRoles={['ADMIN']} />;
};

/**
 * Component for user-only routes
 */
export const UserRoute = () => {
  return <ProtectedRoute allowedRoles={['USER']} />;
};

/**
 * Component for routes accessible by both admin and user
 */
export const AuthenticatedRoute = () => {
  return <ProtectedRoute allowedRoles={['ADMIN', 'USER']} />;
};

export default ProtectedRoute;