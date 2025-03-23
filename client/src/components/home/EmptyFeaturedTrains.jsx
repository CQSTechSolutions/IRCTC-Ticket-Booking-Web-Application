import React from 'react';
import { Link } from 'react-router-dom';

const EmptyFeaturedTrains = () => {
  return (
    <div className="bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-blue-900 mb-3">Featured Trains</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover India's most popular train routes
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8 max-w-2xl mx-auto text-center">
          <div className="mb-6">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-16 w-16 mx-auto text-blue-800" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={1.5} 
                d="M4 8V6a2 2 0 012-2h12a2 2 0 012 2v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5zm0 10a2 2 0 012-2h12a2 2 0 012 2v-3a2 2 0 00-2-2H6a2 2 0 00-2 2v3z" 
              />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-4">Train Schedule Coming Soon</h3>
          <p className="text-gray-600 mb-6">
            We're currently updating our train schedule. Please check back soon to see our featured trains.
          </p>
          <Link
            to="/"
            className="inline-block bg-blue-800 hover:bg-blue-900 text-white font-medium px-6 py-3 rounded-lg transition duration-300"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default EmptyFeaturedTrains; 