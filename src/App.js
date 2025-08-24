// src/App.js

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginSuccess from './LoginSuccess'; // Import the new component
import Dashboard from './Dashboard'; // Import the new component
import './App.css';

// A simple component for the initial login page
const LoginPage = () => {
  const googleLoginUrl = 'http://localhost:8000/accounts/google/login/?process=login';
  return (
    <div className="App">
      <header className="App-header">
        <h1>Money Manager</h1>
        <p>Please log in to continue.</p>
        <a href={googleLoginUrl} className="login-button">
          Login with Google
        </a>
      </header>
    </div>
  );
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/login/success" element={<LoginSuccess />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;