// import React, { useState, useEffect } from 'react';
// import { useDispatch } from 'react-redux';
// import { AppDispatch } from '../../../../redux/store';
// import UserBookings from './UserBookings';
// import PackageStatus from './PackageStatus';
// import BookingCountPerPackage from './BookingCountPerPackage';
// import AuthGuard from '../../common/AuthGuard';
// import { checkAuthStatus } from '../../../../redux/slices/authSlice';

// // Main Dashboard Component
// const BookingsDashboard: React.FC = () => {
//   const [activeTab, setActiveTab] = useState<'users' | 'status' | 'counts'>('users');
//   const dispatch = useDispatch<AppDispatch>();

//   // Check authentication status when component mounts
//   useEffect(() => {
//     dispatch(checkAuthStatus());
//   }, [dispatch]);

//   return (
//     <AuthGuard>
//       <div className="max-w-7xl mx-auto">
//         <h1 className="text-2xl font-bold p-4 border-b">Bookings Dashboard</h1>
        
//         <div className="flex border-b">
//           <button 
//             className={`px-4 py-2 font-medium ${activeTab === 'users' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-600'}`}
//             onClick={() => setActiveTab('users')}
//           >
//             Users & Bookings
//           </button>
//           <button 
//             className={`px-4 py-2 font-medium ${activeTab === 'status' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-600'}`}
//             onClick={() => setActiveTab('status')}
//           >
//             Package Status
//           </button>
//           <button 
//             className={`px-4 py-2 font-medium ${activeTab === 'counts' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-600'}`}
//             onClick={() => setActiveTab('counts')}
//           >
//             Booking Counts
//           </button>
//         </div>
        
//         <div className="p-4">
//           {activeTab === 'users' && <UserBookings />}
//           {activeTab === 'status' && <PackageStatus />}
//           {activeTab === 'counts' && <BookingCountPerPackage />}
//         </div>
//       </div>
//     </AuthGuard>
//   );
// };

// export default BookingsDashboard;