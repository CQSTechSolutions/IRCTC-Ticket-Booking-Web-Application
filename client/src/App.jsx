import React, {useEffect} from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Trains from "./pages/Trains";
import TrainDetails from "./pages/TrainDetails";
import BookingConfirmation from "./pages/BookingConfirmation";
import Navbar from "./components/Navbar";
import { Toaster } from 'react-hot-toast';

const App = () =>{
  
  useEffect(() => {
    const expirationTime = localStorage.getItem('expirationTime');
    if (expirationTime) {
      const currentTime = new Date().getTime();
      if (currentTime > expirationTime) {
        localStorage.clear();
        window.location.href = '/login';
      }
    }
  }, []);

  return(
    <>
      <Navbar />
      <Toaster position="top-right" />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/trains" element={<Trains />} />
        <Route path="/trains/:trainId/:fromStation/:toStation/:date" element={<TrainDetails />} />
        <Route path="/booking/confirmation/:pnr" element={<BookingConfirmation />} />
      </Routes>
    </>
  )
}

export default App;