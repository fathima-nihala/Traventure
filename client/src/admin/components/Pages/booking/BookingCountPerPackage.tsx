import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  getAllBookings,
  selectAllBookings,
  selectBookingLoading,
  selectBookingError 
} from '../../../../redux/slices/bookingSlice';
import { AppDispatch } from '../../../../redux/store';
import { Booking, PackageBookingCount } from '../../types/booking.types';

const BookingCountPerPackage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const bookings = useSelector(selectAllBookings);
  const loading = useSelector(selectBookingLoading);
  const error = useSelector(selectBookingError);
  
  // Calculate booking count per package
  const bookingCountsByPackage = React.useMemo(() => {
    const packageCounts = new Map<string, PackageBookingCount>();
    
    bookings.forEach((booking: Booking) => {
      const packageId = booking.package._id;
      const packageData = booking.package;
      
      if (!packageCounts.has(packageId)) {
        packageCounts.set(packageId, {
          package: packageData,
          count: 0
        });
      }
      
      const currentCount = packageCounts.get(packageId);
      if (currentCount) {
        currentCount.count++;
      }
    });
    
    return Array.from(packageCounts.values());
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

  if (loading) return <div className="p-4">Loading booking counts...</div>;
  if (error) return <div className="p-4 text-red-600">Error: {error}</div>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Booking Count per Package</h2>
      
      {bookingCountsByPackage.length === 0 ? (
        <p>No packages found</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {bookingCountsByPackage.map(({ package: pkg, count }) => (
            <div key={pkg._id} className="border p-4 rounded shadow-sm">
              <h3 className="font-medium text-lg">{pkg.name}</h3>
              <p className="text-sm text-gray-600 mb-2">{pkg.location}</p>
              
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm">
                    <span className="font-medium">Base Price:</span> ${pkg.basePrice}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Period:</span>{" "}
                    {new Date(pkg.startDate).toLocaleDateString()} - {new Date(pkg.endDate).toLocaleDateString()}
                  </p>
                </div>
                <div className="bg-purple-100 text-purple-800 px-4 py-2 rounded-full text-center">
                  <span className="text-xl font-bold">{count}</span>
                  <div className="text-xs">Bookings</div>
                </div>
              </div>
              
              <div className="mt-2 text-sm">
                <p>Capacity: {pkg.capacity}</p>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                  <div 
                    className="bg-purple-600 h-2 rounded-full" 
                    style={{ width: `${Math.min(100, (count / pkg.capacity) * 100)}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-600 mt-1">
                  {Math.round((count / pkg.capacity) * 100)}% booked
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BookingCountPerPackage;