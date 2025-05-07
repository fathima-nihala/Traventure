import  { useEffect, useState } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import DefaultLayout from '../layout/DefaultLayout';
import Loader from '../../common/Loader';
import DashHome from '../components/Pages/DashHome'
import Profile from './Pages/Profile';
import PackagesList from './Pages/PackagesList';


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
        <Route path="" element={<DashHome />} />
        <Route path='/profile' element={<Profile/>}/>
        <Route path='/packages' element={<PackagesList/>}/>
      </Routes>
    </DefaultLayout>
  );
};

export default AdminDashboard;
