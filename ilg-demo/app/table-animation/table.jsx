import React, { useState, useEffect } from 'react';

// Helper function to create fake data
const Data = () => {
  // Retrieve cached data from localStorage
  const cachedLeads = localStorage.getItem('cachedLeads');

  if (!cachedLeads) {
    console.warn("No cached data found.");
    return [];
  }
  console.log("Cached Data for Table");
  let leads = JSON.parse(cachedLeads);

  // Select 50 random entries and sort them alphabetically by `employer_name`
  const selectedLeads = leads
    .sort(() => 0.5 - Math.random()) // Shuffle the array
    .slice(0, 25) // Pick first 50 shuffled entries
    // .sort((a, b) => a.employer_name.localeCompare(b.employer_name)); // Sort alphabetically

  return selectedLeads;
};


const SimpleTable = () => {
  // Generate data only once when component mounts
  const [initialData] = useState(() => Data());
  const [filteredData, setFilteredData] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
  const [animating, setAnimating] = useState(false);
  const [filter, setFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Columns definition
  const columns = [
    { key: 'employer_name', label: 'Employer Name' },
    { key: 'carrier_name', label: 'Carrier Name' },
    { key: 'employer_city', label: 'Employer City' },
    { key: 'policy_number', label: 'Policy Number' },
    { key: 'policy_effective_date', label: 'Effective Date' },
    { key: 'policy_expiration_date', label: 'Expiration Date' },
    { key: 'agency_city', label: 'Agency City' }
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

  // Filter by text
  const handleFilterChange = (e) => {
    setFilter(e.target.value);
    setAnimating(true);
  };

  // Filter by status
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
          row.employer_name.toLowerCase().includes(lowerCaseFilter) ||
          row.carrier_name.toLowerCase().includes(lowerCaseFilter) ||
          row.employer_city.toLowerCase().includes(lowerCaseFilter)
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
  <label
    htmlFor="statusFilter"
    className="block text-sm font-medium text-gray-700 mb-1 opacity-50 cursor-not-allowed"
  >
    Status: disabled
  </label>
  {/* Remove opacity and cursor when status filter is implemented */}
  {/* remove disabled (inside select) when status filter is implemented */}
  <select
    id="statusFilter"
    value={statusFilter}
    onChange={handleStatusFilterChange} 
    className="p-2 border border-gray-300 rounded opacity-50 cursor-not-allowed"
    disabled
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