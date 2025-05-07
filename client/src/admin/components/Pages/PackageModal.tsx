import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../redux/store';
import { createPackage, getPackageById, updatePackage } from '../../../redux/slices/packageSlice';
import { toast } from 'react-toastify';

interface PackageModalProps {
  isOpen: boolean;
  onClose: () => void;
  packageId: string | null;
}

const PackageModal: React.FC<PackageModalProps> = ({ isOpen, onClose, packageId }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { selectedPackage, isLoading } = useSelector((state: RootState) => state.package);
  
  const [formData, setFormData] = useState({
    fromLocation: '',
    toLocation: '',
    startDate: '',
    endDate: '',
    basePrice: '',
    foodIncluded: false,
    foodPrice: '',
    accommodationIncluded: false,
    accommodationPrice: '',
    description: ''
  });
  
  const [images, setImages] = useState<File[]>([]);
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);

  // Reset form when modal is closed
  useEffect(() => {
    if (!isOpen) {
      resetForm();
    }
  }, [isOpen]);

  // Fetch package details if editing
  useEffect(() => {
    if (isOpen && packageId) {
      dispatch(getPackageById(packageId));
    }
  }, [dispatch, isOpen, packageId]);

  // Populate form with existing data if editing
  useEffect(() => {
    if (selectedPackage && packageId) {
      setFormData({
        fromLocation: selectedPackage.fromLocation || '',
        toLocation: selectedPackage.toLocation || '',
        startDate: selectedPackage.startDate ? new Date(selectedPackage.startDate).toISOString().split('T')[0] : '',
        endDate: selectedPackage.endDate ? new Date(selectedPackage.endDate).toISOString().split('T')[0] : '',
        basePrice: selectedPackage.basePrice.toString() || '',
        foodIncluded: selectedPackage.includedServices?.food || false,
        foodPrice: selectedPackage.foodPrice?.toString() || '',
        accommodationIncluded: selectedPackage.includedServices?.accommodation || false,
        accommodationPrice: selectedPackage.accommodationPrice?.toString() || '',
        description: selectedPackage.description || ''
      });
      
      if (selectedPackage.images && selectedPackage.images.length > 0) {
        setExistingImages(selectedPackage.images);
      }
    }
  }, [selectedPackage, packageId]);

  const resetForm = () => {
    setFormData({
      fromLocation: '',
      toLocation: '',
      startDate: '',
      endDate: '',
      basePrice: '',
      foodIncluded: false,
      foodPrice: '',
      accommodationIncluded: false,
      accommodationPrice: '',
      description: ''
    });
    setImages([]);
    setPreviewImages([]);
    setExistingImages([]);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      setImages(selectedFiles);
      
      // Create preview URLs
      const previews = selectedFiles.map(file => URL.createObjectURL(file));
      setPreviewImages(previews);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Form validation
      if (!formData.fromLocation || !formData.toLocation || !formData.startDate || 
          !formData.endDate || !formData.basePrice || !formData.description) {
        toast.error('Please fill all required fields');
        return;
      }
      
      if (new Date(formData.startDate) >= new Date(formData.endDate)) {
        toast.error('End date must be after start date');
        return;
      }
      
      // Create FormData object for file upload
      const packageFormData = new FormData();
      packageFormData.append('fromLocation', formData.fromLocation);
      packageFormData.append('toLocation', formData.toLocation);
      packageFormData.append('startDate', formData.startDate);
      packageFormData.append('endDate', formData.endDate);
      packageFormData.append('basePrice', formData.basePrice);
      
      const includedServices = {
        food: formData.foodIncluded,
        accommodation: formData.accommodationIncluded
      };
      packageFormData.append('includedServices', JSON.stringify(includedServices));
      
      if (formData.foodIncluded) {
        packageFormData.append('foodPrice', formData.foodPrice || '0');
      }
      
      if (formData.accommodationIncluded) {
        packageFormData.append('accommodationPrice', formData.accommodationPrice || '0');
      }
      
      packageFormData.append('description', formData.description);
      
      // Append images if any
      images.forEach(image => {
        packageFormData.append('images', image);
      });
      
      if (packageId) {
        // Update existing package
        await dispatch(updatePackage({ id: packageId, data: packageFormData })).unwrap();
        toast.success('Package updated successfully');
      } else {
        // Create new package
        await dispatch(createPackage(packageFormData)).unwrap();
        toast.success('Package created successfully');
      }
      
      onClose();
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Something went wrong';
      toast.error(errorMessage);    }
  };

  if (!isOpen) return null;

  return (
    // <div className="fixed inset-0 bg-white/10 backdrop-blur-sm bg-opacity-50 z-50 flex items-center justify-center p-4">
    <div className="fixed inset-0 bg-black/30 backdrop-blur-md z-50 flex items-center justify-center p-4">

      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-5 border-b">
          <h2 className="text-xl font-semibold">
            {packageId ? 'Edit Package' : 'Create New Package'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 cursor-pointer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                From Location <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="fromLocation"
                value={formData.fromLocation}
                onChange={handleInputChange}
                required
                className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                To Location <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="toLocation"
                value={formData.toLocation}
                onChange={handleInputChange}
                required
                className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleInputChange}
                required
                className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                End Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleInputChange}
                required
                className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Base Price <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="basePrice"
                value={formData.basePrice}
                onChange={handleInputChange}
                required
                min="0"
                step="0.01"
                className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div className="flex flex-col">
              <div className="flex items-center mb-2">
                <input
                  type="checkbox"
                  id="foodIncluded"
                  name="foodIncluded"
                  checked={formData.foodIncluded}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="foodIncluded" className="ml-2 text-sm font-medium text-gray-700">
                  Food Included
                </label>
              </div>
              
              {formData.foodIncluded && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Food Price
                  </label>
                  <input
                    type="number"
                    name="foodPrice"
                    value={formData.foodPrice}
                    onChange={handleInputChange}
                    min="0"
                    step="0.01"
                    className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              )}
            </div>
            
            <div className="flex flex-col">
              <div className="flex items-center mb-2">
                <input
                  type="checkbox"
                  id="accommodationIncluded"
                  name="accommodationIncluded"
                  checked={formData.accommodationIncluded}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="accommodationIncluded" className="ml-2 text-sm font-medium text-gray-700">
                  Accommodation Included
                </label>
              </div>
              
              {formData.accommodationIncluded && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Accommodation Price
                  </label>
                  <input
                    type="number"
                    name="accommodationPrice"
                    value={formData.accommodationPrice}
                    onChange={handleInputChange}
                    min="0"
                    step="0.01"
                    className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              )}
            </div>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
              rows={4}
              className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Images
            </label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageChange}
              className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
            />
            
            {/* Preview Images */}
            {previewImages.length > 0 && (
              <div className="mt-3">
                <p className="text-sm font-medium text-gray-700 mb-2">New Images:</p>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {previewImages.map((preview, index) => (
                    <div key={`new-${index}`} className="relative h-24 border rounded overflow-hidden">
                      <img
                        src={preview}
                        alt={`Preview ${index}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Existing Images */}
            {existingImages.length > 0 && (
              <div className="mt-3">
                <p className="text-sm font-medium text-gray-700 mb-2">Existing Images:</p>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {existingImages.map((image, index) => (
                    <div key={`existing-${index}`} className="relative h-24 border rounded overflow-hidden">
                      <img
                        src={image}
                        alt={`Existing ${index}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-300 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 bg-blue-600 cursor-pointer text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Saving...' : (packageId ? 'Update Package' : 'Create Package')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PackageModal;