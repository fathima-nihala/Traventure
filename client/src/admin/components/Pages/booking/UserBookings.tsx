import React, { useEffect, useMemo } from 'react';
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

  const bookingsByUser = useMemo(() => {
    const userMap = new Map<string, UserBookingGroup>();

    bookings.forEach((booking: Booking) => {
      const userId = booking.user._id;
      if (!userMap.has(userId)) {
        userMap.set(userId, {
          user: booking.user,
          bookings: []
        });
      }
      userMap.get(userId)!.bookings.push(booking);
    });

    return Array.from(userMap.values());
  }, [bookings]);

  useEffect(() => {
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
                  {bookings.map((booking) => (
                    <div key={booking._id} className="bg-gray-50 p-3 rounded">
                      <div className="flex justify-between">
                        <span className="font-medium">{booking.package.name}</span>
                        <span
                          className={`text-sm px-2 py-1 rounded ${
                            booking.status === 'completed'
                              ? 'bg-green-100 text-green-800'
                              : booking.status === 'active'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">
                        {new Date(booking.package.startDate).toLocaleDateString()} -{' '}
                        {new Date(booking.package.endDate).toLocaleDateString()}
                      </p>
                      <p className="text-sm">
                        <span className="font-medium">Total: </span>${booking.totalPrice}
                      </p>
                      <p className="text-sm">
                        <span className="font-medium">Services: </span>
                        {[
                          booking.selectedServices.food ? 'Food' : null,
                          booking.selectedServices.accommodation ? 'Accommodation' : null
                        ]
                          .filter(Boolean)
                          .join(', ') || 'None'}
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
            {analytics.topUsers.map((user) => (
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
