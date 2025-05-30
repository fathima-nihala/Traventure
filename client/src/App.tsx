import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './shared/ProtectedRoute';
import HomePage from './user/components/HomePage';
import AdminDashboard from './admin/components/AdminDashboard ';
import './App.css';
import Register from './shared/Register';
import RedirectToDashboard from './shared/RedirectToDashboard';
import Login from './shared/Login';

function App() {
  return (
    <Routes>
      {/* Root route shows the public home page */}
      <Route path="/*" element={<HomePage />} />
      
      {/* Authentication routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/sign-up" element={<Register />} />
      
      {/* Redirect route for after login */}
      <Route path="/dashboard" element={<RedirectToDashboard />} />

      {/* Protected admin routes */}
      <Route
        path="/admin/*"
        element={
          <ProtectedRoute allowedRole="admin">
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      {/* Catch all route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App