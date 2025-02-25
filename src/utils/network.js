export const Network = {
  POLYGON_AMOY: 'polygon-amoy',
  POLYGON: 'polygon',
  ETHEREUM_SEPOLIA: 'ethereum-sepolia',
  ETHEREUM: 'ethereum',
  ETHERLINK: 'etherlink',
  ETHERLINK_TESTNET: 'etherlink-testnet',
  ZKSYNC: 'zksync',
  ZKSYNC_SEPOLIA: 'zksync-sepolia',
};

export const getNetworkUrl = () => {
  switch (process.env.REACT_APP_BLOCKCHAIN_NETWORK) {
    case Network.POLYGON:
      return 'https://polygon-rpc.com/';
    case Network.POLYGON_AMOY:
      return 'https://rpc-amoy.polygon.technology/';
    case Network.ETHEREUM_SEPOLIA:
      return 'https://eth-sepolia.g.alchemy.com/v2/fYFybLQFR9Zr2GCRcgALmAktStFKr0i0';
    case Network.ETHEREUM:
      return 'https://eth-mainnet.g.alchemy.com/v2/fYFybLQFR9Zr2GCRcgALmAktStFKr0i0';
    case Network.ETHERLINK:
      return 'https://node.mainnet.etherlink.com';
    case Network.ETHERLINK_TESTNET:
      return 'https://node.ghostnet.etherlink.com';
    case Network.ZKSYNC:
      return 'https://mainnet.era.zksync.io';
    case Network.ZKSYNC_SEPOLIA:
      return 'https://zksync-era-sepolia.blockpi.network/v1/rpc/public';
    default:
      throw new Error('Network not supported');
  }
};

export const getChainId = () => {
  switch (process.env.REACT_APP_BLOCKCHAIN_NETWORK) {
    case Network.POLYGON:
      return 137;
    case Network.POLYGON_AMOY:
      return 80002;
    case Network.ETHEREUM_SEPOLIA:
      return 11155111;
    case Network.ZKSYNC:
      return 324;
    case Network.ZKSYNC_SEPOLIA:
      return 300;
    case Network.ETHEREUM:
      return 1;
    case Network.ETHERLINK:
      return 42793;
    case Network.ETHERLINK_TESTNET:
      return 128123;
    default:
      return null;
  }
};
 

 

export const getNetworkName = () => {
  switch (process.env.REACT_APP_BLOCKCHAIN_NETWORK) {
    case Network.POLYGON:
      return 'Polygon (Mainnet)';
    case Network.POLYGON_AMOY:
      return 'Polygon (Amoy)';
    case Network.ETHEREUM_SEPOLIA:
      return 'Ethereum (Sepolia)';
    case Network.ETHEREUM:
      return 'Ethereum (Mainnet)';
    case Network.ETHERLINK:
      return 'Etherlink (Mainnet)';
    case Network.ETHERLINK_TESTNET:
      return 'Etherlink (Testnet)';
    case Network.ZKSYNC:
      return 'zkSync (Mainnet)';
    case Network.ZKSYNC_SEPOLIA:
      return 'zkSync (Sepolia)';
    default:
      return null;
  }
};
 
 