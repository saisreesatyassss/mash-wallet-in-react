// Importing Magic from MagicProvider component
import { Dispatch, SetStateAction } from 'react';

// LoginProps object, without types
export const LoginProps = {
  token: '',
  setToken: (token) => {},
};

// TxnParams object, without types
export const TxnParams = {
  from: null,
  to: null,
  value: '',
  maxFeePerGas: undefined,
  maxPriorityFeePerGas: undefined,
  gasPrice: undefined,
};

// Exporting Magic from MagicProvider
export { Magic } from '../components/magic/MagicProvider';
