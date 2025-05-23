// UserBookings.tsx
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        <span className="ml-3 text-gray-600">Loading user bookings...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="m-6 p-4 bg-red-50 border border-red-200 rounded-lg">
        <div className="flex items-center">
          <svg className="w-5 h-5 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-red-700 font-medium">Error: {error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Users and Their Bookings</h2>
        <p className="text-gray-600">Comprehensive view of all users and their booking history</p>
      </div>

      {bookingsByUser.length === 0 ? (
        <div className="text-center py-12">
          <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p className="text-gray-500 text-lg mt-4">No bookings found</p>
        </div>
      ) : (
        <div className="space-y-8">
          {bookingsByUser.map(({ user, bookings }) => (
            <div key={user._id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200">
              <div className="bg-gradient-to-r from-gray-50 to-blue-50 p-6 border-b">
                <div className="flex items-center">
                  {user.profilePicture ? (
                    <img
                      src={user.profilePicture}
                      alt={user.name}
                      className="w-16 h-16 rounded-full mr-4 border-2 border-white shadow-sm"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full mr-4 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div className="flex-1">
                    <h3 className="font-bold text-xl text-gray-900">{user.name}</h3>
                    <p className="text-gray-600">{user.email}</p>
                    <div className="flex items-center mt-2">
                      <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
                        {bookings.length} {bookings.length === 1 ? 'Booking' : 'Bookings'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {bookings.map((booking) => (
                    <div key={booking._id} className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:bg-gray-100 transition-colors duration-200">
                      <div className="flex justify-between items-start mb-3">
                        <h4 className="font-semibold text-gray-900 text-lg">{booking.package.name}</h4>
                        <span
                          className={`text-xs px-3 py-1 rounded-full font-medium ${
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
                      
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center text-gray-600">
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          {new Date(booking.package.startDate).toLocaleDateString()} - {new Date(booking.package.endDate).toLocaleDateString()}
                        </div>
                        
                        <div className="flex items-center text-gray-900 font-semibold">
                          {/* <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                          </svg> */}
                          INR {booking.totalPrice}
                        </div>
                        
                        <div className="flex items-center text-gray-600">
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          Services: {[
                            booking.selectedServices.food ? 'Food' : null,
                            booking.selectedServices.accommodation ? 'Accommodation' : null
                          ].filter(Boolean).join(', ') || 'None'}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {analytics && analytics.topUsers && analytics.topUsers.length > 0 && (
        <div className="mt-12 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 border-b">
            <h3 className="text-xl font-bold text-gray-900 flex items-center">
              <svg className="w-6 h-6 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
              Top Users
            </h3>
            <p className="text-gray-600 mt-1">Users with the most bookings and highest spending</p>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {analytics.topUsers.map((user, index) => (
                <div key={user._id} className="bg-gradient-to-br from-gray-50 to-blue-50 p-4 rounded-lg border border-gray-200 relative">
                  {index === 0 && (
                    <div className="absolute -top-2 -right-2 bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-1 rounded-full">
                      #1
                    </div>
                  )}
                  <h4 className="font-bold text-lg text-gray-900">{user.name}</h4>
                  <p className="text-gray-600 text-sm mb-3">{user.email}</p>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Bookings:</span>
                      <span className="font-semibold text-blue-600">{user.bookingsCount}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Total Spent:</span>
                      <span className="font-semibold text-green-600">INR {user.totalSpent}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserBookings;
