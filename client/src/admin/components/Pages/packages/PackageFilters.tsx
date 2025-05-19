// import React, { useState } from 'react';

// interface FilterProps {
//   onFilterChange: (filters: any) => void;
// }

// const PackageFilters: React.FC<FilterProps> = ({ onFilterChange }) => {
//   const [filters, setFilters] = useState({
//     fromLocation: '',
//     toLocation: '',
//     startDate: '',
//     endDate: '',
//     minPrice: '',
//     maxPrice: '',
//     sortBy: 'createdAt',
//     sortOrder: 'desc',
//     status: '',
//     limit: 10
//   });

//   const [isAdvancedFiltersOpen, setIsAdvancedFiltersOpen] = useState(false);

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
//     const { name, value } = e.target;
//     setFilters(prev => ({ ...prev, [name]: value }));
//   };

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
    
//     // Convert price strings to numbers if they exist
//     const processedFilters = {
//       ...filters,
//       minPrice: filters.minPrice ? Number(filters.minPrice) : undefined,
//       maxPrice: filters.maxPrice ? Number(filters.maxPrice) : undefined
//     };
    
//     // Remove empty filters
//     const cleanedFilters = Object.fromEntries(
//       Object.entries(processedFilters).filter(([_, value]) => value !== '' && value !== undefined)
//     );
    
//     onFilterChange(cleanedFilters);
//   };

//   const resetFilters = () => {
//     setFilters({
//       fromLocation: '',
//       toLocation: '',
//       startDate: '',
//       endDate: '',
//       minPrice: '',
//       maxPrice: '',
//       sortBy: 'createdAt',
//       sortOrder: 'desc',
//       status: '',
//       limit: 10
//     });
    
//     // Immediately trigger the filter change
//     onFilterChange({
//       sortBy: 'createdAt',
//       sortOrder: 'desc',
//       limit: 10
//     });
//   };

//   return (
//     <div className="bg-white rounded-lg shadow-md p-4 mb-6">
//       <form onSubmit={handleSubmit}>
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
//           {/* Basic Search Fields */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               From Location
//             </label>
//             <input
//               type="text"
//               name="fromLocation"
//               value={filters.fromLocation}
//               onChange={handleInputChange}
//               placeholder="From location"
//               className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
//             />
//           </div>
          
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               To Location
//             </label>
//             <input
//               type="text"
//               name="toLocation"
//               value={filters.toLocation}
//               onChange={handleInputChange}
//               placeholder="To location"
//               className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
//             />
//           </div>
          
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Status
//             </label>
//             <select
//               name="status"
//               value={filters.status}
//               onChange={handleInputChange}
//               className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
//             >
//               <option value="">All Statuses</option>
//               <option value="upcoming">Upcoming</option>
//               <option value="active">Active</option>
//               <option value="completed">Completed</option>
//             </select>
//           </div>
//         </div>
        
//         {/* Advanced Filters (collapsible) */}
//         <div className="mb-4">
//           <button
//             type="button"
//             onClick={() => setIsAdvancedFiltersOpen(!isAdvancedFiltersOpen)}
//             className="text-blue-600 hover:text-blue-800 flex items-center text-sm cursor-pointer"
//           >
//             {isAdvancedFiltersOpen ? '− Hide' : '+ Show'} Advanced Filters
//           </button>
          
//           {isAdvancedFiltersOpen && (
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Start Date (From)
//                 </label>
//                 <input
//                   type="date"
//                   name="startDate"
//                   value={filters.startDate}
//                   onChange={handleInputChange}
//                   className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
//                 />
//               </div>
              
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   End Date (Before)
//                 </label>
//                 <input
//                   type="date"
//                   name="endDate"
//                   value={filters.endDate}
//                   onChange={handleInputChange}
//                   className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
//                 />
//               </div>
              
//               <div className="grid grid-cols-2 gap-2">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Min Price
//                   </label>
//                   <input
//                     type="number"
//                     name="minPrice"
//                     value={filters.minPrice}
//                     onChange={handleInputChange}
//                     placeholder="Min"
//                     className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
//                   />
//                 </div>
                
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Max Price
//                   </label>
//                   <input
//                     type="number"
//                     name="maxPrice"
//                     value={filters.maxPrice}
//                     onChange={handleInputChange}
//                     placeholder="Max"
//                     className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
//                   />
//                 </div>
//               </div>
              
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Sort By
//                 </label>
//                 <select
//                   name="sortBy"
//                   value={filters.sortBy}
//                   onChange={handleInputChange}
//                   className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
//                 >
//                   <option value="createdAt">Date Created</option>
//                   <option value="startDate">Start Date</option>
//                   <option value="endDate">End Date</option>
//                   <option value="basePrice">Price</option>
//                 </select>
//               </div>
              
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Sort Order
//                 </label>
//                 <select
//                   name="sortOrder"
//                   value={filters.sortOrder}
//                   onChange={handleInputChange}
//                   className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
//                 >
//                   <option value="desc">Descending</option>
//                   <option value="asc">Ascending</option>
//                 </select>
//               </div>
              
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1 cursor-pointer">
//                   Items Per Page
//                 </label>
//                 <select
//                   name="limit"
//                   value={filters.limit}
//                   onChange={handleInputChange}
//                   className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
//                 >
//                   <option value={10}>10</option>
//                   <option value={20}>20</option>
//                   <option value={50}>50</option>
//                 </select>
//               </div>
//             </div>
//           )}
//         </div>
        
//         <div className="flex justify-end space-x-2">
//           <button
//             type="button"
//             onClick={resetFilters}
//             className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded cursor-pointer"
//           >
//             Reset
//           </button>
//           <button
//             type="submit"
//             className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded cursor-pointer"
//           >
//             Apply Filters
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default PackageFilters;

import React, { useState } from 'react';

// Define proper types for filters
export interface FilterValues {
  fromLocation: string;
  toLocation: string;
  startDate: string;
  endDate: string;
  minPrice: string | number;
  maxPrice: string | number;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  status: string;
  limit: number;
}

interface FilterProps {
  onFilterChange: (filters: Record<string, string | number | undefined>) => void;
}

const PackageFilters: React.FC<FilterProps> = ({ onFilterChange }) => {
  const [filters, setFilters] = useState<FilterValues>({
    fromLocation: '',
    toLocation: '',
    startDate: '',
    endDate: '',
    minPrice: '',
    maxPrice: '',
    sortBy: 'createdAt',
    sortOrder: 'desc',
    status: '',
    limit: 10
  });

  const [isAdvancedFiltersOpen, setIsAdvancedFiltersOpen] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Create a clean filter object with proper types
    const processedFilters: Record<string, string | number | undefined> = {};
    
    // Only add non-empty values to the filter
    if (filters.fromLocation) processedFilters.fromLocation = filters.fromLocation;
    if (filters.toLocation) processedFilters.toLocation = filters.toLocation;
    if (filters.startDate) processedFilters.startDate = filters.startDate;
    if (filters.endDate) processedFilters.endDate = filters.endDate;
    if (filters.status) processedFilters.status = filters.status;
    
    // Convert string prices to numbers
    if (filters.minPrice && filters.minPrice !== '') {
      processedFilters.minPrice = Number(filters.minPrice);
    }
    
    if (filters.maxPrice && filters.maxPrice !== '') {
      processedFilters.maxPrice = Number(filters.maxPrice);
    }
    
    // Always include these values
    processedFilters.sortBy = filters.sortBy;
    processedFilters.sortOrder = filters.sortOrder;
    processedFilters.limit = Number(filters.limit);
    
    console.log('Submitting filters:', processedFilters);
    onFilterChange(processedFilters);
  };

  const resetFilters = () => {
    const defaultFilters = {
      fromLocation: '',
      toLocation: '',
      startDate: '',
      endDate: '',
      minPrice: '',
      maxPrice: '',
      sortBy: 'createdAt',
      sortOrder: 'desc' as const,
      status: '',
      limit: 10
    };
    
    setFilters(defaultFilters);
    
    // Submit default filters immediately
    onFilterChange({
      sortBy: 'createdAt',
      sortOrder: 'desc',
      limit: 10
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-6">
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          {/* Basic Search Fields */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              From Location
            </label>
            <input
              type="text"
              name="fromLocation"
              value={filters.fromLocation}
              onChange={handleInputChange}
              placeholder="From location"
              className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              To Location
            </label>
            <input
              type="text"
              name="toLocation"
              value={filters.toLocation}
              onChange={handleInputChange}
              placeholder="To location"
              className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              name="status"
              value={filters.status}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Statuses</option>
              <option value="upcoming">Upcoming</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>
        
        {/* Advanced Filters (collapsible) */}
        <div className="mb-4">
          <button
            type="button"
            onClick={() => setIsAdvancedFiltersOpen(!isAdvancedFiltersOpen)}
            className="text-blue-600 hover:text-blue-800 flex items-center text-sm cursor-pointer"
          >
            {isAdvancedFiltersOpen ? '− Hide' : '+ Show'} Advanced Filters
          </button>
          
          {isAdvancedFiltersOpen && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Date (From)
                </label>
                <input
                  type="date"
                  name="startDate"
                  value={filters.startDate}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  End Date (Before)
                </label>
                <input
                  type="date"
                  name="endDate"
                  value={filters.endDate}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Min Price
                  </label>
                  <input
                    type="number"
                    name="minPrice"
                    value={filters.minPrice}
                    onChange={handleInputChange}
                    placeholder="Min"
                    className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Max Price
                  </label>
                  <input
                    type="number"
                    name="maxPrice"
                    value={filters.maxPrice}
                    onChange={handleInputChange}
                    placeholder="Max"
                    className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sort By
                </label>
                <select
                  name="sortBy"
                  value={filters.sortBy}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="createdAt">Date Created</option>
                  <option value="startDate">Start Date</option>
                  <option value="endDate">End Date</option>
                  <option value="basePrice">Price</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sort Order
                </label>
                <select
                  name="sortOrder"
                  value={filters.sortOrder}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="desc">Descending</option>
                  <option value="asc">Ascending</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 cursor-pointer">
                  Items Per Page
                </label>
                <select
                  name="limit"
                  value={filters.limit}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                </select>
              </div>
            </div>
          )}
        </div>
        
        <div className="flex justify-end space-x-2">
          <button
            type="button"
            onClick={resetFilters}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded cursor-pointer"
          >
            Reset
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded cursor-pointer"
          >
            Apply Filters
          </button>
        </div>
      </form>
    </div>
  );
};

export default PackageFilters;