import express from 'express';
import {
    createBooking,
    getUserBookings,
    getBookingByPNR,
    getBookingById,
    cancelBooking,
    getAllBookings,
    updateBookingStatus,
    updatePaymentStatus,
    updatePassengerStatus
} from '../controllers/bookingController.js';

const router = express.Router();

// Booking routes
router.post('/create', createBooking);
router.get('/user/:userId', getUserBookings);
router.get('/pnr/:pnr', getBookingByPNR);
router.get('/:id', getBookingById);
router.put('/cancel/:id', cancelBooking);
router.put('/passenger/:id', updatePassengerStatus);

// Admin routes
router.get('/', getAllBookings);
router.put('/status/:id', updateBookingStatus);
router.put('/payment/:id', updatePaymentStatus);

export default router; 