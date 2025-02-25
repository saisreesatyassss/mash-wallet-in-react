import React, { useCallback, useEffect, useState } from 'react';
import { useMagic } from '../hooks/MagicProvider'; 
import { logout } from '../utils/common'; 
import Card from '../components/ui/Card';
import CardLabel from '../components/ui/CardLabel';

const networkMapping = {
  '1': 'Ethereum (Mainnet)',
  '5': 'Ethereum (Goerli)',
  '11155111': 'Ethereum (Sepolia)',
  '137': 'Polygon (Mainnet)',
  '80001': 'Polygon (Mumbai)',
  '80002': 'Polygon (Amoy)',
  '10': 'Optimism (Mainnet)',
  '420': 'Optimism (Goerli)',
  '42161': 'Arbitrum (Mainnet)',
  '421613': 'Arbitrum (Goerli)',
  '59144': 'Linea (Mainnet)',
  '59140': 'Linea (Goerli)',
  '324': 'zkSync (Mainnet)',
  '280': 'zkSync (Sepolia)',
};

const UserInfo = ({ token, setToken }) => {
  const { magic, isLoading } = useMagic(); 
  const [publicAddress, setPublicAddress] = useState(localStorage.getItem('user'));
  const [network, setNetwork] = useState('Fetching network...');
  const [isNetworkError, setIsNetworkError] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!magic || isLoading) return;
      
      try {
        // Get user's public address if not already set
        if (!publicAddress) {
          const userMetadata = await magic.user.getInfo();
          if (userMetadata?.publicAddress) {
            console.log("User address:", userMetadata.publicAddress);
            setPublicAddress(userMetadata.publicAddress);
            localStorage.setItem('user', userMetadata.publicAddress);
          }
        }
      } catch (error) {
        console.error('Error fetching user info:', error);
      }
    };

    fetchUserData();
  }, [magic, isLoading, publicAddress]);

  useEffect(() => {
    const fetchNetworkInfo = async () => {
      if (!magic || isLoading) return;
      
      try {
        // Get the stored network info
        const storedNetwork = localStorage.getItem('selectedNetwork');
        if (storedNetwork) {
          const parsedNetwork = JSON.parse(storedNetwork);
          console.log("Using stored network:", parsedNetwork.name);
          setNetwork(parsedNetwork.name);
        } else {
          // Fallback to querying network if no stored info
          const networkId = await magic.rpcProvider.request({ method: 'net_version' });
          console.log("Network ID from provider:", networkId);
          setNetwork(networkMapping[networkId] || `Network ID: ${networkId}`);
        }
        setIsNetworkError(false);
      } catch (error) {
        console.error('Error fetching network info:', error);
        setNetwork('Unknown Network');
        setIsNetworkError(true);
      }
    };

    fetchNetworkInfo();
  }, [magic, isLoading]);
     
  const disconnect = useCallback(async () => {
    if (magic) {
      await logout(setToken, magic);
    }
  }, [magic, setToken]);

  return (
    <Card>
      <CardLabel leftHeader="Status" rightAction={<div onClick={disconnect}>Disconnect</div>} isDisconnect />
      <div className="flex-row">
        <div className={isNetworkError ? "red-dot" : "green-dot"} />
        <div className="connected">
          {isLoading ? 'Connecting...' : `Connected to ${network}`}
        </div>
      </div>
      <div className="code">
        {!publicAddress ? 'Fetching address...' : publicAddress}
      </div>
    </Card>
  );
};

const Dashboard = ({ token, setToken }) => {
  const { isLoading } = useMagic();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('loginType');
    // Keep selectedNetwork to remember the user's choice
    setToken('');
    window.location.href = '/login';
  };

  if (isLoading) {
    return <div>Loading Magic SDK...</div>;
  }

  return (
    <div>
      <h1>Dashboard</h1>
      {token ? (
        <div>
          <UserInfo token={token} setToken={setToken} />
          <button onClick={handleLogout} className="logout-button">Logout</button>
        </div>
      ) : (
        <p>Please log in to access the dashboard.</p>
      )}
    </div>
  );
};

export default Dashboard;