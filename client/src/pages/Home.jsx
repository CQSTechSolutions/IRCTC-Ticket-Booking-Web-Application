import React from "react";
import Hero from "../components/home/Hero";
import SearchForm from "../components/home/SearchForm";
import Services from "../components/home/Services";
import NewsOffers from "../components/home/NewsOffers";
import Footer from "../components/Footer";
import HomeTrainSection from "../components/home/HomeTrainSection";

const Home = () => {
    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section with Background */}
            <div className="relative">
                <Hero />
                
                {/* Search Form - Positioned over the Hero */}
                <div className="relative mt-24 px-4 sm:px-6 lg:px-8 z-20 max-w-5xl mx-auto">
                    <SearchForm />
                </div>
            </div>
            
            {/* Featured Trains Section */}
            <div className="mt-20">
                <HomeTrainSection />
            </div>
            
            {/* Services Section */}
            <div className="mt-12">
                <Services />
            </div>
            
            {/* News and Offers Section */}
            <div className="py-16 px-4 sm:px-6 lg:px-8">
                <NewsOffers />
            </div>
            
            {/* Quick Access Links */}
            <div className="bg-gradient-to-r from-blue-900 to-blue-700 py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <h2 className="text-2xl md:text-3xl font-bold text-white mb-8 text-center">Quick Access</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {[
                            { name: "Booking History", icon: "M19 14l-7 7m0 0l-7-7m7 7V3" },
                            { name: "Refund Status", icon: "M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" },
                            { name: "Train Schedule", icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" },
                            { name: "Fare Rules", icon: "M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" },
                        ].map((item, index) => (
                            <div 
                                key={index}
                                className="bg-white/10 backdrop-blur-lg rounded-lg p-6 text-center transform transition-all duration-300 hover:bg-white/20 hover:scale-105 hover:shadow-lg cursor-pointer"
                            >
                                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <svg 
                                        className="w-6 h-6 text-white" 
                                        fill="none" 
                                        stroke="currentColor" 
                                        viewBox="0 0 24 24"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={item.icon}></path>
                                    </svg>
                                </div>
                                <h3 className="text-white font-medium">{item.name}</h3>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            
            {/* Customer Testimonials */}
            <div className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
                <div className="max-w-5xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-800 mb-4">What Our Users Say</h2>
                        <p className="text-gray-600">Trusted by millions of travelers across India</p>
                    </div>
                    
                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                name: "Rajesh Kumar",
                                location: "Delhi",
                                rating: 5,
                                comment: "IRCTC has made train booking so much easier. The interface is very user-friendly and the process is quick."
                            },
                            {
                                name: "Priya Sharma",
                                location: "Mumbai",
                                rating: 5,
                                comment: "I love the new features, especially the food ordering service. It has made my journeys much more comfortable."
                            },
                            {
                                name: "Arun Patel",
                                location: "Bangalore",
                                rating: 4,
                                comment: "Great service overall. The mobile app works flawlessly and customer support is very responsive."
                            }
                        ].map((testimonial, index) => (
                            <div 
                                key={index} 
                                className="bg-gray-50 p-6 rounded-xl shadow-md border border-gray-100 transform transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
                            >
                                <div className="flex items-center mb-4">
                                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                                        <span className="text-blue-700 font-bold text-lg">{testimonial.name.charAt(0)}</span>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-800">{testimonial.name}</h4>
                                        <p className="text-gray-500 text-sm">{testimonial.location}</p>
                                    </div>
                                </div>
                                <div className="flex mb-3">
                                    {[...Array(5)].map((_, i) => (
                                        <svg 
                                            key={i} 
                                            className={`w-5 h-5 ${i < testimonial.rating ? 'text-yellow-400' : 'text-gray-300'}`} 
                                            fill="currentColor" 
                                            viewBox="0 0 20 20"
                                        >
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                                        </svg>
                                    ))}
                                </div>
                                <p className="text-gray-600 italic">"{testimonial.comment}"</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            
            {/* Download App Section */}
            <div className="bg-gradient-to-br from-blue-500 to-blue-700 py-16 px-4 sm:px-6 lg:px-8">
                <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between">
                    <div className="md:w-1/2 mb-8 md:mb-0">
                        <h2 className="text-3xl font-bold text-white mb-4">Download the IRCTC App</h2>
                        <p className="text-blue-100 mb-6 text-lg">
                            Get the best train booking experience on your mobile device. Download now and enjoy seamless booking!
                        </p>
                        <div className="flex space-x-4">
                            <a href="#" className="transform transition-transform duration-300 hover:scale-105">
                                <img 
                                    src="https://www.irctc.co.in/nget/assets/images/googleplaystore.png" 
                                    alt="Google Play" 
                                    className="h-12" 
                                />
                            </a>
                            <a href="#" className="transform transition-transform duration-300 hover:scale-105">
                                <img 
                                    src="https://www.irctc.co.in/nget/assets/images/applestore.png" 
                                    alt="App Store" 
                                    className="h-12" 
                                />
                            </a>
                        </div>
                    </div>
                    <div className="md:w-1/2 flex justify-center">
                        <img 
                            src="https://img.freepik.com/free-vector/mobile-app-concept-illustration_114360-1363.jpg" 
                            alt="IRCTC Mobile App" 
                            className="max-w-xs md:max-w-sm rounded-3xl shadow-2xl border-4 border-white/20 transform transition-all duration-500 hover:rotate-3 hover:scale-105" 
                        />
                    </div>
                </div>
            </div>
            
            {/* Footer */}
            <Footer />
        </div>
    );
};

export default Home;