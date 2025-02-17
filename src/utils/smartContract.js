import { Network } from "./network";

// getContractId function
export const getContractId = () => {
  switch (process.env.REACT_APP_BLOCKCHAIN_NETWORK) {
    case Network.POLYGON_AMOY:
      return '0xabBb65DD49c18e1ee504C92a83f8f60eC0726e1b';
    case Network.ETHEREUM_SEPOLIA:
      return '0xa5bf55cC9afF6E0Ab59D8Fdd835c63983F124d03';
    case Network.ZKSYNC_SEPOLIA:
      return '0xDA39B00b285B6344E420Fe6F4FC0Aa4Ee5A4312d';
    default:
      return null;
  }
};

// isTestnet function
export const isTestnet = () => {
  const testnets = [Network.POLYGON_AMOY, Network.ETHEREUM_SEPOLIA, Network.ZKSYNC_SEPOLIA];
  const currentNetwork = process.env.REACT_APP_BLOCKCHAIN_NETWORK;

  return currentNetwork && testnets.includes(currentNetwork);
};

// getHashLink function
export const getHashLink = (hash) => {
  switch (process.env.REACT_APP_BLOCKCHAIN_NETWORK) {
    case Network.POLYGON_AMOY:
      return `https://www.oklink.com/amoy/tx/${hash}`;
    case Network.ETHEREUM_SEPOLIA:
      return `https://sepolia.etherscan.io/tx/${hash}`;
    case Network.ZKSYNC_SEPOLIA:
      return `https://sepolia.explorer.zksync.io/tx/${hash}`;
    default:
      return '';
  }
};

// abi array
export const abi = [
  {
    "inputs": [],
    "name": "retrieve",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "num",
        "type": "uint256"
      }
    ],
    "name": "store",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];
