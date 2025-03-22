import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-8 mt-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <h4 className="text-lg font-medium mb-4 border-b border-gray-700 pb-2">IRCTC</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><a href="#" className="hover:text-white transition duration-300">About Us</a></li>
              <li><a href="#" className="hover:text-white transition duration-300">Advertise With Us</a></li>
              <li><a href="#" className="hover:text-white transition duration-300">News & Events</a></li>
              <li><a href="#" className="hover:text-white transition duration-300">Careers</a></li>
              <li><a href="#" className="hover:text-white transition duration-300">Terms of Service</a></li>
              <li><a href="#" className="hover:text-white transition duration-300">Privacy Policy</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-medium mb-4 border-b border-gray-700 pb-2">Travel</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><a href="#" className="hover:text-white transition duration-300">Train Tickets</a></li>
              <li><a href="#" className="hover:text-white transition duration-300">Air Tickets</a></li>
              <li><a href="#" className="hover:text-white transition duration-300">Bus Tickets</a></li>
              <li><a href="#" className="hover:text-white transition duration-300">Holiday Packages</a></li>
              <li><a href="#" className="hover:text-white transition duration-300">Hotel Bookings</a></li>
              <li><a href="#" className="hover:text-white transition duration-300">Tour Packages</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-medium mb-4 border-b border-gray-700 pb-2">Services</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><a href="#" className="hover:text-white transition duration-300">E-Catering</a></li>
              <li><a href="#" className="hover:text-white transition duration-300">E-Ticketing</a></li>
              <li><a href="#" className="hover:text-white transition duration-300">Retiring Rooms</a></li>
              <li><a href="#" className="hover:text-white transition duration-300">Rail Museums</a></li>
              <li><a href="#" className="hover:text-white transition duration-300">WiFi at Stations</a></li>
              <li><a href="#" className="hover:text-white transition duration-300">Travel Insurance</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-medium mb-4 border-b border-gray-700 pb-2">Contact Us</h4>
            <ul className="space-y-3 text-sm text-gray-300">
              <li className="flex items-start">
                <svg className="h-5 w-5 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span>Customer Care: 0755-6610661</span>
              </li>
              <li className="flex items-start">
                <svg className="h-5 w-5 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span>For Railway Tickets: care@irctc.co.in</span>
              </li>
              <li className="flex items-start">
                <svg className="h-5 w-5 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span>For Tourism: tourism@irctc.com</span>
              </li>
              <li className="mt-4">
                <h5 className="text-sm font-medium mb-2">Connect with us</h5>
                <div className="flex space-x-3">
                  <a href="#" className="text-gray-400 hover:text-white transition duration-300">
                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                    </svg>
                  </a>
                  <a href="#" className="text-gray-400 hover:text-white transition duration-300">
                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                    </svg>
                  </a>
                  <a href="#" className="text-gray-400 hover:text-white transition duration-300">
                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 2c5.514 0 10 4.486 10 10s-4.486 10-10 10-10-4.486-10-10 4.486-10 10-10zm0-2c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm-2 10h-2v2h2v6h3v-6h1.82l.18-2h-2v-.833c0-.478.096-.667.558-.667h1.442v-2.5h-2.404c-1.798 0-2.596.792-2.596 2.308v1.692z" />
                    </svg>
                  </a>
                </div>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 pt-6 border-t border-gray-700 text-center text-sm text-gray-400">
          <p className="mb-2">
            The official website of Indian Railway Catering and Tourism Corporation Ltd (IRCTC). 
            Serving Indian Railways since 1999.
          </p>
          <p>&copy; {new Date().getFullYear()} IRCTC. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 