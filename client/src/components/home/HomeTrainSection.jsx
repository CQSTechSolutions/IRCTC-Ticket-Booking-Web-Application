import React, { useState, useEffect } from 'react';
import trainData from '../../data/trains.json';
// import trainData from '../../data/empty-trains.json'; // Uncomment to test empty state
import FeaturedTrains from './FeaturedTrains';
import EmptyFeaturedTrains from './EmptyFeaturedTrains';

const HomeTrainSection = () => {
  const [trains, setTrains] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulating API loading
    const fetchTrains = async () => {
      try {
        // Add a slight delay to simulate network request
        await new Promise(resolve => setTimeout(resolve, 600));
        setTrains(trainData);
      } catch (error) {
        console.error('Error loading train data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrains();
  }, []);

  if (loading) {
    return (
      <div className="bg-gray-50 py-12">
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-800"></div>
        </div>
      </div>
    );
  }

  return (
    <>
      {trains.length > 0 ? <FeaturedTrains /> : <EmptyFeaturedTrains />}
    </>
  );
};

export default HomeTrainSection; 