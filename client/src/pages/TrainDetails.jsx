import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { FaArrowLeft, FaCalendarAlt, FaClock, FaRoute, FaMapMarkerAlt, FaTrain, FaRupeeSign, FaListAlt, FaUser, FaArrowRight, FaWifi, FaUtensils, FaToilet, FaLightbulb, FaPlug, FaSnowflake, FaCouch } from 'react-icons/fa';
import BookingForm from '../components/booking/BookingForm';
import LoadingSpinner from '../components/common/LoadingSpinner';

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

const TrainDetails = () => {
  const { trainId, fromStation, toStation, date } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const preferredClass = searchParams.get('class') || '';
  const [train, setTrain] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedClass, setSelectedClass] = useState('');
  const [showBookingForm, setShowBookingForm] = useState(false);
  
  // States for journey details
  const [journeyFrom, setJourneyFrom] = useState(null);
  const [journeyTo, setJourneyTo] = useState(null);
  const [journeyDate, setJourneyDate] = useState(date || new Date().toISOString().split('T')[0]);
  const [passengers, setPassengers] = useState([
    { name: '', age: '', gender: '', berth: 'Any' }
  ]);
  const [currentUser, setCurrentUser] = useState(null);
  const [totalFare, setTotalFare] = useState(0);

  // Add these new state variables
  const [availableSeats, setAvailableSeats] = useState({});
  const [selectedClassDetails, setSelectedClassDetails] = useState(null);

  // Get class details
  const getClassDetails = (classCode) => {
    return CLASS_TYPES.find(cls => cls.code === classCode) || { 
      name: classCode, 
      description: 'Travel class' 
    };
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Get current user from localStorage
        const userString = localStorage.getItem('user');
        if (userString) {
          const user = JSON.parse(userString);
          setCurrentUser(user);
        }
        
        // Check for required parameters
        if (!trainId) {
          setError('Train ID is required');
          setLoading(false);
          return;
        }
        
        // Fetch train details
        const response = await axios.get(`${API_BASE_URL}/trains/${trainId}`);
        
        if (response.data.success && response.data.data) {
          const trainData = response.data.data;
          setTrain(trainData);
          
          // If fromStation and toStation are provided, set journey details
          if (fromStation && toStation) {
            const from = trainData.stations.find(s => s.stationCode === fromStation);
            const to = trainData.stations.find(s => s.stationCode === toStation);
            
            if (from && to) {
              setJourneyFrom(from);
              setJourneyTo(to);
              
              // Calculate journey details
              const distance = to.distance - from.distance;
              const fromTime = new Date(`2000-01-01T${from.departureTime}`);
              const toTime = new Date(`2000-01-01T${to.arrivalTime}`);
              let duration = (toTime - fromTime) / (1000 * 60); // in minutes
              
              // Adjust for day changes
              duration += (to.day - from.day) * 24 * 60;
              
              // Calculate fares for each class
              const fares = {};
              trainData.classes.forEach(cls => {
                fares[cls] = Math.ceil(distance * trainData.farePerKm[cls]);
              });
              
              // Get intermediate stations
              const fromIndex = trainData.stations.findIndex(s => s.stationCode === fromStation);
              const toIndex = trainData.stations.findIndex(s => s.stationCode === toStation);
              const intermediateStations = trainData.stations.slice(fromIndex + 1, toIndex);
              
              // Set journey in train data
              setTrain({
                ...trainData,
                journey: {
                  fromStation: from,
                  toStation: to,
                  distance,
                  duration: {
                    hours: Math.floor(duration / 60),
                    minutes: duration % 60
                  },
                  intermediateStations,
                  fares
                }
              });
            } else {
              setError('One or both stations are not in this train\'s route');
            }
          } else {
            // No journey details, just show train info
            toast.info('Please select From and To stations for booking');
          }
        } else {
          setError('Failed to fetch train details');
        }
      } catch (error) {
        console.error('Error fetching train details:', error);
        setError('Failed to fetch train details');
        toast.error('Failed to fetch train details');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [trainId, fromStation, toStation]);
  
  useEffect(() => {
    if (train && selectedClass) {
      const baseFare = train.journey?.fares?.[selectedClass] || 0;
      const newTotalFare = baseFare * passengers.length;
      setTotalFare(newTotalFare);
    }
  }, [passengers, selectedClass, train]);
  
  // Check if the booking form should be shown automatically
  useEffect(() => {
    const shouldShowBookingForm = searchParams.get('book') === 'true';
    if (shouldShowBookingForm && selectedClass) {
      setShowBookingForm(true);
    }
  }, [location.search, selectedClass]);
  
  const handleClassSelect = (classType) => {
    if (!train?.classes?.includes(classType)) {
      toast.error(`Class ${classType} is not available on this train`);
      return;
    }

    const classDetails = CLASS_TYPES.find(c => c.code === classType);
    if (!classDetails) {
      toast.error('Invalid class type selected');
      return;
    }

    setSelectedClass(classType);
    setSelectedClassDetails(classDetails);
    setShowBookingForm(true);

    // Update URL with selected class
    const newSearchParams = new URLSearchParams(location.search);
    newSearchParams.set('class', classType);
    navigate(`${location.pathname}?${newSearchParams.toString()}`, { replace: true });
  };
  
  const formatTime = (timeString) => {
    const [hours, minutes] = timeString.split(':');
    return `${hours}:${minutes}`;
  };
  
  const formatDuration = (duration) => {
    if (!duration) return '';
    const { hours, minutes } = duration;
    return `${hours}h ${minutes}m`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const AmenityIcon = ({ type }) => {
    switch (type) {
      case 'WiFi':
        return <FaWifi className="text-blue-500" title="WiFi" />;
      case 'Food':
        return <FaUtensils className="text-orange-500" title="Food Available" />;
      case 'Bio Toilet':
        return <FaToilet className="text-green-500" title="Bio Toilet" />;
      case 'Reading Light':
        return <FaLightbulb className="text-yellow-500" title="Reading Light" />;
      case 'Power Socket':
        return <FaPlug className="text-gray-500" title="Power Socket" />;
      default:
        return null;
    }
  };

  const PassengerForm = ({ index, passenger, onChange, onRemove, isRemovable }) => {
    return (
      <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-lg font-medium text-gray-900">Passenger {index + 1}</h3>
          {isRemovable && (
            <button
              type="button"
              onClick={onRemove}
              className="text-red-500 hover:text-red-700"
            >
              Remove
            </button>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input
              type="text"
              name="name"
              value={passenger.name}
              onChange={(e) => onChange(index, 'name', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
            <input
              type="number"
              name="age"
              min="1"
              max="120"
              value={passenger.age}
              onChange={(e) => onChange(index, 'age', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
            <select
              name="gender"
              value={passenger.gender}
              onChange={(e) => onChange(index, 'gender', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Berth Preference</label>
            <select
              name="berth"
              value={passenger.berth}
              onChange={(e) => onChange(index, 'berth', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="Any">No Preference</option>
              <option value="Lower">Lower</option>
              <option value="Middle">Middle</option>
              <option value="Upper">Upper</option>
              <option value="Side Lower">Side Lower</option>
              <option value="Side Upper">Side Upper</option>
              <option value="Window">Window</option>
              <option value="Aisle">Aisle</option>
            </select>
          </div>
        </div>
      </div>
    );
  };

  const handlePassengerChange = (index, field, value) => {
    const updatedPassengers = [...passengers];
    updatedPassengers[index] = {
      ...updatedPassengers[index],
      [field]: value
    };
    setPassengers(updatedPassengers);
  };

  const addPassenger = () => {
    if (passengers.length < 6) {
      setPassengers([...passengers, { name: '', age: '', gender: '', berth: 'Any' }]);
    } else {
      toast.error('Maximum 6 passengers allowed per booking');
    }
  };

  const removePassenger = (index) => {
    if (passengers.length > 1) {
      const updatedPassengers = [...passengers];
      updatedPassengers.splice(index, 1);
      setPassengers(updatedPassengers);
    }
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Get token from localStorage
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please login to book tickets');
        navigate('/login');
        return;
      }

      // Get user data from localStorage
      const userString = localStorage.getItem('user');
      if (!userString) {
        toast.error('User information not found. Please login again');
        navigate('/login');
        return;
      }

      const user = JSON.parse(userString);
      if (!user.userId) {
        toast.error('Invalid user information. Please login again');
        navigate('/login');
        return;
      }

      // Add token to request headers
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      // Validate all required fields
      if (!trainId) {
        toast.error('Train ID is missing');
        return;
      }

      if (!fromStation || !toStation) {
        toast.error('Please select both source and destination stations');
        return;
      }

      if (!journeyDate) {
        toast.error('Please select a journey date');
        return;
      }

      if (!selectedClass) {
        toast.error('Please select a travel class');
        return;
      }

      if (!passengers || passengers.length === 0) {
        toast.error('Please add at least one passenger');
        return;
      }

      if (!totalFare || totalFare <= 0) {
        toast.error('Invalid fare calculation');
        return;
      }
      
      const isFormValid = passengers.every(
        p => p.name && p.age && p.gender
      );
      
      if (!isFormValid) {
        toast.error('Please fill all passenger details');
        return;
      }

      // Validate age
      const hasInvalidAge = passengers.some(p => p.age < 1 || p.age > 120);
      if (hasInvalidAge) {
        toast.error('Please enter valid age for all passengers');
        return;
      }

      // Validate journey date
      const selectedDate = new Date(journeyDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (selectedDate < today) {
        toast.error('Cannot book tickets for past dates');
        return;
      }

      // Prepare booking data with all required fields
      const bookingData = {
        trainId: train._id,
        fromStation: {
          stationCode: train.journey.fromStation.stationCode,
          stationName: train.journey.fromStation.stationName,
          departureTime: train.journey.fromStation.departureTime,
          day: train.journey.fromStation.day,
          platform: train.journey.fromStation.platform || 1
        },
        toStation: {
          stationCode: train.journey.toStation.stationCode,
          stationName: train.journey.toStation.stationName,
          arrivalTime: train.journey.toStation.arrivalTime,
          day: train.journey.toStation.day,
          platform: train.journey.toStation.platform || 1
        },
        journeyDate: journeyDate,
        classType: selectedClass,
        passengers: passengers.map(p => ({
          name: p.name.trim(),
          age: parseInt(p.age),
          gender: p.gender,
          berthPreference: p.berth
        })),
        totalFare: totalFare,
        userId: user.userId, // Fixed userId reference
        trainNumber: train.trainNumber,
        trainName: train.trainName,
        bookingStatus: 'confirmed',
        bookingDate: new Date().toISOString(),
        distance: train.journey.distance,
        duration: train.journey.duration
      };

      // Detailed console logging for debugging
      console.log('=== Booking Data Debug ===');
      console.log('Auth Token:', token);
      console.log('User Details:', {
        userId: user.userId, // Fixed userId reference
        // Don't log sensitive user information
      });
      console.log('Train Details:', {
        trainId: train._id,
        trainNumber: train.trainNumber,
        trainName: train.trainName
      });
      console.log('From Station:', bookingData.fromStation);
      console.log('To Station:', bookingData.toStation);
      console.log('Journey Date:', bookingData.journeyDate);
      console.log('Class Type:', bookingData.classType);
      console.log('Passengers:', bookingData.passengers);
      console.log('Total Fare:', bookingData.totalFare);
      console.log('Distance:', bookingData.distance);
      console.log('Duration:', bookingData.duration);
      console.log('Complete Booking Data:', bookingData);
      console.log('========================');
      
      const response = await axios.post(`${API_BASE_URL}/bookings/create`, bookingData);
      
      if (response.data?.success) {
        toast.success('Booking successful!');
        navigate(`/booking/confirmation/${response.data.data.booking.pnr}`);
      } else {
        throw new Error(response.data?.message || 'Booking failed');
      }
    } catch (error) {
      console.error('Error creating booking:', error);
      console.error('Error Response:', error.response?.data);
      const errorMessage = error.response?.data?.message || error.message || 'Booking failed';
      toast.error(errorMessage);
      
      // Handle specific error cases
      if (errorMessage.includes('seat availability')) {
        toast.error('Selected class is no longer available. Please choose another class.');
      } else if (errorMessage.includes('journey date')) {
        toast.error('Invalid journey date. Please select a valid date.');
      } else if (errorMessage.includes('train')) {
        toast.error('Train details are invalid. Please try again.');
      } else if (errorMessage.includes('required booking details')) {
        toast.error('Please check all booking details and try again.');
      }
    }
  };

  if (loading) {
    return <LoadingSpinner size="large" className="py-20" />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="bg-red-50 text-red-600 p-4 rounded-lg text-center">
            {error}
          </div>
          <div className="mt-6 text-center">
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center text-blue-600 hover:text-blue-800"
            >
              <FaArrowLeft className="mr-2" /> Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!train) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="bg-yellow-50 text-yellow-600 p-4 rounded-lg text-center">
            Train not found
          </div>
          <div className="mt-6 text-center">
            <Link to="/trains" className="inline-flex items-center text-blue-600 hover:text-blue-800">
              <FaArrowLeft className="mr-2" /> Back to Trains
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-blue-600 hover:text-blue-800"
          >
            <FaArrowLeft className="mr-2" /> Back
          </button>
        </div>
        
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">{train.trainName}</h1>
              <p className="text-lg text-gray-600 mb-4">{train.trainNumber} • {train.trainType}</p>
              
              <div className="flex items-center text-gray-700 mb-2">
                <FaCalendarAlt className="mr-2 text-blue-600" />
                <span>Runs on: </span>
                <div className="flex space-x-1 ml-2">
                  {Object.entries(train.runsOnDays).map(([day, runs]) => (
                    <span
                      key={day}
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${
                        runs
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-400'
                      }`}
                    >
                      {day.charAt(0).toUpperCase()}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="flex items-center text-gray-700 mb-4">
                <FaClock className="mr-2 text-blue-600" />
                <span>Average Speed: {train.averageSpeed} km/h</span>
              </div>
              
              {train.amenities && train.amenities.length > 0 && (
                <div className="mb-4">
                  <h3 className="font-semibold text-gray-700 mb-2">Amenities</h3>
                  <div className="flex flex-wrap gap-2">
                    {train.amenities.map((amenity, index) => (
                      <span
                        key={index}
                        className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm"
                      >
                        {amenity}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            {/* Journey Summary */}
            {train.journey && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-lg text-gray-800 mb-4">Journey Summary</h3>
                
                <div className="flex items-start mb-4">
                  <div className="mr-4 flex flex-col items-center">
                    <div className="w-4 h-4 rounded-full bg-green-500"></div>
                    <div className="w-1 h-16 bg-gray-300"></div>
                    <div className="w-4 h-4 rounded-full bg-red-500"></div>
                  </div>
                  
                  <div className="flex-1">
                    <div className="mb-4">
                      <div className="font-medium">{train.journey.fromStation.stationName} ({train.journey.fromStation.stationCode})</div>
                      <div className="text-lg font-semibold">{formatTime(train.journey.fromStation.departureTime)}</div>
                      <div className="text-sm text-gray-500">Day {train.journey.fromStation.day} • Platform {train.journey.fromStation.platform || 1}</div>
                    </div>
                    
                    <div>
                      <div className="font-medium">{train.journey.toStation.stationName} ({train.journey.toStation.stationCode})</div>
                      <div className="text-lg font-semibold">{formatTime(train.journey.toStation.arrivalTime)}</div>
                      <div className="text-sm text-gray-500">Day {train.journey.toStation.day} • Platform {train.journey.toStation.platform || 1}</div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-lg inline-block mb-2">
                      {formatDuration(train.journey.duration)}
                    </div>
                    <div className="text-sm text-gray-500">{train.journey.distance} km</div>
                    {train.journey.intermediateStations && (
                      <div className="text-sm text-gray-500 mt-2">
                        {train.journey.intermediateStations.length} stops
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Class Selection */}
        {train.journey && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Select Travel Class</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {train.classes.map((cls) => {
                const classDetails = getClassDetails(cls);
                return (
                  <button
                    key={cls}
                    onClick={() => handleClassSelect(cls)}
                    className={`p-4 rounded-lg text-left transition-all duration-300 ${
                      selectedClass === cls
                        ? 'bg-blue-600 text-white border-2 border-blue-700 shadow-md'
                        : 'bg-white text-gray-800 hover:bg-gray-50 border border-gray-200'
                    }`}
                  >
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center">
                        {cls.startsWith('A') ? (
                          <FaSnowflake className={`mr-2 ${selectedClass === cls ? 'text-white' : 'text-blue-500'}`} />
                        ) : (
                          <FaCouch className={`mr-2 ${selectedClass === cls ? 'text-white' : 'text-gray-500'}`} />
                        )}
                        <span className="text-lg font-bold">{cls}</span>
                      </div>
                      {train.journey.fares && (
                        <span className={`font-semibold ${selectedClass === cls ? 'text-white' : 'text-green-600'}`}>
                          ₹{train.journey.fares[cls]}
                        </span>
                      )}
                    </div>
                    <div className={`text-sm mb-1 ${selectedClass === cls ? 'text-blue-100' : 'text-gray-700'}`}>
                      {classDetails.name}
                    </div>
                    <div className={`text-xs ${selectedClass === cls ? 'text-blue-100' : 'text-gray-500'}`}>
                      {classDetails.description}
                    </div>
                    <div className={`text-xs mt-2 ${selectedClass === cls ? 'text-blue-100' : 'text-gray-500'}`}>
                      Available Seats: {train.availableSeats[cls]}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}
        
        {/* Route and Stations */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
            <FaRoute className="mr-2 text-blue-600" /> Train Route
          </h2>
          
          <div className="relative">
            <div className="absolute left-6 top-0 bottom-0 w-1 bg-gray-300"></div>
            
            {train.stations.map((station, index) => (
              <div
                key={index}
                className={`flex mb-6 relative ${
                  (journeyFrom && station.stationCode === journeyFrom.stationCode)
                    ? 'bg-green-50 rounded-lg p-2'
                    : (journeyTo && station.stationCode === journeyTo.stationCode)
                    ? 'bg-red-50 rounded-lg p-2'
                    : ''
                }`}
              >
                <div className="mr-6">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      (journeyFrom && station.stationCode === journeyFrom.stationCode)
                        ? 'bg-green-500'
                        : (journeyTo && station.stationCode === journeyTo.stationCode)
                        ? 'bg-red-500'
                        : 'bg-blue-500'
                    } absolute left-5 transform -translate-x-1/2 mt-2 z-10`}
                  ></div>
                </div>
                
                <div className="flex-1">
                  <div className="font-medium">{station.stationName} ({station.stationCode})</div>
                  <div className="flex flex-wrap text-sm text-gray-600 gap-x-4">
                    <span>Day {station.day}</span>
                    <span>Distance: {station.distance} km</span>
                    {station.platform && <span>Platform: {station.platform}</span>}
                    {station.haltTime && <span>Halt: {station.haltTime} min</span>}
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="text-sm text-gray-500">Arr: {station.arrivalTime || '-'}</div>
                  <div className="text-sm text-gray-500">Dep: {station.departureTime || '-'}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Booking Form */}
        {showBookingForm && selectedClass && journeyFrom && journeyTo && (
          <BookingForm
            train={train}
            selectedClass={selectedClass}
            fromStation={journeyFrom}
            toStation={journeyTo}
            journeyDate={journeyDate}
            fare={train.journey.fares[selectedClass]}
            onSubmit={handleBookingSubmit}
          />
        )}
        
        {(!showBookingForm && journeyFrom && journeyTo) && (
          <div className="bg-blue-50 border border-blue-100 p-4 rounded-lg text-center mb-8">
            <p className="text-blue-800 mb-3">Ready to book your journey?</p>
            <p className="text-gray-600 mb-4">Select a class from the options above to continue with booking.</p>
          </div>
        )}
        
        {(!journeyFrom || !journeyTo) && (
          <div className="bg-yellow-50 border border-yellow-100 p-4 rounded-lg text-center mb-8">
            <p className="text-yellow-800 mb-3">Want to book this train?</p>
            <p className="text-gray-600 mb-4">Please search for your specific journey to proceed with booking.</p>
            <Link
              to="/trains"
              className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-300 inline-block"
            >
              Search Trains
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrainDetails; 