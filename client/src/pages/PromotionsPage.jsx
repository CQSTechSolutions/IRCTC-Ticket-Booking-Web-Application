import React from 'react';
import { FaPercent, FaClock, FaTag, FaGift } from 'react-icons/fa';

const PromotionsPage = () => {
  const promotions = [
    {
      id: 1,
      title: "Early Bird Special",
      description: "Book your tickets 60 days in advance and get 15% off on all classes",
      icon: <FaClock className="text-4xl text-blue-600" />,
      validUntil: "31 Dec 2024",
      code: "EARLY15",
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
    },
    {
      id: 2,
      title: "Weekend Getaway",
      description: "Special discounts on weekend train tickets to popular destinations",
      icon: <FaTag className="text-4xl text-green-600" />,
      validUntil: "Ongoing",
      code: "WEEKEND20",
      image: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
    },
    {
      id: 3,
      title: "Student Special",
      description: "Get 25% off on train tickets with valid student ID",
      icon: <FaGift className="text-4xl text-purple-600" />,
      validUntil: "31 Mar 2024",
      code: "STUDENT25",
      image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">Special Offers & Promotions</h1>
          <p className="text-xl">Discover amazing deals on your train bookings</p>
        </div>
      </div>

      {/* Promotions Grid */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {promotions.map((promo) => (
            <div key={promo.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="relative">
                <img 
                  src={promo.image} 
                  alt={promo.title} 
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full">
                  {promo.icon}
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">{promo.title}</h3>
                <p className="text-gray-600 mb-4">{promo.description}</p>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm text-gray-500">Valid until: {promo.validUntil}</span>
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
                    Code: {promo.code}
                  </span>
                </div>
                <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-300">
                  Apply Offer
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Newsletter Section */}
      <div className="bg-gray-100 py-12">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Stay Updated with Latest Offers</h2>
          <p className="text-gray-600 mb-6">Subscribe to our newsletter to receive exclusive deals and promotions</p>
          <div className="max-w-md mx-auto">
            <div className="flex gap-4">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition duration-300">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PromotionsPage;