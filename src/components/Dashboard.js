import React, { useCallback, useEffect, useState } from 'react';
import { useMagic } from '../hooks/MagicProvider'; 
import useWeb3 from '../hooks/Web3';
import { logout } from '../utils/common'; 
import { getNetworkName } from '../utils/network';
import Card from '../components/ui/Card';
import CardLabel from '../components/ui/CardLabel';

const UserInfo = ({ token, setToken }) => {
  const { magic } = useMagic();
  const web3 = useWeb3();

  const [balance, setBalance] = useState('...');
  const [copied, setCopied] = useState('Copy');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [publicAddress] = useState(localStorage.getItem('user'));

  const getBalance = useCallback(async () => {
    if (publicAddress && web3) {
      const balance = await web3.eth.getBalance(publicAddress);
      // eslint-disable-next-line no-undef
      if (balance === BigInt(0)) {
        setBalance('0');
      } else {
        setBalance(web3.utils.fromWei(balance, 'ether'));
      }
      console.log('BALANCE: ', balance);
    }
  }, [web3, publicAddress]);

  const refresh = useCallback(async () => {
    setIsRefreshing(true);
    await getBalance();
    setTimeout(() => {
      setIsRefreshing(false);
    }, 500);
  }, [getBalance]);

  useEffect(() => {
    if (web3) {
      refresh();
    }
  }, [web3, refresh]);

  useEffect(() => {
    setBalance('...');
  }, [magic]);

  const disconnect = useCallback(async () => {
    if (magic) {
      await logout(setToken, magic);
    }
  }, [magic, setToken]);

  const copy = useCallback(() => {
    if (publicAddress && copied === 'Copy') {
      setCopied('Copied!');
      navigator.clipboard.writeText(publicAddress);
      setTimeout(() => {
        setCopied('Copy');
      }, 1000);
    }
  }, [copied, publicAddress]);

  return (
    <Card>
      <CardLabel leftHeader="Status" rightAction={<div onClick={disconnect}>Disconnect</div>} isDisconnect />
      <div className="flex-row">
        <div className="green-dot" />
        <div className="connected">Connected to {getNetworkName()}</div>
      </div>
      <div className="code">{publicAddress?.length === 0 ? 'Fetching address..' : publicAddress}</div>


    </Card>
  );
};

const Dashboard = ({ token, setToken }) => {
  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken('');
  };

  return (
    <div>
      <h1>Dashboard</h1>
      {token ? (
        <div>
          <UserInfo token={token} setToken={setToken} />
          <button onClick={handleLogout}>Logout</button>
        </div>
      ) : (
        <p>Please log in to access the dashboard.</p>
      )}
    </div>
  );
};

export default Dashboard;
