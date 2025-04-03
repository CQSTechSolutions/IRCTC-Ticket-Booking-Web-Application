import React, { useState } from 'react';
import { FaMapMarkerAlt, FaCalendarAlt, FaRupeeSign, FaStar, FaUsers, FaTrain, FaHotel, FaUtensils } from 'react-icons/fa';

const HolidaysPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'All Packages' },
    { id: 'beach', name: 'Beach Holidays' },
    { id: 'hill', name: 'Hill Stations' },
    { id: 'heritage', name: 'Heritage Tours' },
    { id: 'adventure', name: 'Adventure' }
  ];

  const packages = [
    {
      id: 1,
      name: "Goa Beach Paradise",
      description: "Experience the perfect blend of sun, sand, and sea in Goa",
      location: "Goa",
      duration: "5 Days",
      price: "₹15,000",
      category: "beach",
      rating: 4.8,
      image: "https://images.unsplash.com/photo-1519046904884-53103b34b206?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
      includes: ["Hotel Stay", "Train Tickets", "Local Sightseeing", "Meals"]
    },
    {
      id: 2,
      name: "Manali Adventure",
      description: "Explore the scenic beauty and adventure sports in Manali",
      location: "Himachal Pradesh",
      duration: "6 Days",
      price: "₹18,000",
      category: "hill",
      rating: 4.6,
      image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
      includes: ["Hotel Stay", "Train Tickets", "Skiing", "Meals"]
    },
    {
      id: 3,
      name: "Rajasthan Heritage Tour",
      description: "Discover the rich cultural heritage of Rajasthan",
      location: "Rajasthan",
      duration: "7 Days",
      price: "₹20,000",
      category: "heritage",
      rating: 4.7,
      image: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
      includes: ["Palace Stay", "Train Tickets", "Heritage Walks", "Meals"]
    },
    {
      id: 4,
      name: "Rishikesh Adventure",
      description: "Experience thrilling adventure sports in Rishikesh",
      location: "Uttarakhand",
      duration: "4 Days",
      price: "₹12,000",
      category: "adventure",
      rating: 4.5,
      image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
      includes: ["Camp Stay", "Train Tickets", "River Rafting", "Meals"]
    }
  ];

  const filteredPackages = selectedCategory === 'all' 
    ? packages 
    : packages.filter(pkg => pkg.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">Holiday Packages</h1>
          <p className="text-xl">Discover amazing destinations across India</p>
        </div>
      </div>

      {/* Category Filter */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-wrap justify-center gap-4">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-6 py-2 rounded-full transition duration-300 ${
                selectedCategory === category.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-blue-100'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* Packages Grid */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPackages.map((pkg) => (
            <div key={pkg.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
              <img 
                src={pkg.image} 
                alt={pkg.name} 
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">{pkg.name}</h3>
                <p className="text-gray-600 mb-4">{pkg.description}</p>
                
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center">
                    <FaMapMarkerAlt className="text-gray-500 mr-2" />
                    <span className="text-sm">{pkg.location}</span>
                  </div>
                  <div className="flex items-center">
                    <FaCalendarAlt className="text-gray-500 mr-2" />
                    <span className="text-sm">{pkg.duration}</span>
                  </div>
                  <div className="flex items-center">
                    <FaStar className="text-yellow-400 mr-2" />
                    <span className="text-sm">{pkg.rating}</span>
                  </div>
                </div>

                <div className="mb-4">
                  <h4 className="font-semibold mb-2">Package Includes:</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {pkg.includes.map((item, index) => (
                      <div key={index} className="flex items-center">
                        <FaUsers className="text-green-500 mr-2" />
                        <span className="text-sm">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <FaRupeeSign className="text-green-600" />
                    <span className="text-2xl font-bold">{pkg.price}</span>
                  </div>
                  <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition duration-300">
                    Book Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Why Choose Us */}
      <div className="bg-gray-100 py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">Why Choose Our Holiday Packages</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-600 text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaTrain className="text-2xl" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Seamless Travel</h3>
              <p className="text-gray-600">Train tickets included in all packages</p>
            </div>
            <div className="text-center">
              <div className="bg-blue-600 text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaHotel className="text-2xl" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Quality Accommodation</h3>
              <p className="text-gray-600">Carefully selected hotels and stays</p>
            </div>
            <div className="text-center">
              <div className="bg-blue-600 text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaUtensils className="text-2xl" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Local Cuisine</h3>
              <p className="text-gray-600">Experience authentic local food</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HolidaysPage;