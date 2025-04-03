import mongoose from 'mongoose';

const trainSchema = new mongoose.Schema({
    trainNumber: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    trainName: {
        type: String,
        required: true,
        trim: true
    },
    trainType: {
        type: String,
        enum: ['Express', 'Superfast', 'Local', 'Shatabdi', 'Rajdhani', 'Duronto', 'Passenger'],
        default: 'Express'
    },
    stations: [{
        stationName: {
            type: String,
            required: true
        },
        stationCode: {
            type: String,
            required: true
        },
        arrivalTime: String,
        departureTime: String,
        distance: {
            type: Number,
            required: true
        },
        day: {
            type: Number,
            required: true,
            min: 1
        },
        platform: {
            type: Number,
            default: 1
        },
        haltTime: {
            type: Number, // in minutes
            default: 2
        }
    }],
    runsOnDays: {
        monday: { type: Boolean, default: true },
        tuesday: { type: Boolean, default: true },
        wednesday: { type: Boolean, default: true },
        thursday: { type: Boolean, default: true },
        friday: { type: Boolean, default: true },
        saturday: { type: Boolean, default: true },
        sunday: { type: Boolean, default: true }
    },
    classes: {
        type: [String],
        enum: ['1A', '2A', '3A', 'SL', 'CC', '2S', 'GN'],
        required: true
    },
    farePerKm: {
        '1A': { type: Number, default: 4 },
        '2A': { type: Number, default: 2.5 },
        '3A': { type: Number, default: 2 },
        'SL': { type: Number, default: 1 },
        'CC': { type: Number, default: 1.5 },
        '2S': { type: Number, default: 0.6 },
        'GN': { type: Number, default: 0.4 }
    },
    availableSeats: {
        '1A': { type: Number, default: 18 },
        '2A': { type: Number, default: 52 },
        '3A': { type: Number, default: 64 },
        'SL': { type: Number, default: 72 },
        'CC': { type: Number, default: 78 },
        '2S': { type: Number, default: 108 },
        'GN': { type: Number, default: 150 }
    },
    averageSpeed: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['Active', 'Cancelled', 'Suspended'],
        default: 'Active'
    },
    amenities: [{
        type: String,
        enum: ['Pantry', 'WiFi', 'Bedroll', 'Reading Light', 'Power Socket', 'Bio Toilet', 'Security', 'Food']
    }]
}, {
    timestamps: true
});

// Method to find trains between two stations
trainSchema.statics.findTrainsBetweenStations = async function(fromStation, toStation) {
    return this.find({
        'stations.stationCode': { 
            $all: [fromStation, toStation] 
        }
    }).then(trains => {
        return trains.filter(train => {
            const stations = train.stations;
            const fromIndex = stations.findIndex(s => s.stationCode === fromStation);
            const toIndex = stations.findIndex(s => s.stationCode === toStation);
            return fromIndex < toIndex; // Ensures direction is correct
        });
    });
};

// Method to get intermediate stations
trainSchema.methods.getIntermediateStations = function(fromStation, toStation) {
    const stations = this.stations;
    const fromIndex = stations.findIndex(s => s.stationCode === fromStation);
    const toIndex = stations.findIndex(s => s.stationCode === toStation);
    
    if (fromIndex === -1 || toIndex === -1 || fromIndex >= toIndex) {
        return [];
    }
    
    return stations.slice(fromIndex + 1, toIndex);
};

// Method to calculate fare between stations
trainSchema.methods.calculateFare = function(fromStation, toStation, classType) {
    const stations = this.stations;
    const fromIndex = stations.findIndex(s => s.stationCode === fromStation);
    const toIndex = stations.findIndex(s => s.stationCode === toStation);
    
    if (fromIndex === -1 || toIndex === -1 || fromIndex >= toIndex) {
        return 0;
    }
    
    const distance = stations[toIndex].distance - stations[fromIndex].distance;
    return Math.ceil(distance * this.farePerKm[classType]);
};

const Train = mongoose.model('Train', trainSchema);
export default Train;
