import { getChainId, getNetworkUrl } from '../utils/network';
import { OAuthExtension } from '@magic-ext/oauth';
import { Magic as MagicBase } from 'magic-sdk';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';


const MagicContext = createContext({
  magic: null,
});

export const useMagic = () => useContext(MagicContext);

const MagicProvider = ({ children }) => {
  const [magic, setMagic] = useState(null);

  useEffect(() => {
  console.log('Initializing Magic SDK...');
    console.log('Using Magic API Key:', process.env.REACT_APP_MAGIC_API_KEY);

  if (process.env.REACT_APP_MAGIC_API_KEY) {
    console.log('Using Magic API Key:', process.env.REACT_APP_MAGIC_API_KEY);
    
    const magicInstance = new MagicBase(process.env.REACT_APP_MAGIC_API_KEY, {
      network: {
        rpcUrl: getNetworkUrl(),
        chainId: getChainId(),
      },
      extensions: [new OAuthExtension()],
    });

    console.log('Magic Instance Created:', magicInstance);
    setMagic(magicInstance);
  } else {
    console.error('Magic API Key is missing');
  }
}, []);


  const value = useMemo(() => {
    return {
      magic,
    };
  }, [magic]);

  return <MagicContext.Provider value={value}>{children}</MagicContext.Provider>;
};

export default MagicProvider;
