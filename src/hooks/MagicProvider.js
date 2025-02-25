import React, { createContext, useContext, useEffect, useState } from 'react';
import { Magic } from 'magic-sdk';
import { OAuthExtension } from '@magic-ext/oauth';

const MagicContext = createContext();

export const MagicProvider = ({ children }) => {
  const [magic, setMagic] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeMagic = async () => {
      setIsLoading(true);
      try {
        // Get network info from localStorage (set during login)
        const networkData = localStorage.getItem('selectedNetwork');
        const parsedNetwork = networkData ? JSON.parse(networkData) : {
          chainId: 137, // Default to Polygon Mainnet
          rpcUrl: 'https://polygon-rpc.com/'
        };

        console.log("Initializing Magic with network:", parsedNetwork);
        
        // Create a new Magic instance with the appropriate network
        const magicInstance = new Magic(process.env.REACT_APP_MAGIC_API_KEY, {
          network: {
            rpcUrl: parsedNetwork.rpcUrl,
            chainId: parsedNetwork.chainId,
          },
          extensions: [new OAuthExtension()],
        });
        
        setMagic(magicInstance);
      } catch (error) {
        console.error("Error initializing Magic in provider:", error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeMagic();
    
    // Add event listener for storage changes to detect network changes
    window.addEventListener('storage', (e) => {
      if (e.key === 'selectedNetwork') {
        initializeMagic();
      }
    });
    
    return () => {
      window.removeEventListener('storage', () => {});
    };
  }, []);

  return (
    <MagicContext.Provider value={{ magic, isLoading }}>
      {children}
    </MagicContext.Provider>
  );
};

export const useMagic = () => {
  const context = useContext(MagicContext);
  if (context === undefined) {
    throw new Error('useMagic must be used within a MagicProvider');
  }
  return context;
};