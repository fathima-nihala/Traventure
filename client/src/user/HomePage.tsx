import { Route, Routes } from 'react-router-dom';
import WebNavbar from '../shared/WebNavbar';
import { lazy, Suspense } from 'react';
import Footer from '../shared/Footer';

const Home = lazy(() => import('./components/Home'));

const HomePage = () => {
  return (
    <>
      <WebNavbar />
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/home" element={<Home />} />
        </Routes>
      </Suspense>
      <Footer />
    </>
  );
};

export default HomePage;
