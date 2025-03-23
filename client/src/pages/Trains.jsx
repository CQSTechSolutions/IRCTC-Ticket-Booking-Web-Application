import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSearchParams } from 'react-router-dom';
import TrainSearch from '../components/trains/TrainSearch';
import TrainList from '../components/trains/TrainList';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { toast } from 'react-hot-toast';

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

  // Get search params from URL
  const fromStation = searchParams.get('fromStation') || '';
  const toStation = searchParams.get('toStation') || '';
  const date = searchParams.get('date') || new Date().toISOString().split('T')[0];

  const fetchAllTrains = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get('http://localhost:3000/api/trains');
      if (response.data && response.data.data) {
        const transformedTrains = response.data.data.map(train => {
          const firstStation = train.stations[0];
          const lastStation = train.stations[train.stations.length - 1];
          return transformTrainData(train, firstStation, lastStation);
        });
        setTrains(transformedTrains);
      } else {
        setTrains([]);
        setError('No train data available');
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

  const transformTrainData = (train, fromStn, toStn) => {
    // Find the indices of the stations in the route
    const fromIndex = train.stations.findIndex(s => s.code === fromStn.code);
    const toIndex = train.stations.findIndex(s => s.code === toStn.code);
    
    // Calculate distance between stations
    const distance = toStn.distance - fromStn.distance;
    
    // Calculate duration between stations
    const duration = calculateJourneyTime(
      fromStn.departureTime || fromStn.arrivalTime,
      toStn.arrivalTime || toStn.departureTime,
      fromStn.day,
      toStn.day
    );

    // Calculate fares for all classes
    const fares = {};
    train.classes.forEach(cls => {
      fares[cls] = Math.ceil(distance * train.farePerKm[cls]);
    });

    return {
      ...train,
      journey: {
        fromStation: fromStn,
        toStation: toStn,
        distance,
        duration,
        intermediateStations: train.stations.slice(fromIndex + 1, toIndex),
        fares
      }
    };
  };

  const searchTrains = async (params) => {
    try {
      setLoading(true);
      setError(null);
      
      // Update URL with search params
      setSearchParams(params);

      if (!params.fromStation || !params.toStation) {
        await fetchAllTrains();
        return;
      }

      const response = await axios.get('http://localhost:3000/api/trains/search', {
        params: {
          fromStation: params.fromStation,
          toStation: params.toStation,
          date: params.date
        }
      });

      if (response.data && response.data.data) {
        const transformedTrains = response.data.data.map(train => {
          // Find the specified stations in the train's route
          const fromStn = train.stations.find(s => s.code === params.fromStation);
          const toStn = train.stations.find(s => s.code === params.toStation);
          
          if (!fromStn || !toStn) return null;
          
          return transformTrainData(train, fromStn, toStn);
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

  // Helper function to calculate journey time
  const calculateJourneyTime = (departure, arrival, departureDay, arrivalDay) => {
    try {
      const dept = new Date(`2024-01-${departureDay}T${departure}`);
      const arr = new Date(`2024-01-${arrivalDay}T${arrival}`);
      const diff = arr - dept;
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      return { hours, minutes };
    } catch (error) {
      console.error('Error calculating journey time:', error);
      return { hours: 0, minutes: 0 };
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
          initialValues={{ fromStation, toStation, date }}
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
              trains={trains || []}
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