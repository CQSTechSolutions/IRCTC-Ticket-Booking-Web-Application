import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { FaTrain, FaTicketAlt, FaMapMarkerAlt, FaCalendarAlt, FaUser, FaRupeeSign, FaPrint, FaDownload, FaCheck } from 'react-icons/fa';
import LoadingSpinner from '../components/common/LoadingSpinner';

const API_BASE_URL = 'http://localhost:3000/api';

// Helper function to format time (e.g., "14:30")
const formatTime = (timeString) => {
  if (!timeString) return '';
  return timeString;
};

// Helper function to format date (e.g., "Mon, 26 Mar 2025")
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

// Component to convert class code to readable name
const ClassLabel = ({ classType }) => {
  switch (classType) {
    case '1A': return 'First AC (1A)';
    case '2A': return 'Second AC (2A)';
    case '3A': return 'Third AC (3A)';
    case 'SL': return 'Sleeper (SL)';
    case 'CC': return 'Chair Car (CC)';
    case '2S': return 'Second Sitting (2S)';
    case 'GN': return 'General (GN)';
    default: return classType;
  }
};

// Component to show booking status with appropriate color
const StatusBadge = ({ status }) => {
  let bgColor = 'bg-green-100 text-green-800';
  
  if (status === 'Cancelled') {
    bgColor = 'bg-red-100 text-red-800';
  } else if (status === 'Waiting') {
    bgColor = 'bg-yellow-100 text-yellow-800';
  }
  
  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${bgColor}`}>
      {status === 'Confirmed' && <FaCheck className="mr-1" />}
      {status}
    </span>
  );
};

const BookingConfirmation = () => {
  const { pnr } = useParams();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchBookingDetails = async () => {
      try {
        setLoading(true);
        
        if (!pnr) {
          throw new Error('PNR number is required');
        }
        
        const response = await axios.get(`${API_BASE_URL}/bookings/pnr/${pnr}`);
        
        if (response.data?.success && response.data.data) {
          setBooking(response.data.data);
        } else {
          throw new Error('Failed to fetch booking details');
        }
      } catch (error) {
        console.error('Error fetching booking details:', error);
        setError(error.message || 'Failed to fetch booking details');
        toast.error(error.message || 'Failed to fetch booking details');
      } finally {
        setLoading(false);
      }
    };
    
    fetchBookingDetails();
  }, [pnr]);
  
  const handlePrint = () => {
    window.print();
  };
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    );
  }
  
  if (error || !booking) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
            <p className="text-gray-700 mb-4">{error || 'Booking not found'}</p>
            <Link 
              to="/trains" 
              className="inline-block bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              Search Trains
            </Link>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50 py-8 print:bg-white print:py-0">
      <div className="container mx-auto px-4 print:px-0">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6 mb-8 print:shadow-none">
          {/* Header with booking confirmation message */}
          <div className="mb-8 print:mb-4 border-b pb-6 print:border-b-0 print:pb-2">
            <div className="flex justify-between items-start print:hidden">
              <div>
                <h1 className="text-2xl font-bold text-gray-800 flex items-center">
                  <FaTicketAlt className="text-green-600 mr-2" />
                  Booking Confirmed
                </h1>
                <p className="text-gray-600">Your booking has been confirmed. Save the details for your reference.</p>
              </div>
              <StatusBadge status={booking.status} />
            </div>
            
            <div className="hidden print:block">
              <h1 className="text-xl font-bold text-center">INDIAN RAILWAYS E-TICKET</h1>
              <div className="text-center text-sm text-gray-600 mt-1">This is an electronic ticket. Please carry a valid ID proof during the journey.</div>
            </div>
          </div>
          
          {/* PNR and Booking details */}
          <div className="mb-6 print:mb-4">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
              <div>
                <div className="text-sm text-gray-600">PNR Number</div>
                <div className="text-xl font-bold">{booking.pnr}</div>
              </div>
              <div className="mt-2 md:mt-0">
                <div className="text-sm text-gray-600">Booking Date</div>
                <div>{new Date(booking.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}</div>
              </div>
            </div>
          </div>
          
          {/* Train Information */}
          <div className="mb-6 print:mb-4 p-4 bg-blue-50 rounded-lg print:bg-white print:border print:border-gray-300">
            <div className="flex items-center mb-3">
              <FaTrain className="text-blue-600 mr-2" />
              <h2 className="text-lg font-semibold">Train Information</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-gray-600">Train Number & Name</div>
                <div className="font-medium">{booking.trainNumber} - {booking.trainName}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Journey Date</div>
                <div className="font-medium flex items-center">
                  <FaCalendarAlt className="text-blue-600 mr-1" />
                  {formatDate(booking.journeyDate)}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Class</div>
                <div className="font-medium">
                  <ClassLabel classType={booking.classType} />
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Payment Status</div>
                <StatusBadge status={booking.paymentStatus} />
              </div>
            </div>
          </div>
          
          {/* Journey Details */}
          <div className="mb-6 print:mb-4">
            <div className="flex items-center mb-3">
              <FaMapMarkerAlt className="text-blue-600 mr-2" />
              <h2 className="text-lg font-semibold">Journey Details</h2>
            </div>
            
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center p-4 border border-gray-200 rounded-lg">
              {/* Departure Station */}
              <div className="flex-1 mb-4 md:mb-0">
                <div className="text-sm text-gray-600">From</div>
                <div className="font-bold text-lg">{booking.fromStation.stationName} ({booking.fromStation.stationCode})</div>
                <div className="text-xl font-bold text-gray-900">
                  {formatTime(booking.fromStation.departureTime)}
                </div>
                <div className="text-sm text-gray-600">Day {booking.fromStation.departureDay}</div>
              </div>
              
              {/* Journey Arrow */}
              <div className="flex-1 flex justify-center items-center mb-4 md:mb-0">
                <div className="border-t-2 border-gray-300 w-16 md:w-24 relative">
                  <div className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M8 0L16 8L8 16L0 8L8 0Z" fill="#3B82F6" />
                    </svg>
                  </div>
                </div>
              </div>
              
              {/* Arrival Station */}
              <div className="flex-1 text-right">
                <div className="text-sm text-gray-600">To</div>
                <div className="font-bold text-lg">{booking.toStation.stationName} ({booking.toStation.stationCode})</div>
                <div className="text-xl font-bold text-gray-900">
                  {formatTime(booking.toStation.arrivalTime)}
                </div>
                <div className="text-sm text-gray-600">Day {booking.toStation.arrivalDay}</div>
              </div>
            </div>
          </div>
          
          {/* Passenger Details */}
          <div className="mb-6 print:mb-4">
            <div className="flex items-center mb-3">
              <FaUser className="text-blue-600 mr-2" />
              <h2 className="text-lg font-semibold">Passenger Details</h2>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 border border-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      No.
                    </th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Age
                    </th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Gender
                    </th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Berth
                    </th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {booking.passengers.map((passenger, index) => (
                    <tr key={index}>
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {index + 1}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                        {passenger.name}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                        {passenger.age}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                        {passenger.gender}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                        {passenger.berth || 'Any'}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <StatusBadge status={passenger.ticketStatus || 'Confirmed'} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          
          {/* Fare Details */}
          <div className="mb-6 print:mb-4">
            <div className="flex items-center mb-3">
              <FaRupeeSign className="text-blue-600 mr-2" />
              <h2 className="text-lg font-semibold">Fare Details</h2>
            </div>
            
            <div className="p-4 border border-gray-200 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <div className="text-gray-600">Base Fare</div>
                <div className="font-medium">₹{Math.round(booking.totalFare * 0.85)}</div>
              </div>
              <div className="flex justify-between items-center mb-2">
                <div className="text-gray-600">GST (5%)</div>
                <div className="font-medium">₹{Math.round(booking.totalFare * 0.05)}</div>
              </div>
              <div className="flex justify-between items-center mb-2">
                <div className="text-gray-600">Reservation Charges</div>
                <div className="font-medium">₹{Math.round(booking.totalFare * 0.1)}</div>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-gray-200 mt-2">
                <div className="font-bold text-gray-900">Total Amount</div>
                <div className="font-bold text-xl text-gray-900">₹{booking.totalFare}</div>
              </div>
            </div>
          </div>
          
          {/* Important Instructions */}
          <div className="mb-6 print:mb-4 text-sm">
            <h3 className="font-semibold mb-2">Important Instructions:</h3>
            <ul className="list-disc pl-5 space-y-1 text-gray-700">
              <li>Please carry an ID proof in original during the journey.</li>
              <li>E-ticket passenger is permitted to board the train only if the name in the reservation chart matches with the ID proof.</li>
              <li>Cancellation of tickets is allowed as per Railway rules.</li>
              <li>Please check the train running status before starting your journey.</li>
            </ul>
          </div>
          
          {/* Action Buttons - Only visible when not printing */}
          <div className="flex justify-between items-center print:hidden">
            <Link
              to="/trains"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Back to Trains
            </Link>
            
            <div className="flex space-x-3">
              <button
                onClick={handlePrint}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <FaPrint className="mr-2" />
                Print
              </button>
              <button
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                <FaDownload className="mr-2" />
                Download E-Ticket
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmation; 