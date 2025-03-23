import React from 'react';
import { Link } from 'react-router-dom';
import trainData from '../../data/trains.json';

const FeaturedTrains = () => {
  // Display only the first 3 trains from the data
  const featuredTrains = trainData.slice(0, 3);

  // If no trains are available, don't render the component
  if (featuredTrains.length === 0) {
    return null;
  }

  return (
    <div className="bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-blue-900 mb-3">Featured Trains</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Travel across India with comfort and convenience. Book your train tickets for these popular routes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredTrains.map(train => (
            <div key={train.id} className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg">
              <div className="bg-blue-800 text-white p-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-bold text-lg">{train.name}</h3>
                  <span className="text-sm bg-blue-700 px-2 py-1 rounded">{train.id}</span>
                </div>
              </div>
              
              <div className="p-4">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <p className="text-gray-500 text-sm">From</p>
                    <p className="font-semibold">{train.source}</p>
                    <p className="text-blue-600">{train.departureTime}</p>
                  </div>
                  
                  <div className="flex-1 px-4">
                    <div className="relative">
                      <div className="border-t-2 border-dashed border-gray-300 absolute w-full top-3"></div>
                      <div className="text-xs text-gray-500 text-center mt-4">{train.duration}</div>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-gray-500 text-sm">To</p>
                    <p className="font-semibold">{train.destination}</p>
                    <p className="text-blue-600">{train.arrivalTime}</p>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-1 mb-4">
                  {train.days.map(day => (
                    <span 
                      key={day} 
                      className="inline-block text-xs font-semibold rounded-full bg-blue-100 text-blue-800 px-2 py-1"
                    >
                      {day}
                    </span>
                  ))}
                </div>
                
                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-sm text-gray-500">Starts from</span>
                    <p className="text-lg font-bold text-blue-900">₹{train.classesFare.SL}</p>
                  </div>
                  <Link
                    to="/trains"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-medium transition duration-300"
                  >
                    Book Now
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-8">
          <Link
            to="/trains"
            className="inline-block bg-blue-800 hover:bg-blue-900 text-white font-medium px-6 py-3 rounded-lg transition duration-300"
          >
            View All Trains
          </Link>
        </div>
      </div>
    </div>
  );
};

export default FeaturedTrains; 