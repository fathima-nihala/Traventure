import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  getAllBookings, 
  getBookingAnalytics,
  selectAllBookings,
  selectBookingLoading,
  selectBookingError,
  selectBookingAnalytics
} from '../../../../redux/slices/bookingSlice';
import { AppDispatch } from '../../../../redux/store';
import { Booking, UserBookingGroup } from '../../types/booking.types';

const UserBookings: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const bookings = useSelector(selectAllBookings);
  const loading = useSelector(selectBookingLoading);
  const error = useSelector(selectBookingError);
  const analytics = useSelector(selectBookingAnalytics);

  // Group bookings by user
  const bookingsByUser = React.useMemo(() => {
    const userMap = new Map<string, UserBookingGroup>();
    
    bookings.forEach((booking: Booking) => {
      const userId = booking.user._id;
      if (!userMap.has(userId)) {
        userMap.set(userId, {
          user: booking.user,
          bookings: []
        });
      }
      userMap.get(userId)?.bookings.push(booking);
    });
    
    return Array.from(userMap.values());
  }, [bookings]);

  useEffect(() => {
    // Add authorization check before dispatch
    const token = localStorage.getItem('token');
    if (!token) {
      console.error("No authentication token found");
      return;
    }
    
    dispatch(getAllBookings({}));
    dispatch(getBookingAnalytics());
  }, [dispatch]);

  if (loading) return <div className="p-4">Loading user bookings...</div>;
  if (error) return <div className="p-4 text-red-600">Error: {error}</div>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Users and Their Bookings</h2>
      
      {bookingsByUser.length === 0 ? (
        <p>No bookings found</p>
      ) : (
        <div className="space-y-6">
          {bookingsByUser.map(({ user, bookings }) => (
            <div key={user._id} className="border rounded-lg p-4 shadow-sm">
              <div className="flex items-center mb-3">
                {user.profilePicture && (
                  <img 
                    src={user.profilePicture} 
                    alt={user.name} 
                    className="w-10 h-10 rounded-full mr-3"
                  />
                )}
                <div>
                  <h3 className="font-semibold text-lg">{user.name}</h3>
                  <p className="text-gray-600 text-sm">{user.email}</p>
                </div>
              </div>
              
              <div className="border-t pt-3">
                <h4 className="font-medium mb-2">Bookings ({bookings.length})</h4>
                <div className="space-y-2">
                  {bookings.map(booking => (
                    <div key={booking._id} className="bg-gray-50 p-3 rounded">
                      <div className="flex justify-between">
                        <span className="font-medium">{booking.package.name}</span>
                        <span className={`text-sm px-2 py-1 rounded ${
                          booking.status === 'completed' ? 'bg-green-100 text-green-800' :
                          booking.status === 'active' ? 'bg-blue-100 text-blue-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">
                        {new Date(booking.package.startDate).toLocaleDateString()} - {new Date(booking.package.endDate).toLocaleDateString()}
                      </p>
                      <p className="text-sm">
                        <span className="font-medium">Total: </span>
                        ${booking.totalPrice}
                      </p>
                      <p className="text-sm">
                        <span className="font-medium">Services: </span>
                        {[
                          booking.selectedServices.food ? 'Food' : null,
                          booking.selectedServices.accommodation ? 'Accommodation' : null
                        ].filter(Boolean).join(', ') || 'None'}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {analytics && (
        <div className="mt-6 border-t pt-4">
          <h3 className="text-lg font-bold mb-3">Top Users</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {analytics.topUsers.map(user => (
              <div key={user._id} className="border p-3 rounded shadow-sm">
                <h4 className="font-medium">{user.name}</h4>
                <p className="text-sm text-gray-600">{user.email}</p>
                <div className="mt-2 text-sm">
                  <div>Total Bookings: {user.bookingsCount}</div>
                  <div>Total Spent: ${user.totalSpent}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserBookings;



// import React, { useEffect, useState } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { 
//   getAllBookings, 
//   getBookingAnalytics,
//   selectAllBookings,
//   selectBookingLoading,
//   selectBookingError,
//   selectBookingAnalytics
// } from '../../../redux/slices/bookingSlice';
// import { AppDispatch } from '../../../redux/store';

// // Component for displaying bookings by user
// const UserBookings: React.FC = () => {
//   const dispatch = useDispatch<AppDispatch>();
//   const bookings = useSelector(selectAllBookings);
//   const loading = useSelector(selectBookingLoading);
//   const error = useSelector(selectBookingError);
//   const analytics = useSelector(selectBookingAnalytics);

//   // Group bookings by user
//   const bookingsByUser = React.useMemo(() => {
//     const userMap = new Map();
    
//     bookings.forEach(booking => {
//       const userId = booking.user._id;
//       if (!userMap.has(userId)) {
//         userMap.set(userId, {
//           user: booking.user,
//           bookings: []
//         });
//       }
//       userMap.get(userId).bookings.push(booking);
//     });
    
//     return Array.from(userMap.values());
//   }, [bookings]);

//   useEffect(() => {
//     dispatch(getAllBookings({}));
//     dispatch(getBookingAnalytics());
//   }, [dispatch]);

//   if (loading) return <div className="p-4">Loading user bookings...</div>;
//   if (error) return <div className="p-4 text-red-600">Error: {error}</div>;

//   return (
//     <div className="p-4">
//       <h2 className="text-xl font-bold mb-4">Users and Their Bookings</h2>
      
//       {bookingsByUser.length === 0 ? (
//         <p>No bookings found</p>
//       ) : (
//         <div className="space-y-6">
//           {bookingsByUser.map(({ user, bookings }) => (
//             <div key={user._id} className="border rounded-lg p-4 shadow-sm">
//               <div className="flex items-center mb-3">
//                 {user.profilePicture && (
//                   <img 
//                     src={user.profilePicture} 
//                     alt={user.name} 
//                     className="w-10 h-10 rounded-full mr-3"
//                   />
//                 )}
//                 <div>
//                   <h3 className="font-semibold text-lg">{user.name}</h3>
//                   <p className="text-gray-600 text-sm">{user.email}</p>
//                 </div>
//               </div>
              
//               <div className="border-t pt-3">
//                 <h4 className="font-medium mb-2">Bookings ({bookings.length})</h4>
//                 <div className="space-y-2">
//                   {bookings.map(booking => (
//                     <div key={booking._id} className="bg-gray-50 p-3 rounded">
//                       <div className="flex justify-between">
//                         <span className="font-medium">{booking.package.name}</span>
//                         <span className={`text-sm px-2 py-1 rounded ${
//                           booking.status === 'completed' ? 'bg-green-100 text-green-800' :
//                           booking.status === 'active' ? 'bg-blue-100 text-blue-800' :
//                           'bg-yellow-100 text-yellow-800'
//                         }`}>
//                           {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
//                         </span>
//                       </div>
//                       <p className="text-sm text-gray-600">
//                         {new Date(booking.package.startDate).toLocaleDateString()} - {new Date(booking.package.endDate).toLocaleDateString()}
//                       </p>
//                       <p className="text-sm">
//                         <span className="font-medium">Total: </span>
//                         ${booking.totalPrice}
//                       </p>
//                       <p className="text-sm">
//                         <span className="font-medium">Services: </span>
//                         {[
//                           booking.selectedServices.food ? 'Food' : null,
//                           booking.selectedServices.accommodation ? 'Accommodation' : null
//                         ].filter(Boolean).join(', ') || 'None'}
//                       </p>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
      
//       {analytics && (
//         <div className="mt-6 border-t pt-4">
//           <h3 className="text-lg font-bold mb-3">Top Users</h3>
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//             {analytics.topUsers.map(user => (
//               <div key={user._id} className="border p-3 rounded shadow-sm">
//                 <h4 className="font-medium">{user.name}</h4>
//                 <p className="text-sm text-gray-600">{user.email}</p>
//                 <div className="mt-2 text-sm">
//                   <div>Total Bookings: {user.bookingsCount}</div>
//                   <div>Total Spent: ${user.totalSpent}</div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// // Component for displaying package status based on current date
// const PackageStatus: React.FC = () => {
//   const dispatch = useDispatch<AppDispatch>();
//   const bookings = useSelector(selectAllBookings);
//   const loading = useSelector(selectBookingLoading);
//   const error = useSelector(selectBookingError);
  
//   // States for package status counts
//   const [statusCounts, setStatusCounts] = useState({
//     completed: 0,
//     active: 0,
//     upcoming: 0
//   });

//   // Calculate package status based on current date
//   useEffect(() => {
//     const today = new Date();
//     const packages = bookings.map(booking => booking.package);
    
//     // Use Set to get unique packages based on _id
//     const uniquePackages = Array.from(
//       new Map(packages.map(pkg => [pkg._id, pkg])).values()
//     );
    
//     const counts = {
//       completed: 0,
//       active: 0,
//       upcoming: 0
//     };
    
//     uniquePackages.forEach(pkg => {
//       const startDate = new Date(pkg.startDate);
//       const endDate = new Date(pkg.endDate);
      
//       if (endDate < today) {
//         counts.completed++;
//       } else if (startDate <= today && today <= endDate) {
//         counts.active++;
//       } else if (startDate > today) {
//         counts.upcoming++;
//       }
//     });
    
//     setStatusCounts(counts);
//   }, [bookings]);
  
//   useEffect(() => {
//     dispatch(getAllBookings({}));
//   }, [dispatch]);

//   if (loading) return <div className="p-4">Loading package status...</div>;
//   if (error) return <div className="p-4 text-red-600">Error: {error}</div>;

//   return (
//     <div className="p-4">
//       <h2 className="text-xl font-bold mb-4">Package Status Overview</h2>
      
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//         <div className="bg-green-50 border border-green-200 p-4 rounded shadow-sm">
//           <h3 className="font-medium text-green-800">Completed</h3>
//           <p className="text-3xl font-bold text-green-700 mt-2">{statusCounts.completed}</p>
//           <p className="text-sm text-green-600 mt-1">End Date &lt; Today</p>
//         </div>
        
//         <div className="bg-blue-50 border border-blue-200 p-4 rounded shadow-sm">
//           <h3 className="font-medium text-blue-800">Active</h3>
//           <p className="text-3xl font-bold text-blue-700 mt-2">{statusCounts.active}</p>
//           <p className="text-sm text-blue-600 mt-1">Start Date ≤ Today ≤ End Date</p>
//         </div>
        
//         <div className="bg-yellow-50 border border-yellow-200 p-4 rounded shadow-sm">
//           <h3 className="font-medium text-yellow-800">Upcoming</h3>
//           <p className="text-3xl font-bold text-yellow-700 mt-2">{statusCounts.upcoming}</p>
//           <p className="text-sm text-yellow-600 mt-1">Start Date &gt; Today</p>
//         </div>
//       </div>
//     </div>
//   );
// };

// // Component for displaying booking count per package
// const BookingCountPerPackage: React.FC = () => {
//   const dispatch = useDispatch<AppDispatch>();
//   const bookings = useSelector(selectAllBookings);
//   const loading = useSelector(selectBookingLoading);
//   const error = useSelector(selectBookingError);
  
//   // Calculate booking count per package
//   const bookingCountsByPackage = React.useMemo(() => {
//     const packageCounts = new Map();
    
//     bookings.forEach(booking => {
//       const packageId = booking.package._id;
//       const packageData = booking.package;
      
//       if (!packageCounts.has(packageId)) {
//         packageCounts.set(packageId, {
//           package: packageData,
//           count: 0
//         });
//       }
      
//       packageCounts.get(packageId).count++;
//     });
    
//     return Array.from(packageCounts.values());
//   }, [bookings]);
  
//   useEffect(() => {
//     dispatch(getAllBookings({}));
//   }, [dispatch]);

//   if (loading) return <div className="p-4">Loading booking counts...</div>;
//   if (error) return <div className="p-4 text-red-600">Error: {error}</div>;

//   return (
//     <div className="p-4">
//       <h2 className="text-xl font-bold mb-4">Booking Count per Package</h2>
      
//       {bookingCountsByPackage.length === 0 ? (
//         <p>No packages found</p>
//       ) : (
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//           {bookingCountsByPackage.map(({ package: pkg, count }) => (
//             <div key={pkg._id} className="border p-4 rounded shadow-sm">
//               <h3 className="font-medium text-lg">{pkg.name}</h3>
//               <p className="text-sm text-gray-600 mb-2">{pkg.location}</p>
              
//               <div className="flex justify-between items-center">
//                 <div>
//                   <p className="text-sm">
//                     <span className="font-medium">Base Price:</span> ${pkg.basePrice}
//                   </p>
//                   <p className="text-sm">
//                     <span className="font-medium">Period:</span>{" "}
//                     {new Date(pkg.startDate).toLocaleDateString()} - {new Date(pkg.endDate).toLocaleDateString()}
//                   </p>
//                 </div>
//                 <div className="bg-purple-100 text-purple-800 px-4 py-2 rounded-full text-center">
//                   <span className="text-xl font-bold">{count}</span>
//                   <div className="text-xs">Bookings</div>
//                 </div>
//               </div>
              
//               <div className="mt-2 text-sm">
//                 <p>Capacity: {pkg.capacity}</p>
//                 <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
//                   <div 
//                     className="bg-purple-600 h-2 rounded-full" 
//                     style={{ width: `${Math.min(100, (count / pkg.capacity) * 100)}%` }}
//                   ></div>
//                 </div>
//                 <p className="text-xs text-gray-600 mt-1">
//                   {Math.round((count / pkg.capacity) * 100)}% booked
//                 </p>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// // Main Dashboard Component
// const BookingsDashboard: React.FC = () => {
//   const [activeTab, setActiveTab] = useState<'users' | 'status' | 'counts'>('users');

//   return (
//     <div className="max-w-7xl mx-auto">
//       <h1 className="text-2xl font-bold p-4 border-b">Bookings Dashboard</h1>
      
//       <div className="flex border-b">
//         <button 
//           className={`px-4 py-2 font-medium ${activeTab === 'users' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-600'}`}
//           onClick={() => setActiveTab('users')}
//         >
//           Users & Bookings
//         </button>
//         <button 
//           className={`px-4 py-2 font-medium ${activeTab === 'status' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-600'}`}
//           onClick={() => setActiveTab('status')}
//         >
//           Package Status
//         </button>
//         <button 
//           className={`px-4 py-2 font-medium ${activeTab === 'counts' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-600'}`}
//           onClick={() => setActiveTab('counts')}
//         >
//           Booking Counts
//         </button>
//       </div>
      
//       <div className="p-4">
//         {activeTab === 'users' && <UserBookings />}
//         {activeTab === 'status' && <PackageStatus />}
//         {activeTab === 'counts' && <BookingCountPerPackage />}
//       </div>
//     </div>
//   );
// };

// export default BookingsDashboard;