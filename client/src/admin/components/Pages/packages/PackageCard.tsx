import React from 'react';
import { Link } from 'react-router-dom';

interface PackageCardProps {
  pkg: {
    _id: string;
    fromLocation: string;
    toLocation: string;
    startDate: string;
    endDate: string;
    basePrice: number;
    includedServices: {
      food: boolean;
      accommodation: boolean;
    };
    foodPrice: number;
    accommodationPrice: number;
    description: string;
    images: string[];
    status?: 'completed' | 'active' | 'upcoming';
  };
  onDelete?: () => void;
  onUpdate?: () => void;
}

const PackageCard: React.FC<PackageCardProps> = ({ pkg, onDelete, onUpdate }) => {
  // Format dates for display
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Get status badge color
  const getStatusBadgeColor = (status?: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'upcoming':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Calculate total price including selected services
  const calculateTotalPrice = () => {
    let total = pkg.basePrice;
    if (pkg.includedServices.food) total += pkg.foodPrice;
    if (pkg.includedServices.accommodation) total += pkg.accommodationPrice;
    return total;
  };

  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        {pkg.images && pkg.images.length > 0 ? (
          <img
            src={pkg.images[0]}
            alt={`${pkg.fromLocation} to ${pkg.toLocation}`}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <span className="text-gray-400">No image available</span>
          </div>
        )}

        {/* Status Badge */}
        {pkg.status && (
          <span className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeColor(pkg.status)}`}>
            {pkg.status.charAt(0).toUpperCase() + pkg.status.slice(1)}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold">{pkg.fromLocation} to {pkg.toLocation}</h3>
          <span className="font-bold text-blue-600">₹ {calculateTotalPrice()}</span>
        </div>

        <div className="mb-3 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>{formatDate(pkg.startDate)} - {formatDate(pkg.endDate)}</span>
          </div>
        </div>

        <div className="mb-4">
          <p className="text-gray-700 line-clamp-2 text-sm">{pkg.description}</p>
        </div>

        {/* Included Services */}
        <div className="flex flex-wrap gap-2 mb-4">
          {pkg.includedServices.food && (
            <span className="bg-green-50 text-green-700 text-xs px-2 py-1 rounded">
              Food Included
            </span>
          )}
          {pkg.includedServices.accommodation && (
            <span className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded">
              Accommodation Included
            </span>
          )}
        </div>

        {/* Actions */}
        <div className="flex justify-between items-center mt-4">
          <Link
            to={`/packages/${pkg._id}`}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            View Details
          </Link>

          {(onUpdate || onDelete) && (
            <div className="flex gap-2">
              {onUpdate && (
                <button
                  onClick={onUpdate}
                  className="text-yellow-600 hover:text-yellow-800 text-sm cursor-pointer"
                >
                  Edit
                </button>
              )}
              {onDelete && (
                <button
                  onClick={onDelete}
                  className="text-red-600 hover:text-red-800 text-sm cursor-pointer"
                >
                  Delete
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PackageCard;