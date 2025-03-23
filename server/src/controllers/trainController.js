import Train from '../models/trainModel.js';

// Add a new train
export const addTrain = async (req, res) => {
    try {
        const train = new Train(req.body);
        await train.save();
        res.status(201).json({
            success: true,
            message: "Train added successfully",
            data: train
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to add train",
            error: error.message
        });
    }
};

// Get all trains
export const getAllTrains = async (req, res) => {
    try {
        const trains = await Train.find({ status: 'Active' });
        res.status(200).json({
            success: true,
            count: trains.length,
            data: trains
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch trains",
            error: error.message
        });
    }
};

// Get train by ID
export const getTrainById = async (req, res) => {
    try {
        const train = await Train.findById(req.params.id);
        if (!train) {
            return res.status(404).json({
                success: false,
                message: "Train not found"
            });
        }
        res.status(200).json({
            success: true,
            data: train
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch train",
            error: error.message
        });
    }
};

// Update train
export const updateTrain = async (req, res) => {
    try {
        const train = await Train.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!train) {
            return res.status(404).json({
                success: false,
                message: "Train not found"
            });
        }
        res.status(200).json({
            success: true,
            message: "Train updated successfully",
            data: train
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to update train",
            error: error.message
        });
    }
};

// Delete train
export const deleteTrain = async (req, res) => {
    try {
        const train = await Train.findByIdAndDelete(req.params.id);
        if (!train) {
            return res.status(404).json({
                success: false,
                message: "Train not found"
            });
        }
        res.status(200).json({
            success: true,
            message: "Train deleted successfully"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to delete train",
            error: error.message
        });
    }
};

// Search trains between stations
export const searchTrains = async (req, res) => {
    try {
        const { fromStation, toStation, date } = req.query;
        
        if (!fromStation || !toStation) {
            return res.status(400).json({
                success: false,
                message: "Please provide both fromStation and toStation"
            });
        }

        // Find trains between stations
        const trains = await Train.find({
            'stations.stationCode': { 
                $all: [fromStation, toStation] 
            },
            status: 'Active'
        });

        // Filter trains to ensure correct station sequence and get journey details
        const validTrains = trains.map(train => {
            const stations = train.stations;
            const fromIndex = stations.findIndex(s => s.stationCode === fromStation);
            const toIndex = stations.findIndex(s => s.stationCode === toStation);

            // Skip if stations are not in correct sequence
            if (fromIndex === -1 || toIndex === -1 || fromIndex >= toIndex) {
                return null;
            }

            // Calculate journey details
            const fromStation = stations[fromIndex];
            const toStation = stations[toIndex];
            const distance = toStation.distance - fromStation.distance;
            const journeyTime = calculateJourneyTime(fromStation.departureTime, toStation.arrivalTime, fromStation.day, toStation.day);

            // Calculate fares for all available classes
            const fares = {};
            train.classes.forEach(cls => {
                fares[cls] = Math.ceil(distance * train.farePerKm[cls]);
            });

            // Get intermediate stations
            const intermediateStations = stations.slice(fromIndex + 1, toIndex);

            return {
                ...train.toObject(),
                journey: {
                    fromStation: stations[fromIndex],
                    toStation: stations[toIndex],
                    distance,
                    duration: journeyTime,
                    intermediateStations,
                    fares
                }
            };
        }).filter(Boolean); // Remove null entries

        // Filter by date if provided
        let filteredTrains = validTrains;
        if (date) {
            const journeyDate = new Date(date);
            const dayOfWeek = journeyDate.toLocaleDateString('en-US', { weekday: 'lowercase' });
            filteredTrains = validTrains.filter(train => train.runsOnDays[dayOfWeek]);
        }

        res.status(200).json({
            success: true,
            count: filteredTrains.length,
            data: filteredTrains
        });
    } catch (error) {
        console.error('Search trains error:', error);
        res.status(500).json({
            success: false,
            message: "Failed to search trains",
            error: error.message
        });
    }
};

// Helper function to calculate journey time
const calculateJourneyTime = (departure, arrival, departureDay, arrivalDay) => {
    const dept = new Date(`2024-01-${departureDay}T${departure}`);
    const arr = new Date(`2024-01-${arrivalDay}T${arrival}`);
    const diff = arr - dept;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return { hours, minutes };
};

// Get intermediate stations
export const getIntermediateStations = async (req, res) => {
    try {
        const { trainId, fromStation, toStation } = req.params;
        
        const train = await Train.findById(trainId);
        if (!train) {
            return res.status(404).json({
                success: false,
                message: "Train not found"
            });
        }

        const intermediateStations = train.getIntermediateStations(fromStation, toStation);
        
        res.status(200).json({
            success: true,
            count: intermediateStations.length,
            data: intermediateStations
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to get intermediate stations",
            error: error.message
        });
    }
};

// Calculate fare
export const calculateFare = async (req, res) => {
    try {
        const { trainId, fromStation, toStation, classType } = req.params;
        
        const train = await Train.findById(trainId);
        if (!train) {
            return res.status(404).json({
                success: false,
                message: "Train not found"
            });
        }

        const fare = train.calculateFare(fromStation, toStation, classType);
        
        res.status(200).json({
            success: true,
            data: {
                fare,
                classType,
                fromStation,
                toStation
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to calculate fare",
            error: error.message
        });
    }
};
