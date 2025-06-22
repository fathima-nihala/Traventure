import { Route, Routes } from 'react-router-dom';
import WebNavbar from '../../shared/WebNavbar';
import { lazy, Suspense } from 'react';
import Footer from '../../shared/Footer';
import Blog from './pages/Blog';
import ContactUs from './pages/ContactUs';
import PackageDetailPage from './pages/PackageDetailsPage';

const Home = lazy(() => import('./pages/Home'));

const HomePage = () => {
  return (
    <>
      <WebNavbar />
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path='/packages/:id' element={<PackageDetailPage/>}/>
          <Route path='/blog' element={<Blog/>}/>
          <Route path='/contact' element={<ContactUs/>}/>
        </Routes>
      </Suspense>
      <Footer />
    </>
  );
};

export default HomePage;

