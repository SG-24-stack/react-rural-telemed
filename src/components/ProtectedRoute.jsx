import React, { useEffect } from 'react';

export default function ProtectedRoute({ isAuthenticated, setCurrentPage, children }) {
  useEffect(() => {
    // If the user is not authenticated, redirect them to the login screen
    if (!isAuthenticated) {
      setCurrentPage('login');
    }
  }, [isAuthenticated, setCurrentPage]);

  // If they are authenticated, render the protected component (like Dashboard or VideoRoom)
  if (!isAuthenticated) {
    return null; // Show nothing while redirecting
  }

  return children;
}