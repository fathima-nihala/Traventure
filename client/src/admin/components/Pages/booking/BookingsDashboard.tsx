
// BookingsDashboard.tsx
import React, { useState } from 'react';
import UserBookings from './UserBookings';
import PackageStatus from './PackageStatus';
import BookingCountPerPackage from './BookingCountPerPackage';
import BookingManagement from './BookingManagement';

const BookingsDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'users' | 'status' | 'counts' | 'packages'>('users');

  return (
    <div className="max-w-7xl mx-auto bg-white min-h-screen">
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
        <h1 className="text-3xl font-bold">Bookings Dashboard</h1>
        <p className="text-blue-100 mt-2">Manage and analyze your booking data</p>
      </div>

      <div className="bg-white border-b shadow-sm sticky top-0 z-10">
        <div className="flex space-x-1 p-1">
          <button
            className={`px-6 py-3 font-medium rounded-lg transition-all duration-200 ${activeTab === 'users'
                ? 'bg-blue-500 text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-100'
              }`}
            onClick={() => setActiveTab('users')}
          >
            <span className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              Users & Bookings
            </span>
          </button>
          <button
            className={`px-6 py-3 font-medium rounded-lg transition-all duration-200 ${activeTab === 'status'
                ? 'bg-blue-500 text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-100'
              }`}
            onClick={() => setActiveTab('status')}
          >
            <span className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              Package Status
            </span>
          </button>
          <button
            className={`px-6 py-3 font-medium rounded-lg transition-all duration-200 ${activeTab === 'counts'
                ? 'bg-blue-500 text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-100'
              }`}
            onClick={() => setActiveTab('counts')}
          >
            <span className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Booking Counts
            </span>
          </button>


          {/* ADD THIS NEW TAB BUTTON */}
          <button
            className={`px-6 py-3 font-medium rounded-lg transition-all duration-200 ${activeTab === 'packages'
                ? 'bg-blue-500 text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-100'
              }`}
            onClick={() => setActiveTab('packages')}
          >
            <span className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-2.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 009.586 13H7" />
              </svg>
              Package Management
            </span>
          </button>


        </div>
      </div>

      <div className="bg-gray-50 min-h-screen">
        {activeTab === 'users' && <UserBookings />}
        {activeTab === 'status' && <PackageStatus />}
        {activeTab === 'counts' && <BookingCountPerPackage />}
        {activeTab === 'packages' && <BookingManagement />}
      </div>
    </div>
  );
};

export default BookingsDashboard;
