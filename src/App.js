import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { MagicProvider } from './hooks/MagicProvider';
import Login from './components/login';
import Dashboard from './components/Dashboard';
import './App.css';
import MultiWalletConnector from './components/wallets';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || '');

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  return (
    <Router>
      <MagicProvider>
        <div className="app-container">
          <Routes>
            <Route 
              path="/" 
              element={token ? <Navigate to="/dashboard" /> : <Login token={token} setToken={setToken} />} 
            />
            <Route 
              path="/login" 
              element={token ? <Navigate to="/dashboard" /> : <Login token={token} setToken={setToken} />} 
            />
            <Route 
              path="/wallet" 
              element={token ? <Navigate to="/dashboard" /> : <MultiWalletConnector/>} 
            />
            <Route 
              path="/dashboard" 
              element={token ? <Dashboard token={token} setToken={setToken} /> : <Navigate to="/login" />} 
            />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </MagicProvider>
    </Router>
  );
}

export default App;