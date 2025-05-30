// App.tsx
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './shared/ProtectedRoute';
// import Login from './shared/Login';
import HomePage from './user/HomePage';
import AdminDashboard from './admin/components/AdminDashboard ';
import './App.css';
import Register from './shared/Register';
import RedirectToDashboard from './shared/RedirectToDashboard';
import Login from './shared/Login';

function App() {
  return (
    <Routes>
       <Route path="/" element={<RedirectToDashboard />} /> {/* Root route logic */}
        <Route path="/login" element={<Login />} />
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
        path="/home/*"
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
