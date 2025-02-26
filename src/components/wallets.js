import React, { useState, useEffect } from 'react';
import { FaSpinner } from 'react-icons/fa';

// Wallet icons can be imported from react-icons or your assets
import { 
  SiMetabase
} from 'react-icons/si';

const MultiWalletConnector = () => {
  const [availableWallets, setAvailableWallets] = useState([]);
  const [loginInProgress, setLoginInProgress] = useState(false);
  const [account, setAccount] = useState(null);
  const [token, setToken] = useState(null);
  const [error, setError] = useState(null);
  const [activeWallet, setActiveWallet] = useState(null);

  // Detect available wallets on component mount
  useEffect(() => {
    detectWallets();
    
    // Listen for account changes
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', handleAccountsChanged);
    }
    
    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      }
    };
  }, []);

  const handleAccountsChanged = (accounts) => {
    if (accounts.length === 0) {
      // User disconnected their wallet
      setAccount(null);
      setToken(null);
      localStorage.removeItem('token');
      setActiveWallet(null);
    } else {
      // Account changed
      setAccount(accounts[0]);
    }
  };

  const detectWallets = () => {
    const detected = [];
    
    // Check for MetaMask
    if (window.ethereum && window.ethereum.isMetaMask) {
      detected.push({
        id: 'metamask',
        name: 'MetaMask',
        icon: <SiMetabase  />,
        connector: connectWithMetaMask
      });
    }
    
    // Check for Coinbase Wallet
    if (window.ethereum && window.ethereum.isCoinbaseWallet) {
      detected.push({
        id: 'coinbase',
        name: 'Coinbase Wallet',
        icon: <SiMetabase  />,
        connector: connectWithCoinbase
      });
    }
    
    // Check for Trust Wallet
    if (window.ethereum && window.ethereum.isTrust) {
      detected.push({
        id: 'trust',
        name: 'Trust Wallet',
        icon: <SiMetabase  />,
        connector: connectWithTrust
      });
    }
    
    // Check for Phantom Wallet (primarily for Solana)
    if (window.phantom?.solana) {
      detected.push({
        id: 'phantom',
        name: 'Phantom',
        icon: <SiMetabase  />,
        connector: connectWithPhantom
      });
    }
    
    // WalletConnect is available in all browsers
    detected.push({
      id: 'walletconnect',
      name: 'WalletConnect',
      icon: <SiMetabase  />,
      connector: connectWithWalletConnect
    });
    
    setAvailableWallets(detected);
  };

  const connectWithMetaMask = async () => {
    try {
      setLoginInProgress(true);
      setError(null);
      
      if (typeof window.ethereum === 'undefined' || !window.ethereum.isMetaMask) {
        throw new Error('MetaMask is not installed. Please install MetaMask and try again.');
      }

      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      
      if (!accounts || accounts.length === 0) {
        throw new Error('No accounts returned from MetaMask');
      }
      
      const account = accounts[0];
      console.log("Connected to MetaMask:", account);
      
      setAccount(account);
      setActiveWallet('metamask');
      
      // Mock token for the demo, replace with real token logic
      const mockToken = "metamask-" + Date.now(); 
      setToken(mockToken);
      localStorage.setItem('token', mockToken);
      
      return { success: true, account };
      
    } catch (e) {
      console.error("MetaMask connection error:", e);
      handleWalletError(e);
      return { success: false, error: e.message };
    } finally {
      setLoginInProgress(false);
    }
  };
  
  const connectWithCoinbase = async () => {
    try {
      setLoginInProgress(true);
      setError(null);
      
      if (typeof window.ethereum === 'undefined' || !window.ethereum.isCoinbaseWallet) {
        throw new Error('Coinbase Wallet is not installed. Please install Coinbase Wallet and try again.');
      }

      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      
      if (!accounts || accounts.length === 0) {
        throw new Error('No accounts returned from Coinbase Wallet');
      }
      
      const account = accounts[0];
      console.log("Connected to Coinbase Wallet:", account);
      
      setAccount(account);
      setActiveWallet('coinbase');
      
      // Mock token for the demo, replace with real token logic
      const mockToken = "coinbase-" + Date.now(); 
      setToken(mockToken);
      localStorage.setItem('token', mockToken);
      
      return { success: true, account };
      
    } catch (e) {
      console.error("Coinbase Wallet connection error:", e);
      handleWalletError(e);
      return { success: false, error: e.message };
    } finally {
      setLoginInProgress(false);
    }
  };
  
  const connectWithTrust = async () => {
    try {
      setLoginInProgress(true);
      setError(null);
      
      if (typeof window.ethereum === 'undefined' || !window.ethereum.isTrust) {
        throw new Error('Trust Wallet is not installed. Please install Trust Wallet and try again.');
      }

      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      
      if (!accounts || accounts.length === 0) {
        throw new Error('No accounts returned from Trust Wallet');
      }
      
      const account = accounts[0];
      console.log("Connected to Trust Wallet:", account);
      
      setAccount(account);
      setActiveWallet('trust');
      
      // Mock token for the demo, replace with real token logic
      const mockToken = "trust-" + Date.now(); 
      setToken(mockToken);
      localStorage.setItem('token', mockToken);
      
      return { success: true, account };
      
    } catch (e) {
      console.error("Trust Wallet connection error:", e);
      handleWalletError(e);
      return { success: false, error: e.message };
    } finally {
      setLoginInProgress(false);
    }
  };
  
  const connectWithPhantom = async () => {
    try {
      setLoginInProgress(true);
      setError(null);
      
      if (!window.phantom?.solana) {
        throw new Error('Phantom Wallet is not installed. Please install Phantom Wallet and try again.');
      }

      const connection = await window.phantom.solana.connect();
      const account = connection.publicKey.toString();
      
      console.log("Connected to Phantom Wallet:", account);
      
      setAccount(account);
      setActiveWallet('phantom');
      
      // Mock token for the demo, replace with real token logic
      const mockToken = "phantom-" + Date.now(); 
      setToken(mockToken);
      localStorage.setItem('token', mockToken);
      
      return { success: true, account };
      
    } catch (e) {
      console.error("Phantom Wallet connection error:", e);
      handleWalletError(e);
      return { success: false, error: e.message };
    } finally {
      setLoginInProgress(false);
    }
  };
  
  const connectWithWalletConnect = async () => {
    try {
      setLoginInProgress(true);
      setError(null);
      
      // Note: This is a placeholder - WalletConnect v2 implementation 
      // requires setting up a project on WalletConnect Cloud and using their SDK
      
      // In a real implementation, you'd use:
      // import { EthereumClient, w3mConnectors, w3mProvider } from '@web3modal/ethereum'
      // import { Web3Modal } from '@web3modal/react'
      // import { configureChains, createConfig, WagmiConfig } from 'wagmi'
      // import { arbitrum, mainnet, polygon } from 'wagmi/chains'
      
      alert("WalletConnect integration requires WalletConnect SDK. This is a placeholder.");
      throw new Error('WalletConnect integration not implemented in this demo.');
      
    } catch (e) {
      console.error("WalletConnect connection error:", e);
      handleWalletError(e);
      return { success: false, error: e.message };
    } finally {
      setLoginInProgress(false);
    }
  };
  
  const handleWalletError = (e) => {
    let errorMessage = e.message;
    
    if (e.message.includes('User canceled') || e.message.includes('User rejected')) {
      errorMessage = "You canceled the wallet connection. Please try again and approve the connection.";
    } else if (e.message.includes('Internal error')) {
      errorMessage = "Connection to wallet failed. Please make sure your wallet is unlocked and try again.";
    }
    
    setError(errorMessage);
    console.error(`Wallet connection error: ${errorMessage}`);
  };
  
  const disconnect = () => {
    setAccount(null);
    setToken(null);
    setActiveWallet(null);
    localStorage.removeItem('token');
  };
  
  // Spinner component for loading state
  const Spinner = () => (
    <FaSpinner className="animate-spin" />
  );

  return (
    <div className="wallet-connector p-4 max-w-md mx-auto">
      {error && (
        <div className="error-message bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      {account ? (
        <div className="connected-status">
          <div className="mb-4 p-4 border rounded bg-green-50">
            <h3 className="font-bold">Connected Wallet</h3>
            <p className="break-all">{account}</p>
            <p className="text-sm text-gray-600">
              via {availableWallets.find(w => w.id === activeWallet)?.name || activeWallet}
            </p>
          </div>
          <button
            className="disconnect-button w-full py-2 px-4 bg-red-500 text-white rounded hover:bg-red-600"
            onClick={disconnect}
          >
            Disconnect Wallet
          </button>
        </div>
      ) : (
        <div className="wallet-options grid gap-3">
          <h3 className="font-bold text-lg mb-2">Connect Wallet</h3>
          
          {availableWallets.length === 0 ? (
            <p className="text-center py-4">
              No compatible wallets detected. Please install a wallet extension.
            </p>
          ) : (
            availableWallets.map((wallet) => (
              <button
                key={wallet.id}
                className={`wallet-button flex items-center justify-center w-full py-3 px-4 
                            border rounded hover:bg-gray-50 transition duration-150 
                            ${loginInProgress ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={loginInProgress}
                onClick={wallet.connector}
              >
                <span className="wallet-icon mr-2 text-xl">
                  {wallet.icon}
                </span>
                {loginInProgress ? <Spinner /> : `Connect with ${wallet.name}`}
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default MultiWalletConnector;