import React from 'react';
import { Navigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useUser();

  if (loading) return (
    <div className="spinner-container" style={{ minHeight: 'calc(100vh - 64px)' }}>
      <div className="spinner" />
      <p className="text-slate">Loading...</p>
    </div>
  );

  if (!user) return <Navigate to="/sign-in" replace />;

  return children;
};

export default ProtectedRoute;
