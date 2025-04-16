import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Train from '../models/trainModel.js';

dotenv.config({ path: './.env.local' });

const trains = [
  {
    trainNumber: "12301",
    trainName: "Rajdhani Express",
    trainType: "Rajdhani",
    source: "NDLS",
    destination: "HWH",
    departureTime: "16:30",
    arrivalTime: "10:05",
    duration: "17h 35m",
    distance: 1451,
    averageSpeed: 83,
    classes: ["1A", "2A", "3A"],
    farePerKm: {
      "1A": 4.0,
      "2A": 2.5,
      "3A": 1.8,
    },
    availableSeats: {
      "1A": 18,
      "2A": 46,
      "3A": 64
    },
    stations: [
      { stationCode: "NDLS", stationName: "New Delhi", day: 1, arrivalTime: "16:00", departureTime: "16:30", distance: 0, platform: 9 },
      { stationCode: "CNB", stationName: "Kanpur Central", day: 1, arrivalTime: "21:05", departureTime: "21:10", distance: 440, platform: 1 },
      { stationCode: "PRYJ", stationName: "Prayagraj Junction", day: 1, arrivalTime: "23:00", departureTime: "23:05", distance: 642, platform: 6 },
      { stationCode: "MGS", stationName: "Mughal Sarai Junction", day: 2, arrivalTime: "00:15", departureTime: "00:20", distance: 788, platform: 7 },
      { stationCode: "GAYA", stationName: "Gaya Junction", day: 2, arrivalTime: "02:31", departureTime: "02:33", distance: 998, platform: 1 },
      { stationCode: "DHN", stationName: "Dhanbad Junction", day: 2, arrivalTime: "04:35", departureTime: "04:40", distance: 1158, platform: 3 },
      { stationCode: "ASN", stationName: "Asansol Junction", day: 2, arrivalTime: "05:55", departureTime: "06:00", distance: 1245, platform: 2 },
      { stationCode: "HWH", stationName: "Howrah Junction", day: 2, arrivalTime: "10:05", departureTime: "10:35", distance: 1451, platform: 9 }
    ],
    runsOnDays: {
      monday: true,
      tuesday: true,
      wednesday: true,
      thursday: true,
      friday: true,
      saturday: true,
      sunday: true
    },
    status: "Active",
    amenities: ["Pantry", "Bedroll", "Reading Light", "Power Socket", "Bio Toilet", "Security", "Food"]
  },
  {
    trainNumber: "12951",
    trainName: "Mumbai Rajdhani",
    trainType: "Rajdhani",
    source: "NDLS",
    destination: "MMCT",
    departureTime: "16:00",
    arrivalTime: "08:00",
    duration: "16h 00m",
    distance: 1384,
    averageSpeed: 86,
    classes: ["1A", "2A", "3A"],
    farePerKm: {
      "1A": 4.0,
      "2A": 2.5,
      "3A": 1.8,
    },
    availableSeats: {
      "1A": 22,
      "2A": 48,
      "3A": 70
    },
    stations: [
      { stationCode: "NDLS", stationName: "New Delhi", day: 1, arrivalTime: "15:30", departureTime: "16:00", distance: 0, platform: 3 },
      { stationCode: "KTT", stationName: "Kota Junction", day: 1, arrivalTime: "22:05", departureTime: "22:10", distance: 458, platform: 1 },
      { stationCode: "RTM", stationName: "Ratlam Junction", day: 2, arrivalTime: "01:23", departureTime: "01:25", distance: 726, platform: 4 },
      { stationCode: "BRC", stationName: "Vadodara Junction", day: 2, arrivalTime: "03:54", departureTime: "03:59", distance: 998, platform: 1 },
      { stationCode: "ST", stationName: "Surat", day: 2, arrivalTime: "05:33", departureTime: "05:35", distance: 1159, platform: 3 },
      { stationCode: "BVI", stationName: "Borivali", day: 2, arrivalTime: "07:30", departureTime: "07:32", distance: 1325, platform: 2 },
      { stationCode: "MMCT", stationName: "Mumbai Central", day: 2, arrivalTime: "08:00", departureTime: "08:30", distance: 1384, platform: 4 }
    ],
    runsOnDays: {
      monday: true,
      tuesday: true,
      wednesday: true,
      thursday: true,
      friday: true,
      saturday: true,
      sunday: true
    },
    status: "Active",
    amenities: ["Pantry", "Bedroll", "Reading Light", "Power Socket", "Bio Toilet", "Security", "Food"]
  },
  {
    trainNumber: "12002",
    trainName: "New Delhi - Bhopal Shatabdi Express",
    trainType: "Shatabdi",
    source: "NDLS",
    destination: "BPL",
    departureTime: "06:00",
    arrivalTime: "13:35",
    duration: "7h 35m",
    distance: 702,
    averageSpeed: 93,
    classes: ["CC", "2A"],
    farePerKm: {
      "CC": 1.5,
      "2A": 2.5,
    },
    availableSeats: {
      "CC": 72,
      "2A": 56
    },
    stations: [
      { stationCode: "NDLS", stationName: "New Delhi", day: 1, arrivalTime: "05:30", departureTime: "06:00", distance: 0, platform: 1 },
      { stationCode: "MTJ", stationName: "Mathura Junction", day: 1, arrivalTime: "07:40", departureTime: "07:42", distance: 141, platform: 2 },
      { stationCode: "AGC", stationName: "Agra Cantt", day: 1, arrivalTime: "08:10", departureTime: "08:15", distance: 188, platform: 6 },
      { stationCode: "GWL", stationName: "Gwalior", day: 1, arrivalTime: "09:35", departureTime: "09:40", distance: 305, platform: 1 },
      { stationCode: "JHS", stationName: "Jhansi", day: 1, arrivalTime: "10:30", departureTime: "10:35", distance: 403, platform: 1 },
      { stationCode: "BPL", stationName: "Bhopal", day: 1, arrivalTime: "13:35", departureTime: "14:00", distance: 702, platform: 1 }
    ],
    runsOnDays: {
      monday: true,
      tuesday: true,
      wednesday: true,
      thursday: true,
      friday: true,
      saturday: true,
      sunday: true
    },
    status: "Active",
    amenities: ["WiFi", "Pantry", "Power Socket", "Food", "Reading Light"]
  },
  {
    trainNumber: "12626",
    trainName: "Kerala Express",
    trainType: "Superfast",
    source: "NDLS",
    destination: "TVC",
    departureTime: "11:25",
    arrivalTime: "18:15",
    duration: "42h 50m",
    distance: 3032,
    averageSpeed: 71,
    classes: ["2A", "3A", "SL", "2S", "GN"],
    farePerKm: {
      "2A": 2.5,
      "3A": 1.8,
      "SL": 1.0,
      "2S": 0.6,
      "GN": 0.4
    },
    availableSeats: {
      "2A": 42,
      "3A": 64,
      "SL": 280,
      "2S": 100,
      "GN": 150
    },
    stations: [
      { stationCode: "NDLS", stationName: "New Delhi", day: 1, arrivalTime: "11:00", departureTime: "11:25", distance: 0, platform: 8 },
      { stationCode: "MTJ", stationName: "Mathura Junction", day: 1, arrivalTime: "13:25", departureTime: "13:27", distance: 141, platform: 3 },
      { stationCode: "KOTA", stationName: "Kota Junction", day: 1, arrivalTime: "17:37", departureTime: "17:40", distance: 465, platform: 3 },
      { stationCode: "NGP", stationName: "Nagpur", day: 2, arrivalTime: "05:45", departureTime: "05:50", distance: 1090, platform: 1 },
      { stationCode: "SC", stationName: "Secunderabad Junction", day: 2, arrivalTime: "14:15", departureTime: "14:25", distance: 1658, platform: 7 },
      { stationCode: "MAS", stationName: "Chennai Central", day: 3, arrivalTime: "05:00", departureTime: "05:15", distance: 2175, platform: 5 },
      { stationCode: "ERS", stationName: "Ernakulam Junction", day: 3, arrivalTime: "15:25", departureTime: "15:30", distance: 2617, platform: 2 },
      { stationCode: "TVC", stationName: "Thiruvananthapuram Central", day: 3, arrivalTime: "18:15", departureTime: "18:45", distance: 3032, platform: 3 }
    ],
    runsOnDays: {
      monday: true,
      tuesday: true,
      wednesday: true,
      thursday: false,
      friday: true,
      saturday: false,
      sunday: true
    },
    status: "Active",
    amenities: ["Pantry", "Bedroll", "Bio Toilet", "Food"]
  },
  {
    trainNumber: "20901",
    trainName: "Mumbai - Ahmedabad Tejas Express",
    trainType: "Superfast",
    source: "MMCT",
    destination: "ADI",
    departureTime: "06:25",
    arrivalTime: "13:10",
    duration: "6h 45m",
    distance: 491,
    averageSpeed: 73,
    classes: ["CC", "2A"],
    farePerKm: {
      "CC": 1.5,
      "2A": 2.5,
    },
    availableSeats: {
      "CC": 88,
      "2A": 56
    },
    stations: [
      { stationCode: "MMCT", stationName: "Mumbai Central", day: 1, arrivalTime: "06:00", departureTime: "06:25", distance: 0, platform: 4 },
      { stationCode: "BVI", stationName: "Borivali", day: 1, arrivalTime: "06:58", departureTime: "07:00", distance: 35, platform: 1 },
      { stationCode: "ST", stationName: "Surat", day: 1, arrivalTime: "08:58", departureTime: "09:00", distance: 263, platform: 2 },
      { stationCode: "BRC", stationName: "Vadodara Junction", day: 1, arrivalTime: "10:44", departureTime: "10:47", distance: 392, platform: 2 },
      { stationCode: "ADI", stationName: "Ahmedabad Junction", day: 1, arrivalTime: "13:10", departureTime: "13:40", distance: 491, platform: 5 }
    ],
    runsOnDays: {
      monday: true,
      tuesday: true,
      wednesday: true,
      thursday: true,
      friday: true,
      saturday: true,
      sunday: false
    },
    status: "Active",
    amenities: ["WiFi", "Pantry", "Power Socket", "Reading Light", "Food"]
  },
  {
    trainNumber: "12802",
    trainName: "Purushottam Express",
    trainType: "Superfast",
    source: "NDLS",
    destination: "PURI",
    departureTime: "22:40",
    arrivalTime: "05:30",
    duration: "30h 50m",
    distance: 2039,
    averageSpeed: 66,
    classes: ["2A", "3A", "SL"],
    farePerKm: {
      "2A": 2.5,
      "3A": 1.8,
      "SL": 1.0,
    },
    availableSeats: {
      "2A": 46,
      "3A": 64,
      "SL": 240
    },
    stations: [
      { stationCode: "NDLS", stationName: "New Delhi", day: 1, arrivalTime: "22:15", departureTime: "22:40", distance: 0, platform: 5 },
      { stationCode: "CNB", stationName: "Kanpur Central", day: 2, arrivalTime: "03:45", departureTime: "03:50", distance: 435, platform: 1 },
      { stationCode: "PRYJ", stationName: "Prayagraj Junction", day: 2, arrivalTime: "05:55", departureTime: "06:05", distance: 633, platform: 9 },
      { stationCode: "MGS", stationName: "Mughal Sarai Junction", day: 2, arrivalTime: "07:30", departureTime: "07:40", distance: 788, platform: 10 },
      { stationCode: "GAYA", stationName: "Gaya Junction", day: 2, arrivalTime: "09:55", departureTime: "10:00", distance: 997, platform: 1 },
      { stationCode: "DHN", stationName: "Dhanbad Junction", day: 2, arrivalTime: "12:48", departureTime: "12:53", distance: 1158, platform: 3 },
      { stationCode: "HWH", stationName: "Howrah Junction", day: 2, arrivalTime: "16:45", departureTime: "17:10", distance: 1452, platform: 9 },
      { stationCode: "KGP", stationName: "Kharagpur Junction", day: 2, arrivalTime: "18:35", departureTime: "18:40", distance: 1594, platform: 5 },
      { stationCode: "BBS", stationName: "Bhubaneswar", day: 3, arrivalTime: "01:30", departureTime: "01:35", distance: 1922, platform: 2 },
      { stationCode: "PURI", stationName: "Puri", day: 3, arrivalTime: "05:30", departureTime: "06:00", distance: 2039, platform: 1 }
    ],
    runsOnDays: {
      monday: false,
      tuesday: true,
      wednesday: false,
      thursday: true,
      friday: false,
      saturday: true,
      sunday: false
    },
    status: "Active",
    amenities: ["Pantry", "Bedroll", "Power Socket", "Bio Toilet", "Security"]
  },
  {
    trainNumber: "12303",
    trainName: "Poorva Express",
    trainType: "Superfast",
    source: "HWH",
    destination: "NDLS",
    departureTime: "20:25",
    arrivalTime: "18:35",
    duration: "22h 10m",
    distance: 1446,
    averageSpeed: 65,
    classes: ["2A", "3A", "SL", "2S"],
    farePerKm: {
      "2A": 2.5,
      "3A": 1.8,
      "SL": 1.0,
      "2S": 0.6,
    },
    availableSeats: {
      "2A": 48,
      "3A": 72,
      "SL": 320,
      "2S": 144
    },
    stations: [
      { stationCode: "HWH", stationName: "Howrah Junction", day: 1, arrivalTime: "20:00", departureTime: "20:25", distance: 0, platform: 9 },
      { stationCode: "DHN", stationName: "Dhanbad Junction", day: 2, arrivalTime: "00:05", departureTime: "00:10", distance: 258, platform: 4 },
      { stationCode: "GAYA", stationName: "Gaya Junction", day: 2, arrivalTime: "02:13", departureTime: "02:15", distance: 448, platform: 1 },
      { stationCode: "MGS", stationName: "Mughal Sarai Junction", day: 2, arrivalTime: "04:04", departureTime: "04:09", distance: 658, platform: 9 },
      { stationCode: "PRYJ", stationName: "Prayagraj Junction", day: 2, arrivalTime: "05:45", departureTime: "05:50", distance: 813, platform: 6 },
      { stationCode: "CNB", stationName: "Kanpur Central", day: 2, arrivalTime: "08:25", departureTime: "08:30", distance: 1011, platform: 1 },
      { stationCode: "NDLS", stationName: "New Delhi", day: 2, arrivalTime: "18:35", departureTime: "19:00", distance: 1446, platform: 5 }
    ],
    runsOnDays: {
      monday: true,
      tuesday: false,
      wednesday: true,
      thursday: false,
      friday: true,
      saturday: true,
      sunday: false
    },
    status: "Active",
    amenities: ["Pantry", "Bedroll", "Bio Toilet", "Security", "Food"]
  },
  {
    trainNumber: "12381",
    trainName: "Poorabiya Express",
    trainType: "Superfast",
    source: "HWH",
    destination: "NDLS",
    departureTime: "23:45",
    arrivalTime: "19:55",
    duration: "20h 10m",
    distance: 1446,
    averageSpeed: 72,
    classes: ["1A", "2A", "3A", "SL"],
    farePerKm: {
      "1A": 4.0,
      "2A": 2.5,
      "3A": 1.8,
      "SL": 1.0,
    },
    availableSeats: {
      "1A": 22,
      "2A": 46,
      "3A": 64,
      "SL": 280
    },
    stations: [
      { stationCode: "HWH", stationName: "Howrah Junction", day: 1, arrivalTime: "23:20", departureTime: "23:45", distance: 0, platform: 9 },
      { stationCode: "ASN", stationName: "Asansol Junction", day: 2, arrivalTime: "01:54", departureTime: "01:56", distance: 200, platform: 2 },
      { stationCode: "GAYA", stationName: "Gaya Junction", day: 2, arrivalTime: "04:13", departureTime: "04:16", distance: 448, platform: 1 },
      { stationCode: "DDU", stationName: "Pt. DD Upadhyaya Junction", day: 2, arrivalTime: "06:15", departureTime: "06:20", distance: 658, platform: 9 },
      { stationCode: "PRYJ", stationName: "Prayagraj Junction", day: 2, arrivalTime: "07:40", departureTime: "07:45", distance: 813, platform: 6 },
      { stationCode: "CNB", stationName: "Kanpur Central", day: 2, arrivalTime: "10:15", departureTime: "10:20", distance: 1011, platform: 1 },
      { stationCode: "NDLS", stationName: "New Delhi", day: 2, arrivalTime: "19:55", departureTime: "20:20", distance: 1446, platform: 3 }
    ],
    runsOnDays: {
      monday: false,
      tuesday: true,
      wednesday: false,
      thursday: true,
      friday: false,
      saturday: false,
      sunday: true
    },
    status: "Active",
    amenities: ["Pantry", "Bedroll", "Reading Light", "Power Socket", "Bio Toilet", "Security", "Food"]
  },
  {
    trainNumber: "12565",
    trainName: "Bihar Sampark Kranti Express",
    trainType: "Superfast",
    source: "NDLS",
    destination: "DBG",
    departureTime: "14:20",
    arrivalTime: "19:55",
    duration: "29h 35m",
    distance: 1198,
    averageSpeed: 40,
    classes: ["2A", "3A", "SL"],
    farePerKm: {
      "2A": 2.5,
      "3A": 1.8,
      "SL": 1.0,
    },
    availableSeats: {
      "2A": 44,
      "3A": 64,
      "SL": 240
    },
    stations: [
      { stationCode: "NDLS", stationName: "New Delhi", day: 1, arrivalTime: "14:00", departureTime: "14:20", distance: 0, platform: 9 },
      { stationCode: "CNB", stationName: "Kanpur Central", day: 1, arrivalTime: "19:35", departureTime: "19:40", distance: 435, platform: 1 },
      { stationCode: "PRYJ", stationName: "Prayagraj Junction", day: 1, arrivalTime: "22:00", departureTime: "22:10", distance: 633, platform: 4 },
      { stationCode: "DDU", stationName: "Pt. DD Upadhyaya Junction", day: 2, arrivalTime: "00:14", departureTime: "00:19", distance: 797, platform: 3 },
      { stationCode: "BSB", stationName: "Varanasi Junction", day: 2, arrivalTime: "01:20", departureTime: "01:35", distance: 825, platform: 9 },
      { stationCode: "CPR", stationName: "Chhapra", day: 2, arrivalTime: "04:35", departureTime: "04:40", distance: 952, platform: 2 },
      { stationCode: "SEE", stationName: "Sonpur", day: 2, arrivalTime: "07:13", departureTime: "07:15", distance: 1049, platform: 1 },
      { stationCode: "MFP", stationName: "Muzaffarpur Junction", day: 2, arrivalTime: "08:50", departureTime: "08:55", distance: 1073, platform: 1 },
      { stationCode: "SPJ", stationName: "Samastipur Junction", day: 2, arrivalTime: "12:45", departureTime: "12:50", distance: 1123, platform: 4 },
      { stationCode: "DBG", stationName: "Darbhanga Junction", day: 2, arrivalTime: "19:55", departureTime: "20:15", distance: 1198, platform: 1 }
    ],
    runsOnDays: {
      monday: true,
      tuesday: false, 
      wednesday: true,
      thursday: false,
      friday: true,
      saturday: false,
      sunday: false
    },
    status: "Active",
    amenities: ["Pantry", "Power Socket", "Bio Toilet", "Security"]
  },
  {
    trainNumber: "12243",
    trainName: "Chennai - Coimbatore Shatabdi Express",
    trainType: "Shatabdi",
    source: "MAS",
    destination: "CBE",
    departureTime: "07:10",
    arrivalTime: "13:15",
    duration: "6h 05m",
    distance: 497,
    averageSpeed: 82,
    classes: ["CC", "2A"],
    farePerKm: {
      "CC": 1.5,
      "2A": 2.5,
    },
    availableSeats: {
      "CC": 56,
      "2A": 72
    },
    stations: [
      { stationCode: "MAS", stationName: "Chennai Central", day: 1, arrivalTime: "06:45", departureTime: "07:10", distance: 0, platform: 8 },
      { stationCode: "AJJ", stationName: "Arakkonam", day: 1, arrivalTime: "08:13", departureTime: "08:15", distance: 69, platform: 1 },
      { stationCode: "KPD", stationName: "Katpadi Junction", day: 1, arrivalTime: "09:13", departureTime: "09:15", distance: 129, platform: 1 },
      { stationCode: "SBC", stationName: "KSR Bengaluru", day: 1, arrivalTime: "10:45", departureTime: "10:50", distance: 291, platform: 4 },
      { stationCode: "SA", stationName: "Salem Junction", day: 1, arrivalTime: "12:00", departureTime: "12:05", distance: 389, platform: 2 },
      { stationCode: "CBE", stationName: "Coimbatore Junction", day: 1, arrivalTime: "13:15", departureTime: "13:45", distance: 497, platform: 1 }
    ],
    runsOnDays: {
      monday: true,
      tuesday: true,
      wednesday: true,
      thursday: true,
      friday: true,
      saturday: true,
      sunday: false
    },
    status: "Active",
    amenities: ["WiFi", "Pantry", "Power Socket", "Food", "Reading Light"]
  }
];

const seedTrains = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log('Connected to MongoDB');

    // Clear existing trains
    await Train.deleteMany({});
    console.log('Cleared existing trains');

    // Insert new trains
    await Train.insertMany(trains);
    console.log('Sample trains have been seeded successfully');

    await mongoose.connection.close();
    console.log('MongoDB connection closed');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding trains:', error);
    process.exit(1);
  }
};

seedTrains(); 