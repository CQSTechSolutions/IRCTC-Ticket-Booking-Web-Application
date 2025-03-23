import React, { useState, useEffect } from 'react';
import trainData from '../data/trains.json';
// import trainData from '../data/empty-trains.json'; // Uncomment to test empty state
import TrainList from '../components/trains/TrainList';
import NoTrainsFound from '../components/trains/NoTrainsFound';
import { Link } from 'react-router-dom';

const Trains = () => {
    const [trains, setTrains] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Simulate API loading
        const loadTrains = async () => {
            try {
                // Simulating network delay
                await new Promise(resolve => setTimeout(resolve, 800));
                setTrains(trainData);
            } catch (error) {
                console.error('Error loading train data:', error);
            } finally {
                setLoading(false);
            }
        };

        loadTrains();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-800"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="bg-blue-800 text-white py-6">
                <div className="container mx-auto px-4">
                    <h1 className="text-3xl font-bold">Train Search</h1>
                    <div className="flex gap-2 mt-2">
                        <Link to="/" className="text-blue-200 hover:text-white text-sm">Home</Link>
                        <span className="text-blue-300">/</span>
                        <span className="text-sm">Trains</span>
                    </div>
                </div>
            </div>

            {/* Search Form */}
            <div className="container mx-auto px-4 py-6">
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <form className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">From Station</label>
                            <input 
                                type="text" 
                                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter source station"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">To Station</label>
                            <input 
                                type="text" 
                                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter destination station"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Date of Journey</label>
                            <input 
                                type="date" 
                                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div className="md:col-span-3 flex justify-center mt-2">
                            <button 
                                type="button"
                                className="bg-blue-800 hover:bg-blue-900 text-white font-medium py-2 px-6 rounded-lg transition duration-300"
                            >
                                Search Trains
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {/* Train Results */}
            {trains.length > 0 ? (
                <TrainList trains={trains} />
            ) : (
                <NoTrainsFound />
            )}
        </div>
    );
};

export default Trains;