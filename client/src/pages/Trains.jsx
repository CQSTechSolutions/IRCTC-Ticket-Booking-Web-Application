import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSearchParams } from 'react-router-dom';
import TrainSearch from '../components/trains/TrainSearch';
import TrainList from '../components/trains/TrainList';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { toast } from 'react-hot-toast';

const API_BASE_URL = 'http://localhost:3000/api';

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

  const fetchAllTrains = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`${API_BASE_URL}/trains`);
      
      if (response.data?.success && response.data.data) {
        // Transform each train to include journey details
        const transformedTrains = response.data.data.map(train => {
          const firstStation = train.stations[0];
          const lastStation = train.stations[train.stations.length - 1];
          
          // Calculate duration
          const duration = calculateDuration(
            firstStation.departureTime,
            lastStation.arrivalTime,
            firstStation.day,
            lastStation.day
          );
          
          return {
            ...train,
            journey: {
              fromStation: firstStation,
              toStation: lastStation,
              distance: lastStation.distance - firstStation.distance,
              duration,
              intermediateStations: train.stations.slice(1, -1)
            }
          };
        });
        
        setTrains(transformedTrains);
      } else {
        setTrains([]);
        setError('No trains available');
      }
    } catch (error) {
      console.error('Error fetching trains:', error);
      setError('Failed to fetch trains. Please try again.');
      toast.error(error.response?.data?.message || 'Failed to fetch trains');
      setTrains([]);
    } finally {
      setLoading(false);
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
      
      // Validate station codes
      if (!params.fromStation || !params.toStation) {
        toast.error('Please select both stations');
        return;
      }

      // Ensure date is provided, use current date if not
      const searchDate = params.date || getCurrentDate();
      
      // Update URL with search params
      setSearchParams({ 
        fromStation: params.fromStation, 
        toStation: params.toStation, 
        date: searchDate 
      });

      const response = await axios.get(`${API_BASE_URL}/trains/search`, {
        params: {
          fromStation: params.fromStation,
          toStation: params.toStation,
          date: searchDate
        }
      });

      if (response.data?.success && response.data.data) {
        // Transform the response data to include proper journey details
        const transformedTrains = response.data.data.map(train => {
          const fromStationIndex = train.stations.findIndex(s => s.stationCode === params.fromStation);
          const toStationIndex = train.stations.findIndex(s => s.stationCode === params.toStation);
          
          if (fromStationIndex === -1 || toStationIndex === -1) return null;
          
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
              intermediateStations: train.stations.slice(fromStationIndex + 1, toStationIndex)
            }
          };
        }).filter(Boolean); // Remove null entries
        
        setTrains(transformedTrains);
        
        if (transformedTrains.length === 0) {
          toast.error('No trains found for this route');
        }
      } else {
        setTrains([]);
        setError('No trains available for this route');
      }
    } catch (error) {
      console.error('Error searching trains:', error);
      const errorMessage = error.response?.data?.message || 
                          'Failed to search trains. Please try again later.';
      setError(errorMessage);
      toast.error(errorMessage);
      setTrains([]);
    } finally {
      setLoading(false);
    }
  };

  // Initial data fetch based on URL params
  useEffect(() => {
    const initializeData = async () => {
      try {
        if (fromStation && toStation) {
          await searchTrains({ fromStation, toStation, date });
        } else {
          await fetchAllTrains();
        }
      } catch (error) {
        console.error('Error initializing data:', error);
        setError('Failed to initialize data');
        setTrains([]);
      }
    };

    initializeData();
  }, []); // Empty dependency array for initial load only

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <TrainSearch
          onSearch={searchTrains}
          popularStations={POPULAR_STATIONS}
          initialValues={{ 
            fromStation, 
            toStation, 
            date: date || getCurrentDate() 
          }}
        />

        {loading ? (
          <LoadingSpinner size="large" className="py-20" />
        ) : error ? (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg text-center">
            {error}
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
                {trains?.length || 0} trains found
                {fromStation && toStation && ` • ${new Date(date).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}`}
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