import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Swap from "./components/Swap";
import Pool from "./components/Pool";
import Token from "./components/Token";
import Navbar from "./components/Navbar";

import './App.css';

function App() {
  return (
    <Router>
      <Navbar/>
      <Routes>
        <Route path="/swap" element={<Swap/>} />
        <Route path="/pool" element={<Pool/>} />
        <Route path="/token" element={<Token/>} />
      </Routes>
    </Router>
  );
}

export default App;
