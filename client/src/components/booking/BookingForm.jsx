import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { FaPlus, FaMinus, FaTicketAlt, FaMoneyBillWave, FaCouch, FaInfoCircle, FaSnowflake } from 'react-icons/fa';

const API_BASE_URL = 'http://localhost:3000/api';

// Class types with descriptions and capacities
const CLASS_TYPES = [
  { code: "1A", name: "AC First Class (1A)", description: "Most premium class with lockable, carpeted cabins", capacity: 18 },
  { code: "2A", name: "AC 2 Tier (2A)", description: "Air-conditioned coaches with 2-tier berths", capacity: 52 },
  { code: "3A", name: "AC 3 Tier (3A)", description: "Air-conditioned coaches with 3-tier berths", capacity: 64 },
  { code: "SL", name: "Sleeper (SL)", description: "Non-AC coaches with 3-tier berths", capacity: 72 },
  { code: "CC", name: "Chair Car (CC)", description: "Air-conditioned seating coaches", capacity: 78 },
  { code: "2S", name: "Second Sitting (2S)", description: "Non-AC seating coaches", capacity: 108 },
  { code: "GN", name: "General (GN)", description: "Unreserved general coaches", capacity: 150 }
];

const BookingForm = ({ train, selectedClass, fromStation, toStation, journeyDate, fare: baseFare, onSubmit }) => {
  const navigate = useNavigate();
  const [passengers, setPassengers] = useState([
    { name: '', age: '', gender: 'Male', berth: 'Any' }
  ]);
  const [totalFare, setTotalFare] = useState(baseFare);
  const [isLoading, setIsLoading] = useState(false);
  const [availableSeats, setAvailableSeats] = useState(0);

  useEffect(() => {
    if (train && selectedClass) {
      setAvailableSeats(train.availableSeats?.[selectedClass] || 0);
      setTotalFare(baseFare * passengers.length);
    }
  }, [train, selectedClass, baseFare, passengers.length]);

  const handleAddPassenger = () => {
    if (passengers.length >= availableSeats) {
      toast.error(`Only ${availableSeats} seats available in ${selectedClass} class`);
      return;
    }
    
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
    let isValid = true;
    let validationError = '';

    // Check if user is logged in
    const userString = localStorage.getItem('user');
    if (!userString) {
      validationError = 'Please login to book tickets';
      navigate('/login', { state: { from: window.location.pathname } });
      return false;
    }

    // Check if class is selected
    if (!selectedClass) {
      toast.error('Please select a travel class');
      return false;
    }

    // Check available seats
    if (passengers.length > availableSeats) {
      toast.error(`Only ${availableSeats} seats available in ${selectedClass} class`);
      return false;
    }

    // Validate each passenger
    passengers.forEach((passenger, index) => {
      if (!passenger.name.trim()) {
        isValid = false;
        validationError = `Please enter name for Passenger ${index + 1}`;
      }

      if (!passenger.age) {
        isValid = false;
        validationError = `Please enter age for Passenger ${index + 1}`;
      }

      // Age validation
      const age = parseInt(passenger.age);
      if (isNaN(age) || age < 1 || age > 120) {
        isValid = false;
        validationError = `Please enter a valid age for Passenger ${index + 1} (between 1 and 120)`;
      }

      // Name validation
      if (passenger.name.trim().length < 3) {
        isValid = false;
        validationError = `Name for Passenger ${index + 1} should be at least 3 characters`;
      }
    });

    if (!isValid) {
      toast.error(validationError);
    }

    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Get token and user data
      const token = localStorage.getItem('token');
      const userString = localStorage.getItem('user');
      
      if (!token || !userString) {
        toast.error('Please login to book tickets');
        navigate('/login');
        return;
      }

      const user = JSON.parse(userString);
      
      // Set authorization header
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      // Prepare booking data
      const bookingData = {
        trainId: train._id,
        fromStation: {
          stationCode: fromStation.stationCode,
          stationName: fromStation.stationName,
          departureTime: fromStation.departureTime,
          departureDay: fromStation.departureDay || fromStation.day || 1,
          platform: fromStation.platform || 1
        },
        toStation: {
          stationCode: toStation.stationCode,
          stationName: toStation.stationName,
          arrivalTime: toStation.arrivalTime,
          arrivalDay: toStation.arrivalDay || toStation.day || 1,
          platform: toStation.platform || 1
        },
        journeyDate,
        classType: selectedClass,
        passengers: passengers.map(p => ({
          name: p.name.trim(),
          age: parseInt(p.age),
          gender: p.gender,
          berthPreference: p.berth
        })),
        totalFare,
        userId: user._id,
        trainNumber: train.trainNumber,
        trainName: train.trainName,
        bookingStatus: 'confirmed',
        bookingDate: new Date().toISOString(),
        distance: train.journey.distance,
        duration: train.journey.duration
      };

      // Debug logging
      console.log('=== Booking Data Debug ===');
      console.log('Auth Token Present:', !!token);
      console.log('User ID:', user._id);
      console.log('Train ID:', bookingData.trainId);
      console.log('From Station:', bookingData.fromStation);
      console.log('To Station:', bookingData.toStation);
      console.log('Journey Date:', bookingData.journeyDate);
      console.log('Class Type:', bookingData.classType);
      console.log('Passengers:', bookingData.passengers);
      console.log('Total Fare:', bookingData.totalFare);
      console.log('Complete Booking Data:', bookingData);
      console.log('========================');

      const response = await axios.post('http://localhost:3000/api/bookings/create', bookingData);

      if (response.data?.success) {
        toast.success('Booking successful!');
        navigate(`/booking/confirmation/${response.data.data.booking.pnr}`);
      } else {
        throw new Error(response.data?.message || 'Booking failed');
      }
    } catch (error) {
      console.error('Error booking ticket:', error);
      console.error('Error Response:', error.response?.data);
      const errorMessage = error.response?.data?.message || error.message || 'Booking failed';
      toast.error(errorMessage);
    }
  };

  // Berth options based on class type
  const getBerthOptions = () => {
    if (selectedClass === '1A' || selectedClass === '2A' || selectedClass === '3A' || selectedClass === 'SL') {
      return [
        { value: 'Any', label: 'No Preference' },
        { value: 'Lower', label: 'Lower Berth' },
        { value: 'Middle', label: 'Middle Berth' },
        { value: 'Upper', label: 'Upper Berth' },
        { value: 'Side Lower', label: 'Side Lower Berth' },
        { value: 'Side Upper', label: 'Side Upper Berth' }
      ];
    } else {
      return [
        { value: 'Any', label: 'No Preference' },
        { value: 'Window', label: 'Window Seat' },
        { value: 'Aisle', label: 'Aisle Seat' },
        { value: 'Middle', label: 'Middle Seat' }
      ];
    }
  };

  const berthOptions = getBerthOptions();
  const classDetails = CLASS_TYPES.find(c => c.code === selectedClass) || {
    name: selectedClass || 'Unknown Class',
    description: 'Travel class',
    capacity: 0
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
        <FaTicketAlt className="mr-2 text-blue-600" /> Book Tickets
      </h2>
      
      {/* Class Type Info */}
      <div className="bg-blue-50 p-4 rounded-lg mb-6">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-blue-600 text-white rounded-lg">
            {selectedClass && selectedClass.startsWith('A') ? (
              <FaSnowflake className="text-2xl" />
            ) : (
              <FaCouch className="text-2xl" />
            )}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-blue-800">{classDetails.name}</h3>
            <p className="text-gray-600">{classDetails.description}</p>
            <div className="mt-2 flex items-center gap-6">
              <div>
                <span className="text-sm text-gray-500">Base Fare:</span>
                <span className="ml-2 font-semibold text-green-600">₹{baseFare}</span>
              </div>
              <div>
                <span className="text-sm text-gray-500">Total Fare ({passengers.length} passengers):</span>
                <span className="ml-2 font-semibold text-green-600">₹{totalFare}</span>
              </div>
              <div>
                <span className="text-sm text-gray-500">Available Seats:</span>
                <span className="ml-2 font-semibold text-blue-600">{availableSeats}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Journey Summary */}
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-medium text-gray-900 mb-3">Journey Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-gray-600">From</p>
              <p className="font-semibold">{fromStation.stationName} ({fromStation.stationCode})</p>
              <p className="text-sm text-gray-500">Departure: {fromStation.departureTime}</p>
            </div>
            <div>
              <p className="text-gray-600">To</p>
              <p className="font-semibold">{toStation.stationName} ({toStation.stationCode})</p>
              <p className="text-sm text-gray-500">Arrival: {toStation.arrivalTime}</p>
            </div>
            <div>
              <p className="text-gray-600">Date</p>
              <p className="font-semibold">{new Date(journeyDate).toLocaleDateString('en-US', {
                weekday: 'short',
                day: 'numeric',
                month: 'long',
                year: 'numeric'
              })}</p>
            </div>
            <div>
              <p className="text-gray-600">Distance</p>
              <p className="font-semibold">{train.journey.distance} km</p>
              <p className="text-sm text-gray-500">
                Duration: {train.journey.duration.hours}h {train.journey.duration.minutes}m
              </p>
            </div>
          </div>
        </div>

        {/* Passenger Forms */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900">Passenger Details</h3>
            <button
              type="button"
              onClick={handleAddPassenger}
              className="flex items-center text-blue-600 hover:text-blue-800"
              disabled={passengers.length >= 6 || passengers.length >= availableSeats}
            >
              <FaPlus className="mr-1" /> Add Passenger
            </button>
          </div>

          {passengers.map((passenger, index) => (
            <div key={index} className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex justify-between items-center mb-3">
                <h4 className="text-lg font-medium text-gray-900">Passenger {index + 1}</h4>
                {passengers.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemovePassenger(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <FaMinus className="mr-1" /> Remove
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={passenger.name}
                    onChange={(e) => handlePassengerChange(index, 'name', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                    minLength={3}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Age
                  </label>
                  <input
                    type="number"
                    value={passenger.age}
                    onChange={(e) => handlePassengerChange(index, 'age', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                    min={1}
                    max={120}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Gender
                  </label>
                  <select
                    value={passenger.gender}
                    onChange={(e) => handlePassengerChange(index, 'gender', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Berth/Seat Preference
                  </label>
                  <select
                    value={passenger.berth}
                    onChange={(e) => handlePassengerChange(index, 'berth', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    {berthOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Booking Summary */}
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-medium text-gray-900 mb-3">Booking Summary</h3>
          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-600">Total Passengers: {passengers.length}</p>
              <p className="text-gray-600">Class: {classDetails.name}</p>
            </div>
            <div className="text-right">
              <p className="text-gray-600">Base Fare: ₹{baseFare}</p>
              <p className="text-xl font-bold text-green-600">Total: ₹{totalFare}</p>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </span>
            ) : (
              <span className="flex items-center">
                <FaTicketAlt className="mr-2" /> Book Now
              </span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default BookingForm; 