import React, { useState, useEffect, useRef } from 'react';
import { FaSearch, FaExchangeAlt, FaCalendarAlt, FaTimes } from 'react-icons/fa';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const TrainSearch = ({ onSearch, popularStations = [], initialValues = {} }) => {
  const [fromStation, setFromStation] = useState(initialValues.fromStation || '');
  const [toStation, setToStation] = useState(initialValues.toStation || '');
  const [date, setDate] = useState(initialValues.date || getCurrentDate());
  const [stations, setStations] = useState([]);
  const [filteredFromStations, setFilteredFromStations] = useState([]);
  const [filteredToStations, setFilteredToStations] = useState([]);
  const [showFromDropdown, setShowFromDropdown] = useState(false);
  const [showToDropdown, setShowToDropdown] = useState(false);
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

  // Fetch all stations when component mounts
  useEffect(() => {
    const fetchStations = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/trains');
        if (response.data && response.data.data) {
          // Extract unique stations from all trains
          const uniqueStations = new Set();
          response.data.data.forEach(train => {
            train.stations.forEach(station => {
              uniqueStations.add(JSON.stringify({
                code: station.stationCode,
                name: station.stationName
              }));
            });
          });
          const stationsList = Array.from(uniqueStations).map(station => JSON.parse(station));
          setStations(stationsList);
          setFilteredFromStations(stationsList);
          setFilteredToStations(stationsList);
        }
      } catch (error) {
        console.error('Error fetching stations:', error);
        toast.error('Failed to fetch stations');
      }
    };
    fetchStations();
  }, []);

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

    onSearch({ fromStation, toStation, date });
  };

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

        {/* Search Button */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors duration-300 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={!fromStation || !toStation}
        >
          <FaSearch />
          <span>Search Trains</span>
        </button>
      </form>
    </div>
  );
};

export default TrainSearch; 