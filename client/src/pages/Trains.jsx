import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSearchParams } from 'react-router-dom';
import TrainSearch from '../components/trains/TrainSearch';
import TrainList from '../components/trains/TrainList';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { toast } from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Popular stations for quick selection
const POPULAR_STATIONS = [
  { code: 'NDLS', name: 'New Delhi' },
  { code: 'HWH', name: 'Howrah' },
  { code: 'MMCT', name: 'Mumbai Central' },
  { code: 'MAS', name: 'Chennai Central' },
  { code: 'SBC', name: 'Bangalore' },
  { code: 'PRYJ', name: 'Prayagraj Junction' },
  { code: 'BZA', name: 'Vijayawada Junction' }
];

const Trains = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [trains, setTrains] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [apiRetries, setApiRetries] = useState(0);

  // Get current date in YYYY-MM-DD format
  const getCurrentDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Get search params from URL with current date as default
  const fromStation = searchParams.get('fromStation') || '';
  const toStation = searchParams.get('toStation') || '';
  const date = searchParams.get('date') || getCurrentDate();
  const classType = searchParams.get('classType') || '';

  useEffect(() => {
    // Load initial trains or search results based on URL parameters
    if (fromStation && toStation) {
      searchTrains({
        fromStation,
        toStation,
        date,
        classType
      });
    } else {
      // Load all trains or popular routes
      fetchInitialTrains();
    }
  }, []);

  const fetchInitialTrains = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.get(`${API_URL}/trains`, {
        params: { limit: 20 }
      });
      
      if (response.data && response.data.data) {
        // Transform each train to include journey details for the entire route
        const transformedTrains = response.data.data.map(train => {
          // Always use first and last station for full journey details
          const firstStation = train.stations[0];
          const lastStation = train.stations[train.stations.length - 1];
          
          // Calculate duration for the entire journey
          const duration = calculateDuration(
            firstStation.departureTime,
            lastStation.arrivalTime,
            firstStation.day,
            lastStation.day
          );
          
          // Calculate total distance
          const totalDistance = lastStation.distance - firstStation.distance;
          
          // Calculate fares for all available classes for the entire journey
          const fares = {};
          train.classes.forEach(cls => {
            fares[cls] = Math.ceil(totalDistance * train.farePerKm[cls]);
          });
          
          return {
            ...train,
            journey: {
              fromStation: firstStation,
              toStation: lastStation,
              distance: totalDistance,
              duration,
              intermediateStations: train.stations.slice(1, -1),
              fares
            }
          };
        });
        
        setTrains(transformedTrains);
      } else {
        setTrains([]);
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching initial trains:', error);
      handleApiError(error);
    }
  };

  const handleApiError = (error) => {
    setLoading(false);
    
    if (error.code === 'ERR_NETWORK' && apiRetries < 3) {
      // Network error - retry up to 3 times with increasing delay
      setApiRetries(prev => prev + 1);
      const retryDelay = 1000 * apiRetries; // 1s, 2s, 3s
      
      toast.error(`Connection error. Retrying in ${retryDelay/1000} seconds...`);
      
      setTimeout(() => {
        if (fromStation && toStation) {
          searchTrains({
            fromStation,
            toStation,
            date,
            classType
          });
        } else {
          fetchInitialTrains();
        }
      }, retryDelay);
      
      setError("Server connection error. Retrying...");
    } else if (error.response) {
      // Server responded with error
      const statusCode = error.response.status;
      if (statusCode === 404) {
        setError("No trains found for this route. Please try different stations.");
      } else if (statusCode >= 500) {
        setError("Server error. Please try again later.");
      } else {
        setError(error.response.data?.message || "Error fetching trains");
      }
    } else {
      // Other errors
      setError("Unable to connect to the server. Please check your internet connection and try again.");
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

  const searchTrains = async (params) => {
    try {
      setLoading(true);
      setError(null);
      setApiRetries(0);
      
      // Validate station codes
      if (!params.fromStation || !params.toStation) {
        toast.error('Please select both stations');
        setLoading(false);
        return;
      }

      // Ensure date is provided, use current date if not
      const searchDate = params.date || getCurrentDate();
      
      // Update URL with search params
      setSearchParams({ 
        fromStation: params.fromStation, 
        toStation: params.toStation, 
        date: searchDate,
        ...(params.classType && { classType: params.classType })
      });

      const response = await axios.get(`${API_URL}/trains/search`, {
        params: {
          fromStation: params.fromStation,
          toStation: params.toStation,
          date: searchDate,
          ...(params.classType && { classType: params.classType })
        }
      });

      if (response.data && response.data.data) {
        // Transform the train data to include journey details
        const transformedTrains = response.data.data.map(train => {
          // Try to find specific route stations
          const fromStationIndex = train.stations.findIndex(s => s.stationCode === params.fromStation);
          const toStationIndex = train.stations.findIndex(s => s.stationCode === params.toStation);
          
          // If we can't find specific stations or they're in wrong order, use full route
          if (fromStationIndex === -1 || toStationIndex === -1 || fromStationIndex >= toStationIndex) {
            // Use full route instead
            const firstStation = train.stations[0];
            const lastStation = train.stations[train.stations.length - 1];
            
            // Calculate duration for the entire journey
            const duration = calculateDuration(
              firstStation.departureTime,
              lastStation.arrivalTime,
              firstStation.day,
              lastStation.day
            );
            
            // Calculate total distance
            const totalDistance = lastStation.distance - firstStation.distance;
            
            // Calculate fares for all available classes for the entire journey
            const fares = {};
            train.classes.forEach(cls => {
              fares[cls] = Math.ceil(totalDistance * train.farePerKm[cls]);
            });
            
            return {
              ...train,
              journey: {
                fromStation: firstStation,
                toStation: lastStation,
                distance: totalDistance,
                duration,
                intermediateStations: train.stations.slice(1, -1),
                fares,
                isFullRoute: true // Flag to indicate we're showing the full route
              }
            };
          }
          
          // Use specific route information
          const fromStation = train.stations[fromStationIndex];
          const toStation = train.stations[toStationIndex];
          
          // Calculate duration between selected stations
          const duration = calculateDuration(
            fromStation.departureTime,
            toStation.arrivalTime,
            fromStation.day,
            toStation.day
          );
          
          // Calculate distance between selected stations
          const distance = toStation.distance - fromStation.distance;
          
          // Calculate fares for the selected journey
          const fares = {};
          train.classes.forEach(cls => {
            fares[cls] = Math.ceil(distance * train.farePerKm[cls]);
          });
          
          return {
            ...train,
            journey: {
              fromStation,
              toStation,
              distance,
              duration,
              fares,
              intermediateStations: train.stations.slice(fromStationIndex + 1, toStationIndex),
              isFullRoute: false
            }
          };
        });
        
        setTrains(transformedTrains);
        
        if (transformedTrains.length === 0) {
          setError('No trains found for this route and date. Please try different stations or dates.');
        }
      } else {
        setTrains([]);
        setError('No trains found. Please try a different search.');
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Error searching trains:', error);
      handleApiError(error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <TrainSearch
          onSearch={searchTrains}
          popularStations={POPULAR_STATIONS}
          initialValues={{ 
            fromStation, 
            toStation, 
            date: date || getCurrentDate(),
            classType
          }}
        />

        {loading ? (
          <LoadingSpinner size="large" className="py-20" />
        ) : error ? (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg my-4 text-center">
            <p className="text-lg">{error}</p>
            <button 
              onClick={() => searchTrains({
                fromStation, 
                toStation, 
                date: date || getCurrentDate(),
                classType
              })}
              className="mt-3 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
            >
              Retry Search
            </button>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-gray-800">
                {fromStation && toStation ? (
                  `Trains from ${fromStation} to ${toStation}`
                ) : (
                  'All Available Trains'
                )}
              </h3>
              <p className="text-gray-600">
                {trains.length} trains found
                {fromStation && toStation && date && ` • ${new Date(date).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}`}
                {classType && ` • Class: ${classType}`}
              </p>
            </div>
            
            <TrainList
              trains={trains}
              fromStation={fromStation}
              toStation={toStation}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default Trains;