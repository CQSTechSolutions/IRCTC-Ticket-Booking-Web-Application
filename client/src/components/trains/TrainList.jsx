import React from 'react';

const TrainList = ({ trains }) => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold text-blue-900 mb-6">Available Trains</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
          <thead className="bg-blue-800 text-white">
            <tr>
              <th className="py-3 px-4 text-left">Train No.</th>
              <th className="py-3 px-4 text-left">Train Name</th>
              <th className="py-3 px-4 text-left">From</th>
              <th className="py-3 px-4 text-left">To</th>
              <th className="py-3 px-4 text-left">Departure</th>
              <th className="py-3 px-4 text-left">Arrival</th>
              <th className="py-3 px-4 text-left">Duration</th>
              <th className="py-3 px-4 text-left">Days</th>
              <th className="py-3 px-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {trains.map((train) => (
              <tr key={train.id} className="border-b hover:bg-gray-50">
                <td className="py-3 px-4 font-medium">{train.id}</td>
                <td className="py-3 px-4">{train.name}</td>
                <td className="py-3 px-4">{train.source}</td>
                <td className="py-3 px-4">{train.destination}</td>
                <td className="py-3 px-4">{train.departureTime}</td>
                <td className="py-3 px-4">{train.arrivalTime}</td>
                <td className="py-3 px-4">{train.duration}</td>
                <td className="py-3 px-4">
                  <div className="flex space-x-1">
                    {train.days.map((day) => (
                      <span 
                        key={day} 
                        className="inline-block text-xs font-semibold rounded-full bg-blue-100 text-blue-800 px-2 py-1"
                      >
                        {day}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="py-3 px-4">
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm">
                    Book Now
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TrainList; 