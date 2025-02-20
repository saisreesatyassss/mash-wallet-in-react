 

import React, { useState, useEffect } from 'react';
import { useMagic } from '../hooks/MagicProvider'; // Adjust the path as per your project
import { useNavigate } from 'react-router-dom';
import showToast from '../utils/showToast'; // Adjust the path as per your project
import Spinner from '../components/ui/Spinner'; // Adjust the path as per your project
import { RPCError, RPCErrorCode } from 'magic-sdk';
import { saveUserInfo } from '../utils/common'; // Adjust the path as per your project
import Card from '../components/ui/Card'; // Adjust the path as per your project
import CardHeader from '../components/ui/CardHeader'; // Adjust the path as per your project
import FormInput from '../components/ui/FormInput'; // Adjust the path as per your project

const Login = ({ token, setToken }) => {
  const { magic } = useMagic();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState(false);
  const [isLoginInProgress, setLoginInProgress] = useState(false);
  const [showEmailInput, setShowEmailInput] = useState(true);
  
  // List of available wallets
  const wallets = [
    { name: 'Brave Wallet', status: 'Last used', icon: '🦁' },
    { name: 'Bitski', status: 'Installed', icon: '🔷' },
    { name: 'Brave Browser', status: 'Installed', icon: '🦁' }
  ];

  const extendedWallets = [
    ...wallets,
    { name: 'MetaMask', status: 'Popular', icon: '🦊' },
    { name: 'Coinbase Wallet', status: 'Popular', icon: '🔵' },
    { name: 'WalletConnect', status: 'Multi-wallet', icon: '🔗' },
    { name: 'Trust Wallet', status: 'Mobile', icon: '🛡️' },
    { name: 'Ledger', status: 'Hardware', icon: '🔒' },
    { name: 'Trezor', status: 'Hardware', icon: '🛡️' }
  ];

  // Check if the token exists in localStorage and redirect to dashboard
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      navigate('/dashboard');
    }
  }, [navigate]);

  const handleLogin = async () => {
    if (!email.match(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/)) {
      setEmailError(true);
      return;
    }

    try {
      setLoginInProgress(true);
      setEmailError(false);

      if (!magic) throw new Error('Magic instance not found');

      console.log('Logging in with email:', email);
      const token = await magic.auth.loginWithEmailOTP({ email });
      console.log('Token received:', token);

      if (!token) throw new Error('No token received');

      const metadata = await magic.user.getInfo();
      console.log('User metadata:', metadata);

      if (!metadata?.publicAddress) throw new Error('Magic login failed: No publicAddress');

      setToken(token);
      localStorage.setItem('token', token);
      saveUserInfo(token, 'EMAIL', metadata.publicAddress);
      setEmail('');
      navigate('/dashboard');
    } catch (e) {
      console.error('Login error:', e);

      if (e instanceof RPCError) {
        switch (e.code) {
          case RPCErrorCode.MagicLinkFailedVerification:
          case RPCErrorCode.MagicLinkExpired:
          case RPCErrorCode.MagicLinkRateLimited:
          case RPCErrorCode.UserAlreadyLoggedIn:
            showToast({ message: e.message, type: 'error' });
            break;
          default:
            showToast({ message: 'Something went wrong. Please try again', type: 'error' });
        }
      } else {
        showToast({ message: e.message || 'Unexpected error occurred', type: 'error' });
      }
    } finally {
      setLoginInProgress(false);
    }
  };

  // Simplified wallet connection using Magic's universal connector
  const connectWallet = async (walletName) => {
    try {
      setLoginInProgress(true);
      console.log(`Connecting to ${walletName}...`);
      
      if (!magic) {
        throw new Error('Magic instance not found');
      }

      // Use Magic's universal wallet connector
      const token = await magic.wallet.connectWithUI();
      
      if (!token) {
        throw new Error('Connection failed');
      }
      
      // Get user info after successful connection
      const metadata = await magic.user.getInfo();
      console.log('User metadata:', metadata);
      
      if (!metadata?.publicAddress) {
        throw new Error('Failed to get wallet address');
      }
      
      // Save authentication data
      setToken(token);
      localStorage.setItem('token', token);
      saveUserInfo(token, 'WALLET', metadata.publicAddress);
      
      showToast({ message: `Successfully connected with ${walletName}`, type: 'success' });
      navigate('/dashboard');
      
    } catch (error) {
      console.error('Wallet connection error:', error);
      showToast({ 
        message: error.message || `Failed to connect to ${walletName}`, 
        type: 'error' 
      });
    } finally {
      setLoginInProgress(false);
    }
  };

  return (
    <Card>
      <CardHeader id="login">Log in or sign up</CardHeader>
      
      {showEmailInput ? (
        <div className="login-method-grid-item-container">
          <p className="text-center mb-4">Enter your email</p>
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
            disabled={isLoginInProgress || email.length === 0}
            onClick={handleLogin}
          >
            {isLoginInProgress ? <Spinner /> : 'Continue'}
          </button>
          
          <div className="divider mt-6 mb-6">
            <span className="divider-line"></span>
            <span className="divider-text">OR</span>
            <span className="divider-line"></span>
          </div>
          
          <div className="wallet-options">
            {wallets.map((wallet, index) => (
              <button
                key={index}
                className="wallet-button"
                onClick={() => connectWallet(wallet.name)}
                disabled={isLoginInProgress}
              >
                <span className="wallet-icon">{wallet.icon}</span>
                <div className="wallet-info">
                  <span className="wallet-name">{wallet.name}</span>
                  <span className="wallet-status">{wallet.status}</span>
                </div>
              </button>
            ))}
            
            <button 
              className="view-all-wallets-button"
              onClick={() => setShowEmailInput(false)}
              disabled={isLoginInProgress}
            >
              View all wallets
            </button>
          </div>
        </div>
      ) : (
        <div className="all-wallets-container">
          <h3 className="text-lg font-semibold mb-4">Connect Wallet</h3>
          
          <div className="wallet-grid">
            {extendedWallets.map((wallet, index) => (
              <button
                key={index}
                className="wallet-item"
                onClick={() => connectWallet(wallet.name)}
                disabled={isLoginInProgress}
              >
                <span className="wallet-icon">{wallet.icon}</span>
                <div className="wallet-info">
                  <span className="wallet-name">{wallet.name}</span>
                  <span className="wallet-status">{wallet.status}</span>
                </div>
              </button>
            ))}
          </div>
          
          <button 
            className="back-button mt-6"
            onClick={() => setShowEmailInput(true)}
            disabled={isLoginInProgress}
          >
            Back to email login
          </button>
        </div>
      )}
      
      <style jsx>{`
        .divider {
          display: flex;
          align-items: center;
          width: 100%;
        }
        .divider-line {
          flex-grow: 1;
          height: 1px;
          background-color: #e2e8f0;
        }
        .divider-text {
          padding: 0 16px;
          color: #64748b;
          font-size: 14px;
        }
        .wallet-options {
          display: flex;
          flex-direction: column;
          gap: 12px;
          width: 100%;
        }
        .wallet-button {
          display: flex;
          align-items: center;
          padding: 12px 16px;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          background-color: white;
          cursor: pointer;
          transition: all 0.2s;
          text-align: left;
        }
        .wallet-button:hover {
          background-color: #f8fafc;
        }
        .wallet-button:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }
        .wallet-icon {
          font-size: 24px;
          margin-right: 12px;
        }
        .wallet-info {
          display: flex;
          flex-direction: column;
        }
        .wallet-name {
          font-weight: 500;
        }
        .wallet-status {
          font-size: 12px;
          color: #64748b;
        }
        .view-all-wallets-button {
          margin-top: 8px;
          color: #3b82f6;
          font-weight: 500;
          padding: 8px;
          text-align: center;
        }
        .view-all-wallets-button:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }
        .all-wallets-container {
          width: 100%;
        }
        .wallet-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
          gap: 16px;
        }
        .wallet-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 16px;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          background-color: white;
          cursor: pointer;
          transition: all 0.2s;
          height: 120px;
        }
        .wallet-item:hover {
          border-color: #3b82f6;
          box-shadow: 0 2px 6px rgba(0,0,0,0.05);
        }
        .wallet-item:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }
        .wallet-item .wallet-icon {
          font-size: 32px;
          margin-bottom: 12px;
          margin-right: 0;
        }
        .wallet-item .wallet-info {
          text-align: center;
        }
        .back-button {
          padding: 8px 16px;
          color: #3b82f6;
          background: none;
          border: none;
          cursor: pointer;
          font-weight: 500;
        }
        .back-button:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }
        .error {
          color: #ef4444;
          font-size: 12px;
          margin-top: 4px;
        }
      `}</style>
    </Card>
  );
};

export default Login;