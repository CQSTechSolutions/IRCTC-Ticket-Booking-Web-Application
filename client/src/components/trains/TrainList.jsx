import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaTrain, FaClock, FaRupeeSign, FaMapMarkerAlt, FaRoute, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { MdAirlineSeatReclineNormal } from 'react-icons/md';

const TrainList = ({ trains, fromStation, toStation }) => {
  const [expandedTrain, setExpandedTrain] = useState(null);

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
      const startDate = new Date(`2024-01-${fromDay}T${fromTime}`);
      const endDate = new Date(`2024-01-${toDay}T${toTime}`);
      const diff = endDate - startDate;
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      return { hours, minutes };
    } catch (error) {
      console.error('Error calculating duration:', error);
      return { hours: 0, minutes: 0 };
    }
  };

  const formatDuration = (fromStation, toStation) => {
    if (!fromStation || !toStation) return 'N/A';
    try {
      const duration = calculateDuration(
        fromStation.departureTime || fromStation.arrivalTime,
        toStation.arrivalTime || toStation.departureTime,
        fromStation.day,
        toStation.day
      );
      return `${duration.hours}h ${duration.minutes}m`;
    } catch (error) {
      console.error('Error formatting duration:', error);
      return 'N/A';
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

  const toggleTrainDetails = (trainId) => {
    setExpandedTrain(expandedTrain === trainId ? null : trainId);
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
                  <p className="text-sm text-gray-600">Starts from</p>
                  <p className="font-semibold text-green-600">
                    <FaRupeeSign className="inline" />
                    {train.journey?.fares ? Math.min(...Object.values(train.journey.fares)) : 'N/A'}
                  </p>
                </div>
                {expandedTrain === train._id ? <FaChevronUp /> : <FaChevronDown />}
              </div>
            </div>
          </div>

          {/* Expanded Details */}
          {expandedTrain === train._id && train.journey && (
            <div className="border-t border-gray-200 p-4">
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
              <div>
                <h4 className="text-md font-semibold mb-2 flex items-center gap-2">
                  <MdAirlineSeatReclineNormal className="text-blue-600" />
                  Available Classes
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {train.classes.map((classType) => (
                    <div key={classType} className="bg-gray-50 p-3 rounded-lg">
                      <p className="font-medium">{getClassLabel(classType)}</p>
                      <p className="text-green-600 font-semibold">
                        <FaRupeeSign className="inline" />
                        {train.journey.fares?.[classType] || 'N/A'}
                      </p>
                      <p className="text-sm text-gray-500">
                        {train.availableSeats?.[classType] || 0} seats
                      </p>
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
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default TrainList; 