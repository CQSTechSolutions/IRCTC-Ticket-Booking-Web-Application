import React, {useEffect, useState} from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Trains from "./pages/Trains";
import TrainDetails from "./pages/TrainDetails";
import BookingConfirmation from "./pages/BookingConfirmation";
import Navbar from "./components/Navbar";
import LoginPromptModal from "./components/common/LoginPromptModal";
import { Toaster } from 'react-hot-toast';

const App = () =>{
  const navigate = useNavigate();
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  useEffect(() => {
    const expirationTime = localStorage.getItem('expirationTime');
    const token = localStorage.getItem('token');
    
    if (expirationTime) {
      const currentTime = new Date().getTime();
      if (currentTime > expirationTime) {
        localStorage.clear();
        navigate('/login');
      }
    }
    
    // Show login prompt if user is not logged in
    if (!token) {
      setShowLoginPrompt(true);
    }
  }, []);

  const handleCloseLoginPrompt = () => {
    setShowLoginPrompt(false);
  };

  return(
    <div className="select-none">
      <Navbar />
      <Toaster position="top-right" />
      <LoginPromptModal 
        isOpen={showLoginPrompt} 
        onClose={handleCloseLoginPrompt}
      />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/trains" element={<Trains />} />
        <Route path="/trains/:trainId/:fromStation/:toStation/:date" element={<TrainDetails />} />
        <Route path="/booking/confirmation/:pnr" element={<BookingConfirmation />} />
      </Routes>
    </div>
  )
}

export default App;