// types/booking.types.ts
export interface User {
  _id: string;
  name: string;
  email: string;
  profilePicture?: string;
}

export interface Package {
  _id: string;
  name: string;
  description: string;
  basePrice: number;
  foodPrice: number;
  accommodationPrice: number;
  includedServices: {
    food: boolean;
    accommodation: boolean;
  };
  startDate: Date; // Changed to Date to match Redux slice
  endDate: Date; // Changed to Date to match Redux slice
  location: string;
  images: string[];
  capacity: number;
  fromLocation: string;
  toLocation: string;
}

export interface SelectedServices {
  food: boolean;
  accommodation: boolean;
  [key: string]: boolean;
}

export interface Booking {
  _id: string;
  package: Package;
  user: User;
  selectedServices: SelectedServices;
  totalPrice: number;
  status: string; // Changed to string to match Redux slice
  bookingDate: Date; // Changed to Date to match Redux slice
  bookingStatus?: string;
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
  cancelled: number;
  pending?: number;
  accepted?: number;
}

export interface DateBasedStatus {
  active: number;
  upcoming: number;
  completed: number;
}

export interface TopUser {
  _id: string;
  name: string;
  email: string;
  bookingsCount: number;
  totalSpent: number;
}

export interface MonthlyTrend {
  _id: {
    year: number;
    month: number;
  };
  bookingsCount: number;
  revenue: number;
}

export interface BookingAnalytics {
  totalBookings: number;
  totalRevenue: number;
  // statusCounts: {
  //   completed: number;
  //   active: number;
  //   upcoming: number;
  //   cancelled: number;
  // };
  statusCounts: StatusCounts;
  dateBasedStatus: DateBasedStatus;
  topUsers: TopUser[];
  monthlyTrends: MonthlyTrend[];
}
