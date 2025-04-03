import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaTrain, FaClock, FaRupeeSign, FaMapMarkerAlt, FaRoute, FaChevronDown, FaChevronUp, FaInfoCircle, FaTicketAlt, FaCheck, FaArrowRight } from 'react-icons/fa';
import { MdAirlineSeatReclineNormal } from 'react-icons/md';

const TrainList = ({ trains, fromStation, toStation, classType }) => {
  const [expandedTrain, setExpandedTrain] = useState(null);

  // Get current date in YYYY-MM-DD format as fallback
  const getCurrentDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const formatTime = (time) => {
    if (!time) return 'N/A';
    try {
      return new Date(`2024-01-01T${time}`).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
    } catch (error) {
      console.error('Error formatting time:', error);
      return 'N/A';
    }
  };

  const calculateDuration = (fromTime, toTime, fromDay, toDay) => {
    try {
      // Handle missing inputs
      if (!fromTime || !toTime) {
        return { hours: 0, minutes: 0 };
      }
      
      // Ensure fromDay and toDay are valid numbers
      const startDay = Number.isInteger(parseInt(fromDay)) ? parseInt(fromDay) : 1;
      const endDay = Number.isInteger(parseInt(toDay)) ? parseInt(toDay) : 1;
      
      // Validate time format (should be HH:MM:SS or HH:MM)
      const timeRegex = /^([01]?[0-9]|2[0-3]):([0-5][0-9])(?::([0-5][0-9]))?$/;
      if (!timeRegex.test(fromTime) || !timeRegex.test(toTime)) {
        console.error('Invalid time format:', { fromTime, toTime });
        return { hours: 0, minutes: 0 };
      }
      
      // Create valid date objects
      const baseDate = '2024-01-';
      const startDate = new Date(`${baseDate}${startDay}T${fromTime}`);
      const endDate = new Date(`${baseDate}${endDay}T${toTime}`);
      
      // Check if dates are valid
      if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        console.error('Invalid date objects in calculateDuration', { fromTime, toTime, startDay, endDay });
        return { hours: 0, minutes: 0 };
      }
      
      // Handle days correctly - if endDay < startDay, assume crossing to next month
      let adjustedEndDate = new Date(endDate);
      if (endDay < startDay) {
        adjustedEndDate.setDate(adjustedEndDate.getDate() + 30);
      }
      
      // Calculate time difference in milliseconds
      const diff = adjustedEndDate - startDate;
      if (diff < 0) {
        // If still negative, adjust by adding days
        adjustedEndDate.setDate(adjustedEndDate.getDate() + (diff < 0 ? 1 : 0));
        const newDiff = adjustedEndDate - startDate;
        const hours = Math.floor(newDiff / (1000 * 60 * 60));
        const minutes = Math.floor((newDiff % (1000 * 60 * 60)) / (1000 * 60));
        return { hours, minutes };
      }
      
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      return { hours, minutes };
    } catch (error) {
      console.error('Error calculating duration:', error, { fromTime, toTime, fromDay, toDay });
      return { hours: 0, minutes: 0 };
    }
  };

  const formatDuration = (fromStation, toStation) => {
    if (!fromStation || !toStation) return '--';
    
    try {
      // Extract required values, providing fallbacks
      const departureTime = fromStation.departureTime || fromStation.arrivalTime;
      const arrivalTime = toStation.arrivalTime || toStation.departureTime;
      const fromDay = fromStation.day || 1;
      const toDay = toStation.day || 1;
      
      // Skip calculation if critical data is missing
      if (!departureTime || !arrivalTime) {
        return '--';
      }
      
      const duration = calculateDuration(departureTime, arrivalTime, fromDay, toDay);
      
      // Format the duration nicely
      if (duration.hours === 0 && duration.minutes === 0) {
        return '--';
      }
      
      return `${duration.hours}h ${duration.minutes}m`;
    } catch (error) {
      console.error('Error formatting duration:', error, { fromStation, toStation });
      return '--';
    }
  };

  const formatDistance = (distance) => {
    if (!distance && distance !== 0) return 'N/A';
    return `${distance} km`;
  };

  const getClassLabel = (classCode) => {
    const classLabels = {
      '1A': 'First AC',
      '2A': 'Second AC',
      '3A': 'Third AC',
      'SL': 'Sleeper',
      'CC': 'Chair Car',
      '2S': 'Second Sitting',
      'GN': 'General'
    };
    return classLabels[classCode] || classCode;
  };

  const getClassDescription = (classCode) => {
    const classDescriptions = {
      '1A': 'Most premium class with lockable, carpeted cabins',
      '2A': 'Air-conditioned coaches with 2-tier berths',
      '3A': 'Air-conditioned coaches with 3-tier berths',
      'SL': 'Non-AC coaches with 3-tier berths',
      'CC': 'Air-conditioned seating coaches',
      '2S': 'Non-AC seating coaches',
      'GN': 'Unreserved general coaches'
    };
    return classDescriptions[classCode] || '';
  };

  const toggleTrainDetails = (trainId) => {
    setExpandedTrain(expandedTrain === trainId ? null : trainId);
  };

  // Get the journey date from the URL or use current date
  const getJourneyDate = () => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('date') || getCurrentDate();
  };

  // Get the minimum fare considering class type if selected
  const getMinimumFare = (train) => {
    if (!train.journey?.fares) {
      // If fares are not available in journey object, calculate based on distance
      if (train.journey?.distance && train.farePerKm) {
        if (classType && train.farePerKm[classType]) {
          return Math.ceil(train.journey.distance * train.farePerKm[classType]);
        }
        
        // Find minimum fare across all classes
        const fares = Object.keys(train.farePerKm)
          .filter(cls => train.classes.includes(cls))
          .map(cls => Math.ceil(train.journey.distance * train.farePerKm[cls]));
          
        return fares.length > 0 ? Math.min(...fares) : 'N/A';
      }
      return 'N/A';
    }
    
    // If class type is selected, show that fare
    if (classType && train.journey.fares[classType]) {
      return train.journey.fares[classType];
    }
    
    // Otherwise show the minimum fare across all available classes
    const availableFares = Object.entries(train.journey.fares)
      .filter(([cls]) => train.classes.includes(cls))
      .map(([_, fare]) => fare);
      
    return availableFares.length > 0 ? Math.min(...availableFares) : 'N/A';
  };
  
  // Format fare with currency symbol
  const formatFare = (fare) => {
    if (fare === 'N/A' || fare === undefined) return 'N/A';
    return `₹${fare}`;
  };

  if (!trains || trains.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">No trains found for this route.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {trains.map((train) => (
        <div key={train._id} className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Train Header */}
          <div className="p-4 cursor-pointer hover:bg-gray-50" onClick={() => toggleTrainDetails(train._id)}>
            <div className="flex justify-between items-center">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <FaTrain className="text-blue-600" />
                  <h3 className="text-lg font-semibold">{train.trainName}</h3>
                  <span className="text-sm text-gray-500">({train.trainNumber})</span>
                </div>
                <p className="text-sm text-gray-600">{train.trainType}</p>
              </div>
              
              <div className="flex-1 text-center">
                <div className="flex items-center justify-center gap-8">
                  <div>
                    <p className="font-semibold">{formatTime(train.journey?.fromStation?.departureTime)}</p>
                    <p className="text-sm text-gray-600">{train.journey?.fromStation?.stationName}</p>
                  </div>
                  <div className="flex flex-col items-center">
                    <p className="text-sm text-gray-500">
                      {formatDuration(train.journey?.fromStation, train.journey?.toStation)}
                    </p>
                    <div className="w-24 h-0.5 bg-gray-300 my-1"></div>
                    <p className="text-xs text-gray-500">{formatDistance(train.journey?.distance)}</p>
                  </div>
                  <div>
                    <p className="font-semibold">{formatTime(train.journey?.toStation?.arrivalTime)}</p>
                    <p className="text-sm text-gray-600">{train.journey?.toStation?.stationName}</p>
                  </div>
                </div>
              </div>

              <div className="flex-1 flex justify-end items-center gap-4">
                <div>
                  <p className="text-sm text-gray-600">
                    {classType ? getClassLabel(classType) : 'Starts from'}
                  </p>
                  <p className="font-semibold text-green-600">
                    <FaRupeeSign className="inline" />
                    {formatFare(getMinimumFare(train))}
                  </p>
                </div>
                {expandedTrain === train._id ? <FaChevronUp /> : <FaChevronDown />}
              </div>
            </div>
            
            {/* Display class type if specified */}
            {classType && train.classes.includes(classType) && (
              <div className="mt-2 flex items-center gap-2 text-sm text-blue-700 bg-blue-50 px-3 py-1 rounded-full w-fit">
                <FaCheck size={12} /> {getClassLabel(classType)} available
              </div>
            )}
          </div>

          {/* Expanded Details */}
          {expandedTrain === train._id && train.journey && (
            <div className="border-t border-gray-200 p-4">
              {/* Route Warning - Show when displaying the full route instead of the specific route */}
              {train.journey.isFullRoute && fromStation && toStation && (
                <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md text-yellow-700 text-sm">
                  <div className="flex items-start">
                    <FaRoute className="mt-0.5 mr-2 flex-shrink-0" />
                    <div>
                      <p className="font-medium">Showing full train route</p>
                      <p>We couldn't find your exact stations or they're in the wrong order. Displaying the complete journey from the first to last station.</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Route Details */}
              <div className="mb-4">
                <h4 className="text-md font-semibold mb-2 flex items-center gap-2">
                  <FaRoute className="text-blue-600" />
                  Route Details
                </h4>
                <div className="space-y-2">
                  {train.stations.map((station, index) => {
                    const isFromStation = station.stationCode === train.journey.fromStation.stationCode;
                    const isToStation = station.stationCode === train.journey.toStation.stationCode;
                    const isIntermediateStation = !isFromStation && !isToStation;
                    const fromStationIndex = train.stations.findIndex(s => s.stationCode === train.journey.fromStation.stationCode);
                    const toStationIndex = train.stations.findIndex(s => s.stationCode === train.journey.toStation.stationCode);
                    const isInRoute = index >= fromStationIndex && index <= toStationIndex;

                    if (!isInRoute) return null;

                    return (
                      <div 
                        key={station.stationCode} 
                        className={`flex items-center gap-4 ${
                          isFromStation ? 'bg-blue-50' : 
                          isToStation ? 'bg-green-50' : ''
                        } p-2 rounded-lg`}
                      >
                        <div className="w-20">
                          <p className="text-sm font-semibold">Day {station.day || 'N/A'}</p>
                        </div>
                        <div className="w-32">
                          <p className="text-sm">{formatTime(station.arrivalTime)}</p>
                          <p className="text-sm">{formatTime(station.departureTime)}</p>
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">{station.stationName}</p>
                          <p className="text-xs text-gray-500">{station.stationCode}</p>
                        </div>
                        <div className="w-24 text-right">
                          <p className="text-sm">{formatDistance(station.distance)}</p>
                          {station.platform && (
                            <p className="text-xs text-gray-500">Platform {station.platform}</p>
                          )}
                        </div>
                        <div className="w-24 text-right">
                          {isFromStation && (
                            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                              Departure
                            </span>
                          )}
                          {isToStation && (
                            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                              Arrival
                            </span>
                          )}
                          {isIntermediateStation && (
                            <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded">
                              Stop
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Classes and Fares */}
              <div className="mt-6 border-t border-gray-100 pt-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Available Classes & Fares:</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {train.classes.map((cls) => (
                    <div key={cls} className="border border-gray-200 rounded-md p-3 hover:border-blue-500 transition-colors">
                      <p className="font-medium">{getClassLabel(cls)}</p>
                      <p className="text-green-600 font-semibold flex items-center">
                        <FaRupeeSign className="mr-1 text-xs" />
                        {train.journey.fares && train.journey.fares[cls] 
                          ? train.journey.fares[cls] 
                          : Math.ceil(train.journey.distance * train.farePerKm[cls])}
                      </p>
                      {/* Show available seats if available */}
                      {train.availableSeats && train.availableSeats[cls] && (
                        <p className="text-xs text-gray-500">
                          {train.availableSeats[cls]} seats available
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Amenities */}
              {train.amenities && train.amenities.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-md font-semibold mb-2">Amenities</h4>
                  <div className="flex flex-wrap gap-2">
                    {train.amenities.map((amenity) => (
                      <span key={amenity} className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm">
                        {amenity}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Booking Buttons */}
              <div className="mt-4 flex space-x-2">
                <Link
                  to={`/trains/${train._id}/${train.journey.fromStation.stationCode}/${train.journey.toStation.stationCode}/${getJourneyDate()}`}
                  className="bg-blue-100 text-blue-700 px-4 py-2 rounded-lg hover:bg-blue-200 transition-colors duration-300 text-sm flex items-center"
                >
                  <FaInfoCircle className="mr-1" /> View Details
                </Link>
                <Link
                  to={`/trains/${train._id}/${train.journey.fromStation.stationCode}/${train.journey.toStation.stationCode}/${getJourneyDate()}?book=true${classType ? `&class=${classType}` : ''}`}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-300 text-sm flex items-center"
                >
                  <FaTicketAlt className="mr-1" /> Book Now
                </Link>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default TrainList; 