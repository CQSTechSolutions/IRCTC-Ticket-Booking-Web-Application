import express from "express";
import cors from "cors";
import dotenv from "dotenv";

// other imports 
import dbConn from "./src/utils/db.js";
import authRoute from "./src/routes/authRoute.js"
import trainRoute from "./src/routes/trainRoute.js"
import bookingRoute from "./src/routes/bookingRoute.js"

dotenv.config({ path: './.env.local' });
const app = express();
const port = process.env.PORT;

const allowedOrigins = process.env.CLIENT_URL ? process.env.CLIENT_URL.split(',') : [];
app.use(cors({
    origin: (origin, callback) => {
        if (allowedOrigins.includes(origin) || !origin) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/api/auth', authRoute);
app.use('/api/trains', trainRoute);
app.use('/api/bookings', bookingRoute);

dbConn();

app.get('/',(req,res)=>{
    res.send("Server is running");
})

app.listen(port,()=>{
    console.log(`Server is running on port ${port}`);
})