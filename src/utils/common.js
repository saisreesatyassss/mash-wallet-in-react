// utils/common.js

export const saveUserInfo = (token, loginType, publicAddress) => {
  if (token && publicAddress) {
    localStorage.setItem('token', token);
    localStorage.setItem('user', publicAddress);
    localStorage.setItem('loginType', loginType);
  }
};

export const logout = async (setToken, magic) => {
  try {
    if (magic) {
      await magic.user.logout();
    }
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('loginType');
    localStorage.removeItem('selectedNetwork');
    setToken('');
    
    return true;
  } catch (error) {
    console.error('Logout error:', error);
    return false;
  }
};

// Add this utility function to switch networks if needed
export const switchNetwork = async (magic, networkConfig) => {
  if (!magic) return false;
  
  try {
    // Store the updated network config
    localStorage.setItem('selectedNetwork', JSON.stringify(networkConfig));
    
    // Use Magic SDK to switch the network
    await magic.network.enable({
      rpcUrl: networkConfig.rpcUrl,
      chainId: networkConfig.chainId
    });
    
    return true;
  } catch (error) {
    console.error('Network switch error:', error);
    return false;
  }
};