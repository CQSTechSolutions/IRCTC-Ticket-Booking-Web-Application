import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { FaPlus, FaMinus, FaTicketAlt, FaMoneyBillWave } from 'react-icons/fa';

const API_BASE_URL = 'http://localhost:3000/api';

const BookingForm = ({ train, fromStation, toStation, journeyDate, classType }) => {
  const navigate = useNavigate();
  const [passengers, setPassengers] = useState([
    { name: '', age: '', gender: 'Male', berth: 'Any' }
  ]);
  const [fare, setFare] = useState(0);
  const [totalFare, setTotalFare] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  // Get user ID from local storage - in a real app, this would come from auth context
  const userId = localStorage.getItem('userId') || '65f12a3e5c98765432101234'; // Sample valid ObjectId format
  
  useEffect(() => {
    if (train && fromStation && toStation && classType) {
      calculateFare();
    }
  }, [train, fromStation, toStation, classType, passengers.length]);

  const calculateFare = () => {
    if (!train?.journey?.fares || !classType) return;

    const baseFare = train.journey.fares[classType] || 0;
    setFare(baseFare);
    setTotalFare(baseFare * passengers.length);
  };

  const handleAddPassenger = () => {
    if (passengers.length < 6) {
      setPassengers([...passengers, { name: '', age: '', gender: 'Male', berth: 'Any' }]);
    } else {
      toast.error('Maximum 6 passengers allowed per booking');
    }
  };

  const handleRemovePassenger = (index) => {
    if (passengers.length > 1) {
      const updatedPassengers = [...passengers];
      updatedPassengers.splice(index, 1);
      setPassengers(updatedPassengers);
    } else {
      toast.error('At least one passenger is required');
    }
  };

  const handlePassengerChange = (index, field, value) => {
    const updatedPassengers = [...passengers];
    updatedPassengers[index] = { ...updatedPassengers[index], [field]: value };
    setPassengers(updatedPassengers);
  };

  const validateForm = () => {
    for (const passenger of passengers) {
      if (!passenger.name || !passenger.age) {
        toast.error('Please fill all required passenger details');
        return false;
      }
      
      const age = parseInt(passenger.age);
      if (isNaN(age) || age < 1 || age > 120) {
        toast.error('Age must be between 1 and 120');
        return false;
      }
    }

    if (!train || !fromStation || !toStation || !journeyDate || !classType) {
      toast.error('Missing journey details');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      // Format journey date to YYYY-MM-DD format
      const formattedDate = new Date(journeyDate).toISOString().split('T')[0];

      const bookingData = {
        userId,
        trainId: train._id,
        trainNumber: train.trainNumber,
        trainName: train.trainName,
        fromStation: {
          stationCode: fromStation.stationCode,
          stationName: fromStation.stationName,
          departureTime: fromStation.departureTime,
          departureDay: fromStation.day,
          platform: fromStation.platform || 1
        },
        toStation: {
          stationCode: toStation.stationCode,
          stationName: toStation.stationName,
          arrivalTime: toStation.arrivalTime,
          arrivalDay: toStation.day,
          platform: toStation.platform || 1
        },
        journeyDate: formattedDate,
        classType,
        passengers,
        totalFare
      };
      
      const response = await axios.post(`${API_BASE_URL}/bookings/create`, bookingData);
      
      if (response.data.success) {
        toast.success('Booking successful!');
        // Navigate to booking confirmation page with PNR
        navigate(`/booking/confirmation/${response.data.data.booking.pnr}`);
      }
    } catch (error) {
      console.error('Booking error:', error);
      const errorMessage = error.response?.data?.message || 'Failed to create booking';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  if (!train || !fromStation || !toStation) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg text-yellow-700">
        Please select a train and journey details first.
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Book Your Ticket</h2>
      
      <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-6">
        <h3 className="font-semibold text-lg text-blue-800 mb-2">Journey Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-gray-600">Train</p>
            <p className="font-medium">{train.trainNumber} - {train.trainName}</p>
          </div>
          <div>
            <p className="text-gray-600">Date</p>
            <p className="font-medium">{new Date(journeyDate).toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}</p>
          </div>
          <div>
            <p className="text-gray-600">From</p>
            <p className="font-medium">{fromStation.stationCode} - {fromStation.stationName}</p>
            <p className="text-sm text-gray-500">Dep: {fromStation.departureTime}</p>
          </div>
          <div>
            <p className="text-gray-600">To</p>
            <p className="font-medium">{toStation.stationCode} - {toStation.stationName}</p>
            <p className="text-sm text-gray-500">Arr: {toStation.arrivalTime}</p>
          </div>
          <div>
            <p className="text-gray-600">Class</p>
            <p className="font-medium">{classType}</p>
          </div>
          <div>
            <p className="text-gray-600">Base Fare</p>
            <p className="font-medium">₹{fare}</p>
          </div>
        </div>
      </div>
      
      <form onSubmit={handleSubmit}>
        <h3 className="font-semibold text-lg text-gray-800 mb-4">Passenger Details</h3>
        
        {passengers.map((passenger, index) => (
          <div key={index} className="bg-gray-50 p-4 rounded-lg mb-4">
            <div className="flex justify-between mb-2">
              <h4 className="font-medium">Passenger {index + 1}</h4>
              {passengers.length > 1 && (
                <button 
                  type="button" 
                  onClick={() => handleRemovePassenger(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  Remove
                </button>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name*</label>
                <input
                  type="text"
                  value={passenger.name}
                  onChange={(e) => handlePassengerChange(index, 'name', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Age*</label>
                <input
                  type="number"
                  min="1"
                  max="120"
                  value={passenger.age}
                  onChange={(e) => handlePassengerChange(index, 'age', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                <select
                  value={passenger.gender}
                  onChange={(e) => handlePassengerChange(index, 'gender', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Berth Preference</label>
                <select
                  value={passenger.berth}
                  onChange={(e) => handlePassengerChange(index, 'berth', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="Any">No Preference</option>
                  <option value="Lower">Lower</option>
                  <option value="Middle">Middle</option>
                  <option value="Upper">Upper</option>
                  <option value="Side Lower">Side Lower</option>
                  <option value="Side Upper">Side Upper</option>
                </select>
              </div>
            </div>
          </div>
        ))}
        
        {passengers.length < 6 && (
          <button
            type="button"
            onClick={handleAddPassenger}
            className="flex items-center text-blue-600 hover:text-blue-800 mb-6"
          >
            <FaPlus className="mr-2" /> Add Passenger (Max 6)
          </button>
        )}
        
        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-700">Total Fare ({passengers.length} {passengers.length === 1 ? 'passenger' : 'passengers'})</p>
              <p className="text-2xl font-bold">₹{totalFare}</p>
            </div>
            
            <button
              type="submit"
              disabled={isLoading}
              className="bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors duration-300 flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>Processing...</>
              ) : (
                <>
                  <FaTicketAlt />
                  <span>Book Now</span>
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default BookingForm; 