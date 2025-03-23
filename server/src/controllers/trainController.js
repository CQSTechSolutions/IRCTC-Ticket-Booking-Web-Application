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

        const trains = await Train.findTrainsBetweenStations(fromStation, toStation);
        
        // Filter trains by date if provided
        let filteredTrains = trains;
        if (date) {
            const dayOfWeek = new Date(date).toLocaleLowerCase();
            filteredTrains = trains.filter(train => train.runsOnDays[dayOfWeek]);
        }

        res.status(200).json({
            success: true,
            count: filteredTrains.length,
            data: filteredTrains
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to search trains",
            error: error.message
        });
    }
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
