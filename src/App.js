import React from 'react';
import './App.css';

function App() {
  // The full URL to your Django backend's Google login endpoint
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
}

export default App;