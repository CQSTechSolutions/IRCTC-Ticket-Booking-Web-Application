import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Container,
  Grid,
  Card,
  CardContent,
  CardActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Avatar,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tabs,
  Tab,
  Snackbar,
  Alert,
  CircularProgress,
  useTheme,
  createTheme,
  ThemeProvider,
  CssBaseline,
  AppBar, // Added AppBar for structure
  Toolbar, // Added Toolbar
} from '@mui/material';

import {
  Send as SendIcon,
  LocationOn,
  Train as TrainIcon,
  AttachMoney,
  Person as PersonIcon,
  CalendarMonth as CalendarIcon,
  DirectionsTransit as TransitIcon,
  EmojiPeople as PassengerIcon,
  AttachMoney as PaymentIcon,
  QrCode2 as QrCodeIcon,
  LocationOn as LocationIcon,
  Receipt as TicketIcon,
  AirlineSeatReclineNormal as SeatIcon,
  Restaurant as MealIcon,
  Speed as TatkalIcon,
  Settings as SettingsIcon,
  MoreVert as MoreIcon,
  DarkMode as DarkModeIcon,
  LightMode as LightModeIcon,
  Favorite as FavoriteIcon,
  Close as CloseIcon, // Added CloseIcon for Dialog
} from '@mui/icons-material';

// Mock data for train stations
const TRAIN_STATIONS = [
  'New Delhi', 'Mumbai Central', 'Chennai Central', 'Kolkata Howrah',
  'Bengaluru City Junction', 'Hyderabad Deccan', 'Ahmedabad Junction',
  'Pune Junction', 'Jaipur Junction', 'Lucknow Charbagh'
];

// Mock data for trains
const TRAINS = [
  { number: '12301', name: 'Rajdhani Express', from: 'New Delhi', to: 'Kolkata Howrah', departure: '16:10', arrival: '10:05', duration: '17h 55m', classes: ['3A', '2A', '1A'] },
  { number: '12951', name: 'Mumbai Rajdhani', from: 'New Delhi', to: 'Mumbai Central', departure: '16:25', arrival: '08:15', duration: '15h 50m', classes: ['3A', '2A', '1A'] },
  { number: '12259', name: 'Sealdah Duronto', from: 'New Delhi', to: 'Kolkata Howrah', departure: '12:55', arrival: '03:55', duration: '15h 00m', classes: ['3A', '2A', '1A', 'EC'] },
  { number: '12303', name: 'Poorva Express', from: 'New Delhi', to: 'Kolkata Howrah', departure: '17:45', arrival: '17:50', duration: '24h 05m', classes: ['SL', '3A', '2A'] },
  { number: '12019', name: 'Shatabdi Express', from: 'New Delhi', to: 'Lucknow Charbagh', departure: '06:10', arrival: '12:40', duration: '6h 30m', classes: ['CC', 'EC'] },
  // Added more potential matches for testing
  { number: '12452', name: 'Shram Shakti Exp', from: 'New Delhi', to: 'Kanpur Central', departure: '23:55', arrival: '06:00', duration: '6h 05m', classes: ['SL', '3A'] },
  { number: '12816', name: 'Nandankanan Exp', from: 'New Delhi', to: 'Puri', departure: '07:30', arrival: '13:15', duration: '29h 45m', classes: ['SL', '3A', '2A'] },
  { number: '22692', name: 'Bengaluru Rajdhani', from: 'New Delhi', to: 'Bengaluru City Junction', departure: '20:45', arrival: '05:20', duration: '32h 35m', classes: ['3A', '2A', '1A'] },
  { number: '12138', name: 'Punjab Mail', from: 'New Delhi', to: 'Mumbai Central', departure: '05:10', arrival: '07:35', duration: '26h 25m', classes: ['SL', '3A', '2A'] },
];

// Function to generate fake PNR
const generatePNR = () => {
  return Math.floor(1000000000 + Math.random() * 9000000000).toString();
};

// Main ChatBot component
const TrainBookingChatbot = () => {
  const [darkMode, setDarkMode] = useState(false);
  // Use createTheme inside the component to react to darkMode changes
  const customTheme = React.useMemo(
    () =>
      createTheme({
        palette: {
          mode: darkMode ? 'dark' : 'light',
          primary: {
            main: '#1976d2', // Blue
          },
          secondary: {
            main: '#f50057', // Pink
          },
          background: {
            default: darkMode ? '#121212' : '#f4f6f8',
            paper: darkMode ? '#1e1e1e' : '#ffffff',
          },
        },
        typography: {
            fontFamily: 'Roboto, Arial, sans-serif',
        }
      }),
    [darkMode],
  );
  // Need ThemeProvider wrapper around the component return
  return (
    <ThemeProvider theme={customTheme}>
        <CssBaseline />
        <TrainBookingChatbotContent darkMode={darkMode} setDarkMode={setDarkMode} />
    </ThemeProvider>
  );
}

// Extracted content to access theme properly
const TrainBookingChatbotContent = ({ darkMode, setDarkMode }) => {
  const theme = useTheme(); // Now useTheme can access the context provided by ThemeProvider
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hi! I'm your train booking assistant. How can I help you today? You can book a regular ticket, a Tatkal ticket, or check ticket status.",
      sender: 'bot',
      options: ['Book Regular Ticket', 'Book Tatkal Ticket', 'Check PNR Status', 'Popular Routes']
    }
  ]);
  const [input, setInput] = useState('');
  const [bookingState, setBookingState] = useState({
    step: 0,
    from: '',
    to: '',
    date: '',
    class: '',
    passengers: [],
    passengerCount: 0, // Added passengerCount explicitly
    currentPassenger: 1, // Added currentPassenger explicitly
    trainPreference: '',
    autoUpgrade: false,
    mealPreference: '',
    payment: '',
    confirmBeforePayment: true,
    isTatkal: false
  });
  const [currentTab, setCurrentTab] = useState(0); // Currently unused, but kept for potential future tabs
  const [showTicket, setShowTicket] = useState(false);
  const [ticketDetails, setTicketDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });
  const messagesEndRef = useRef(null);


  // Scroll to bottom when messages update
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Handle user input
  const handleSendMessage = () => {
    if (input.trim() === '') return;

    const userMessage = {
      id: Date.now(), // Use timestamp for unique ID
      text: input,
      sender: 'user'
    };

    setMessages(prev => [...prev, userMessage]);
    processUserInput(input);
    setInput('');
  };

  // Handle button option click
  const handleOptionClick = (option) => {
    const userMessage = {
      id: Date.now(), // Use timestamp for unique ID
      text: option,
      sender: 'user'
    };

    setMessages(prev => [...prev, userMessage]);
    processUserInput(option);
  };

  // Process user input and determine next steps
  const processUserInput = (text) => {
    const botMessageId = Date.now() + 1; // Unique ID for bot response

    // Reset PNR check state if user starts a new booking flow
    if (bookingState.step === 'pnr' && (text.toLowerCase().includes('book') || text.toLowerCase().includes('routes'))) {
        setBookingState(prev => ({ ...prev, step: 0 }));
    }

    // Start booking flows
    if ((bookingState.step === 0 || bookingState.step === 'pnr') && (text.toLowerCase().includes('book regular ticket') || text.toLowerCase().includes('regular ticket') || text.toLowerCase().startsWith('book') && !text.toLowerCase().includes('tatkal'))) {
      resetBookingState(); // Reset before starting new booking
      setBookingState(prev => ({ ...prev, step: 1, isTatkal: false }));
      askForDepartureStation(botMessageId);
    }
    else if ((bookingState.step === 0 || bookingState.step === 'pnr') && (text.toLowerCase().includes('book tatkal ticket') || text.toLowerCase().includes('tatkal'))) {
      resetBookingState(); // Reset before starting new booking
      setBookingState(prev => ({ ...prev, step: 1, isTatkal: true }));
      const botMessage = {
        id: botMessageId,
        text: "You've selected Tatkal booking. Tatkal booking opens at 10:00 AM for AC classes and 11:00 AM for non-AC classes, one day before the journey. Let's proceed with your booking details.",
        sender: 'bot'
      };
      setMessages(prev => [...prev, botMessage]);
      askForDepartureStation(botMessageId + 1);
    }
    else if ((bookingState.step === 0 || bookingState.step === 'pnr') && (text.toLowerCase().includes('check pnr') || text.toLowerCase().includes('status'))) {
      resetBookingState(); // Reset any partial booking
      const botMessage = {
        id: botMessageId,
        text: "Please enter your 10-digit PNR number to check status:",
        sender: 'bot'
      };
      setMessages(prev => [...prev, botMessage]);
      setBookingState(prev => ({ ...prev, step: 'pnr' }));
    }
    else if (bookingState.step === 0 && text.toLowerCase().includes('popular routes')) {
      showPopularRoutes(botMessageId);
    }
    // Handle booking flow steps
    else if (bookingState.step === 'pnr') {
      // Simulating PNR check
      if (text.match(/^\d{10}$/)) {
        setLoading(true);
        setTimeout(() => {
          setLoading(false);
          const mockTicket = generateMockTicket(text);
          setTicketDetails(mockTicket);
          setShowTicket(true);

          const botMessage = {
            id: botMessageId,
            text: `PNR ${text} found! Your ticket from ${mockTicket.from} to ${mockTicket.to} on ${mockTicket.date} has status: ${mockTicket.status}. I've opened the ticket details for you. What else can I help with?`,
            sender: 'bot',
            options: ['Book Regular Ticket', 'Book Tatkal Ticket', 'Check Another PNR']
          };
          setMessages(prev => [...prev, botMessage]);
          // Don't reset PNR state here, allow checking another PNR
        }, 2000);
      } else {
        const botMessage = {
          id: botMessageId,
          text: "Please enter a valid 10-digit PNR number.",
          sender: 'bot'
        };
        setMessages(prev => [...prev, botMessage]);
      }
    }
    else if (bookingState.step === 1) {
      // Process departure station
      const matchedStation = TRAIN_STATIONS.find(station =>
          station.toLowerCase() === text.toLowerCase() || station.toLowerCase().includes(text.toLowerCase())
      );
      if (matchedStation) {
        setBookingState(prev => ({ ...prev, from: matchedStation, step: 2 }));
        askForDestinationStation(matchedStation, botMessageId);
      } else {
        const suggestedStations = TRAIN_STATIONS.filter(station => station.toLowerCase().includes(text.toLowerCase())).slice(0, 3);
        const botMessage = {
          id: botMessageId,
          text: `I couldn't find the station "${text}". Did you mean one of these? Or try entering the full name.`,
          sender: 'bot',
          options: suggestedStations.length > 0 ? suggestedStations : TRAIN_STATIONS.slice(0, 3)
        };
        setMessages(prev => [...prev, botMessage]);
      }
    }
    else if (bookingState.step === 2) {
      // Process destination station
      const matchedStation = TRAIN_STATIONS.find(station =>
        station.toLowerCase() === text.toLowerCase() || station.toLowerCase().includes(text.toLowerCase())
      );

      if (matchedStation) {
        if (matchedStation === bookingState.from) {
          const botMessage = {
            id: botMessageId,
            text: `Destination cannot be the same as departure (${bookingState.from}). Please choose a different destination.`,
            sender: 'bot'
          };
          setMessages(prev => [...prev, botMessage]);
          return;
        }

        setBookingState(prev => ({ ...prev, to: matchedStation, step: 3 }));
        askForTravelDate(botMessageId);
      } else {
        const suggestedStations = TRAIN_STATIONS.filter(s => s !== bookingState.from && s.toLowerCase().includes(text.toLowerCase())).slice(0, 3);
        const botMessage = {
          id: botMessageId,
          text: `I couldn't find the destination station "${text}". Did you mean one of these? Or try entering the full name.`,
          sender: 'bot',
          options: suggestedStations.length > 0 ? suggestedStations : TRAIN_STATIONS.filter(s => s !== bookingState.from).slice(0, 3)
        };
        setMessages(prev => [...prev, botMessage]);
      }
    }
    else if (bookingState.step === 3) {
      // Process travel date
      const dateRegex = /^(\d{1,2})[-/](\d{1,2})[-/](\d{4})$/; // More flexible date format
      let selectedDate;
      let formattedDate;

      if (dateRegex.test(text)) {
          const [, day, month, year] = text.match(dateRegex);
          // Basic validation for month/day (doesn't check days in month perfectly)
          if (parseInt(month) > 0 && parseInt(month) <= 12 && parseInt(day) > 0 && parseInt(day) <= 31) {
              selectedDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
              formattedDate = `${String(day).padStart(2, '0')}-${String(month).padStart(2, '0')}-${year}`;
          }
      } else {
          // Try parsing less strict formats (e.g., "tomorrow", "today", "next monday") - Simplified for now
          const lowerText = text.toLowerCase();
          const today = new Date();
          today.setHours(0, 0, 0, 0); // Normalize today to midnight

          if (lowerText === 'today') {
              selectedDate = new Date(today);
          } else if (lowerText === 'tomorrow') {
              selectedDate = new Date(today);
              selectedDate.setDate(today.getDate() + 1);
          }
          // Add more date parsing logic if needed

          if (selectedDate) {
              formattedDate = `${String(selectedDate.getDate()).padStart(2, '0')}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}-${selectedDate.getFullYear()}`;
          }
      }


      if (selectedDate) {
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Compare dates without time

        if (selectedDate < today) {
          const botMessage = {
            id: botMessageId,
            text: `You can't book tickets for past dates. Please enter a future date (DD-MM-YYYY).`,
            sender: 'bot'
          };
          setMessages(prev => [...prev, botMessage]);
          return;
        }

        setBookingState(prev => ({ ...prev, date: formattedDate, step: 4 }));
        askForTrainClass(botMessageId);
      } else {
        const botMessage = {
          id: botMessageId,
          text: "Please enter the date in DD-MM-YYYY format, or try 'today' or 'tomorrow'.",
          sender: 'bot'
        };
        setMessages(prev => [...prev, botMessage]);
      }
    }
    else if (bookingState.step === 4) {
      // Process train class
      const classes = ['SL', '3A', '2A', 'EC', 'CC', '1A'];
      const classMap = {
        'sleeper': 'SL',
        'sl': 'SL',
        'ac 3': '3A',
        '3a': '3A',
        'ac 2': '2A',
        '2a': '2A',
        'chair': 'CC', // Default chair car to CC
        'cc': 'CC',
        'executive': 'EC',
        'ec': 'EC',
        'first ac': '1A',
        '1a': '1A',
      };
      let selectedClass = null;
      const lowerText = text.toLowerCase();

      // Check direct codes first
      if(classes.includes(text.toUpperCase())){
          selectedClass = text.toUpperCase();
      } else {
          // Check keywords
          for (const key in classMap) {
              if (lowerText.includes(key)) {
                  selectedClass = classMap[key];
                  break;
              }
          }
      }


      if (selectedClass) {
        setBookingState(prev => ({ ...prev, class: selectedClass, step: 5 }));
        askForPassengerCount(botMessageId);
      } else {
        const botMessage = {
          id: botMessageId,
          text: "Please select a valid train class (e.g., SL, 3A, Sleeper, AC 2-Tier).",
          sender: 'bot',
          options: ['Sleeper (SL)', 'AC 3-Tier (3A)', 'AC 2-Tier (2A)', 'Executive Chair Car (EC)']
        };
        setMessages(prev => [...prev, botMessage]);
      }
    }
    else if (bookingState.step === 5) {
      // Process passenger count
      const count = parseInt(text);
      if (!isNaN(count) && count > 0 && count <= 6) {
        setBookingState(prev => ({ ...prev, passengerCount: count, step: 6, currentPassenger: 1, passengers: [] }));
        askForPassengerDetails(1, count, botMessageId);
      } else {
        const botMessage = {
          id: botMessageId,
          text: "Please enter a valid number of passengers (1-6).",
          sender: 'bot',
          options: ['1', '2', '3', '4']
        };
        setMessages(prev => [...prev, botMessage]);
      }
    }
    else if (bookingState.step === 6) {
      // Process passenger details
      // Expect format: Name, Age, Gender
      const detailsRegex = /^([a-zA-Z\s.'-]+),\s*(\d{1,3}),\s*(male|female|m|f|other|o)$/i; // Allow dots, apostrophes, hyphens in names, 3 digit age, other gender
      if (detailsRegex.test(text)) {
        const [, name, ageStr, genderStr] = text.match(detailsRegex);
        const age = parseInt(ageStr);
        let formattedGender = 'Other';
        const lowerGender = genderStr.toLowerCase();

        if (lowerGender.startsWith('m')) formattedGender = 'Male';
        else if (lowerGender.startsWith('f')) formattedGender = 'Female';

        if (age <= 0 || age > 120) {
             const botMessage = {
                id: botMessageId,
                text: `Invalid age: ${age}. Please enter a valid age (1-120). Format: Name, Age, Gender`,
                sender: 'bot'
            };
            setMessages(prev => [...prev, botMessage]);
            return; // Stay on the same step
        }

        const newPassenger = { name: name.trim(), age: age, gender: formattedGender };
        const updatedPassengers = [...bookingState.passengers, newPassenger];

        if (updatedPassengers.length < bookingState.passengerCount) {
          const nextPassengerNum = bookingState.currentPassenger + 1;
          setBookingState(prev => ({
            ...prev,
            passengers: updatedPassengers,
            currentPassenger: nextPassengerNum
          }));

          askForPassengerDetails(nextPassengerNum, bookingState.passengerCount, botMessageId);
        } else {
          setBookingState(prev => ({
            ...prev,
            passengers: updatedPassengers,
            step: 7
          }));

          askForTrainPreference(botMessageId);
        }
      } else {
        const botMessage = {
          id: botMessageId,
          text: `Please enter passenger details in the format: Name, Age, Gender (e.g., John Doe, 35, Male). Use 'Male', 'Female', or 'Other'.`,
          sender: 'bot',
          examples: ['Jane Smith, 28, Female', 'Alex Ray, 42, Male']
        };
        setMessages(prev => [...prev, botMessage]);
      }
    }
    else if (bookingState.step === 7) {
      // Process train preference
      // Check if the entered text matches a train name or number from the relevant list
      const relevantTrains = TRAINS.filter(train =>
          train.from === bookingState.from && train.to === bookingState.to
      );
      const matchedTrain = relevantTrains.find(train =>
          text.includes(train.number) || train.name.toLowerCase().includes(text.toLowerCase())
      );

      let preference = 'No preference';
      if (text.toLowerCase() !== 'no preference' && matchedTrain) {
          preference = `${matchedTrain.number} - ${matchedTrain.name}`;
      } else if (text.toLowerCase() !== 'no preference' && !matchedTrain && text.trim() !== '') {
          // If user entered something but it didn't match, treat as 'No preference' but maybe inform?
          // For simplicity, we'll just set it. User can correct later if needed.
          preference = 'No preference'; // Or keep text as preference? Let's stick to known trains or none.
      }


      setBookingState(prev => ({ ...prev, trainPreference: preference, step: 8 }));
      askForAutoUpgrade(botMessageId);
    }
    else if (bookingState.step === 8) {
      // Process auto upgrade preference
      const lowerText = text.toLowerCase();
      if (lowerText.includes('yes') || lowerText === 'y') {
        setBookingState(prev => ({ ...prev, autoUpgrade: true, step: 9 }));
      } else if (lowerText.includes('no') || lowerText === 'n') {
        setBookingState(prev => ({ ...prev, autoUpgrade: false, step: 9 }));
      } else {
         const botMessage = {
              id: botMessageId,
              text: "Please answer 'Yes' or 'No' for auto-upgrade.",
              sender: 'bot',
              options: ['Yes', 'No']
          };
          setMessages(prev => [...prev, botMessage]);
          return; // Stay on step 8
      }
      // Only proceed if Yes or No was understood
      if (lowerText.includes('yes') || lowerText === 'y' || lowerText.includes('no') || lowerText === 'n') {
         askForMealPreference(botMessageId);
      }
    }
    else if (bookingState.step === 9) {
      // Process meal preference
      let mealPref = 'No meal'; // Default
      const lowerText = text.toLowerCase();
      if (lowerText.includes('veg') && !lowerText.includes('non')) {
        mealPref = 'Vegetarian';
      } else if (lowerText.includes('non-veg') || lowerText.includes('non veg')) {
        mealPref = 'Non-Vegetarian';
      } else if (lowerText.includes('no meal') || lowerText.includes('none')) {
        mealPref = 'No meal';
      } else {
          // If input is ambiguous, ask again
           const botMessage = {
              id: botMessageId,
              text: "Please specify meal preference: Vegetarian, Non-Vegetarian, or No meal.",
              sender: 'bot',
              options: ['Vegetarian', 'Non-Vegetarian', 'No meal']
          };
          setMessages(prev => [...prev, botMessage]);
          return; // Stay on step 9
      }

      setBookingState(prev => ({ ...prev, mealPreference: mealPref, step: 10 }));
      askForPaymentMethod(botMessageId);
    }
    else if (bookingState.step === 10) {
      // Process payment method
      let paymentMethod = '';
      const lowerText = text.toLowerCase();
      if (lowerText.includes('card')) {
        paymentMethod = 'Credit/Debit Card';
      } else if (lowerText.includes('upi')) {
        paymentMethod = 'UPI';
      } else if (lowerText.includes('net') || lowerText.includes('banking')) {
        paymentMethod = 'Net Banking';
      } else {
          // If input is ambiguous, ask again
          const botMessage = {
              id: botMessageId,
              text: "Please choose a payment method.",
              sender: 'bot',
              options: ['Credit/Debit Card', 'UPI', 'Net Banking']
          };
          setMessages(prev => [...prev, botMessage]);
          return; // Stay on step 10
      }

      setBookingState(prev => ({ ...prev, payment: paymentMethod, step: 11 }));
      showBookingSummary(botMessageId);
    }
    else if (bookingState.step === 11) {
      // Process confirmation
      const lowerText = text.toLowerCase();
      if (lowerText.includes('yes') || lowerText.includes('confirm') || lowerText.includes('proceed') || lowerText.includes('book')) {
        processPayment(botMessageId);
      } else if (lowerText.includes('no') || lowerText.includes('cancel') || lowerText.includes('stop')) {
        const botMessage = {
          id: botMessageId,
          text: "Booking canceled. How can I help you next?",
          sender: 'bot',
          options: ['Book Regular Ticket', 'Book Tatkal Ticket', 'Check PNR Status']
        };
        setMessages(prev => [...prev, botMessage]);
        resetBookingState(); // Reset state after cancellation
      } else {
           const botMessage = {
              id: botMessageId,
              text: "Please confirm or cancel the booking.",
              sender: 'bot',
              options: ['Confirm Booking', 'Cancel']
          };
          setMessages(prev => [...prev, botMessage]);
          return; // Stay on step 11
      }
    }
    else {
      // Default response if none of the conditions match
      const botMessage = {
        id: botMessageId,
        text: "I'm not sure how to help with that. You can ask me to book a ticket (regular or Tatkal), check PNR status, or show popular routes.",
        sender: 'bot',
        options: ['Book Regular Ticket', 'Book Tatkal Ticket', 'Check PNR Status', 'Popular Routes']
      };
      setMessages(prev => [...prev, botMessage]);
    }
  };

   // Reset booking state helper
   const resetBookingState = () => {
       setBookingState({
          step: 0,
          from: '',
          to: '',
          date: '',
          class: '',
          passengers: [],
          passengerCount: 0,
          currentPassenger: 1,
          trainPreference: '',
          autoUpgrade: false,
          mealPreference: '',
          payment: '',
          confirmBeforePayment: true,
          isTatkal: false
       });
   };

  // Various step functions for the booking flow
  const askForDepartureStation = (id) => {
    const botMessage = {
      id: id,
      text: "Okay, let's book a ticket. From which station are you traveling?",
      sender: 'bot',
      options: TRAIN_STATIONS.slice(0, 4)
    };
    setMessages(prev => [...prev, botMessage]);
  };

  const askForDestinationStation = (fromStation, id) => {
    const botMessage = {
      id: id,
      text: `Got it, departing from ${fromStation}. What is your destination station?`,
      sender: 'bot',
      options: TRAIN_STATIONS.filter(station => station !== fromStation).slice(0, 4)
    };
    setMessages(prev => [...prev, botMessage]);
  };

  const askForTravelDate = (id) => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dayAfter = new Date(today);
    dayAfter.setDate(dayAfter.getDate() + 2);

    const formatDate = (date) => {
      return `${String(date.getDate()).padStart(2, '0')}-${String(date.getMonth() + 1).padStart(2, '0')}-${date.getFullYear()}`;
    };

    const botMessage = {
      id: id,
      text: "On which date do you want to travel? (e.g., DD-MM-YYYY, 'today', 'tomorrow')",
      sender: 'bot',
      options: [formatDate(tomorrow), formatDate(dayAfter), 'Today']
    };
    setMessages(prev => [...prev, botMessage]);
  };

  const askForTrainClass = (id) => {
    const botMessage = {
      id: id,
      text: "Which train class do you prefer?",
      sender: 'bot',
      options: ['Sleeper (SL)', 'AC 3-Tier (3A)', 'AC 2-Tier (2A)', 'AC First Class (1A)', 'Executive Chair Car (EC)', 'AC Chair Car (CC)']
    };
    setMessages(prev => [...prev, botMessage]);
  };

  const askForPassengerCount = (id) => {
    const botMessage = {
      id: id,
      text: "How many passengers are traveling? (Maximum 6)",
      sender: 'bot',
      options: ['1', '2', '3', '4']
    };
    setMessages(prev => [...prev, botMessage]);
  };

  const askForPassengerDetails = (current, total, id) => {
    const botMessage = {
      id: id,
      text: `Please provide details for passenger ${current} of ${total}:\nFormat: Name, Age, Gender (Male/Female/Other)`,
      sender: 'bot'
    };
    setMessages(prev => [...prev, botMessage]);
  };

  const askForTrainPreference = (id) => {
    // Get trains for the selected route
    const relevantTrains = TRAINS.filter(train =>
      train.from === bookingState.from && train.to === bookingState.to
    );

    let trainOptions = ['No preference'];
    if (relevantTrains.length > 0) {
      trainOptions = relevantTrains.map(train => `${train.number} - ${train.name}`).slice(0, 3); // Limit options
      trainOptions.push('No preference');
    }

    const botMessage = {
      id: id,
      text: "Do you have any preferred train? You can enter the Train Name/Number or select an option.",
      sender: 'bot',
      options: trainOptions
    };
    setMessages(prev => [...prev, botMessage]);
  };

  const askForAutoUpgrade = (id) => {
    const botMessage = {
      id: id,
      text: "Would you like to opt for auto-upgrade if a higher class is available at no extra cost?",
      sender: 'bot',
      options: ['Yes', 'No']
    };
    setMessages(prev => [...prev, botMessage]);
  };

  const askForMealPreference = (id) => {
    const botMessage = {
      id: id,
      text: "Do you have a meal preference?",
      sender: 'bot',
      options: ['Vegetarian', 'Non-Vegetarian', 'No meal']
    };
    setMessages(prev => [...prev, botMessage]);
  };

  const askForPaymentMethod = (id) => {
    const botMessage = {
      id: id,
      text: "How would you like to pay?",
      sender: 'bot',
      options: ['Credit/Debit Card', 'UPI', 'Net Banking']
    };
    setMessages(prev => [...prev, botMessage]);
  };

  const showBookingSummary = (id) => {
    const relevantTrains = TRAINS.filter(train =>
      train.from === bookingState.from && train.to === bookingState.to
    );

    let trainInfo = "Any available train";
    let selectedTrainObject = null;

    if (bookingState.trainPreference !== 'No preference' && bookingState.trainPreference !== '') {
      const trainNumber = bookingState.trainPreference.split(' - ')[0];
      selectedTrainObject = relevantTrains.find(t => t.number === trainNumber);
      if (selectedTrainObject) {
        trainInfo = `${selectedTrainObject.number} - ${selectedTrainObject.name} (Dep: ${selectedTrainObject.departure}, Arr: ${selectedTrainObject.arrival})`;
      } else {
        // If preference was set but somehow didn't match, default
         trainInfo = "Any available train (preference not found)";
         if(relevantTrains.length > 0) {
             selectedTrainObject = relevantTrains[0]; // Pick first available for fare calc etc.
         }
      }
    } else if (relevantTrains.length > 0) {
      // If no preference, pick the first available for display/fare calculation
      selectedTrainObject = relevantTrains[0];
      trainInfo = `${selectedTrainObject.number} - ${selectedTrainObject.name} (Dep: ${selectedTrainObject.departure}, Arr: ${selectedTrainObject.arrival})`;
    } else {
        // No trains found for route - edge case
         trainInfo = "No direct trains found in mock data for fare calculation.";
    }

    const passengerInfo = bookingState.passengers.map((p, i) =>
      ` P${i+1}: ${p.name} (${p.age}, ${p.gender})`
    ).join('\n');

    const totalFare = calculateFare(selectedTrainObject); // Pass the selected train object

    const summary = `Please confirm your booking details:
------------------------------------
Journey: ${bookingState.from} to ${bookingState.to}
Date: ${bookingState.date}
Class: ${bookingState.class} ${bookingState.isTatkal ? '(Tatkal)' : ''}
Train: ${trainInfo}
Passengers (${bookingState.passengers.length}):
${passengerInfo}
Auto-upgrade: ${bookingState.autoUpgrade ? 'Yes' : 'No'}
Meal: ${bookingState.mealPreference}
Payment: ${bookingState.payment}
------------------------------------
Estimated Fare: ₹ ${totalFare}
------------------------------------
Proceed with booking?`;

    const botMessage = {
      id: id,
      text: summary,
      sender: 'bot',
      options: ['Confirm Booking', 'Cancel']
    };

    setMessages(prev => [...prev, botMessage]);
  };

  const calculateFare = (selectedTrain) => {
    // Basic fare calculation
    const baseFares = {
      'SL': 400, '3A': 1200, '2A': 2000, 'EC': 1600, 'CC': 1000, '1A': 3000
    };
    // More realistic: Use distance or train type multiplier
    const routeDistanceFactor = 1 + Math.random() * 0.8; // Simulate distance effect (0 to 80% increase)
    const trainTypeFactor = selectedTrain?.name.includes('Rajdhani') || selectedTrain?.name.includes('Shatabdi') || selectedTrain?.name.includes('Duronto') ? 1.2 : 1.0; // Premium trains are costlier

    const baseFare = baseFares[bookingState.class] || 800; // Default if class not found

    // Tatkal charges (approx 10-30% of base fare, with min/max - simplified here)
    const tatkalChargePercent = bookingState.isTatkal ? (bookingState.class.includes('A') || bookingState.class.includes('C') ? 0.25 : 0.15) : 0; // Higher for AC
    const tatkalCharge = bookingState.isTatkal ? Math.max(50, baseFare * tatkalChargePercent) : 0;

    // Calculate fare per passenger
    const farePerPassenger = (baseFare * routeDistanceFactor * trainTypeFactor) + tatkalCharge;

    // Calculate total fare for all passengers
    const passengerCount = bookingState.passengers.length || 1; // Ensure at least 1 passenger
    const totalFare = Math.round(farePerPassenger * passengerCount);

    return totalFare;
  };

  const processPayment = (id) => {
    setLoading(true);
    const processingMessage = {
        id: id,
        text: `Processing your booking via ${bookingState.payment}...`,
        sender: 'bot'
    };
    setMessages(prev => [...prev, processingMessage]);

    setTimeout(() => {
      setLoading(false);
      const pnr = generatePNR();

      // Determine the actual train booked
      const relevantTrains = TRAINS.filter(train =>
          train.from === bookingState.from && train.to === bookingState.to
      );
      let finalTrain = relevantTrains.length > 0 ? relevantTrains[0] : TRAINS[0]; // Default if none found

      if (bookingState.trainPreference !== 'No preference' && bookingState.trainPreference !== '') {
          const trainNumber = bookingState.trainPreference.split(' - ')[0];
          const selectedTrain = relevantTrains.find(t => t.number === trainNumber);
          if (selectedTrain) {
              finalTrain = selectedTrain;
          }
      } // else stick with the first relevant train or the default

      // Simulate CNF/RAC/WL status
      const statusRand = Math.random();
      let bookingStatus = 'CNF';
      if (statusRand > 0.9) bookingStatus = `WL/${Math.floor(Math.random()*20)+1}`;
      else if (statusRand > 0.7) bookingStatus = `RAC/${Math.floor(Math.random()*10)+1}`;


      const ticket = {
        pnr: pnr,
        from: bookingState.from,
        to: bookingState.to,
        date: bookingState.date,
        class: bookingState.class,
        train: finalTrain,
        passengers: bookingState.passengers,
        fare: calculateFare(finalTrain), // Recalculate with final train
        status: bookingStatus,
        coach: bookingStatus === 'CNF' ? generateCoach(bookingState.class) : 'N/A',
        seats: bookingStatus === 'CNF' ? generateSeats(bookingState.passengers.length, bookingState.class) : ['N/A'],
        bookingType: bookingState.isTatkal ? 'Tatkal' : 'Regular',
        mealPreference: bookingState.mealPreference,
        autoUpgrade: bookingState.autoUpgrade,
      };

      setTicketDetails(ticket);
      setShowTicket(true); // Open the ticket dialog

      const successMessage = {
        id: id + 1, // Increment ID
        text: `🎉 Success! Your ticket is booked.\nPNR: ${pnr}\nStatus: ${bookingStatus}\n\nCheck the Ticket Details popup. How else can I help?`,
        sender: 'bot',
        options: ['Book Another Ticket', 'Check PNR Status', 'Show Popular Routes']
      };

      setMessages(prev => [...prev, successMessage]);
      showSnackbar('Ticket booked successfully!', 'success');

      // Reset booking state for next interaction
      resetBookingState();

    }, 3000); // Simulate network delay
  };

  const generateCoach = (trainClass) => {
    const coaches = {
      'SL': ['S1', 'S2', 'S3', 'S4', 'S5', 'S6', 'S7', 'S8', 'S9', 'S10'],
      '3A': ['B1', 'B2', 'B3', 'B4', 'B5', 'B6', 'M1', 'M2'], // Added M coaches
      '2A': ['A1', 'A2', 'A3', 'A4'],
      'EC': ['E1', 'E2'],
      'CC': ['C1', 'C2', 'C3', 'C4', 'D1', 'D2'], // Added D coaches
      '1A': ['H1', 'H2']
    };

    const coachList = coaches[trainClass] || ['G1']; // Default 'G' for General
    return coachList[Math.floor(Math.random() * coachList.length)];
  };

  const generateSeats = (passengerCount, trainClass) => {
    const seats = [];
    const seatTypes = { // Simplified seat types
        'SL': ['LB', 'MB', 'UB', 'SL', 'SU'],
        '3A': ['LB', 'MB', 'UB', 'SL', 'SU'],
        '2A': ['LB', 'UB', 'SL', 'SU'],
        '1A': ['LB', 'UB', 'CABIN'],
        'CC': ['W', 'A'], // Window, Aisle
        'EC': ['W', 'A']
    };
    const maxSeats = { 'SL': 72, '3A': 64, '2A': 46, '1A': 24, 'CC': 78, 'EC': 56 };

    const maxNum = maxSeats[trainClass] || 70;
    const typeList = seatTypes[trainClass] || [''];
    const usedSeats = new Set();

    for (let i = 0; i < passengerCount; i++) {
      let seatNum;
      do {
        seatNum = Math.floor(Math.random() * maxNum) + 1;
      } while (usedSeats.has(seatNum)); // Ensure unique seat numbers

      usedSeats.add(seatNum);
      const seatType = typeList[Math.floor(Math.random() * typeList.length)];
      seats.push(`${seatNum}${seatType ? ' '+seatType : ''}`); // e.g., "35 UB" or "12 W"
    }

    return seats; // Return array of seat strings
  };

  const generateMockTicket = (pnr) => {
    // Create a mock ticket for PNR status check
    const randomStationIndex1 = Math.floor(Math.random() * TRAIN_STATIONS.length);
    let randomStationIndex2 = Math.floor(Math.random() * TRAIN_STATIONS.length);
    while(randomStationIndex1 === randomStationIndex2) { // Ensure different stations
        randomStationIndex2 = Math.floor(Math.random() * TRAIN_STATIONS.length);
    }
    const randomFrom = TRAIN_STATIONS[randomStationIndex1];
    const randomTo = TRAIN_STATIONS[randomStationIndex2];

    const today = new Date();
    const randomDayOffset = Math.floor(Math.random() * 60) - 15; // Can be past or future for status check
    const journeyDate = new Date(today);
    journeyDate.setDate(today.getDate() + randomDayOffset);

    const formatDate = (date) => {
      return `${String(date.getDate()).padStart(2, '0')}-${String(date.getMonth() + 1).padStart(2, '0')}-${date.getFullYear()}`;
    };

    const classList = ['SL', '3A', '2A', 'EC', 'CC', '1A'];
    const randomClass = classList[Math.floor(Math.random() * classList.length)];

    // Determine status based on date relative to today
    const isPast = journeyDate < today;
    const isFuture = journeyDate > today;

    let randomStatus;
    if (isPast) {
        randomStatus = Math.random() > 0.1 ? 'Journey Completed' : 'Ticket Cancelled';
    } else {
        const statusRand = Math.random();
        if (statusRand > 0.85) randomStatus = `WL/${Math.floor(Math.random()*50)+1}`;
        else if (statusRand > 0.6) randomStatus = `RAC/${Math.floor(Math.random()*10)+1}`;
        else randomStatus = 'CNF';
    }


    // Find a somewhat relevant train or pick a random one
    let randomTrain = TRAINS.find(t => t.from === randomFrom || t.to === randomTo);
    if (!randomTrain) randomTrain = TRAINS[Math.floor(Math.random() * TRAINS.length)];

    // Generate random number of passengers for mock ticket
    const numPassengers = Math.floor(Math.random() * 4) + 1;
    const mockPassengers = [];
    for(let i=0; i<numPassengers; i++){
        mockPassengers.push({ name: `Passenger ${i+1}`, age: Math.floor(Math.random() * 60) + 18, gender: Math.random() > 0.5 ? "Male" : "Female" });
    }

    const isCNF = randomStatus === 'CNF';

    return {
      pnr: pnr,
      from: randomFrom,
      to: randomTo,
      date: formatDate(journeyDate),
      class: randomClass,
      train: randomTrain,
      passengers: mockPassengers,
      fare: Math.floor(Math.random() * 2000) + 500,
      status: randomStatus,
      coach: isCNF ? generateCoach(randomClass) : 'N/A',
      seats: isCNF ? generateSeats(numPassengers, randomClass) : ['N/A'],
      bookingType: Math.random() > 0.8 ? 'Tatkal' : 'Regular',
      mealPreference: 'N/A', // Not usually shown in basic status
      autoUpgrade: 'N/A',
    };
  };

  const showPopularRoutes = (id) => {
    const popularRoutes = [
      { from: 'New Delhi', to: 'Mumbai Central' },
      { from: 'New Delhi', to: 'Kolkata Howrah' },
      { from: 'Mumbai Central', to: 'Ahmedabad Junction' },
      { from: 'Chennai Central', to: 'Bengaluru City Junction' }
    ];

    const routeText = popularRoutes.map((route, index) => {
        const trainsOnRoute = TRAINS.filter(t => t.from === route.from && t.to === route.to).length;
        return `${index + 1}. ${route.from} to ${route.to} (${trainsOnRoute} direct trains in data)`;
    }).join('\n');

    const botMessage = {
      id: id,
      text: `Here are some popular routes based on our data:\n\n${routeText}\n\nWould you like to book a ticket for one of these or another route?`,
      sender: 'bot',
      options: popularRoutes.map(route => `Book ${route.from} to ${route.to}`).slice(0, 3) // Limit options shown
         .concat(['Book Another Route'])
    };

    setMessages(prev => [...prev, botMessage]);
  };

  const showSnackbar = (message, severity = 'info') => {
    setSnackbar({
      open: true,
      message,
      severity
    });
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbar(prev => ({
      ...prev,
      open: false
    }));
  };

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { // Allow shift+enter for newline
      e.preventDefault(); // Prevent default newline on Enter
      handleSendMessage();
    }
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  // QR Code value generation for ticket
  const generateQRValue = (ticket) => {
    if (!ticket) return '';
    // Simple format, real QR codes encode more complex data structures (like JSON)
    return `PNR:${ticket.pnr}, TR:${ticket.train.number}, DT:${ticket.date}, FR:${ticket.from}, TO:${ticket.to}, CLS:${ticket.class}, PAX:${ticket.passengers.length}`;
  };

  // Render functions for the chat interface
  const renderChatMessages = () => {
    return messages.map((message, index) => (
      <Box
        key={message.id || index} // Use id if available, fallback to index
        sx={{
          display: 'flex',
          justifyContent: message.sender === 'user' ? 'flex-end' : 'flex-start',
          mb: 2,
        }}
      >
        {message.sender === 'bot' && (
            <Avatar sx={{ bgcolor: theme.palette.secondary.main, mr: 1 }}>
                <TrainIcon />
            </Avatar>
        )}
        <Paper
          elevation={2}
          sx={{
            p: 1.5,
            borderRadius: message.sender === 'user' ? '15px 15px 0 15px' : '15px 15px 15px 0',
            maxWidth: '80%',
            bgcolor: message.sender === 'user'
              ? theme.palette.primary.main
              : theme.palette.background.paper,
            color: message.sender === 'user'
              ? theme.palette.primary.contrastText
              : theme.palette.text.primary,
          }}
        >
          <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>
            {message.text}
          </Typography>

          {message.options && message.options.length > 0 && (
            <Box sx={{ mt: 1.5, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {message.options.map((option, idx) => (
                <Chip
                  key={idx}
                  label={option}
                  onClick={() => handleOptionClick(option)}
                  size="small"
                  color={message.sender === 'user' ? 'default' : 'primary'} // Make bot options primary
                  variant="filled" // Use filled for better visibility
                  clickable
                  sx={{
                    cursor: 'pointer',
                    bgcolor: message.sender === 'user' ? theme.palette.background.default : theme.palette.primary.light, // Lighter primary for bot options
                     color: message.sender === 'user' ? theme.palette.text.primary : theme.palette.primary.contrastText,
                    '&:hover': {
                      bgcolor: message.sender === 'user' ? theme.palette.action.hover : theme.palette.primary.main,
                    }
                  }}
                />
              ))}
            </Box>
          )}

          {message.examples && message.examples.length > 0 && (
            <Box sx={{ mt: 1, borderTop: `1px solid ${theme.palette.divider}`, pt: 1 }}>
              <Typography variant="caption" color="textSecondary" sx={{ display: 'block', mb: 0.5 }}>
                Example Format:
              </Typography>
              {message.examples.map((example, index) => (
                <Chip
                  key={index}
                  label={example}
                  variant="outlined"
                  size="small"
                  onClick={() => { setInput(example); }} // Set input instead of sending directly
                  sx={{ mr: 0.5, mt: 0.5, cursor: 'pointer' }}
                />
              ))}
            </Box>
          )}
        </Paper>
         {message.sender === 'user' && (
            <Avatar sx={{ bgcolor: theme.palette.primary.main, ml: 1 }}>
                <PersonIcon />
            </Avatar>
        )}
      </Box>
    ));
  };

  // --- RENDER TICKET FUNCTION ---
  const renderTicket = () => {
    if (!ticketDetails) return null;

    const qrValue = generateQRValue(ticketDetails);

    return (
        // Using Paper instead of Card for consistency with chat bubbles perhaps
        <Paper elevation={4} sx={{ m: { xs: 1, sm: 2 }, p: 0, borderRadius: 2, overflow: 'hidden' }}>
            {/* Header */}
            <Box sx={{
              p: 1.5,
              bgcolor: theme.palette.primary.main,
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <TicketIcon />
                    <Typography variant="h6">E-Ticket</Typography>
                    {ticketDetails.bookingType === 'Tatkal' && (
                        <Chip icon={<TatkalIcon />} label="Tatkal" color="secondary" size="small" sx={{ ml: 1 }}/>
                    )}
                </Box>
                <Typography variant="body1" fontWeight="bold">PNR: {ticketDetails.pnr}</Typography>
            </Box>

            <CardContent sx={{ p: { xs: 1.5, sm: 2.5 } }}>
                <Grid container spacing={2.5}>
                    {/* Train Details */}
                    <Grid item xs={12} md={6}>
                         <Typography variant="h6" gutterBottom color="primary">{ticketDetails.train.number} - {ticketDetails.train.name}</Typography>
                         <Divider sx={{ my: 1 }}/>
                         <Box display="flex" alignItems="center" mb={1}>
                            <LocationOn fontSize="small" sx={{ mr: 1, color: 'success.main' }} />
                            <Typography variant="body1"><strong>From:</strong> {ticketDetails.from}</Typography>
                         </Box>
                         <Box display="flex" alignItems="center" mb={1}>
                            <Typography variant="body2" sx={{ ml: 3.5 }}>Departure: {ticketDetails.train.departure}</Typography>
                         </Box>
                         <Box display="flex" alignItems="center" mb={1}>
                            <LocationOn fontSize="small" sx={{ mr: 1, color: 'error.main' }}/>
                            <Typography variant="body1"><strong>To:</strong> {ticketDetails.to}</Typography>
                         </Box>
                         <Box display="flex" alignItems="center" mb={1}>
                            <Typography variant="body2" sx={{ ml: 3.5 }}>Arrival: {ticketDetails.train.arrival}</Typography>
                         </Box>
                          <Box display="flex" alignItems="center" mb={1}>
                            <CalendarIcon fontSize="small" sx={{ mr: 1 }} />
                            <Typography variant="body1"><strong>Date:</strong> {ticketDetails.date}</Typography>
                         </Box>
                          <Box display="flex" alignItems="center">
                            <TransitIcon fontSize="small" sx={{ mr: 1 }} />
                            <Typography variant="body1"><strong>Duration:</strong> {ticketDetails.train.duration}</Typography>
                         </Box>
                    </Grid>

                    {/* Booking & Seat Details */}
                    <Grid item xs={12} md={6}>
                         <Typography variant="h6" gutterBottom color="primary">Booking Details</Typography>
                         <Divider sx={{ my: 1 }}/>
                         <Box display="flex" alignItems="center" mb={1}>
                            <SeatIcon fontSize="small" sx={{ mr: 1 }} />
                            <Typography variant="body1"><strong>Class:</strong> {ticketDetails.class}</Typography>
                         </Box>
                         <Box display="flex" alignItems="center" mb={1}>
                            <PassengerIcon fontSize="small" sx={{ mr: 1 }} />
                            <Typography variant="body1"><strong>Status:</strong> <Chip label={ticketDetails.status} size="small" color={ticketDetails.status === 'CNF' ? 'success' : ticketDetails.status.startsWith('RAC') ? 'warning' : 'error'} /></Typography>
                         </Box>
                          <Box display="flex" alignItems="center" mb={1}>
                            <TrainIcon fontSize="small" sx={{ mr: 1 }} />
                            <Typography variant="body1"><strong>Coach:</strong> {ticketDetails.coach}</Typography>
                         </Box>
                          <Box display="flex" alignItems="center" mb={1}>
                            <SeatIcon fontSize="small" sx={{ mr: 1 }} />
                            <Typography variant="body1"><strong>Seats:</strong> {Array.isArray(ticketDetails.seats) ? ticketDetails.seats.join(', ') : 'N/A'}</Typography>
                         </Box>
                         <Box display="flex" alignItems="center" mb={1}>
                            <AttachMoney fontSize="small" sx={{ mr: 1 }} />
                            <Typography variant="body1"><strong>Fare:</strong> ₹ {ticketDetails.fare}</Typography>
                         </Box>
                         {ticketDetails.mealPreference !== 'N/A' && (
                            <Box display="flex" alignItems="center" mb={1}>
                                <MealIcon fontSize="small" sx={{ mr: 1 }} />
                                <Typography variant="body1"><strong>Meal:</strong> {ticketDetails.mealPreference}</Typography>
                            </Box>
                         )}
                         {ticketDetails.autoUpgrade !== 'N/A' && (
                              <Box display="flex" alignItems="center" mb={1}>
                                <SettingsIcon fontSize="small" sx={{ mr: 1 }} />
                                <Typography variant="body1"><strong>Auto Upgrade:</strong> {ticketDetails.autoUpgrade ? 'Yes' : 'No'}</Typography>
                             </Box>
                         )}
                    </Grid>

                    {/* Passenger Details */}
                    <Grid item xs={12}>
                        <Typography variant="h6" gutterBottom color="primary">Passengers</Typography>
                        <Divider sx={{ mb: 1 }} />
                        <List dense disablePadding>
                            {ticketDetails.passengers.map((p, index) => (
                                <ListItem key={index} disableGutters>
                                    <ListItemAvatar>
                                        <Avatar sx={{ bgcolor: theme.palette.secondary.light }}>
                                            <PersonIcon fontSize="small" />
                                        </Avatar>
                                    </ListItemAvatar>
                                    <ListItemText
                                        primary={`${p.name}`}
                                        secondary={`Age: ${p.age}, Gender: ${p.gender}`}
                                    />
                                    {ticketDetails.status === 'CNF' && ticketDetails.seats[index] && (
                                        <Chip label={`${ticketDetails.coach} / ${ticketDetails.seats[index]}`} size="small" variant="outlined" sx={{ ml: 'auto' }} />
                                    )}
                                </ListItem>
                            ))}
                        </List>
                    </Grid>

                     {/* QR Code Section (Simulated) */}
                     <Grid item xs={12} sx={{ textAlign: 'center', mt: 2 }}>
                        <Typography variant="caption" display="block" color="textSecondary">Scan QR Code (Simulated)</Typography>
                        <QrCodeIcon sx={{ fontSize: 80, color: theme.palette.text.secondary, my: 1 }} />
                        {/* <Typography variant="caption" sx={{ wordBreak: 'break-all' }}>{qrValue}</Typography> */}
                    </Grid>
                </Grid>
            </CardContent>

            {/* Footer Note */}
            <Box sx={{ p: 1.5, bgcolor: theme.palette.background.default, textAlign: 'center' }}>
                <Typography variant="caption" color="textSecondary">
                   Happy Journey! Please carry a valid ID proof along with this ticket.
                </Typography>
            </Box>
        </Paper>
    );
  };
  // --- END RENDER TICKET ---


  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh', bgcolor: 'background.default' }}>
       {/* App Bar */}
       <AppBar position="static" elevation={1}>
           <Toolbar>
               <TrainIcon sx={{ mr: 2 }} />
               <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                   Train Booking Assistant
               </Typography>
               <IconButton color="inherit" onClick={toggleDarkMode}>
                   {darkMode ? <LightModeIcon /> : <DarkModeIcon />}
               </IconButton>
           </Toolbar>
       </AppBar>

       {/* Main Content Area */}
       <Container maxWidth="md" sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', py: 2 }}>
            {/* Chat Area */}
            <Paper
                elevation={3}
                sx={{
                    flexGrow: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'hidden', // Needed for scrolling content
                    borderRadius: 2,
                }}
            >
                {/* Messages Display */}
                <Box
                    sx={{
                        flexGrow: 1,
                        overflowY: 'auto',
                        p: 3, // Padding inside the scrollable area
                        bgcolor: theme.palette.mode === 'dark' ? 'grey.900' : 'grey.50', // Slightly different bg for chat area
                    }}
                >
                    {renderChatMessages()}
                    {/* Loader at the end of messages */}
                    {loading && bookingState.step !== 'pnr' && ( // Show general loader inline, PNR loader is handled separately
                        <Box sx={{ display: 'flex', justifyContent: 'flex-start', mb: 2 }}>
                            <Avatar sx={{ bgcolor: theme.palette.secondary.main, mr: 1 }}>
                                <TrainIcon />
                            </Avatar>
                            <Paper elevation={2} sx={{ p: 1.5, borderRadius: '15px 15px 15px 0', maxWidth: '80%', bgcolor: 'background.paper' }}>
                                <CircularProgress size={20} />
                            </Paper>
                        </Box>
                    )}
                    <div ref={messagesEndRef} /> {/* Anchor for scrolling */}
                </Box>

                {/* Input Area */}
                <Box
                    sx={{
                        p: 2,
                        borderTop: `1px solid ${theme.palette.divider}`,
                        bgcolor: 'background.paper'
                    }}
                >
                    <Grid container spacing={2} alignItems="center">
                        <Grid item xs>
                            <TextField
                                fullWidth
                                variant="outlined"
                                size="small"
                                placeholder="Type your message or selection..."
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyPress={handleKeyPress}
                                disabled={loading} // Disable input while loading
                                multiline
                                maxRows={3} // Allow up to 3 lines before scrolling
                            />
                        </Grid>
                        <Grid item xs="auto">
                             {/* Show loader near send button for PNR check or final payment */}
                             {loading && (bookingState.step === 'pnr' || bookingState.step === 11) ? (
                                 <CircularProgress size={24} sx={{ mr: 1 }}/>
                             ) : (
                                <Button
                                    variant="contained"
                                    color="primary"
                                    endIcon={<SendIcon />}
                                    onClick={handleSendMessage}
                                    disabled={input.trim() === '' || loading}
                                >
                                    Send
                                </Button>
                             )}
                        </Grid>
                    </Grid>
                </Box>
            </Paper>
       </Container>

        {/* Ticket Details Dialog */}
        <Dialog
            open={showTicket}
            onClose={() => setShowTicket(false)}
            maxWidth="md" // Allow ticket to be wider on larger screens
            fullWidth
            scroll='body' // Allow body scroll if content is too long
        >
            <DialogTitle sx={{ bgcolor: theme.palette.primary.main, color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                Ticket Details (PNR: {ticketDetails?.pnr})
                <IconButton edge="end" color="inherit" onClick={() => setShowTicket(false)} aria-label="close">
                   <CloseIcon />
               </IconButton>
            </DialogTitle>
            <DialogContent dividers sx={{ p: { xs: 1, sm: 2 } }}> {/* Add dividers and control padding */}
                {renderTicket()}
            </DialogContent>
            <DialogActions sx={{ p: 1.5 }}>
                <Button onClick={() => setShowTicket(false)} color="primary" variant="contained">
                    Close
                </Button>
            </DialogActions>
        </Dialog>

       {/* Snackbar for Notifications */}
       <Snackbar
           open={snackbar.open}
           autoHideDuration={6000}
           onClose={handleSnackbarClose}
           anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
       >
           <Alert onClose={handleSnackbarClose} severity={snackbar.severity} sx={{ width: '100%' }} variant="filled">
               {snackbar.message}
           </Alert>
       </Snackbar>
    </Box>
  );
};


export default TrainBookingChatbot;