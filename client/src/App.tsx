// App.tsx
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './shared/ProtectedRoute';
import Login from './shared/Login';
import HomePage from './user/components/HomePage';
import AdminDashboard from './admin/components/AdminDashboard ';
import './App.css';
import Register from './shared/Register';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/sign-up" element={<Register />} />

      <Route
        path="/admin/*"
        element={
          <ProtectedRoute allowedRole="admin">
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/home"
        element={
          <ProtectedRoute allowedRole="user">
            <HomePage />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
