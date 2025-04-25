import  { useEffect, useState } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import DefaultLayout from '../layout/DefaultLayout';
import Loader from '../../common/Loader';
import PrivateRoute from '../../shared/ProtectedRoute'; 
import DashHome from '../components/Pages/DashHome'


const AdminDashboard = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <Loader />;
  }

  return (
    <DefaultLayout>
      <Routes>
        <Route
          path="admin"
          element={
            <PrivateRoute allowedRole="admin">
              <DashHome />
            </PrivateRoute>
          }
        />
      </Routes>
    </DefaultLayout>
  );
};

export default AdminDashboard;
