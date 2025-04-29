import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../redux/store';
import { getPackages, deletePackage, clearPackageError } from '../../../redux/slices/packageSlice';
import PackageCard from './PackageCard';
import PackageModal from './PackageModal';
import PackageFilters from './PackageFilters';
import { toast } from 'react-toastify';

// Define types for your filters
interface PackageFilters {
  limit: number;
  page: number;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  [key: string]: string | number; // Allow for additional filter properties
}

const PackagesList: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { packages, isLoading, error, count } = useSelector((state: RootState) => state.package);
  const { user } = useSelector((state: RootState) => state.auth);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<PackageFilters>({
    limit: 10,
    page: 1,
    sortBy: 'createdAt',
    sortOrder: 'desc'
  });

  useEffect(() => {
    dispatch(getPackages(filters));
  }, [dispatch, filters]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearPackageError());
    }
  }, [error, dispatch]);

  const handlePageChange = (page: number): void => {
    setCurrentPage(page);
    setFilters((prev: PackageFilters) => ({ ...prev, page }));
  };

  const handleDelete = (id: string): void => {
    if (window.confirm('Are you sure you want to delete this package?')) {
      dispatch(deletePackage(id))
        .unwrap()
        .then(() => {
          toast.success('Package deleted successfully');
        })
        .catch((err: Error | string) => {
          toast.error(err || 'Failed to delete package');
        });
    }
  };

  const handleUpdate = (id: string): void => {
    setSelectedPackage(id);
    setIsModalOpen(true);
  };

  const handleFilterChange = (newFilters: Partial<PackageFilters>): void => {
    setCurrentPage(1);
    setFilters({ ...filters, ...newFilters, page: 1 });
  };

  const isAdmin = user?.role === 'admin';
  const totalPages = Math.ceil(count / filters.limit);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Travel Packages</h1>
        {isAdmin && (
          <button
            onClick={() => {
              setSelectedPackage(null);
              setIsModalOpen(true);
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          >
            Add New Package
          </button>
        )}
      </div>

      <PackageFilters onFilterChange={handleFilterChange} />

      {isLoading ? (
        <div className="flex justify-center my-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : packages.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">No packages found matching your criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {packages.map((pkg) => (
            <PackageCard
              key={pkg._id}
              pkg={pkg}
              onDelete={isAdmin ? () => handleDelete(pkg._id) : undefined}
              onUpdate={isAdmin ? () => handleUpdate(pkg._id) : undefined}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-8">
          <nav>
            <ul className="flex">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <li key={page}>
                  <button
                    onClick={() => handlePageChange(page)}
                    className={`mx-1 px-3 py-1 rounded ${
                      currentPage === page
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 hover:bg-gray-300'
                    }`}
                  >
                    {page}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      )}

      <PackageModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        packageId={selectedPackage}
      />
    </div>
  );
};

export default PackagesList;