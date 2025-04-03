import mongoose from 'mongoose';

const passengerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Passenger name is required'],
        trim: true
    },
    age: {
        type: Number,
        required: [true, 'Passenger age is required'],
        min: [1, 'Age must be at least 1 year'],
        max: [120, 'Age cannot exceed 120 years']
    },
    gender: {
        type: String,
        required: [true, 'Gender is required'],
        enum: ['Male', 'Female', 'Other']
    },
    berth: {
        type: String,
        enum: ['Lower', 'Middle', 'Upper', 'Side Lower', 'Side Upper', 'Window', 'Middle', 'Aisle', 'Any'],
        default: 'Any'
    },
    seatNumber: String,
    ticketStatus: {
        type: String,
        enum: ['Confirmed', 'Waiting', 'RAC', 'Cancelled'],
        default: 'Confirmed'
    }
});

const bookingSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'User ID is required']
    },
    train: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Train',
        required: [true, 'Train ID is required']
    },
    trainNumber: {
        type: String,
        required: [true, 'Train number is required']
    },
    trainName: {
        type: String,
        required: [true, 'Train name is required']
    },
    fromStation: {
        stationCode: {
            type: String,
            required: [true, 'From station code is required']
        },
        stationName: {
            type: String,
            required: [true, 'From station name is required']
        },
        departureTime: {
            type: String,
            required: [true, 'Departure time is required']
        },
        departureDay: {
            type: Number,
            required: [true, 'Departure day is required']
        }
    },
    toStation: {
        stationCode: {
            type: String,
            required: [true, 'To station code is required']
        },
        stationName: {
            type: String,
            required: [true, 'To station name is required']
        },
        arrivalTime: {
            type: String,
            required: [true, 'Arrival time is required']
        },
        arrivalDay: {
            type: Number,
            required: [true, 'Arrival day is required']
        }
    },
    journeyDate: {
        type: Date,
        required: [true, 'Journey date is required']
    },
    classType: {
        type: String,
        enum: ['1A', '2A', '3A', 'SL', 'CC', '2S', 'GN'],
        required: [true, 'Class type is required']
    },
    passengers: {
        type: [passengerSchema],
        validate: {
            validator: function(passengers) {
                return passengers.length > 0 && passengers.length <= 6;
            },
            message: 'A booking must have at least 1 passenger and at most 6 passengers'
        }
    },
    totalFare: {
        type: Number,
        required: [true, 'Total fare is required']
    },
    status: {
        type: String,
        enum: ['Confirmed', 'Waiting', 'Cancelled', 'Completed'],
        default: 'Confirmed'
    },
    pnr: {
        type: String,
        unique: true
    },
    paymentId: {
        type: String
    },
    paymentStatus: {
        type: String,
        enum: ['Pending', 'Completed', 'Failed', 'Refunded'],
        default: 'Pending'
    },
    cancellationInfo: {
        cancelledOn: Date,
        refundAmount: Number,
        refundStatus: {
            type: String,
            enum: ['Pending', 'Processed', 'Completed', 'Failed'],
            default: 'Pending'
        }
    }
}, {
    timestamps: true
});

// Generate PNR before saving
bookingSchema.pre('save', async function(next) {
    if (!this.pnr) {
        // Generate a 10-digit PNR number
        const randomPart = Math.floor(Math.random() * 9000000000) + 1000000000;
        this.pnr = randomPart.toString();
    }
    next();
});

// Static method to find bookings by user
bookingSchema.statics.findByUser = function(userId) {
    return this.find({ user: userId })
        .populate('train')
        .sort({ createdAt: -1 });
};

// Static method to find booking by PNR
bookingSchema.statics.findByPNR = function(pnr) {
    return this.findOne({ pnr })
        .populate('train')
        .populate('user', 'name email phone');
};

// Method to calculate refund amount
bookingSchema.methods.calculateRefundAmount = function() {
    const bookingDate = new Date(this.createdAt);
    const journeyDate = new Date(this.journeyDate);
    const currentDate = new Date();
    
    // Days between current date and journey date
    const daysDifference = Math.ceil((journeyDate - currentDate) / (1000 * 60 * 60 * 24));
    
    let refundPercentage = 0;
    
    // Refund policy: > 7 days: 100%, 3-7 days: 75%, 1-2 days: 50%, < 24 hours: 0%
    if (daysDifference > 7) {
        refundPercentage = 1.0; // 100%
    } else if (daysDifference >= 3 && daysDifference <= 7) {
        refundPercentage = 0.75; // 75%
    } else if (daysDifference >= 1 && daysDifference < 3) {
        refundPercentage = 0.5; // 50%
    } else {
        refundPercentage = 0.0; // 0%
    }
    
    return Math.round(this.totalFare * refundPercentage);
};

const Booking = mongoose.model('Booking', bookingSchema);

export default Booking; 