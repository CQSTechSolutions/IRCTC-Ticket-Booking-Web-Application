import React, { useState } from 'react';

// Move animations to a separate constant
const animations = `
  @keyframes fade-in-up {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const Services = () => {
  const [hoveredCard, setHoveredCard] = useState(null);
  
  const services = [
    {
      title: "IRCTC Mobile App",
      description: "Download the official IRCTC Mobile App for seamless ticket booking, anytime and anywhere.",
      image: "https://www.irctc.co.in/nget/assets/images/mobile-app-logo.png",
      features: ["Instant Booking", "Save Passenger Details", "Easy Navigation", "Multiple Payment Options"],
      buttons: [
        { text: "Google Play", icon: "https://www.irctc.co.in/nget/assets/images/googleplaystore.png" },
        { text: "App Store", icon: "https://www.irctc.co.in/nget/assets/images/applestore.png" }
      ]
    },
    {
      title: "IRCTC Rail Connect",
      description: "Experience the new age of railway ticket booking with our advanced Rail Connect application.",
      image: "https://play-lh.googleusercontent.com/mWLuXDngfYu4QxeqZt5mHSQEpea8yFqgkJ5dLQEaVPs02L3Q6YI_WUXkF6eHjYYHAQ=w240-h480-rw",
      features: ["Live Train Status", "PNR Status", "Station Alerts", "Travel Updates"],
      buttons: [
        { text: "Learn More", color: "blue" }
      ]
    },
    {
      title: "Holiday Packages",
      description: "Explore India with IRCTC's exclusive holiday packages and tour offers across the country.",
      image: "https://www.irctctourism.com/assets/images/logo.png",
      features: ["Budget Friendly", "All-Inclusive", "Expert Guides", "Safe Travel"],
      buttons: [
        { text: "View Packages", color: "blue" }
      ]
    },
    {
      title: "IRCTC e-Catering",
      description: "Order food online from restaurants and get it delivered right to your train seat during journey.",
      image: "https://ecatering.irctc.co.in/media/1683806057649.png",
      features: ["Quality Food", "On-train Delivery", "Multiple Restaurants", "Hygienic Packaging"],
      buttons: [
        { text: "Order Food", color: "green" }
      ]
    }
  ];

  return (
    <div className="py-16 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4 relative inline-block">
            Our Services
            <span className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-blue-600 rounded-full"></span>
          </h2>
          <p className="text-gray-600 mt-6 text-lg">
            Experience seamless train travel with our comprehensive services designed to make your journey comfortable and convenient.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <div 
              key={index}
              className="group bg-white p-6 rounded-2xl shadow-xl overflow-hidden border border-gray-200 transition-all duration-500 hover:shadow-2xl hover:-translate-y-2"
              onMouseEnter={() => setHoveredCard(index)}
              onMouseLeave={() => setHoveredCard(null)}
              style={{ 
                transitionDelay: `${index * 50}ms`,
                opacity: 0,
                animation: `fade-in-up 600ms ease-out ${index * 100}ms forwards`
              }}
            >
              <div className="flex justify-center mb-6 transform transition-transform duration-500 group-hover:scale-110">
                <img 
                  src={service.image || "https://via.placeholder.com/80"}
                  alt={service.title} 
                  className="h-20 object-contain" 
                />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3 text-center group-hover:text-blue-600 transition-colors duration-300">
                {service.title}
              </h3>
              <p className="text-gray-600 mb-4 text-center">
                {service.description}
              </p>
              
              <div className={`space-y-2 mb-5 transition-all duration-500 ${hoveredCard === index ? 'opacity-100 max-h-40 translate-y-0' : 'opacity-0 max-h-0 -translate-y-4 overflow-hidden'}`}>
                <ul className="text-sm text-gray-600 space-y-2 pl-2">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start">
                      <svg className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="flex justify-center space-x-3">
                {service.buttons.map((button, buttonIndex) => (
                  button.icon ? (
                    <img 
                      key={buttonIndex}
                      src={button.icon} 
                      alt={button.text} 
                      className="h-10 cursor-pointer transform transition-transform duration-300 hover:scale-110" 
                    />
                  ) : (
                    <button 
                      key={buttonIndex}
                      className={`${
                        button.color === 'blue' 
                          ? 'bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800' 
                          : button.color === 'green' 
                          ? 'bg-gradient-to-r from-green-500 to-green-700 hover:from-green-600 hover:to-green-800' 
                          : 'bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700'
                      } text-white font-medium px-6 py-2.5 rounded-lg shadow-md hover:shadow-lg transform transition-all duration-300 hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-${button.color === 'blue' ? 'blue' : button.color === 'green' ? 'green' : 'orange'}-500`}
                    >
                      {button.text}
                    </button>
                  )
                ))}
              </div>
              
              {/* Add a subtle hint to indicate there are features to discover */}
              {hoveredCard !== index && (
                <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2">
                  <svg className="h-6 w-6 text-gray-400 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>
        
        {/* Additional Promotional Banner */}
        <div className="mt-20 bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl shadow-2xl overflow-hidden">
          <div className="md:flex items-center">
            <div className="md:w-3/5 p-8 md:p-12">
              <div className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full mb-5 animate-pulse">
                NEW SERVICE
              </div>
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">IRCTC Premium Membership</h3>
              <p className="text-blue-100 mb-6">
                Get priority booking, dedicated customer support, and exclusive discounts on hotels and travel packages with IRCTC Premium Membership.
              </p>
              <button className="px-6 py-3 bg-white text-blue-700 font-bold rounded-lg shadow-lg hover:bg-blue-50 transition-all duration-300 transform hover:scale-105">
                Become a Premium Member
              </button>
            </div>
            <div className="md:w-2/5 p-8 md:p-0">
              <img 
                src="https://img.freepik.com/free-vector/train-station-concept-illustration_114360-8857.jpg" 
                alt="IRCTC Premium" 
                className="w-full h-64 md:h-auto object-cover rounded-lg transform transition-transform duration-700 hover:scale-105" 
              />
            </div>
          </div>
        </div>
      </div>
      
      {/* Add animations without jsx attribute */}
      <style>{animations}</style>
    </div>
  );
};

export default Services; 