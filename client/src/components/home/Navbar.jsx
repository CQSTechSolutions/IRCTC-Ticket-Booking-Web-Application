import React, { useState } from 'react';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      {/* Header */}
      <header className="bg-blue-900 text-white shadow-lg">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <img 
              src="https://www.irctc.co.in/nget/assets/images/logo.png" 
              alt="IRCTC Logo" 
              className="h-12 hover:opacity-90 transition-opacity duration-300" 
            />
          </div>
          
          {/* Mobile menu button */}
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden focus:outline-none"
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
              )}
            </svg>
          </button>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#" className="text-sm font-medium hover:text-blue-200 transition-colors duration-300 px-2 py-1 hover:bg-blue-800 rounded">Login</a>
            <a href="#" className="text-sm font-medium hover:text-blue-200 transition-colors duration-300 px-2 py-1 hover:bg-blue-800 rounded">Register</a>
            <a href="#" className="text-sm font-medium hover:text-blue-200 transition-colors duration-300 px-2 py-1 hover:bg-blue-800 rounded">Agent Login</a>
            <a href="#" className="text-sm font-medium hover:text-blue-200 transition-colors duration-300 px-2 py-1 hover:bg-blue-800 rounded">Contact Us</a>
            <a href="#" className="text-sm font-medium hover:text-blue-200 transition-colors duration-300 px-2 py-1 hover:bg-blue-800 rounded">Ask Disha</a>
            <div className="relative group">
              <button className="flex items-center text-sm font-medium group-hover:text-blue-200 transition-colors duration-300">
                <span>English</span>
                <svg className="w-4 h-4 ml-1 group-hover:rotate-180 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </button>
              <div className="absolute right-0 mt-2 w-36 bg-white rounded-md shadow-lg overflow-hidden z-50 transform scale-0 origin-top-right group-hover:scale-100 transition-transform duration-200 opacity-0 group-hover:opacity-100">
                <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50">English</a>
                <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50">Hindi</a>
                <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50">Tamil</a>
                <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50">Telugu</a>
              </div>
            </div>
          </nav>
        </div>
        
        {/* Mobile Navigation */}
        <div className={`md:hidden ${isMenuOpen ? 'block' : 'hidden'} bg-blue-800 shadow-inner`}>
          <div className="px-4 py-3 space-y-2">
            <a href="#" className="block text-sm font-medium py-2 px-3 rounded hover:bg-blue-700 transition-colors duration-300">Login</a>
            <a href="#" className="block text-sm font-medium py-2 px-3 rounded hover:bg-blue-700 transition-colors duration-300">Register</a>
            <a href="#" className="block text-sm font-medium py-2 px-3 rounded hover:bg-blue-700 transition-colors duration-300">Agent Login</a>
            <a href="#" className="block text-sm font-medium py-2 px-3 rounded hover:bg-blue-700 transition-colors duration-300">Contact Us</a>
            <a href="#" className="block text-sm font-medium py-2 px-3 rounded hover:bg-blue-700 transition-colors duration-300">Ask Disha</a>
            
            <div className="border-t border-blue-700 pt-2 mt-2">
              <p className="text-xs text-blue-200 mb-1">Select Language</p>
              <div className="grid grid-cols-2 gap-1">
                <a href="#" className="text-sm font-medium py-1 px-2 rounded hover:bg-blue-700 transition-colors duration-300">English</a>
                <a href="#" className="text-sm font-medium py-1 px-2 rounded hover:bg-blue-700 transition-colors duration-300">Hindi</a>
                <a href="#" className="text-sm font-medium py-1 px-2 rounded hover:bg-blue-700 transition-colors duration-300">Tamil</a>
                <a href="#" className="text-sm font-medium py-1 px-2 rounded hover:bg-blue-700 transition-colors duration-300">Telugu</a>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Menu */}
      <div className="bg-blue-800 text-white sticky top-0 z-50 shadow-md">
        <div className="container mx-auto px-4">
          <div className="flex items-center space-x-1 md:space-x-6 overflow-x-auto py-3 scrollbar-hide">
            <a href="#" className="whitespace-nowrap text-sm font-medium py-1 px-3 border-b-2 border-white hover:text-blue-200 transition-colors duration-300">HOME</a>
            <a href="#" className="whitespace-nowrap text-sm font-medium py-1 px-3 hover:text-blue-200 hover:border-b-2 hover:border-white transition-all duration-300">IRCTC EXCLUSIVE</a>
            <a href="#" className="whitespace-nowrap text-sm font-medium py-1 px-3 hover:text-blue-200 hover:border-b-2 hover:border-white transition-all duration-300">TRAINS</a>
            <a href="#" className="whitespace-nowrap text-sm font-medium py-1 px-3 hover:text-blue-200 hover:border-b-2 hover:border-white transition-all duration-300">HOLIDAYS</a>
            <a href="#" className="whitespace-nowrap text-sm font-medium py-1 px-3 hover:text-blue-200 hover:border-b-2 hover:border-white transition-all duration-300">STAYS</a>
            <a href="#" className="whitespace-nowrap text-sm font-medium py-1 px-3 hover:text-blue-200 hover:border-b-2 hover:border-white transition-all duration-300">LOYALTY</a>
            <a href="#" className="whitespace-nowrap text-sm font-medium py-1 px-3 hover:text-blue-200 hover:border-b-2 hover:border-white transition-all duration-300">MEALS</a>
            <a href="#" className="whitespace-nowrap text-sm font-medium py-1 px-3 hover:text-blue-200 hover:border-b-2 hover:border-white transition-all duration-300">PROMOTIONS</a>
          </div>
        </div>
      </div>

      {/* Add style for scrollbar hiding in very small screens */}
      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </>
  );
};

export default Navbar; 