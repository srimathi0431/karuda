import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedUserRoute = ({ children }) => {
  // Check if user is authenticated
  // In production, this should check your actual auth state (localStorage, context, etc.)
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';

  if (!isAuthenticated) {
    // Redirect to login page if not authenticated
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedUserRoute;
