import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaTrain, FaClock, FaRupeeSign, FaMapMarkerAlt, FaRoute } from 'react-icons/fa';
import { MdAirlineSeatReclineNormal } from 'react-icons/md';

const TrainList = ({ trains, fromStation, toStation }) => {
  const [expandedTrain, setExpandedTrain] = useState(null);

  const formatTime = (time) => {
    return time ? new Date(`2024-01-01T${time}`).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    }) : 'N/A';
  };

  const formatDuration = (duration) => {
    if (!duration) return 'N/A';
    return `${duration.hours}h ${duration.minutes}m`;
  };

  if (!trains || trains.length === 0) {
    return (
      <div className="text-center py-10">
        <div className="text-gray-500 text-xl">No trains found</div>
        <p className="text-gray-400 mt-2">
          {fromStation && toStation 
            ? 'Try searching with different stations or dates'
            : 'No trains are currently available'}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {trains.map((train) => {
        if (!train.journey) return null;
        const { fromStation: departureStation, toStation: arrivalStation, duration, distance, intermediateStations, fares } = train.journey;

        return (
          <div key={train._id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
            <div className="p-6">
              {/* Train Header */}
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 flex items-center">
                    <FaTrain className="text-blue-600 mr-2" />
                    {train.trainName}
                  </h3>
                  <p className="text-gray-500 text-sm">{train.trainNumber} • {train.trainType}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">Runs on</p>
                  <div className="flex gap-1 mt-1">
                    {Object.entries(train.runsOnDays).map(([day, runs]) => (
                      <span
                        key={day}
                        className={`text-xs px-1 rounded ${
                          runs 
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-400'
                        }`}
                      >
                        {day[0].toUpperCase()}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Time and Duration */}
              <div className="flex justify-between items-center mb-6">
                <div className="text-center flex-1">
                  <p className="text-2xl font-bold text-gray-800">{formatTime(departureStation.departureTime)}</p>
                  <div className="flex items-center justify-center gap-1">
                    <FaMapMarkerAlt className="text-gray-400" />
                    <p className="text-sm text-gray-600">{departureStation.stationName}</p>
                  </div>
                  <p className="text-xs text-gray-500">Day {departureStation.day}</p>
                </div>
                <div className="flex-1 px-4">
                  <div className="flex items-center justify-center">
                    <div className="h-[2px] flex-1 bg-gray-300"></div>
                    <div className="px-2 text-gray-500 text-sm flex items-center">
                      <FaClock className="mr-1" />
                      {formatDuration(duration)}
                    </div>
                    <div className="h-[2px] flex-1 bg-gray-300"></div>
                  </div>
                  <p className="text-center text-sm text-gray-500 mt-1">{distance} km</p>
                </div>
                <div className="text-center flex-1">
                  <p className="text-2xl font-bold text-gray-800">{formatTime(arrivalStation.arrivalTime)}</p>
                  <div className="flex items-center justify-center gap-1">
                    <FaMapMarkerAlt className="text-gray-400" />
                    <p className="text-sm text-gray-600">{arrivalStation.stationName}</p>
                  </div>
                  <p className="text-xs text-gray-500">Day {arrivalStation.day}</p>
                </div>
              </div>

              {/* Intermediate Stations */}
              {intermediateStations.length > 0 && (
                <div className="mb-4">
                  <button
                    onClick={() => setExpandedTrain(expandedTrain === train._id ? null : train._id)}
                    className="flex items-center text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    <FaRoute className="mr-1" />
                    {intermediateStations.length} Intermediate Stations
                  </button>
                  {expandedTrain === train._id && (
                    <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {intermediateStations.map((station, index) => (
                          <div key={index} className="text-sm p-2 bg-white rounded border border-gray-200">
                            <div className="font-medium">{station.stationName}</div>
                            <div className="text-gray-500 text-xs">
                              {formatTime(station.arrivalTime)} - {formatTime(station.departureTime)}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Classes and Booking */}
              <div className="border-t pt-4">
                <div className="flex justify-between items-center flex-wrap gap-4">
                  <div className="flex flex-wrap gap-2">
                    {train.classes.map((cls) => (
                      <div key={cls} className="flex items-center bg-gray-100 px-3 py-1 rounded">
                        <MdAirlineSeatReclineNormal className="text-blue-600 mr-1" />
                        <span className="text-sm font-medium">{cls}</span>
                        <span className="text-xs text-gray-500 ml-1">
                          ({train.availableSeats[cls]} seats)
                        </span>
                        <span className="ml-2 text-sm font-medium text-green-600">
                          ₹{fares[cls]}
                        </span>
                      </div>
                    ))}
                  </div>
                  <Link
                    to={`/booking/${train._id}?from=${departureStation.stationCode}&to=${arrivalStation.stationCode}`}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-300"
                  >
                    Book Now
                  </Link>
                </div>
              </div>

              {/* Amenities */}
              {train.amenities && train.amenities.length > 0 && (
                <div className="mt-4 pt-4 border-t">
                  <p className="text-sm text-gray-600 mb-2">Amenities:</p>
                  <div className="flex flex-wrap gap-2">
                    {train.amenities.map((amenity, index) => (
                      <span key={index} className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded">
                        {amenity}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default TrainList; 