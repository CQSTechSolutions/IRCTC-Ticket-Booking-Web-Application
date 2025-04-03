import React from 'react';
import { Link } from 'react-router-dom';

const NoTrainsFound = () => {
  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-2xl mx-auto">
        <div className="mb-6">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-20 w-20 mx-auto text-blue-800" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={1.5} 
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
            />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">No Trains Available</h2>
        <p className="text-gray-600 mb-6">
          Sorry, we couldn't find any trains matching your criteria. Please try modifying your search
          or check back later for updated schedules.
        </p>
        <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4">
          <Link 
            to="/" 
            className="bg-blue-800 hover:bg-blue-900 text-white font-medium py-2 px-6 rounded-lg transition duration-300"
          >
            Return to Home
          </Link>
          <button 
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-6 rounded-lg transition duration-300"
            onClick={() => window.location.reload()}
          >
            Refresh Page
          </button>
        </div>
      </div>
    </div>
  );
};

export default NoTrainsFound; 