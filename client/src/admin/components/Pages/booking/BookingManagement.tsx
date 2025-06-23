import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch } from '../../../../redux/store';
import {
  getAllBookings,
  updateBookingStatus,
  getBookingAnalytics,
  resetBookingState,
  clearBookingErrors,
  selectAllBookings,
  selectBookingLoading,
  selectBookingError,
  selectBookingSuccess,
  selectBookingAnalytics,
  type Booking // Import the Booking type from the slice
} from '../../../../redux/slices/bookingSlice';

interface TopUser {
  _id: string;
  name: string;
  email: string;
  bookingsCount: number;
  totalSpent: number;
}

const BookingManagement: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>(); 
  const bookings = useSelector(selectAllBookings);
  const loading = useSelector(selectBookingLoading);
  const error = useSelector(selectBookingError);
  const success = useSelector(selectBookingSuccess);
  const analytics = useSelector(selectBookingAnalytics);

  // Local state
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [showStatusModal, setShowStatusModal] = useState<boolean>(false);
  const [newStatus, setNewStatus] = useState<string>('');
  const [showAnalytics, setShowAnalytics] = useState<boolean>(false);

  // Fetch bookings and analytics on component mount
  useEffect(() => {
    dispatch(getAllBookings({ status: statusFilter }));
    dispatch(getBookingAnalytics());
  }, [dispatch, statusFilter]);

  // Clear success message after 3 seconds
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        dispatch(resetBookingState());
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [success, dispatch]);

  // Filter bookings based on search term
  const filteredBookings = bookings.filter((booking: Booking) => 
    booking?.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    booking.user?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    booking.package?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    booking.package?.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    booking.package?.fromLocation?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    booking.package?.toLocation?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get booking status - FIXED VERSION
  const getBookingStatus = (booking: Booking): string => {
    // First check if there's an explicit booking status
    if (booking.status) {
      return booking.status;
    }
    
    // If bookingStatus exists, use that
    if (booking.bookingStatus) {
      return booking.bookingStatus;
    }
    
    // Fallback to date-based calculation only if no explicit status
    const today = new Date();
    const startDate = new Date(booking.package.startDate);
    const endDate = new Date(booking.package.endDate);
    
    if (endDate < today) return 'completed';
    if (startDate <= today && today <= endDate) return 'active';
    if (startDate > today) return 'upcoming';
    return 'unknown';
  };

  // Get status badge color - UPDATED VERSION
  const getStatusBadgeColor = (status: string): string => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'active': return 'bg-blue-100 text-blue-800';
      case 'upcoming': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'accepted': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Handle status update
  const handleStatusUpdate = (): void => {
    if (selectedBooking && newStatus) {
      dispatch(updateBookingStatus({ id: selectedBooking._id, status: newStatus }));
      setShowStatusModal(false);
      setSelectedBooking(null);
      setNewStatus('');
    }
  };

  // Open status modal
  const openStatusModal = (booking: Booking): void => {
    setSelectedBooking(booking);
    setNewStatus(booking.status || booking.bookingStatus || getBookingStatus(booking));
    setShowStatusModal(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        <span className="ml-3 text-gray-600">Loading bookings...</span>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Booking Management</h2>
        <p className="text-gray-600">Manage and track all customer bookings</p>
      </div>

      {/* Success Message */}
      {success && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span className="text-green-700 font-medium">Booking updated successfully!</span>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-red-700 font-medium">{error}</span>
            <button 
              onClick={() => dispatch(clearBookingErrors())}
              className="ml-auto text-red-500 hover:text-red-700"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Analytics Card */}
      {analytics && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Booking Analytics</h3>
            <button
              onClick={() => setShowAnalytics(!showAnalytics)}
              className="text-blue-500 hover:text-blue-600 font-medium"
            >
              {showAnalytics ? 'Hide Details' : 'Show Details'}
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{analytics.totalBookings}</div>
              <div className="text-sm text-gray-600">Total Bookings</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{analytics.statusCounts.completed || 0}</div>
              <div className="text-sm text-gray-600">Completed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{analytics.statusCounts.active || 0}</div>
              <div className="text-sm text-gray-600">Active</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">{analytics.statusCounts.upcoming || 0}</div>
              <div className="text-sm text-gray-600">Upcoming</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{analytics.statusCounts.cancelled || 0}</div>
              <div className="text-sm text-gray-600">Cancelled</div>
            </div>
          </div>

          {showAnalytics && analytics.topUsers.length > 0 && (
            <div className="mt-6">
              <h4 className="font-medium text-gray-900 mb-3">Top Customers</h4>
              <div className="space-y-2">
                {analytics.topUsers.slice(0, 5).map((user: TopUser) => (
                  <div key={user._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <div className="font-medium text-gray-900">{user.name}</div>
                      <div className="text-sm text-gray-600">{user.email}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium text-gray-900">{user.bookingsCount} bookings</div>
                      <div className="text-sm text-gray-600">₹{user.totalSpent.toLocaleString()}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Filters and Search */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search by customer name, email, or package..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex gap-4">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Statuses</option>
              <option value="upcoming">Upcoming</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
              <option value="accepted">Accepted</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <button
              onClick={() => dispatch(getAllBookings({ status: statusFilter }))}
              className="bg-blue-500 cursor-pointer hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-medium flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Bookings List */}
      <div className="space-y-6">
        {filteredBookings.length === 0 ? (
          <div className="text-center py-12">
            <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <p className="text-gray-500 text-lg mt-4">No bookings found</p>
          </div>
        ) : (
          filteredBookings.map((booking: Booking) => {
            const status = getBookingStatus(booking);
            return (
              <div key={booking._id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                    {/* Booking Info */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="text-xl font-bold text-gray-900">
                            {booking.package.name || `${booking.package.fromLocation} to ${booking.package.toLocation}`}
                          </h3>
                          <p className="text-gray-600">Booking ID: {booking._id.slice(-8)}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadgeColor(status)}`}>
                          {status.charAt(0).toUpperCase() + status.slice(1)}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600 mb-1">
                            <span className="font-medium">Customer:</span> {booking.user?.name}
                          </p>
                          <p className="text-gray-600 mb-1">
                            <span className="font-medium">Email:</span> {booking.user?.email}
                          </p>
                          <p className="text-gray-600 mb-1">
                            <span className="font-medium">Route:</span> {booking.package.fromLocation} → {booking.package.toLocation}
                          </p>
                          <p className="text-gray-600">
                            <span className="font-medium">Description:</span> {booking.package.description}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-600 mb-1">
                            <span className="font-medium">Total Price:</span> ₹{booking.totalPrice.toLocaleString()}
                          </p>
                          <p className="text-gray-600 mb-1">
                            <span className="font-medium">Booking Date:</span> {new Date(booking.bookingDate).toLocaleDateString()}
                          </p>
                          <p className="text-gray-600 mb-1">
                            <span className="font-medium">Trip Duration:</span> {new Date(booking.package.startDate).toLocaleDateString()} - {new Date(booking.package.endDate).toLocaleDateString()}
                          </p>
                          <div className="flex gap-2 mt-2">
                            {booking.selectedServices?.food && (
                              <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">Food</span>
                            )}
                            {booking.selectedServices?.accommodation && (
                              <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">Accommodation</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => openStatusModal(booking)}
                        className="bg-blue-500 cursor-pointer hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Update Status
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Status Update Modal */}
      {showStatusModal && selectedBooking && (
        <div className="fixed inset-0 backdrop-blur-lg bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Update Booking Status</h3>
            
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">
                Booking: {selectedBooking.package.name || `${selectedBooking.package.fromLocation} to ${selectedBooking.package.toLocation}`}
              </p>
              <p className="text-sm text-gray-600 mb-4">Customer: {selectedBooking.user?.name}</p>
              
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                className="w-full cursor-pointer px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="upcoming">Upcoming</option>
                <option value="active">Active</option>
                <option value="completed">Completed</option>
                <option value="accepted">Accepted</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            <div className="flex gap-4">
              <button
                onClick={handleStatusUpdate}
                className="flex-1 cursor-pointer bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium"
              > 
                Update Status
              </button>
              <button
                onClick={() => {
                  setShowStatusModal(false);
                  setSelectedBooking(null);
                  setNewStatus('');
                }}
                className="flex-1 cursor-pointer bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingManagement;