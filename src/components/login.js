 

import React, { useState, useEffect } from 'react';
import { useMagic } from '../hooks/MagicProvider';  
import { useNavigate } from 'react-router-dom';
import showToast from '../utils/showToast';  
import Spinner from '../components/ui/Spinner';  
import { RPCError, RPCErrorCode } from 'magic-sdk';
import { saveUserInfo } from '../utils/common';  
import Card from '../components/ui/Card';  
import CardHeader from '../components/ui/CardHeader';  
import FormInput from '../components/ui/FormInput';  

const Login = ({ token, setToken }) => {
  const { magic } = useMagic();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState(false);
  const [isLoginInProgress, setLoginInProgress] = useState(false);
   

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

  return (
    <Card>
      <CardHeader id="login">Log in or sign up</CardHeader>
      
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
          
       
    </Card>
  );
};

export default Login;