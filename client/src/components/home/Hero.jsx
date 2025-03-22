import React from 'react';

const Hero = () => {
  return (
    <div className="relative">
      {/* Hero Background with animation */}
      <div className="absolute inset-0 bg-cover bg-center z-0 animate-slow-zoom" 
        style={{ 
          backgroundImage: 'url("https://images.pexels.com/photos/2031758/pexels-photo-2031758.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1")', 
          backgroundSize: 'cover',
          height: '550px'
        }}>
        {/* Dark overlay with gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-blue-900/70 via-black/50 to-black/70"></div>
      </div>
      
      {/* Content with animations */}
      <div className="relative z-10 container mx-auto px-6 pt-20 pb-28 text-white">
        <div className="max-w-3xl animate-fade-in-up">
          <span className="inline-block px-4 py-1 rounded-full bg-orange-500/80 text-white text-sm font-medium mb-6 animate-bounce-in">Welcome to Indian Railways</span>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight animate-fade-in">
            Start Your Journey <br />With <span className="text-orange-400">IRCTC</span>
          </h1>
          <p className="text-lg md:text-xl mb-10 text-gray-100 animate-fade-in leading-relaxed">
            Your gateway to seamless train travel across India. Book tickets, check PNR status, and explore holiday packages with ease.
          </p>
          <div className="flex flex-wrap gap-4 animate-fade-in-up delay-200">
            <button className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 px-10 rounded-lg shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-orange-500/50 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-opacity-50">
              Book Tickets
            </button>
            <button className="bg-transparent hover:bg-white/10 text-white font-bold py-4 px-10 rounded-lg border-2 border-white shadow-lg transform transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50">
              Explore Packages
            </button>
          </div>
        </div>
      </div>
      
      {/* Quick Info Cards */}
      <div className="relative bottom-0 left-0 right-0 z-20 transform translate-y-1/3 md:translate-y-1/2">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            <div className="bg-gradient-to-r from-blue-900 to-blue-800 rounded-xl shadow-xl p-6 text-white flex items-center transform transition-all duration-300 hover:translate-y-[-8px] hover:shadow-2xl group overflow-hidden">
              <div className="relative">
                <div className="absolute inset-0 bg-blue-700 rounded-full opacity-0 group-hover:opacity-100 transform scale-0 group-hover:scale-100 transition-all duration-300"></div>
                <div className="rounded-full bg-blue-800 p-4 relative z-10 mr-5 group-hover:bg-blue-600 transition-colors duration-300">
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
              </div>
              <div>
                <h3 className="font-bold text-lg mb-2 group-hover:translate-x-2 transition-transform duration-300">Fast Booking</h3>
                <p className="text-sm text-blue-100 group-hover:translate-x-2 transition-transform duration-300 delay-75">Book your tickets in less than 2 minutes</p>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-blue-900 to-blue-800 rounded-xl shadow-xl p-6 text-white flex items-center transform transition-all duration-300 hover:translate-y-[-8px] hover:shadow-2xl group overflow-hidden">
              <div className="relative">
                <div className="absolute inset-0 bg-blue-700 rounded-full opacity-0 group-hover:opacity-100 transform scale-0 group-hover:scale-100 transition-all duration-300"></div>
                <div className="rounded-full bg-blue-800 p-4 relative z-10 mr-5 group-hover:bg-blue-600 transition-colors duration-300">
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                  </svg>
                </div>
              </div>
              <div>
                <h3 className="font-bold text-lg mb-2 group-hover:translate-x-2 transition-transform duration-300">Secure Payments</h3>
                <p className="text-sm text-blue-100 group-hover:translate-x-2 transition-transform duration-300 delay-75">Multiple payment options with security</p>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-blue-900 to-blue-800 rounded-xl shadow-xl p-6 text-white flex items-center transform transition-all duration-300 hover:translate-y-[-8px] hover:shadow-2xl group overflow-hidden">
              <div className="relative">
                <div className="absolute inset-0 bg-blue-700 rounded-full opacity-0 group-hover:opacity-100 transform scale-0 group-hover:scale-100 transition-all duration-300"></div>
                <div className="rounded-full bg-blue-800 p-4 relative z-10 mr-5 group-hover:bg-blue-600 transition-colors duration-300">
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
              </div>
              <div>
                <h3 className="font-bold text-lg mb-2 group-hover:translate-x-2 transition-transform duration-300">24/7 Support</h3>
                <p className="text-sm text-blue-100 group-hover:translate-x-2 transition-transform duration-300 delay-75">Get assistance anytime you need</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes slow-zoom {
          0% { transform: scale(1); }
          100% { transform: scale(1.05); }
        }
        .animate-slow-zoom {
          animation: slow-zoom 20s infinite alternate ease-in-out;
        }
        
        @keyframes fade-in-up {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out forwards;
        }
        
        @keyframes fade-in {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }
        .animate-fade-in {
          animation: fade-in 1s ease-out forwards;
        }
        
        @keyframes bounce-in {
          0% { opacity: 0; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1.05); }
          100% { transform: scale(1); }
        }
        .animate-bounce-in {
          animation: bounce-in 0.7s ease-out forwards;
        }
        
        .delay-200 {
          animation-delay: 0.2s;
        }
      `}</style>
    </div>
  );
};

export default Hero; 