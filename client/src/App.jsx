import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Trains from "./pages/Trains";
import Navbar from "./components/Navbar";

const App = () =>{
  return(
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/trains" element={ <Trains /> } />        
      </Routes>
    </>
  )
}

export default App;