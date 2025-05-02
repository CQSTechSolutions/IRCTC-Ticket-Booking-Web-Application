import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

// Move styles to a separate constant
const styles = {
  scrollbarHide: {
    WebkitScrollbar: {
      display: 'none'
    },
    msOverflowStyle: 'none',
    scrollbarWidth: 'none'
  }
};

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/'); // Redirect to home page after logout
  };

  return (
    <>
      {/* Header */}
      <header className="bg-blue-900 text-white shadow-lg">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link to="/">
              <img 
                src="https://www.irctc.co.in/nget/assets/images/logo.png" 
                alt="IRCTC Logo" 
                className="h-12 hover:opacity-90 transition-opacity duration-300" 
              />
            </Link>
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
            {localStorage.getItem('token') ? (
                <button 
                    onClick={handleLogout} 
                    className="text-sm font-medium hover:text-blue-200 transition-colors duration-300 px-2 py-1 hover:bg-blue-800 rounded"
                >
                    Logout
                </button>
            ) : (
                <>
                    <Link to="/login" className="text-sm font-medium hover:text-blue-200 transition-colors duration-300 px-2 py-1 hover:bg-blue-800 rounded">Login</Link>
                    <Link to="/register" className="text-sm font-medium hover:text-blue-200 transition-colors duration-300 px-2 py-1 hover:bg-blue-800 rounded">Register</Link>
                </>
            )}
            <Link to="/contact" className="text-sm font-medium hover:text-blue-200 transition-colors duration-300 px-2 py-1 hover:bg-blue-800 rounded">Contact Us</Link>
            <Link to="/disha" className="text-sm font-medium hover:text-blue-200 transition-colors duration-300 px-2 py-1 hover:bg-blue-800 rounded">Ask Disha</Link>
            <div className="relative group">
              <button className="flex items-center text-sm font-medium group-hover:text-blue-200 transition-colors duration-300">
                <span>English</span>
                <svg className="w-4 h-4 ml-1 group-hover:rotate-180 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </button>
              <div className="absolute right-0 mt-2 w-36 bg-white rounded-md shadow-lg overflow-hidden z-500 transform scale-0 origin-top-right group-hover:scale-100 transition-transform duration-200 opacity-0 group-hover:opacity-100">
                <Link to="/lang/en" className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50">English</Link>
                <Link to="/lang/hi" className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50">Hindi</Link>
                <Link to="/lang/ta" className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50">Tamil</Link>
                <Link to="/lang/te" className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50">Telugu</Link>
              </div>
            </div>
          </nav>
        </div>
        
        {/* Mobile Navigation */}
        <div className={`md:hidden ${isMenuOpen ? 'block' : 'hidden'} bg-blue-800 shadow-inner`}>
          <div className="px-4 py-3 space-y-2">
            <Link to="/login" className="block text-sm font-medium py-2 px-3 rounded hover:bg-blue-700 transition-colors duration-300">Login</Link>
            <Link to="/register" className="block text-sm font-medium py-2 px-3 rounded hover:bg-blue-700 transition-colors duration-300">Register</Link>
            <Link to="/agent-login" className="block text-sm font-medium py-2 px-3 rounded hover:bg-blue-700 transition-colors duration-300">Agent Login</Link>
            <Link to="/contact" className="block text-sm font-medium py-2 px-3 rounded hover:bg-blue-700 transition-colors duration-300">Contact Us</Link>
            <Link to="/disha" className="block text-sm font-medium py-2 px-3 rounded hover:bg-blue-700 transition-colors duration-300">TrainMate</Link>
            
            <div className="border-t border-blue-700 pt-2 mt-2">
              <p className="text-xs text-blue-200 mb-1">Select Language</p>
              <div className="grid grid-cols-2 gap-1">
                <Link to="/lang/en" className="text-sm font-medium py-1 px-2 rounded hover:bg-blue-700 transition-colors duration-300">English</Link>
                <Link to="/lang/hi" className="text-sm font-medium py-1 px-2 rounded hover:bg-blue-700 transition-colors duration-300">Hindi</Link>
                <Link to="/lang/ta" className="text-sm font-medium py-1 px-2 rounded hover:bg-blue-700 transition-colors duration-300">Tamil</Link>
                <Link to="/lang/te" className="text-sm font-medium py-1 px-2 rounded hover:bg-blue-700 transition-colors duration-300">Telugu</Link>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Menu */}
      <div className="bg-blue-800 text-white sticky top-0 z-50 shadow-md">
        <div className="container mx-auto px-4">
          <div className="flex items-center space-x-1 md:space-x-6 overflow-x-auto py-3" style={styles.scrollbarHide}>
            <Link to="/" className="whitespace-nowrap text-sm font-medium py-1 px-3 border-b-2 border-white hover:text-blue-200 transition-colors duration-300">HOME</Link>
            <Link to="/exclusive" className="whitespace-nowrap text-sm font-medium py-1 px-3 hover:text-blue-200 hover:border-b-2 hover:border-white transition-all duration-300">IRCTC EXCLUSIVE</Link>
            <Link to="/trains" className="whitespace-nowrap text-sm font-medium py-1 px-3 hover:text-blue-200 hover:border-b-2 hover:border-white transition-all duration-300">TRAINS</Link>
            <Link to="/holidays" className="whitespace-nowrap text-sm font-medium py-1 px-3 hover:text-blue-200 hover:border-b-2 hover:border-white transition-all duration-300">HOLIDAYS</Link>
            <Link to="/stays" className="whitespace-nowrap text-sm font-medium py-1 px-3 hover:text-blue-200 hover:border-b-2 hover:border-white transition-all duration-300">STAYS</Link>
            <Link to="/loyalty" className="whitespace-nowrap text-sm font-medium py-1 px-3 hover:text-blue-200 hover:border-b-2 hover:border-white transition-all duration-300">LOYALTY</Link>
            <Link to="/meals" className="whitespace-nowrap text-sm font-medium py-1 px-3 hover:text-blue-200 hover:border-b-2 hover:border-white transition-all duration-300">MEALS</Link>
            <Link to="/promotions" className="whitespace-nowrap text-sm font-medium py-1 px-3 hover:text-blue-200 hover:border-b-2 hover:border-white transition-all duration-300">PROMOTIONS</Link>
          </div>
        </div>
      </div>

      {/* Add the styles to the head of the document */}
      <style>
        {`
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
          .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
        `}
      </style>
    </>
  );
};

export default Navbar;
