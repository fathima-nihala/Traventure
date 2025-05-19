import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  getAllBookings,
  selectAllBookings,
  selectBookingLoading,
  selectBookingError 
} from '../../../../redux/slices/bookingSlice';
import { AppDispatch } from '../../../../redux/store';
import { StatusCounts } from '../../types/booking.types';

const PackageStatus: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const bookings = useSelector(selectAllBookings);
  const loading = useSelector(selectBookingLoading);
  const error = useSelector(selectBookingError);
  
  // States for package status counts
  const [statusCounts, setStatusCounts] = useState<StatusCounts>({
    completed: 0,
    active: 0,
    upcoming: 0
  });

  // Calculate package status based on current date
  useEffect(() => {
    const today = new Date();
    const packages = bookings.map(booking => booking.package);
    
    // Use Set to get unique packages based on _id
    const uniquePackages = Array.from(
      new Map(packages.map(pkg => [pkg._id, pkg])).values()
    );
    
    const counts = {
      completed: 0,
      active: 0,
      upcoming: 0
    };
    
    uniquePackages.forEach(pkg => {
      const startDate = new Date(pkg.startDate);
      const endDate = new Date(pkg.endDate);
      
      if (endDate < today) {
        counts.completed++;
      } else if (startDate <= today && today <= endDate) {
        counts.active++;
      } else if (startDate > today) {
        counts.upcoming++;
      }
    });
    
    setStatusCounts(counts);
  }, [bookings]);
  
  useEffect(() => {
    // Add authorization check before dispatch
    const token = localStorage.getItem('token');
    if (!token) {
      console.error("No authentication token found");
      return;
    }
    
    dispatch(getAllBookings({}));
  }, [dispatch]);

  if (loading) return <div className="p-4">Loading package status...</div>;
  if (error) return <div className="p-4 text-red-600">Error: {error}</div>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Package Status Overview</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-green-50 border border-green-200 p-4 rounded shadow-sm">
          <h3 className="font-medium text-green-800">Completed</h3>
          <p className="text-3xl font-bold text-green-700 mt-2">{statusCounts.completed}</p>
          <p className="text-sm text-green-600 mt-1">End Date &lt; Today</p>
        </div>
        
        <div className="bg-blue-50 border border-blue-200 p-4 rounded shadow-sm">
          <h3 className="font-medium text-blue-800">Active</h3>
          <p className="text-3xl font-bold text-blue-700 mt-2">{statusCounts.active}</p>
          <p className="text-sm text-blue-600 mt-1">Start Date ≤ Today ≤ End Date</p>
        </div>
        
        <div className="bg-yellow-50 border border-yellow-200 p-4 rounded shadow-sm">
          <h3 className="font-medium text-yellow-800">Upcoming</h3>
          <p className="text-3xl font-bold text-yellow-700 mt-2">{statusCounts.upcoming}</p>
          <p className="text-sm text-yellow-600 mt-1">Start Date &gt; Today</p>
        </div>
      </div>
    </div>
  );
};

export default PackageStatus;