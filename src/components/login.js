import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Magic } from 'magic-sdk';
import { OAuthExtension } from '@magic-ext/oauth';
import { ConnectExtension } from '@magic-ext/connect';
import showToast from '../utils/showToast';
import Spinner from '../components/ui/Spinner';
import { saveUserInfo } from '../utils/common';
import Card from '../components/ui/Card';
import CardHeader from '../components/ui/CardHeader';
import FormInput from '../components/ui/FormInput';
import MultiWalletConnector from './wallets';

// Network configurations with consistent data
const networks = [
  { name: 'Polygon (Mainnet)', chainId: 137, rpcUrl: 'https://polygon-rpc.com/' },
  { name: 'Polygon (Amoy)', chainId: 80002, rpcUrl: 'https://rpc-amoy.polygon.technology/' },
  { name: 'Ethereum (Mainnet)', chainId: 1, rpcUrl: 'https://eth-mainnet.g.alchemy.com/v2/fYFybLQFR9Zr2GCRcgALmAktStFKr0i0' },
  { name: 'Ethereum (Sepolia)', chainId: 11155111, rpcUrl: 'https://eth-sepolia.g.alchemy.com/v2/fYFybLQFR9Zr2GCRcgALmAktStFKr0i0' },
  { name: 'zkSync (Mainnet)', chainId: 324, rpcUrl: 'https://mainnet.era.zksync.io' },
];

const Login = ({ token, setToken }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState(false);
  const [isLoginInProgress, setLoginInProgress] = useState(false);
  const [selectedNetwork, setSelectedNetwork] = useState(networks[0]);
  const [magic, setMagic] = useState(null);
  const [error, setError] = useState(null);
  const [account, setAccount] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) navigate('/dashboard');
  }, [navigate]);

  useEffect(() => {
    console.log("Selected network changed:", selectedNetwork);
    
    // When the network selection changes, create a new Magic instance
    const initializeMagic = async () => {
      try {
        // Make sure the API key is available
        if (!process.env.REACT_APP_MAGIC_API_KEY) {
          console.error("Magic API key is missing");
          setError("Magic API key is not configured. Check your environment variables.");
          return;
        }

        console.log("Initializing Magic with API key and network:", selectedNetwork.name);
        
        // Create a new Magic instance with the selected network and connect extension
        const magicInstance = new Magic(process.env.REACT_APP_MAGIC_API_KEY, {
          network: {
            rpcUrl: selectedNetwork.rpcUrl,
            chainId: selectedNetwork.chainId,
          },
          extensions: [
            new OAuthExtension(),
            new ConnectExtension()
          ],
        });
        
        setMagic(magicInstance);
        setError(null);
        
        // Save to localStorage for MagicProvider to use
        localStorage.setItem('selectedNetwork', JSON.stringify({
          chainId: selectedNetwork.chainId,
          name: selectedNetwork.name,
          rpcUrl: selectedNetwork.rpcUrl
        }));
      } catch (error) {
        console.error("Error initializing Magic:", error);
        setError("Failed to initialize Magic SDK: " + error.message);
        showToast({ message: "Failed to initialize connection", type: 'error' });
      }
    };
    
    initializeMagic();

    // Clean up function
    return () => {
      // Any cleanup if needed when network changes
    };
  }, [selectedNetwork]);

  const handleLogin = async () => {
    if (!email.match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)) {
      setEmailError(true);
      return;
    }

    try {
      setLoginInProgress(true);
      setEmailError(false);
      setError(null);

      if (!magic) throw new Error('Magic instance not initialized');

      // Make sure we save the network first
      localStorage.setItem('selectedNetwork', JSON.stringify({
        chainId: selectedNetwork.chainId,
        name: selectedNetwork.name,
        rpcUrl: selectedNetwork.rpcUrl
      }));
      
      console.log("Attempting login with network:", selectedNetwork.name);
      
      const token = await magic.auth.loginWithEmailOTP({ email });
      if (!token) throw new Error('No token received');

      const metadata = await magic.user.getInfo();
      if (!metadata?.publicAddress) throw new Error('Magic login failed: No publicAddress');
      
      setToken(token);
      localStorage.setItem('token', token);
      saveUserInfo(token, 'EMAIL', metadata.publicAddress);
      setEmail('');
      
      showToast({ message: "Login successful!", type: 'success' });
      
      // Redirect to dashboard
      navigate('/dashboard');
    } catch (e) {
      console.error("Login error:", e);
      setError("Login failed: " + e.message);
      showToast({ message: e.message || 'Unexpected error occurred', type: 'error' });
    } finally {
      setLoginInProgress(false);
    }
  };


  const connectWithMetaMask = async () => {
    
      navigate('/wallets'); // Example redirect
      
   
  };
 
 


  return (
    <Card>
      <CardHeader>Log in or Sign up</CardHeader>
      
      {error && (
        <div className="error-banner">
          <p className="error-message">{error}</p>
        </div>
      )}
      
      <p className="text-center mb-4">Select a Network</p>
      <select
        className="network-dropdown"
        value={selectedNetwork.name}
        onChange={(e) => {
          const network = networks.find((n) => n.name === e.target.value);
          if (network) {
            console.log("Network selected:", network.name);
            setSelectedNetwork(network);
          }
        }}
      >
        {networks.map((network) => (
          <option key={network.chainId} value={network.name}>{network.name}</option>
        ))}
      </select>
      
      <div className="login-options-container">
        <div className="login-option">
          <p className="text-center mb-4">Login with Email</p>
          <FormInput
            onChange={(e) => {
              if (emailError) setEmailError(false);
              setEmail(e.target.value);
            }}
            placeholder="Email"
            value={email}
          />
          {emailError && <span className="error">Enter a valid email</span>}
          <button
            className="login-button"
            disabled={isLoginInProgress || email.length === 0 || !magic}
            onClick={handleLogin}
          >
            {isLoginInProgress ? <Spinner /> : 'Continue with Email'}
          </button>
        </div>
        
        <div className="login-divider">
          <span>OR</span>
        </div>
        
        <div className="wallet-options">
  <MultiWalletConnector/>
        </div>
      </div>
    </Card>
  );
};

export default Login;