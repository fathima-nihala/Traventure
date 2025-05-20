import React from 'react';
import { Navigate } from 'react-router-dom';

const RedirectToDashboard: React.FC = () => {
  const token = localStorage.getItem('token'); 
  const role = localStorage.getItem('role');

  if (token && role === 'admin') return <Navigate to="/admin" replace />;
  if (token && role === 'user') return <Navigate to="/home" replace />;

  return <Navigate to="/login" replace />;
};

export default RedirectToDashboard;