import React from 'react';
import { FaCrown, FaTrain, FaHotel, FaUtensils, FaConciergeBell, FaCar } from 'react-icons/fa';

const ExclusivePage = () => {
  const services = [
    {
      id: 1,
      title: "Luxury Train Journeys",
      description: "Experience the epitome of luxury with our premium train services",
      icon: <FaTrain className="text-4xl text-gold-500" />,
      features: [
        "Private cabins with en-suite bathrooms",
        "Personal butler service",
        "Gourmet dining experience",
        "Exclusive lounge access"
      ],
      image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
    },
    {
      id: 2,
      title: "Premium Hotel Stays",
      description: "Stay in handpicked luxury hotels and resorts",
      icon: <FaHotel className="text-4xl text-gold-500" />,
      features: [
        "5-star accommodations",
        "Spa and wellness centers",
        "Private pools and gardens",
        "24/7 concierge service"
      ],
      image: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
    },
    {
      id: 3,
      title: "Fine Dining Experience",
      description: "Savor exquisite cuisines from around the world",
      icon: <FaUtensils className="text-4xl text-gold-500" />,
      features: [
        "Michelin-starred restaurants",
        "Private dining rooms",
        "Personal chef service",
        "Wine tasting sessions"
      ],
      image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
    }
  ];

  const benefits = [
    {
      id: 1,
      title: "Personal Concierge",
      description: "Dedicated concierge service for all your travel needs",
      icon: <FaConciergeBell className="text-3xl text-gold-500" />
    },
    {
      id: 2,
      title: "Luxury Transport",
      description: "Premium car service for airport transfers and local travel",
      icon: <FaCar className="text-3xl text-gold-500" />
    },
    {
      id: 3,
      title: "VIP Access",
      description: "Exclusive access to events and attractions",
      icon: <FaCrown className="text-3xl text-gold-500" />
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="flex justify-center mb-6">
            <FaCrown className="text-6xl text-gold-500" />
          </div>
          <h1 className="text-5xl font-bold mb-6">Exclusive Services</h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Experience the pinnacle of luxury and comfort with our exclusive services
          </p>
        </div>
      </div>

      {/* Services Section */}
      <div className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold mb-12 text-center">Premium Services</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((service) => (
            <div key={service.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
              <img 
                src={service.image} 
                alt={service.title} 
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <div className="flex items-center mb-4">
                  {service.icon}
                  <h3 className="text-2xl font-semibold ml-3">{service.title}</h3>
                </div>
                <p className="text-gray-600 mb-4">{service.description}</p>
                <ul className="space-y-2 mb-6">
                  {service.features.map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <FaCrown className="text-gold-500 mr-2" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <button className="w-full bg-gray-900 text-white py-3 rounded-lg hover:bg-gray-800 transition duration-300">
                  Learn More
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Benefits Section */}
      <div className="bg-gray-900 text-white py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">Exclusive Benefits</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {benefits.map((benefit) => (
              <div key={benefit.id} className="text-center">
                <div className="mb-4">{benefit.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{benefit.title}</h3>
                <p className="text-gray-400">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Membership Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-lg p-8 text-white">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Join Our Exclusive Membership</h2>
            <p className="text-gray-300 mb-8">
              Get access to our premium services and exclusive benefits. Experience luxury like never before.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-gold-500 text-gray-900 px-8 py-3 rounded-lg hover:bg-gold-600 transition duration-300">
                Become a Member
              </button>
              <button className="border border-white text-white px-8 py-3 rounded-lg hover:bg-white hover:text-gray-900 transition duration-300">
                View Membership Benefits
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <div className="bg-gray-100 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Experience Luxury?</h2>
            <p className="text-gray-600 mb-8">
              Contact our exclusive services team to plan your premium travel experience
            </p>
            <button className="bg-gray-900 text-white px-8 py-3 rounded-lg hover:bg-gray-800 transition duration-300">
              Contact Us
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExclusivePage;