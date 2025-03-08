import React, { useState, useEffect } from 'react';

// Helper function to create fake data
const makeData = (count) => {
  const data = [];
  for (let i = 0; i < count; i++) {
    data.push({
      id: i,
      firstName: ['John', 'Jane', 'Alex', 'Emma', 'Michael'][Math.floor(Math.random() * 5)],
      lastName: ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones'][Math.floor(Math.random() * 5)],
      age: 20 + Math.floor(Math.random() * 50),
      visits: Math.floor(Math.random() * 100),
      status: ['Active', 'Pending', 'Inactive'][Math.floor(Math.random() * 3)],
      progress: Math.floor(Math.random() * 100)
    });
  }
  return data;
};

const SimpleTable = () => {
  // Generate data only once when component mounts
  const [initialData] = useState(() => makeData(10));
  const [filteredData, setFilteredData] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
  const [animating, setAnimating] = useState(false);
  const [filter, setFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Columns definition
  const columns = [
    { key: 'firstName', label: 'First Name' },
    { key: 'lastName', label: 'Last Name' },
    { key: 'age', label: 'Age' },
    { key: 'visits', label: 'Visits' },
    { key: 'status', label: 'Status' },
    { key: 'progress', label: 'Progress' }
  ];

  // Sorting function
  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
    
    // Trigger animation
    setAnimating(true);
  };

  // Filter data
  const handleFilterChange = (e) => {
    setFilter(e.target.value);
    setAnimating(true);
  };

  // Status filter
  const handleStatusFilterChange = (e) => {
    setStatusFilter(e.target.value);
    setAnimating(true);
  };

  // Apply sorting and filtering
  useEffect(() => {
    const applyFiltersAndSort = () => {
      let result = [...initialData];
      
      // Apply text filter
      if (filter) {
        const lowerCaseFilter = filter.toLowerCase();
        result = result.filter(row => 
          row.firstName.toLowerCase().includes(lowerCaseFilter) ||
          row.lastName.toLowerCase().includes(lowerCaseFilter)
        );
      }
      
      // Apply status filter
      if (statusFilter !== 'all') {
        result = result.filter(row => row.status === statusFilter);
      }
      
      // Apply sorting
      if (sortConfig.key) {
        result.sort((a, b) => {
          if (a[sortConfig.key] < b[sortConfig.key]) {
            return sortConfig.direction === 'ascending' ? -1 : 1;
          }
          if (a[sortConfig.key] > b[sortConfig.key]) {
            return sortConfig.direction === 'ascending' ? 1 : -1;
          }
          return 0;
        });
      }
      
      setFilteredData(result);
    };
    
    applyFiltersAndSort();
    
    // Reset animation after timeout
    if (animating) {
      const timer = setTimeout(() => {
        setAnimating(false);
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [filter, statusFilter, sortConfig, initialData, animating]);

  // Set initial filtered data on first render
  useEffect(() => {
    setFilteredData(initialData);
  }, [initialData]);

  // Get sort direction indicator
  const getSortDirectionIndicator = (key) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === 'ascending' ? ' 🔼' : ' 🔽';
  };

  return (
    <div className="p-4">
      <div className="mb-4 flex items-center space-x-4">
        <div>
          <label htmlFor="filter" className="block text-sm font-medium text-gray-700 mb-1">Search:</label>
          <input
            id="filter"
            type="text"
            value={filter}
            onChange={handleFilterChange}
            placeholder="Filter by name..."
            className="p-2 border border-gray-300 rounded"
          />
        </div>
        <div>
          <label htmlFor="statusFilter" className="block text-sm font-medium text-gray-700 mb-1">Status:</label>
          <select
            id="statusFilter"
            value={statusFilter}
            onChange={handleStatusFilterChange}
            className="p-2 border border-gray-300 rounded"
          >
            <option value="all">All</option>
            <option value="Active">Active</option>
            <option value="Pending">Pending</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
      </div>
      
      <div className="rounded shadow overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr>
              {columns.map(column => (
                <th 
                  key={column.key}
                  className="py-2 px-4 border-b border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer transition-colors duration-200 hover:bg-gray-200"
                  onClick={() => requestSort(column.key)}
                >
                  {column.label}
                  {getSortDirectionIndicator(column.key)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className={animating ? "opacity-50 transition-opacity duration-300" : "transition-opacity duration-300"}>
            {filteredData.length > 0 ? (
              filteredData.map(row => (
                <tr 
                  key={row.id} 
                  className="hover:bg-gray-50 transition-colors duration-150"
                >
                  {columns.map(column => (
                    <td 
                      key={`${row.id}-${column.key}`}
                      className="py-2 px-4 border-b border-gray-200 text-sm"
                    >
                      {column.key === 'progress' ? `${row[column.key]}%` : row[column.key]}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="py-4 px-4 text-center text-gray-500">
                  No results found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SimpleTable;