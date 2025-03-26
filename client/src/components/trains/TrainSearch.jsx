import React, { useState, useEffect, useRef } from 'react';
import { FaSearch, FaExchangeAlt, FaCalendarAlt, FaTimes } from 'react-icons/fa';
import axios from 'axios';
import { toast } from 'react-hot-toast';

// Class types with descriptions - will be used as fallback
const FALLBACK_CLASS_TYPES = [
  { code: "1A", name: "AC First Class (1A)", description: "Most premium class with lockable, carpeted cabins" },
  { code: "2A", name: "AC 2 Tier (2A)", description: "Air-conditioned coaches with 2-tier berths" },
  { code: "3A", name: "AC 3 Tier (3A)", description: "Air-conditioned coaches with 3-tier berths" },
  { code: "SL", name: "Sleeper (SL)", description: "Non-AC coaches with 3-tier berths" },
  { code: "CC", name: "Chair Car (CC)", description: "Air-conditioned seating coaches" },
  { code: "2S", name: "Second Sitting (2S)", description: "Non-AC seating coaches" },
  { code: "GN", name: "General (GN)", description: "Unreserved general coaches" }
];

// Fallback stations in case API fails
const FALLBACK_STATIONS = [
  { code: 'NDLS', name: 'New Delhi' },
  { code: 'HWH', name: 'Howrah' },
  { code: 'MMCT', name: 'Mumbai Central' },
  { code: 'MAS', name: 'Chennai Central' },
  { code: 'SBC', name: 'Bangalore' },
  { code: 'PRYJ', name: 'Prayagraj Junction' },
  { code: 'BZA', name: 'Vijayawada Junction' },
  { code: 'PUNE', name: 'Pune Junction' },
  { code: 'HYB', name: 'Hyderabad' },
  { code: 'ADI', name: 'Ahmedabad' }
];

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const TrainSearch = ({ onSearch, popularStations = [], initialValues = {} }) => {
  const [fromStation, setFromStation] = useState(initialValues.fromStation || '');
  const [toStation, setToStation] = useState(initialValues.toStation || '');
  const [date, setDate] = useState(initialValues.date || getCurrentDate());
  const [classType, setClassType] = useState(initialValues.classType || '');
  const [stations, setStations] = useState([...FALLBACK_STATIONS, ...popularStations]);
  const [filteredFromStations, setFilteredFromStations] = useState([...FALLBACK_STATIONS, ...popularStations]);
  const [filteredToStations, setFilteredToStations] = useState([...FALLBACK_STATIONS, ...popularStations]);
  const [showFromDropdown, setShowFromDropdown] = useState(false);
  const [showToDropdown, setShowToDropdown] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [classTypes, setClassTypes] = useState(FALLBACK_CLASS_TYPES);
  const [availableClassTypes, setAvailableClassTypes] = useState([]);
  const searchFormRef = useRef(null);

  // Get current date in YYYY-MM-DD format
  function getCurrentDate() {
    const today = new Date();
    // Use local timezone with explicit year, month, day formatting
    const year = today.getFullYear();
    // getMonth() is zero-based, so add 1 and pad with 0 if needed
    const month = String(today.getMonth() + 1).padStart(2, '0');
    // getDate() returns the day of the month
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  // Get maximum date (1 year from now)
  function getMaxDate() {
    const maxDate = new Date();
    maxDate.setFullYear(maxDate.getFullYear() + 1);
    const year = maxDate.getFullYear();
    const month = String(maxDate.getMonth() + 1).padStart(2, '0');
    const day = String(maxDate.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  // Fetch all stations and class types when component mounts
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      
      try {
        // Try getting stations from all trains
        const trainsResponse = await axios.get(`${API_URL}/trains`);
        if (trainsResponse.data && trainsResponse.data.data) {
          // Extract unique stations from all trains
          const uniqueStations = new Set();
          const uniqueClassTypes = new Set();
          
          trainsResponse.data.data.forEach(train => {
            // Add stations to set
            train.stations.forEach(station => {
              uniqueStations.add(JSON.stringify({
                code: station.stationCode,
                name: station.stationName
              }));
            });
            
            // Add class types from each train
            if (train.classes && Array.isArray(train.classes)) {
              train.classes.forEach(classCode => uniqueClassTypes.add(classCode));
            }
          });
          
          // Process stations
          const stationsList = Array.from(uniqueStations).map(station => JSON.parse(station));
          
          // Merge with fallback stations to ensure we have data
          const mergedStations = [...stationsList, ...FALLBACK_STATIONS, ...popularStations];
          
          // Remove duplicates by code
          const uniqueByCode = mergedStations.filter((station, index, self) =>
            index === self.findIndex((s) => s.code === station.code)
          );
          
          setStations(uniqueByCode);
          setFilteredFromStations(uniqueByCode);
          setFilteredToStations(uniqueByCode);
          
          // Process class types
          const availableClasses = Array.from(uniqueClassTypes);
          setAvailableClassTypes(availableClasses);
          
          // Filter full class types data based on available classes
          const filteredClassTypes = FALLBACK_CLASS_TYPES.filter(
            classType => availableClasses.includes(classType.code)
          );
          
          // If we have at least one class type, update the state
          if (filteredClassTypes.length > 0) {
            setClassTypes(filteredClassTypes);
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        // Already using fallback data from initialization
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [popularStations]);

  // Fetch class types for selected route when both stations are selected
  useEffect(() => {
    const fetchAvailableClasses = async () => {
      if (fromStation && toStation && fromStation !== toStation) {
        try {
          setIsLoading(true);
          
          // Search available trains for this route to get available classes
          const searchResponse = await axios.get(`${API_URL}/trains/search`, {
            params: { fromStation, toStation }
          });
          
          if (searchResponse.data?.success && searchResponse.data.data.length > 0) {
            // Collect all unique class types available on this route
            const uniqueClasses = new Set();
            
            searchResponse.data.data.forEach(train => {
              if (train.classes && Array.isArray(train.classes)) {
                train.classes.forEach(cls => uniqueClasses.add(cls));
              }
            });
            
            const availableClasses = Array.from(uniqueClasses);
            
            // Only update if we found classes
            if (availableClasses.length > 0) {
              setAvailableClassTypes(availableClasses);
              
              // Reset class selection if current selection is not available
              if (classType && !availableClasses.includes(classType)) {
                setClassType('');
              }
            }
          }
        } catch (error) {
          console.error('Error fetching available classes:', error);
          // Keep using all classes as fallback
        } finally {
          setIsLoading(false);
        }
      }
    };
    
    fetchAvailableClasses();
  }, [fromStation, toStation]);

  useEffect(() => {
    // Handle clicks outside the search form
    const handleClickOutside = (event) => {
      if (searchFormRef.current && !searchFormRef.current.contains(event.target)) {
        setShowFromDropdown(false);
        setShowToDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filterStations = (input, type) => {
    if (!input) {
      return type === 'from' ? setFilteredFromStations(stations) : setFilteredToStations(stations);
    }
    
    const searchTerm = input.toLowerCase();
    const filtered = stations.filter(station => 
      station.code.toLowerCase().includes(searchTerm) || 
      station.name.toLowerCase().includes(searchTerm)
    );
    
    if (type === 'from') {
      setFilteredFromStations(filtered);
    } else {
      setFilteredToStations(filtered);
    }
  };

  const handleStationInput = (value, type) => {
    if (type === 'from') {
      setFromStation(value.toUpperCase());
      setShowFromDropdown(true);
      filterStations(value, 'from');
    } else {
      setToStation(value.toUpperCase());
      setShowToDropdown(true);
      filterStations(value, 'to');
    }
  };

  const handleStationSelect = (station, type) => {
    if (type === 'from') {
      setFromStation(station.code);
      setShowFromDropdown(false);
    } else {
      setToStation(station.code);
      setShowToDropdown(false);
    }
  };

  const handleSwapStations = () => {
    setFromStation(toStation);
    setToStation(fromStation);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!fromStation || !toStation) {
      toast.error('Please select both stations');
      return;
    }

    if (fromStation === toStation) {
      toast.error('Please select different stations');
      return;
    }

    const selectedDate = new Date(date);
    const currentDate = new Date(getCurrentDate());
    const maxDate = new Date(getMaxDate());

    if (selectedDate < currentDate) {
      toast.error('Please select a date from today onwards');
      setDate(getCurrentDate());
      return;
    }

    if (selectedDate > maxDate) {
      toast.error('Please select a date within next year');
      return;
    }

    onSearch({ 
      fromStation, 
      toStation, 
      date,
      classType
    });
  };

  // Filter class types based on available options
  const displayedClassTypes = availableClassTypes.length > 0
    ? classTypes.filter(cls => availableClassTypes.includes(cls.code))
    : classTypes;

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Search Trains</h2>
        {(fromStation || toStation) && (
          <button
            onClick={() => {
              setFromStation('');
              setToStation('');
              setDate(getCurrentDate());
              setClassType('');
              onSearch({ fromStation: '', toStation: '', date: getCurrentDate() });
            }}
            className="text-gray-500 hover:text-gray-700 flex items-center gap-1"
          >
            <FaTimes className="w-4 h-4" />
            <span>Reset</span>
          </button>
        )}
      </div>
      
      <form ref={searchFormRef} onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* From Station */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              From Station
            </label>
            <input
              type="text"
              value={fromStation}
              onChange={(e) => handleStationInput(e.target.value, 'from')}
              onFocus={() => setShowFromDropdown(true)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter station code or name"
            />
            {showFromDropdown && filteredFromStations.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                {filteredFromStations.map((station, index) => (
                  <div
                    key={index}
                    className="p-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => handleStationSelect(station, 'from')}
                  >
                    <div className="font-medium">{station.code}</div>
                    <div className="text-sm text-gray-600">{station.name}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Swap Button */}
          <div className="flex items-center justify-center md:pt-8">
            <button
              type="button"
              onClick={handleSwapStations}
              className="p-2 text-blue-600 hover:text-blue-700 focus:outline-none"
              disabled={!fromStation && !toStation}
            >
              <FaExchangeAlt className="w-5 h-5" />
            </button>
          </div>

          {/* To Station */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              To Station
            </label>
            <input
              type="text"
              value={toStation}
              onChange={(e) => handleStationInput(e.target.value, 'to')}
              onFocus={() => setShowToDropdown(true)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter station code or name"
            />
            {showToDropdown && filteredToStations.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                {filteredToStations.map((station, index) => (
                  <div
                    key={index}
                    className="p-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => handleStationSelect(station, 'to')}
                  >
                    <div className="font-medium">{station.code}</div>
                    <div className="text-sm text-gray-600">{station.name}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Date Selection */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Journey Date
            </label>
            <div className="relative">
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                min={getCurrentDate()}
                max={getMaxDate()}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-10"
              />
              <FaCalendarAlt className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
          </div>

          {/* Class Type Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Travel Class
            </label>
            <select
              value={classType}
              onChange={(e) => setClassType(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Classes</option>
              {displayedClassTypes.map(cls => (
                <option key={cls.code} value={cls.code}>
                  {cls.name}
                </option>
              ))}
            </select>
            {classType && (
              <p className="text-sm text-gray-600 mt-1">
                {displayedClassTypes.find(c => c.code === classType)?.description}
              </p>
            )}
          </div>
        </div>

        {/* Search Button */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors duration-300 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={!fromStation || !toStation || isLoading}
        >
          {isLoading ? (
            <>
              <svg className="animate-spin h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Searching...</span>
            </>
          ) : (
            <>
              <FaSearch />
              <span>Search Trains</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default TrainSearch;