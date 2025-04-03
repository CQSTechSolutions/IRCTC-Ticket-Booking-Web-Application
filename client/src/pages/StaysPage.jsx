import React, { useState } from 'react';
import { FaSearch, FaMapMarkerAlt, FaCalendarAlt, FaUsers } from 'react-icons/fa';

const StaysPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [location, setLocation] = useState('');
  const [dates, setDates] = useState('');
  const [guests, setGuests] = useState('');

  const featuredHotels = [
    {
      id: 1,
      name: "Grand Hotel",
      location: "Mumbai",
      price: "₹2,500",
      rating: 4.5,
      image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
    },
    {
      id: 2,
      name: "Luxury Resort",
      location: "Goa",
      price: "₹3,500",
      rating: 4.8,
      image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
    },
    {
      id: 3,
      name: "Beach View Hotel",
      location: "Kerala",
      price: "₹4,000",
      rating: 4.6,
      image: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-blue-600 text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-6">Find Your Perfect Stay</h1>
          <p className="text-xl mb-8">Discover comfortable accommodations across India</p>
          
          {/* Search Section */}
          <div className="bg-white rounded-lg p-6 shadow-lg">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <FaSearch className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search hotels..."
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="relative">
                <FaMapMarkerAlt className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="text"
                  placeholder="Location"
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>
              <div className="relative">
                <FaCalendarAlt className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="text"
                  placeholder="Check-in/Check-out"
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={dates}
                  onChange={(e) => setDates(e.target.value)}
                />
              </div>
              <div className="relative">
                <FaUsers className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="text"
                  placeholder="Guests"
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={guests}
                  onChange={(e) => setGuests(e.target.value)}
                />
              </div>
            </div>
            <button className="mt-6 w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition duration-300">
              Search Hotels
            </button>
          </div>
        </div>
      </div>

      {/* Featured Hotels Section */}
      <div className="container mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold mb-8">Featured Hotels</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featuredHotels.map((hotel) => (
            <div key={hotel.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
              <img src={hotel.image} alt={hotel.name} className="w-full h-48 object-cover" />
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">{hotel.name}</h3>
                <p className="text-gray-600 mb-2">{hotel.location}</p>
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-blue-600">{hotel.price}</span>
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm">
                    {hotel.rating} ★
                  </span>
                </div>
                <button className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-300">
                  Book Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StaysPage;