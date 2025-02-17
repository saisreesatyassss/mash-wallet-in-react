import './App.css';
import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import MagicProvider from './hooks/MagicProvider';
import Login from './components/login';
import Dashboard from './components/Dashboard';

function App() {
  const [token, setToken] = useState('');

  useEffect(() => {
    setToken(localStorage.getItem('token') ?? '');
  }, []);

  return (
    <MagicProvider>
      <Router>
        <div className="App">
          <ToastContainer />
          <Routes>
            <Route path="/" element={<Login token={token} setToken={setToken} />} />
            <Route path="/dashboard" element={<Dashboard token={token} setToken={setToken} />} />
          </Routes>
        </div>
      </Router>
    </MagicProvider>
  );
}

export default App;