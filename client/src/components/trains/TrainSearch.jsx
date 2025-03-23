import React, { useState, useEffect } from 'react';
import { FaSearch, FaExchangeAlt, FaCalendarAlt, FaTimes } from 'react-icons/fa';
import axios from 'axios';

const TrainSearch = ({ onSearch, initialValues }) => {
  const [searchParams, setSearchParams] = useState({
    fromStation: initialValues?.fromStation || '',
    toStation: initialValues?.toStation || '',
    date: initialValues?.date || new Date().toISOString().split('T')[0]
  });

  const [stations, setStations] = useState([]);
  const [filteredFromStations, setFilteredFromStations] = useState([]);
  const [filteredToStations, setFilteredToStations] = useState([]);
  const [showFromDropdown, setShowFromDropdown] = useState(false);
  const [showToDropdown, setShowToDropdown] = useState(false);

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
          setStations(Array.from(uniqueStations).map(station => JSON.parse(station)));
        }
      } catch (error) {
        console.error('Error fetching stations:', error);
      }
    };
    fetchStations();
  }, []);

  useEffect(() => {
    if (initialValues) {
      setSearchParams({
        fromStation: initialValues.fromStation || '',
        toStation: initialValues.toStation || '',
        date: initialValues.date || new Date().toISOString().split('T')[0]
      });
    }
  }, [initialValues]);

  const handleFromStationChange = (e) => {
    const value = e.target.value.toUpperCase();
    setSearchParams(prev => ({ ...prev, fromStation: value }));
    setFilteredFromStations(
      stations.filter(station => 
        station.code.includes(value) || 
        station.name.toUpperCase().includes(value)
      )
    );
    setShowFromDropdown(true);
  };

  const handleToStationChange = (e) => {
    const value = e.target.value.toUpperCase();
    setSearchParams(prev => ({ ...prev, toStation: value }));
    setFilteredToStations(
      stations.filter(station => 
        station.code.includes(value) || 
        station.name.toUpperCase().includes(value)
      )
    );
    setShowToDropdown(true);
  };

  const handleStationSelect = (type, station) => {
    setSearchParams(prev => ({
      ...prev,
      [type === 'from' ? 'fromStation' : 'toStation']: station.code
    }));
    if (type === 'from') {
      setShowFromDropdown(false);
    } else {
      setShowToDropdown(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(searchParams);
  };

  const handleSwapStations = () => {
    setSearchParams(prev => ({
      ...prev,
      fromStation: prev.toStation,
      toStation: prev.fromStation
    }));
  };

  const handleReset = () => {
    setSearchParams({
      fromStation: '',
      toStation: '',
      date: new Date().toISOString().split('T')[0]
    });
    onSearch({ fromStation: '', toStation: '', date: new Date().toISOString().split('T')[0] });
  };

  // Get tomorrow's date for min date in date picker
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];

  // Get date 4 months from now for max date
  const maxDate = new Date();
  maxDate.setMonth(maxDate.getMonth() + 4);
  const maxDateStr = maxDate.toISOString().split('T')[0];

  const hasSearchParams = searchParams.fromStation || searchParams.toStation;

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Search Trains</h2>
        {hasSearchParams && (
          <button
            onClick={handleReset}
            className="text-gray-500 hover:text-gray-700 flex items-center gap-1"
          >
            <FaTimes className="w-4 h-4" />
            <span>Reset</span>
          </button>
        )}
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* From Station */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              From Station
            </label>
            <input
              type="text"
              value={searchParams.fromStation}
              onChange={handleFromStationChange}
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
                    onClick={() => handleStationSelect('from', station)}
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
              disabled={!searchParams.fromStation && !searchParams.toStation}
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
              value={searchParams.toStation}
              onChange={handleToStationChange}
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
                    onClick={() => handleStationSelect('to', station)}
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
              value={searchParams.date}
              onChange={(e) => setSearchParams(prev => ({ ...prev, date: e.target.value }))}
              min={minDate}
              max={maxDateStr}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-10"
            />
            <FaCalendarAlt className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>
        </div>

        {/* Search Button */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors duration-300 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={!searchParams.fromStation || !searchParams.toStation}
        >
          <FaSearch />
          <span>Search Trains</span>
        </button>
      </form>

      {/* Click outside handler */}
      <div 
        className="fixed inset-0 z-0" 
        style={{ display: (showFromDropdown || showToDropdown) ? 'block' : 'none' }}
        onClick={() => {
          setShowFromDropdown(false);
          setShowToDropdown(false);
        }}
      />
    </div>
  );
};

export default TrainSearch; 