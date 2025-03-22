import React, { useState, useEffect } from 'react';

const NewsOffers = () => {
  const [activeTab, setActiveTab] = useState('news');
  const [currentSlide, setCurrentSlide] = useState(0);

  const newsItems = [
    {
      id: 1,
      title: "New Premium Tatkal Booking Service",
      date: "10 Jun 2023",
      content: "IRCTC launches new Premium Tatkal Booking service with improved quota and faster booking experience.",
      image: "https://images.unsplash.com/photo-1580674684081-7617fbf3d745?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
    },
    {
      id: 2,
      title: "Online Food Delivery Now Available",
      date: "05 Jun 2023",
      content: "Order food online during your journey with our new e-Catering service available at major stations.",
      image: "https://images.unsplash.com/photo-1533777857889-4be7c70b33f7?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
    },
    {
      id: 3,
      title: "New Vande Bharat Express Routes",
      date: "01 Jun 2023",
      content: "Indian Railways announces new Vande Bharat Express routes connecting major cities with high-speed travel.",
      image: "https://images.unsplash.com/photo-1474487548417-781cb71495f3?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
    },
    {
      id: 4,
      title: "Mobile App Update Available",
      date: "28 May 2023",
      content: "IRCTC mobile app gets a major update with new features and improved user interface.",
      image: "https://images.unsplash.com/photo-1585101164203-adaf1e50de62?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
    }
  ];

  const offerItems = [
    {
      id: 1,
      title: "25% Off on FIRST Booking",
      validTill: "30 Jul 2023",
      code: "FIRST25",
      description: "Get 25% off (up to ₹250) on your first booking via IRCTC website or mobile app.",
      image: "https://images.unsplash.com/photo-1607082349566-187342175e2f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
    },
    {
      id: 2,
      title: "10% Cashback with SBI Cards",
      validTill: "15 Jul 2023",
      code: "SBIOFFER",
      description: "Get 10% cashback (up to ₹150) on bookings made with SBI Credit or Debit cards.",
      image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
    },
    {
      id: 3,
      title: "Free Cancellation Insurance",
      validTill: "31 Jul 2023",
      code: "INSURE",
      description: "Get free cancellation insurance with every ticket booking above ₹500.",
      image: "https://images.unsplash.com/photo-1607863680198-23d4b2565df0?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
    },
    {
      id: 4,
      title: "5% Off on Round Trips",
      validTill: "25 Jul 2023",
      code: "ROUND5",
      description: "Book round trip tickets and get 5% off on your return journey.",
      image: "https://images.unsplash.com/photo-1621955964441-c173e01c6441?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
    }
  ];

  // Auto-rotate slides
  useEffect(() => {
    const interval = setInterval(() => {
      const items = activeTab === 'news' ? newsItems : offerItems;
      setCurrentSlide((prev) => (prev + 1) % items.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [activeTab, newsItems.length, offerItems.length]);

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  const nextSlide = () => {
    const items = activeTab === 'news' ? newsItems : offerItems;
    setCurrentSlide((prev) => (prev + 1) % items.length);
  };

  const prevSlide = () => {
    const items = activeTab === 'news' ? newsItems : offerItems;
    setCurrentSlide((prev) => (prev - 1 + items.length) % items.length);
  };

  const displayItems = activeTab === 'news' ? newsItems : offerItems;

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-200 transition-all duration-300 hover:shadow-blue-100 max-w-4xl mx-auto">
      <div className="flex border-b mb-6">
        <button 
          className={`relative px-6 py-3 text-base font-medium transition-all duration-300 ease-in-out ${
            activeTab === 'news' 
              ? 'text-blue-700' 
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => {setActiveTab('news'); setCurrentSlide(0);}}
        >
          <span className="relative z-10">Latest News</span>
          {activeTab === 'news' && (
            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 transform transition-transform duration-300 scale-x-100"></span>
          )}
        </button>
        <button 
          className={`relative px-6 py-3 text-base font-medium transition-all duration-300 ease-in-out ${
            activeTab === 'offers' 
              ? 'text-blue-700' 
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => {setActiveTab('offers'); setCurrentSlide(0);}}
        >
          <span className="relative z-10">Special Offers</span>
          {activeTab === 'offers' && (
            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 transform transition-transform duration-300 scale-x-100"></span>
          )}
        </button>
      </div>

      <div className="relative overflow-hidden">
        <div 
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {displayItems.map((item) => (
            <div 
              key={item.id} 
              className="w-full flex-shrink-0 px-1"
            >
              <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl overflow-hidden shadow-md border border-gray-100 flex flex-col md:flex-row transform transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                <div className="md:w-2/5 h-48 md:h-auto overflow-hidden">
                  <img 
                    src={item.image} 
                    alt={item.title} 
                    className="w-full h-full object-cover transform transition-transform duration-700 hover:scale-110"
                  />
                </div>
                <div className="p-6 md:w-3/5 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-xl font-bold text-gray-800">{item.title}</h3>
                      {activeTab === 'news' ? (
                        <span className="text-sm text-gray-500">{item.date}</span>
                      ) : (
                        <span className="bg-red-100 text-red-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                          Valid till {item.validTill}
                        </span>
                      )}
                    </div>
                    <p className="text-gray-600 mb-4">{activeTab === 'news' ? item.content : item.description}</p>
                  </div>
                  
                  <div className="mt-auto">
                    {activeTab === 'news' ? (
                      <button className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium transition-colors duration-300">
                        Read more
                        <svg className="w-4 h-4 ml-1 transform transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                        </svg>
                      </button>
                    ) : (
                      <div className="flex flex-wrap items-center justify-between">
                        <div className="bg-gray-100 px-3 py-1 rounded-lg flex items-center mb-2 md:mb-0">
                          <span className="text-gray-800 font-mono font-medium">{item.code}</span>
                          <button className="ml-2 text-blue-600 hover:text-blue-800 focus:outline-none" title="Copy code">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0v2"></path>
                            </svg>
                          </button>
                        </div>
                        <button className="text-white bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 font-medium px-4 py-1.5 rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 shadow-md hover:shadow-lg">
                          Apply Now
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Carousel controls */}
        <button 
          onClick={prevSlide}
          className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-gray-700 hover:text-blue-700 p-2 rounded-full shadow-md z-10 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-400 -ml-3"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
          </svg>
        </button>
        <button 
          onClick={nextSlide}
          className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-gray-700 hover:text-blue-700 p-2 rounded-full shadow-md z-10 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-400 -mr-3"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
          </svg>
        </button>

        {/* Indicators */}
        <div className="flex justify-center mt-4">
          {displayItems.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`mx-1 w-2 h-2 rounded-full transition-all duration-300 focus:outline-none ${
                index === currentSlide 
                  ? 'bg-blue-600 w-6' 
                  : 'bg-gray-300 hover:bg-gray-400'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default NewsOffers; 