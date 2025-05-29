
import React, { useEffect, useMemo, useState } from 'react';
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

  // Search state
  const [searchFilters, setSearchFilters] = useState({
    status: '',
    userId: '',
    packageId: '',
    searchTerm: '' // For general search in user names/emails
  });

  // Get unique values for dropdowns
  const filterOptions = useMemo(() => {
    const statuses = new Set<string>();
    const users = new Map<string, { id: string; name: string; email: string }>();
    const packages = new Map<string, { id: string; name: string; locations: string }>();

    bookings.forEach((booking: Booking) => {
      // Collect statuses
      if (booking.status) {
        statuses.add(booking.status);
      }

      // Collect users
      if (booking.user && booking.user._id !== 'guest') {
        users.set(booking.user._id, {
          id: booking.user._id,
          name: booking.user.name || 'Unknown',
          email: booking.user.email || 'No email'
        });
      }

      // Collect packages
      if (booking.package && booking.package._id) {
        const packageName = booking.package.name || 
          (booking.package.fromLocation && booking.package.toLocation 
            ? `${booking.package.fromLocation} → ${booking.package.toLocation}`
            : 'Unknown Package');
        
        packages.set(booking.package._id, {
          id: booking.package._id,
          name: packageName,
          locations: booking.package.fromLocation && booking.package.toLocation 
            ? `${booking.package.fromLocation} - ${booking.package.toLocation}`
            : ''
        });
      }
    });

    return {
      statuses: Array.from(statuses).sort(),
      users: Array.from(users.values()).sort((a, b) => a.name.localeCompare(b.name)),
      packages: Array.from(packages.values()).sort((a, b) => a.name.localeCompare(b.name))
    };
  }, [bookings]);

  const bookingsByUser = useMemo(() => {
    const userMap = new Map<string, UserBookingGroup>();

    console.log('Processing bookings:', bookings);

    // Filter bookings based on search criteria
    const filteredBookings = bookings.filter((booking: Booking) => {
      // Status filter
      if (searchFilters.status && booking.status !== searchFilters.status) {
        return false;
      }

      // User ID filter
      if (searchFilters.userId && booking.user?._id !== searchFilters.userId) {
        return false;
      }

      // Package ID filter
      if (searchFilters.packageId && booking.package?._id !== searchFilters.packageId) {
        return false;
      }

      // General search term filter (search in user name, email, package name)
      if (searchFilters.searchTerm) {
        const searchLower = searchFilters.searchTerm.toLowerCase();
        const userName = booking.user?.name?.toLowerCase() || '';
        const userEmail = booking.user?.email?.toLowerCase() || '';
        const packageName = booking.package?.name?.toLowerCase() || '';
        const fromLocation = booking.package?.fromLocation?.toLowerCase() || '';
        const toLocation = booking.package?.toLocation?.toLowerCase() || '';

        if (!userName.includes(searchLower) && 
            !userEmail.includes(searchLower) && 
            !packageName.includes(searchLower) &&
            !fromLocation.includes(searchLower) &&
            !toLocation.includes(searchLower)) {
          return false;
        }
      }

      return true;
    });

    filteredBookings.forEach((booking: Booking) => {
      const userId = booking?.user?._id || 'guest-bookings';
      const user = booking?.user || {
        _id: 'guest',
        name: 'Guest/Unknown User',
        email: 'No email available',
        profilePicture: ''
      };
      
      if (!userMap.has(userId)) {
        userMap.set(userId, {
          user: user,
          bookings: []
        });
      }
      userMap.get(userId)!.bookings.push(booking);
    });

    const result = Array.from(userMap.values());
    console.log('Grouped bookings by user:', result);
    return result;
  }, [bookings, searchFilters]);

  useEffect(() => {
    // Fetch bookings with current filters
    dispatch(getAllBookings({
      status: searchFilters.status || undefined,
      userId: searchFilters.userId || undefined,
      packageId: searchFilters.packageId || undefined
    }));
    dispatch(getBookingAnalytics());
  }, [dispatch, searchFilters.status, searchFilters.userId, searchFilters.packageId]);

  const handleFilterChange = (key: string, value: string) => {
    setSearchFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const clearFilters = () => {
    setSearchFilters({
      status: '',
      userId: '',
      packageId: '',
      searchTerm: ''
    });
  };

  const hasActiveFilters = Object.values(searchFilters).some(value => value !== '');

  // Helper function to format status
  const formatStatus = (status: string) => {
    if (!status) return 'Unknown';
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  // Helper function to get status color
  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'active':
        return 'bg-blue-100 text-blue-800';
      case 'accepted':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'upcoming':
        return 'bg-purple-100 text-purple-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

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

      {/* Search and Filter Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            Search & Filter Bookings
          </h3>
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="text-sm text-red-600 hover:text-red-800 font-medium flex items-center"
            >
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Clear All Filters
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* General Search */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search
            </label>
            <input
              type="text"
              placeholder="Search users, packages..."
              value={searchFilters.searchTerm}
              onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <select
              value={searchFilters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Statuses</option>
              {filterOptions.statuses.map(status => (
                <option key={status} value={status}>
                  {formatStatus(status)}
                </option>
              ))}
            </select>
          </div>

          {/* User Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              User
            </label>
            <select
              value={searchFilters.userId}
              onChange={(e) => handleFilterChange('userId', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Users</option>
              {filterOptions.users.map(user => (
                <option key={user.id} value={user.id}>
                  {user.name} ({user.email})
                </option>
              ))}
            </select>
          </div>

          {/* Package Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Package
            </label>
            <select
              value={searchFilters.packageId}
              onChange={(e) => handleFilterChange('packageId', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Packages</option>
              {filterOptions.packages.map(pkg => (
                <option key={pkg.id} value={pkg.id}>
                  {pkg.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Active Filters Display */}
        {hasActiveFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex flex-wrap gap-2">
              <span className="text-sm text-gray-600 mr-2">Active filters:</span>
              {searchFilters.searchTerm && (
                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                  Search: "{searchFilters.searchTerm}"
                </span>
              )}
              {searchFilters.status && (
                <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                  Status: {formatStatus(searchFilters.status)}
                </span>
              )}
              {searchFilters.userId && (
                <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full">
                  User: {filterOptions.users.find(u => u.id === searchFilters.userId)?.name}
                </span>
              )}
              {searchFilters.packageId && (
                <span className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-full">
                  Package: {filterOptions.packages.find(p => p.id === searchFilters.packageId)?.name}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Results Summary */}
        <div className="mt-4 p-3 bg-gray-50 rounded-lg text-sm">
          <p><strong>Total bookings found:</strong> {bookings.length}</p>
          <p><strong>Users with bookings:</strong> {bookingsByUser.length}</p>
          <p><strong>Total bookings after filters:</strong> {bookingsByUser.reduce((acc, userGroup) => acc + userGroup.bookings.length, 0)}</p>
        </div>
      </div>

      {bookingsByUser.length === 0 ? (
        <div className="text-center py-12">
          <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p className="text-gray-500 text-lg mt-4">
            {hasActiveFilters ? 'No bookings match your search criteria' : 'No bookings found'}
          </p>
          <p className="text-gray-400 text-sm mt-2">
            {hasActiveFilters ? 'Try adjusting your filters' : 'Check if the API is returning data correctly'}
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {bookingsByUser.map(({ user, bookings }) => (
            <div key={user._id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200">
              <div className="bg-gradient-to-r from-gray-50 to-blue-50 p-6 border-b">
                {user._id === 'guest' && (
                  <div className="mb-3">
                    <span className="bg-orange-100 text-orange-800 text-xs font-medium px-2 py-1 rounded-full">
                      Guest/Unknown User Bookings
                    </span>
                  </div>
                )}
                <div className="flex items-center">
                  {user?.profilePicture ? (
                    <img
                      src={user.profilePicture}
                      alt={user.name}
                      className="w-16 h-16 rounded-full mr-4 border-2 border-white shadow-sm"
                    />
                  ) : (
                    <div className={`w-16 h-16 rounded-full mr-4 ${user._id === 'guest' ? 'bg-gradient-to-br from-orange-500 to-red-600' : 'bg-gradient-to-br from-blue-500 to-purple-600'} flex items-center justify-center text-white font-bold text-xl`}>
                      {user._id === 'guest' ? '?' : (user?.name?.charAt(0)?.toUpperCase() || '?')}
                    </div>
                  )}
                  <div className="flex-1">
                    <h3 className="font-bold text-xl text-gray-900">{user?.name || 'Unknown User'}</h3>
                    <p className="text-gray-600">{user?.email || 'No email'}</p>
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
                        <h4 className="font-semibold text-gray-900 text-lg">
                          {booking.package?.fromLocation && booking.package?.toLocation 
                            ? `${booking.package.fromLocation} → ${booking.package.toLocation}`
                            : booking.package?.name || 'Unknown Package'
                          }
                        </h4>
                        <span className={`text-xs px-3 py-1 rounded-full font-medium ${getStatusColor(booking.status)}`}>
                          {formatStatus(booking.status)}
                        </span>
                      </div>
                      
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center text-gray-600">
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          {booking.package?.startDate ? new Date(booking.package.startDate).toLocaleDateString() : 'N/A'} - {booking.package?.endDate ? new Date(booking.package.endDate).toLocaleDateString() : 'N/A'}
                        </div>
                        
                        <div className="flex items-center text-gray-900 font-semibold">
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                          </svg>
                          INR {booking.totalPrice?.toLocaleString() || 0}
                        </div>
                        
                        <div className="flex items-center text-gray-600">
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          Services: {[
                            booking.selectedServices?.food ? 'Food' : null,
                            booking.selectedServices?.accommodation ? 'Accommodation' : null
                          ].filter(Boolean).join(', ') || 'Base package only'}
                        </div>

                        <div className="flex items-center text-gray-500 text-xs">
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          Booked: {booking.bookingDate ? new Date(booking.bookingDate).toLocaleDateString() : 'N/A'}
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
                      <span className="font-semibold text-green-600">INR {user.totalSpent?.toLocaleString()}</span>
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