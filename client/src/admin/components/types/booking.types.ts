  // Define the structure of booking-related data
  export interface User {
    _id: string;
    name: string;
    email: string;
    profilePicture?: string;
  }

  export interface Package {
    _id: string;
    name: string;
    location: string;
    basePrice: number;
    startDate: string;
    endDate: string;
    capacity: number;
    description?: string;
  }

  export interface SelectedServices {
    food: boolean;
    accommodation: boolean;
    [key: string]: boolean;
  }

  export interface Booking {
    _id: string;
    user: User;
    package: Package;
    status: 'completed' | 'active' | 'upcoming';
    totalPrice: number;
    selectedServices: SelectedServices;
    bookingDate?: string;
  }

  export interface UserBookingGroup {
    user: User;
    bookings: Booking[];
  }

  export interface PackageBookingCount {
    package: Package;
    count: number;
  }

  export interface StatusCounts {
    completed: number;
    active: number;
    upcoming: number;
  }

  export interface TopUser {
    _id: string;
    name: string;
    email: string;
    bookingsCount: number;
    totalSpent: number;
  }

  export interface BookingAnalytics {
    topUsers: TopUser[];
    totalBookings?: number;
    totalRevenue?: number;
  }
