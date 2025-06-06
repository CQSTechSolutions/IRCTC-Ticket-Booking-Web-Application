import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const SearchForm = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("trains");
  const [fromStation, setFromStation] = useState("");
  const [toStation, setToStation] = useState("");
  const [departDate, setDepartDate] = useState(getCurrentDate());
  const [journeyClass, setJourneyClass] = useState("");
  const [quota, setQuota] = useState("GENERAL");
  const [swapAnimation, setSwapAnimation] = useState(false);
  const [showFromDropdown, setShowFromDropdown] = useState(false);
  const [showToDropdown, setShowToDropdown] = useState(false);
  const [searchFromTerm, setSearchFromTerm] = useState("");
  const [searchToTerm, setSearchToTerm] = useState("");
  const [validation, setValidation] = useState({
    fromStation: true,
    toStation: true,
    departDate: true
  });

  // Get current date in YYYY-MM-DD format
  function getCurrentDate() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  // Get one year from now as max date
  function getMaxDate() {
    const today = new Date();
    today.setFullYear(today.getFullYear() + 1);
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  // Sample stations data - in a real app, this would come from an API
  const stations = [
    { code: "NDLS", name: "New Delhi" },
    { code: "MAS", name: "Chennai Central" },
    { code: "HWH", name: "Howrah Junction" },
    { code: "BCT", name: "Mumbai Central" },
    { code: "SBC", name: "Bengaluru City Junction" },
    { code: "CSTM", name: "Chhatrapati Shivaji Terminus" },
    { code: "LKO", name: "Lucknow" },
    { code: "JAT", name: "Jammu Tawi" },
    { code: "ADI", name: "Ahmedabad Junction" },
    { code: "BPL", name: "Bhopal Junction" },
    { code: "CNB", name: "Kanpur Central" },
    { code: "PNBE", name: "Patna Junction" },
  ];

  // Class types with descriptions
  const classTypes = [
    { code: "1A", name: "AC First Class (1A)", description: "Most premium class with lockable, carpeted cabins" },
    { code: "2A", name: "AC 2 Tier (2A)", description: "Air-conditioned coaches with 2-tier berths" },
    { code: "3A", name: "AC 3 Tier (3A)", description: "Air-conditioned coaches with 3-tier berths" },
    { code: "SL", name: "Sleeper (SL)", description: "Non-AC coaches with 3-tier berths" },
    { code: "CC", name: "Chair Car (CC)", description: "Air-conditioned seating coaches" },
    { code: "2S", name: "Second Sitting (2S)", description: "Non-AC seating coaches" },
    { code: "GN", name: "General (GN)", description: "Unreserved general coaches" }
  ];

  const filteredFromStations = stations.filter(station => 
    station.name.toLowerCase().includes(searchFromTerm.toLowerCase()) || 
    station.code.toLowerCase().includes(searchFromTerm.toLowerCase())
  );

  const filteredToStations = stations.filter(station => 
    station.name.toLowerCase().includes(searchToTerm.toLowerCase()) || 
    station.code.toLowerCase().includes(searchToTerm.toLowerCase())
  );

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (!event.target.closest('.station-dropdown')) {
        setShowFromDropdown(false);
        setShowToDropdown(false);
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const swapStations = () => {
    setSwapAnimation(true);
    setTimeout(() => {
      const temp = fromStation;
      setFromStation(toStation);
      setToStation(temp);
      setSearchFromTerm(searchToTerm);
      setSearchToTerm(searchFromTerm);
      setSwapAnimation(false);
    }, 300);
  };

  const handleFromStationSelect = (station) => {
    setFromStation(station.code);
    setSearchFromTerm(`${station.code} - ${station.name}`);
    setShowFromDropdown(false);
    setValidation({...validation, fromStation: true});
  };

  const handleToStationSelect = (station) => {
    setToStation(station.code);
    setSearchToTerm(`${station.code} - ${station.name}`);
    setShowToDropdown(false);
    setValidation({...validation, toStation: true});
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    
    // Validate inputs
    const newValidation = {
      fromStation: !!fromStation,
      toStation: !!toStation,
      departDate: !!departDate
    };
    
    setValidation(newValidation);
    
    if (newValidation.fromStation && newValidation.toStation && newValidation.departDate) {
      // Navigate to trains page with search params
      navigate(`/trains?fromStation=${fromStation}&toStation=${toStation}&date=${departDate}${journeyClass ? `&class=${journeyClass}` : ''}`);
    }
  };

  const handlePNRSubmit = (e) => {
    e.preventDefault();
    const pnrInput = document.getElementById('pnr-input').value;
    if (pnrInput && pnrInput.length === 10) {
      navigate(`/booking/confirmation/${pnrInput}`);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200 transform transition-all duration-300 hover:shadow-blue-100">
      {/* Tabs */}
      <div className="flex border-b">
        <button 
          className={`flex-1 py-4 px-4 text-center font-medium relative overflow-hidden ${activeTab === "trains" ? "text-white" : "bg-gray-50 text-gray-700 hover:bg-gray-100"}`}
          onClick={() => setActiveTab("trains")}
        >
          {activeTab === "trains" && (
            <span className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-700 transform transition-transform duration-300"></span>
          )}
          <div className={`flex items-center justify-center relative z-10 transition-all duration-300 ${activeTab === "trains" ? "scale-110" : ""}`}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 002 2h14a2 2 0 002-2V7a2 2 0 00-2-2H5z" />
            </svg>
            BOOK TICKET
          </div>
        </button>
        <button 
          className={`flex-1 py-4 px-4 text-center font-medium relative overflow-hidden ${activeTab === "pnr" ? "text-white" : "bg-gray-50 text-gray-700 hover:bg-gray-100"}`}
          onClick={() => setActiveTab("pnr")}
        >
          {activeTab === "pnr" && (
            <span className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-700 transform transition-transform duration-300"></span>
          )}
          <div className={`flex items-center justify-center relative z-10 transition-all duration-300 ${activeTab === "pnr" ? "scale-110" : ""}`}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            PNR STATUS
          </div>
        </button>
        <button 
          className={`flex-1 py-4 px-4 text-center font-medium relative overflow-hidden ${activeTab === "charts" ? "text-white" : "bg-gray-50 text-gray-700 hover:bg-gray-100"}`}
          onClick={() => setActiveTab("charts")}
        >
          {activeTab === "charts" && (
            <span className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-700 transform transition-transform duration-300"></span>
          )}
          <div className={`flex items-center justify-center relative z-10 transition-all duration-300 ${activeTab === "charts" ? "scale-110" : ""}`}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            CHARTS / VACANCY
          </div>
        </button>
      </div>

      {/* Train Search Form */}
      {activeTab === "trains" && (
        <form onSubmit={handleSearchSubmit} className="p-8">
          <div className="grid md:grid-cols-2 gap-8 relative">
            <div className={`relative station-dropdown ${swapAnimation ? 'animate-fade-out' : 'animate-fade-in'}`}>
              <label className="block text-sm font-medium text-gray-700 mb-2">From</label>
              <div className="relative">
                <div className="absolute left-0 top-0 h-full flex items-center pl-4 pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <input 
                  type="text" 
                  value={searchFromTerm}
                  onChange={(e) => {
                    setSearchFromTerm(e.target.value);
                    setShowFromDropdown(true);
                  }}
                  onFocus={() => setShowFromDropdown(true)}
                  placeholder="Search Origin Station" 
                  className={`w-full p-4 pl-12 border ${!validation.fromStation ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm transition duration-300`}
                  required
                />
                {!validation.fromStation && (
                  <p className="text-red-500 text-sm mt-1">Please select a departure station</p>
                )}
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
                {showFromDropdown && (
                  <div className="absolute z-50 mt-1 w-full bg-white shadow-lg rounded-lg border border-gray-200 max-h-60 overflow-y-auto">
                    {filteredFromStations.length > 0 ? (
                      filteredFromStations.map((station, index) => (
                        <div 
                          key={index} 
                          className="p-3 hover:bg-blue-50 cursor-pointer flex items-center border-b border-gray-100"
                          onClick={() => handleFromStationSelect(station)}
                        >
                          <div className="flex-shrink-0 bg-blue-100 rounded-full p-2 mr-3">
                            <span className="text-blue-800 font-bold">{station.code}</span>
                          </div>
                          <div>
                            <p className="font-medium">{station.name}</p>
                            <p className="text-xs text-gray-500">{station.code}</p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-3 text-center text-gray-500">No stations found</div>
                    )}
                  </div>
                )}
              </div>
            </div>
            
            {/* Swap Button */}
            <button 
              type="button"
              onClick={swapStations}
              className="absolute left-1/2 top-10 transform -translate-x-1/2 z-10 bg-white rounded-full w-10 h-10 shadow-md flex items-center justify-center border border-gray-200 hover:shadow-lg transition-all duration-300 hover:border-blue-500 hover:bg-blue-50 group"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600 group-hover:rotate-180 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
            </button>
            
            <div className={`relative station-dropdown ${swapAnimation ? 'animate-fade-out' : 'animate-fade-in'}`}>
              <label className="block text-sm font-medium text-gray-700 mb-2">To</label>
              <div className="relative">
                <div className="absolute left-0 top-0 h-full flex items-center pl-4 pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <input 
                  type="text" 
                  value={searchToTerm}
                  onChange={(e) => {
                    setSearchToTerm(e.target.value);
                    setShowToDropdown(true);
                  }}
                  onFocus={() => setShowToDropdown(true)}
                  placeholder="Search Destination Station" 
                  className={`w-full p-4 pl-12 border ${!validation.toStation ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm transition duration-300`}
                  required
                />
                {!validation.toStation && (
                  <p className="text-red-500 text-sm mt-1">Please select a destination station</p>
                )}
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
                {showToDropdown && (
                  <div className="absolute z-50 mt-1 w-full bg-white shadow-lg rounded-lg border border-gray-200 max-h-60 overflow-y-auto">
                    {filteredToStations.length > 0 ? (
                      filteredToStations.map((station, index) => (
                        <div 
                          key={index} 
                          className="p-3 hover:bg-blue-50 cursor-pointer flex items-center border-b border-gray-100"
                          onClick={() => handleToStationSelect(station)}
                        >
                          <div className="flex-shrink-0 bg-blue-100 rounded-full p-2 mr-3">
                            <span className="text-blue-800 font-bold">{station.code}</span>
                          </div>
                          <div>
                            <p className="font-medium">{station.name}</p>
                            <p className="text-xs text-gray-500">{station.code}</p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-3 text-center text-gray-500">No stations found</div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mt-8">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Date of Journey</label>
              <div className="relative">
                <div className="absolute left-0 top-0 h-full flex items-center pl-4 pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <input 
                  type="date" 
                  value={departDate}
                  onChange={(e) => {
                    setDepartDate(e.target.value);
                    setValidation({...validation, departDate: true});
                  }}
                  min={getCurrentDate()}
                  max={getMaxDate()}
                  className={`w-full p-4 pl-12 border ${!validation.departDate ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm transition duration-300`}
                  required
                />
                {!validation.departDate && (
                  <p className="text-red-500 text-sm mt-1">Please select a valid date</p>
                )}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Class</label>
              <div className="relative">
                <div className="absolute left-0 top-0 h-full flex items-center pl-4 pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <select 
                  value={journeyClass}
                  onChange={(e) => setJourneyClass(e.target.value)}
                  className="w-full p-4 pl-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm appearance-none bg-none transition duration-300"
                >
                  <option value="">All Classes</option>
                  {classTypes.map(cls => (
                    <option key={cls.code} value={cls.code}>{cls.name}</option>
                  ))}
                </select>
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
              {journeyClass && (
                <p className="text-sm text-gray-600 mt-1">
                  {classTypes.find(c => c.code === journeyClass)?.description}
                </p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Quota</label>
              <div className="relative">
                <div className="absolute left-0 top-0 h-full flex items-center pl-4 pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <select 
                  value={quota}
                  onChange={(e) => setQuota(e.target.value)}
                  className="w-full p-4 pl-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm appearance-none bg-none transition duration-300"
                >
                  <option value="GENERAL">GENERAL</option>
                  <option value="TATKAL">TATKAL</option>
                  <option value="LADIES">LADIES</option>
                  <option value="LOWER BERTH">LOWER BERTH/SR.CITIZEN</option>
                  <option value="DIVYAANG">PERSON WITH DISABILITY</option>
                </select>
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap gap-4">
            <label className="inline-flex items-center hover:bg-gray-50 p-2 rounded-lg cursor-pointer transition-colors duration-300 group">
              <input type="checkbox" id="flexible-dates" className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer transition-colors duration-300" />
              <span className="ml-3 text-sm text-gray-700 group-hover:text-blue-700 transition-colors duration-300">Flexible With Date</span>
            </label>
            <label className="inline-flex items-center hover:bg-gray-50 p-2 rounded-lg cursor-pointer transition-colors duration-300 group">
              <input type="checkbox" id="train-with-availability" className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer transition-colors duration-300" />
              <span className="ml-3 text-sm text-gray-700 group-hover:text-blue-700 transition-colors duration-300">Train With Available Berth</span>
            </label>
            <label className="inline-flex items-center hover:bg-gray-50 p-2 rounded-lg cursor-pointer transition-colors duration-300 group">
              <input type="checkbox" id="railway-pass" className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer transition-colors duration-300" />
              <span className="ml-3 text-sm text-gray-700 group-hover:text-blue-700 transition-colors duration-300">Railway Pass Concession</span>
            </label>
          </div>

          <div className="mt-8 flex justify-center">
            <button 
              type="submit"
              className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold py-4 px-12 rounded-lg shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-orange-500/50 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-opacity-50"
            >
              Search Trains
            </button>
          </div>
        </form>
      )}

      {/* PNR Status Tab */}
      {activeTab === "pnr" && (
        <form onSubmit={handlePNRSubmit} className="p-8">
          <div className="max-w-md mx-auto">
            <label className="block text-sm font-medium text-gray-700 mb-2">PNR Number</label>
            <div className="relative">
              <div className="absolute left-0 top-0 h-full flex items-center pl-4 pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                </svg>
              </div>
              <input 
                type="text" 
                id="pnr-input"
                placeholder="Enter 10 digit PNR number" 
                pattern="[0-9]{10}"
                className="w-full p-4 pl-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm transition duration-300" 
                required
              />
            </div>
            <div className="mt-8 flex justify-center">
              <button 
                type="submit"
                className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold py-4 px-12 rounded-lg shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-orange-500/50 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-opacity-50"
              >
                Get PNR Status
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Charts/Vacancy Tab */}
      {activeTab === "charts" && (
        <form className="p-8">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Train Number</label>
              <div className="relative">
                <div className="absolute left-0 top-0 h-full flex items-center pl-4 pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <input 
                  type="text" 
                  placeholder="Enter Train Number" 
                  className="w-full p-4 pl-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm transition duration-300" 
                  required
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Journey Date</label>
              <div className="relative">
                <div className="absolute left-0 top-0 h-full flex items-center pl-4 pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <input 
                  type="date" 
                  min={getCurrentDate()}
                  max={getMaxDate()}
                  className="w-full p-4 pl-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm transition duration-300" 
                  required
                />
              </div>
            </div>
          </div>
          
          <div className="mt-8">
            <label className="block text-sm font-medium text-gray-700 mb-2">Coach Class</label>
            <div className="grid grid-cols-3 md:grid-cols-7 gap-2">
              {classTypes.map(cls => (
                <label key={cls.code} className="relative px-3 py-2 cursor-pointer">
                  <input type="radio" name="classType" value={cls.code} className="peer sr-only" />
                  <div className="peer-checked:bg-blue-500 peer-checked:text-white bg-gray-100 text-gray-800 text-center rounded-lg p-2 transition-colors duration-200 hover:bg-gray-200">
                    <div className="font-semibold">{cls.code}</div>
                    <div className="text-xs">{cls.name.split(' ')[0]}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>
          
          <div className="mt-8 flex justify-center">
            <button 
              type="submit"
              className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold py-4 px-12 rounded-lg shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-orange-500/50 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-opacity-50"
            >
              Get Vacancy
            </button>
          </div>
        </form>
      )}

      {/* CSS Animations */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes fade-out {
          0% { opacity: 1; }
          100% { opacity: 0; }
        }
        .animate-fade-out {
          animation: fade-out 0.3s ease-out forwards;
        }
        
        @keyframes fade-in {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out forwards;
        }
      ` }} />
    </div>
  );
};

export default SearchForm; 