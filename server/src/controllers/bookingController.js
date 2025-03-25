import Booking from '../models/bookingModel.js';
import Train from '../models/trainModel.js';
import User from '../models/userModel.js';
import mongoose from 'mongoose';

// Create a new booking
export const createBooking = async (req, res) => {
    try {
        const {
            trainId,
            trainNumber,
            trainName,
            fromStation,
            toStation,
            journeyDate,
            classType,
            passengers,
            totalFare,
            userId
        } = req.body;

        console.log(req.body);
        // Validate request body
        if (!trainId || !fromStation || !toStation || !journeyDate || !classType || !passengers || !totalFare || !userId) {
            return res.status(400).json({
                success: false,
                message: 'Please provide all required booking details'
            });
        }
        
        // Validate if userId is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid user ID format'
            });
        }
        
        // Validate if trainId is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(trainId)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid train ID format'
            });
        }

        // Validate user
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Validate train
        const train = await Train.findById(trainId);
        if (!train) {
            return res.status(404).json({
                success: false,
                message: 'Train not found'
            });
        }

        // Validate journey date
        const selectedDate = new Date(journeyDate);
        const currentDate = new Date();
        if (selectedDate < currentDate) {
            return res.status(400).json({
                success: false,
                message: 'Journey date cannot be in the past'
            });
        }

        // Check if train runs on the selected day of week
        const dayOfWeek = selectedDate.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
        if (!train.runsOnDays[dayOfWeek]) {
            return res.status(400).json({
                success: false,
                message: `This train does not run on ${dayOfWeek.charAt(0).toUpperCase() + dayOfWeek.slice(1)}`
            });
        }

        // Check if the class is available on the train
        if (!train.classes.includes(classType)) {
            return res.status(400).json({
                success: false,
                message: `Class ${classType} is not available on this train`
            });
        }

        // Validate stations exist in the train route
        const fromStationIndex = train.stations.findIndex(s => s.stationCode === fromStation.stationCode);
        const toStationIndex = train.stations.findIndex(s => s.stationCode === toStation.stationCode);

        if (fromStationIndex === -1 || toStationIndex === -1 || fromStationIndex >= toStationIndex) {
            return res.status(400).json({
                success: false,
                message: 'Invalid stations for this train route'
            });
        }

        // Check seat availability
        const existingBookings = await Booking.find({
            train: trainId,
            journeyDate: {
                $gte: new Date(selectedDate.setHours(0, 0, 0, 0)),
                $lt: new Date(selectedDate.setHours(23, 59, 59, 999))
            },
            classType,
            status: { $ne: 'Cancelled' }
        });

        const totalBookedSeats = existingBookings.reduce((total, booking) => total + booking.passengers.length, 0);
        const availableSeats = train.availableSeats[classType] - totalBookedSeats;

        if (passengers.length > availableSeats) {
            return res.status(400).json({
                success: false,
                message: `Only ${availableSeats} seats available in ${classType} class`
            });
        }

        // Validate fare calculation
        const distance = train.stations[toStationIndex].distance - train.stations[fromStationIndex].distance;
        const calculatedFare = Math.ceil(distance * train.farePerKm[classType]);
        const expectedTotalFare = calculatedFare * passengers.length;

        if (Math.abs(totalFare - expectedTotalFare) > 1) { // Allow for minor rounding differences
            return res.status(400).json({
                success: false,
                message: 'Invalid fare calculation'
            });
        }

        // Generate PNR
        const pnr = generatePNR();

        // Create a new booking
        const newBooking = await Booking.create({
            pnr,
            user: userId,
            train: trainId,
            trainNumber,
            trainName,
            fromStation,
            toStation,
            journeyDate,
            classType,
            passengers,
            totalFare,
            status: 'Confirmed',
            paymentStatus: 'Completed', // In a real app, this would be set after payment processing
            bookingDate: new Date()
        });

        // Update available seats
        await Train.findByIdAndUpdate(trainId, {
            $inc: {
                [`availableSeats.${classType}`]: -passengers.length
            }
        });

        res.status(201).json({
            success: true,
            message: 'Booking created successfully',
            data: {
                pnr: newBooking.pnr,
                booking: newBooking
            }
        });
    } catch (error) {
        console.error('Error creating booking:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create booking',
            error: error.message
        });
    }
};

// Helper function to generate PNR
const generatePNR = () => {
    const timestamp = Date.now().toString();
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `PNR${timestamp}${random}`;
};

// Get all bookings for a user
export const getUserBookings = async (req, res) => {
    try {
        const { userId } = req.params;
        
        // Validate if userId is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid user ID format'
            });
        }

        const bookings = await Booking.findByUser(userId);

        res.status(200).json({
            success: true,
            count: bookings.length,
            data: bookings
        });
    } catch (error) {
        console.error('Error fetching user bookings:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch bookings',
            error: error.message
        });
    }
};

// Get booking by PNR
export const getBookingByPNR = async (req, res) => {
    try {
        const { pnr } = req.params;

        const booking = await Booking.findByPNR(pnr);

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: 'Booking not found with this PNR'
            });
        }

        res.status(200).json({
            success: true,
            data: booking
        });
    } catch (error) {
        console.error('Error fetching booking by PNR:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch booking details',
            error: error.message
        });
    }
};

// Get booking by ID
export const getBookingById = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Validate if id is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid booking ID format'
            });
        }

        const booking = await Booking.findById(id)
            .populate('train')
            .populate('user', 'name email phone');

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: 'Booking not found'
            });
        }

        res.status(200).json({
            success: true,
            data: booking
        });
    } catch (error) {
        console.error('Error fetching booking by ID:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch booking details',
            error: error.message
        });
    }
};

// Cancel booking
export const cancelBooking = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Validate if id is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid booking ID format'
            });
        }

        const booking = await Booking.findById(id);

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: 'Booking not found'
            });
        }

        // Check if booking is already cancelled
        if (booking.status === 'Cancelled') {
            return res.status(400).json({
                success: false,
                message: 'Booking is already cancelled'
            });
        }

        // Check if journey date has passed
        const journeyDate = new Date(booking.journeyDate);
        const currentDate = new Date();
        if (journeyDate < currentDate) {
            return res.status(400).json({
                success: false,
                message: 'Cannot cancel a booking after journey date'
            });
        }

        // Calculate refund amount
        const refundAmount = booking.calculateRefundAmount();

        // Update booking status
        booking.status = 'Cancelled';
        booking.cancellationInfo = {
            cancelledOn: new Date(),
            refundAmount,
            refundStatus: 'Pending'
        };

        await booking.save();

        res.status(200).json({
            success: true,
            message: 'Booking cancelled successfully',
            data: {
                booking,
                refundAmount,
                refundStatus: 'Pending'
            }
        });
    } catch (error) {
        console.error('Error cancelling booking:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to cancel booking',
            error: error.message
        });
    }
};

// Get all bookings (admin only)
export const getAllBookings = async (req, res) => {
    try {
        // Add pagination
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 10;
        const skip = (page - 1) * limit;

        const bookings = await Booking.find()
            .populate('user', 'name email phone')
            .populate('train', 'trainNumber trainName')
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 });

        const totalBookings = await Booking.countDocuments();

        res.status(200).json({
            success: true,
            count: bookings.length,
            totalPages: Math.ceil(totalBookings / limit),
            currentPage: page,
            data: bookings
        });
    } catch (error) {
        console.error('Error fetching all bookings:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch bookings',
            error: error.message
        });
    }
};

// Update booking status (admin only)
export const updateBookingStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        
        // Validate if id is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid booking ID format'
            });
        }

        // Validate status
        const validStatuses = ['Confirmed', 'Waiting', 'Cancelled', 'Completed'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid status value'
            });
        }

        const booking = await Booking.findByIdAndUpdate(
            id,
            { status },
            { new: true, runValidators: true }
        );

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: 'Booking not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Booking status updated successfully',
            data: booking
        });
    } catch (error) {
        console.error('Error updating booking status:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update booking status',
            error: error.message
        });
    }
};

// Update payment status (can be used by payment webhook)
export const updatePaymentStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { paymentStatus, paymentId } = req.body;
        
        // Validate if id is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid booking ID format'
            });
        }

        // Validate payment status
        const validPaymentStatuses = ['Pending', 'Completed', 'Failed', 'Refunded'];
        if (!validPaymentStatuses.includes(paymentStatus)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid payment status value'
            });
        }

        const booking = await Booking.findByIdAndUpdate(
            id,
            { 
                paymentStatus,
                ...(paymentId && { paymentId })
            },
            { new: true, runValidators: true }
        );

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: 'Booking not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Payment status updated successfully',
            data: booking
        });
    } catch (error) {
        console.error('Error updating payment status:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update payment status',
            error: error.message
        });
    }
}; 