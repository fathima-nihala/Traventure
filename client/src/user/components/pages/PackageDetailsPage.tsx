import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Calendar, MapPin, Clock, CheckCircle, XCircle } from 'lucide-react';
import { RootState, AppDispatch } from '../../../redux/store';
import { getPackageById, clearSelectedPackage } from '../../../redux/slices/packageSlice';
import { createBooking, resetBookingState } from '../../../redux/slices/bookingSlice';
import { SelectedServices } from '../../../redux/slices/bookingSlice';

const PackageDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const { selectedPackage, isLoading: packageLoading } = useSelector((state: RootState) => state.package);
  const { loading: bookingLoading, success: bookingSuccess, error: bookingError, isAuthenticated } = useSelector((state: RootState) => ({
    ...state.booking,
    isAuthenticated: state.auth.isAuthenticated
  }));

  const [selectedServices, setSelectedServices] = useState<SelectedServices>({
    food: false,
    accommodation: false
  });
  const [totalPrice, setTotalPrice] = useState(0);
  const [showBookingForm, setShowBookingForm] = useState(false);

  useEffect(() => {
    if (id) {
      dispatch(getPackageById(id));
    }
    return () => {
      dispatch(clearSelectedPackage());
      dispatch(resetBookingState());
    };
  }, [id, dispatch]);

  useEffect(() => {
    if (selectedPackage) {
      calculateTotalPrice();
    }
  }, [selectedPackage, selectedServices]);

  useEffect(() => {
    if (bookingSuccess) {
      alert('Booking created successfully!');
      setShowBookingForm(false);
      setSelectedServices({ food: false, accommodation: false });
      dispatch(resetBookingState());
    }
  }, [bookingSuccess, dispatch]);

  const calculateTotalPrice = () => {
    if (!selectedPackage) return;
    
    let price = selectedPackage.basePrice;
    if (selectedServices.food) price += selectedPackage.foodPrice;
    if (selectedServices.accommodation) price += selectedPackage.accommodationPrice;
    
    setTotalPrice(price);
  };

  const handleServiceToggle = (service: keyof SelectedServices) => {
    setSelectedServices(prev => ({
      ...prev,
      [service]: !prev[service]
    }));
  };

  const handleBookNow = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    setShowBookingForm(true);
  };

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPackage) return;

    const bookingData = {
      packageId: selectedPackage._id,
      selectedServices
    };

    dispatch(createBooking(bookingData));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getDuration = () => {
    if (!selectedPackage) return '';
    const start = new Date(selectedPackage.startDate);
    const end = new Date(selectedPackage.endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return `${diffDays} days`;
  };

  if (packageLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!selectedPackage) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Package not found</h2>
          <button
            onClick={() => navigate('/')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Go Back Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Image Gallery */}
            <div className="relative">
              {selectedPackage.images && selectedPackage.images.length > 0 ? (
                <img
                  src={selectedPackage.images[0]}
                  alt={selectedPackage.toLocation}
                  className="w-full h-96 object-cover"
                />
              ) : (
                <div className="w-full h-96 bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-500">No image available</span>
                </div>
              )}
              {selectedPackage.images && selectedPackage.images.length > 1 && (
                <div className="absolute bottom-4 right-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded">
                  +{selectedPackage.images.length - 1} more
                </div>
              )}
            </div>

            {/* Basic Info */}
            <div className="p-6">
              <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                <MapPin className="w-4 h-4" />
                <span>{selectedPackage.fromLocation} → {selectedPackage.toLocation}</span>
              </div>
              
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {selectedPackage.toLocation} Travel Package
              </h1>
              
              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center gap-1">
                  <Calendar className="w-5 h-5 text-blue-600" />
                  <span className="text-sm font-medium">{formatDate(selectedPackage.startDate)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-5 h-5 text-blue-600" />
                  <span className="text-sm font-medium">{getDuration()}</span>
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg mb-6">
                <div className="flex items-center gap-2 mb-2">
                  {/* <DollarSign className="w-5 h-5 text-blue-600" /> */}
                  <span className="text-lg font-semibold text-blue-900">Starting from ₹{selectedPackage.basePrice}</span>
                </div>
                <p className="text-sm text-blue-700">Base package price (additional services available)</p>
              </div>

              <button
                onClick={handleBookNow}
                disabled={bookingLoading}
                className="w-full bg-blue-600 cursor-pointer text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200"
              >
                {bookingLoading ? 'Processing...' : 'Book Now'}
              </button>
            </div>
          </div>
        </div>

        {/* Package Details */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">About This Package</h2>
              <p className="text-gray-700 leading-relaxed">{selectedPackage.description}</p>
            </div>

            {/* Included Services */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">What's Included</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  {selectedPackage.includedServices.food ? (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-600" />
                  )}
                  <span className={selectedPackage.includedServices.food ? 'text-green-700' : 'text-red-700'}>
                    Food & Meals
                  </span>
                  {!selectedPackage.includedServices.food && (
                    <span className="text-sm text-gray-500">
                      (Available for ₹{selectedPackage.foodPrice})
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  {selectedPackage.includedServices.accommodation ? (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-600" />
                  )}
                  <span className={selectedPackage.includedServices.accommodation ? 'text-green-700' : 'text-red-700'}>
                    Accommodation
                  </span>
                  {!selectedPackage.includedServices.accommodation && (
                    <span className="text-sm text-gray-500">
                      (Available for ₹{selectedPackage.accommodationPrice})
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Package Creator */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Package Provider</h2>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold text-lg">
                    {selectedPackage.createdBy.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{selectedPackage.createdBy.name}</h3>
                  <p className="text-gray-600">{selectedPackage.createdBy.email}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Details */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Quick Details</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Duration:</span>
                  <span className="font-medium">{getDuration()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Start Date:</span>
                  <span className="font-medium">{formatDate(selectedPackage.startDate)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">End Date:</span>
                  <span className="font-medium">{formatDate(selectedPackage.endDate)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Base Price:</span>
                  <span className="font-medium text-blue-600">₹{selectedPackage.basePrice}</span>
                </div>
              </div>
            </div>

            {/* Additional Services (if not included) */}
            {(!selectedPackage.includedServices.food || !selectedPackage.includedServices.accommodation) && (
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Additional Services</h3>
                <div className="space-y-3">
                  {!selectedPackage.includedServices.food && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Food & Meals</span>
                      <span className="font-medium text-blue-600">₹{selectedPackage.foodPrice}</span>
                    </div>
                  )}
                  {!selectedPackage.includedServices.accommodation && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Accommodation</span>
                      <span className="font-medium text-blue-600">₹{selectedPackage.accommodationPrice}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Booking Modal */}
        {showBookingForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-md w-full p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Complete Your Booking</h2>
              
              {bookingError && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
                  {bookingError}
                </div>
              )}

              <form onSubmit={handleBookingSubmit}>
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-3">Select Additional Services</h3>
                  
                  {!selectedPackage.includedServices.food && (
                    <label className="flex items-center gap-3 mb-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedServices.food}
                        onChange={() => handleServiceToggle('food')}
                        className="w-4 h-4 text-blue-600"
                      />
                      <span>Food & Meals (₹{selectedPackage.foodPrice})</span>
                    </label>
                  )}

                  {!selectedPackage.includedServices.accommodation && (
                    <label className="flex items-center gap-3 mb-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedServices.accommodation}
                        onChange={() => handleServiceToggle('accommodation')}
                        className="w-4 h-4 text-blue-600"
                      />
                      <span>Accommodation (₹{selectedPackage.accommodationPrice})</span>
                    </label>
                  )}
                </div>

                <div className="bg-gray-50 p-4 rounded-lg mb-6">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold">Total Price:</span>
                    <span className="text-2xl font-bold text-blue-600">₹{totalPrice}</span>
                  </div>
                </div>

                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setShowBookingForm(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={bookingLoading}
                    className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {bookingLoading ? 'Booking...' : 'Confirm Booking'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PackageDetailPage;