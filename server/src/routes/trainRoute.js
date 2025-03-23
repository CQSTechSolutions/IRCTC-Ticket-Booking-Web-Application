import express from "express";
import { 
    addTrain, 
    getAllTrains, 
    getTrainById, 
    updateTrain, 
    deleteTrain,
    searchTrains,
    getIntermediateStations,
    calculateFare
} from "../controllers/trainController.js";

const router = express.Router();

// Basic CRUD operations
router.post("/add", addTrain);
router.get("/", getAllTrains);
router.get("/:id", getTrainById);
router.put("/:id", updateTrain);
router.delete("/:id", deleteTrain);

// Search and advanced operations
router.get("/search", searchTrains);
router.get("/:trainId/intermediate/:fromStation/:toStation", getIntermediateStations);
router.get("/:trainId/fare/:fromStation/:toStation/:classType", calculateFare);

export default router;