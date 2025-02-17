// import React, { useState } from 'react';
// import { useMagic } from '../hooks/MagicProvider'; // Adjust the path as per your project
// import showToast from '../utils/showToast'; // Adjust the path as per your project
// import Spinner from '../components/ui/Spinner'; // Adjust the path as per your project
// import { RPCError, RPCErrorCode } from 'magic-sdk';
// import { saveUserInfo } from '../utils/common'; // Adjust the path as per your project
// import Card from '../components/ui/Card'; // Adjust the path as per your project
// import CardHeader from '../components/ui/CardHeader'; // Adjust the path as per your project
// import FormInput from '../components/ui/FormInput'; // Adjust the path as per your project

// const Login = ({ token, setToken }) => {
//   const { magic } = useMagic();
//   const [email, setEmail] = useState('');
//   const [emailError, setEmailError] = useState(false);
//   const [isLoginInProgress, setLoginInProgress] = useState(false);

// const handleLogin = async () => {
//   if (!email.match(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/)) {
//     setEmailError(true);
//     return;
//   }

//   try {
//     setLoginInProgress(true);
//     setEmailError(false);

//     console.log('Checking Magic instance:', magic);
//     if (!magic) throw new Error('Magic instance not found');

//     console.log('Logging in with email:', email);
//     const token = await magic.auth.loginWithEmailOTP({ email });
//     console.log('Token received:', token);

//     if (!token) throw new Error('No token received');

//     const metadata = await magic.user.getInfo();
//     console.log('User metadata:', metadata);

//     if (!metadata?.publicAddress) throw new Error('Magic login failed: No publicAddress');

//     setToken(token);
//     localStorage.setItem('token', token);
//     saveUserInfo(token, 'EMAIL', metadata.publicAddress);
//     setEmail('');
//   } catch (e) {
//     console.error('Login error:', e);

//     if (e instanceof RPCError) {
//       switch (e.code) {
//         case RPCErrorCode.MagicLinkFailedVerification:
//         case RPCErrorCode.MagicLinkExpired:
//         case RPCErrorCode.MagicLinkRateLimited:
//         case RPCErrorCode.UserAlreadyLoggedIn:
//           showToast({ message: e.message, type: 'error' });
//           break;
//         default:
//           showToast({ message: 'Something went wrong. Please try again', type: 'error' });
//       }
//     } else {
//       showToast({ message: e.message || 'Unexpected error occurred', type: 'error' });
//     }
//   } finally {
//     setLoginInProgress(false);
//   }
// };


//   return (
//     <Card>
//       <CardHeader id="login">Email OTP Login</CardHeader>
//       <div className="login-method-grid-item-container">
//         <FormInput
//           onChange={(e) => {
//             if (emailError) setEmailError(false);
//             setEmail(e.target.value);
//           }}
//           placeholder={token.length > 0 ? 'Already logged in' : 'Email'}
//           value={email}
//         />
//         {emailError && <span className="error">Enter a valid email</span>}
//         <button
//           className="login-button"
//           disabled={isLoginInProgress || (token.length > 0 ? false : email.length === 0)}
//           onClick={handleLogin}
//         >
//           {isLoginInProgress ? <Spinner /> : 'Log in / Sign up'}
//         </button>
//       </div>
//     </Card>
//   );
// };

// export default Login;

import React, { useState, useEffect } from 'react';
import { useMagic } from '../hooks/MagicProvider'; // Adjust the path as per your project
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation (instead of useHistory)
import showToast from '../utils/showToast'; // Adjust the path as per your project
import Spinner from '../components/ui/Spinner'; // Adjust the path as per your project
import { RPCError, RPCErrorCode } from 'magic-sdk';
import { saveUserInfo } from '../utils/common'; // Adjust the path as per your project
import Card from '../components/ui/Card'; // Adjust the path as per your project
import CardHeader from '../components/ui/CardHeader'; // Adjust the path as per your project
import FormInput from '../components/ui/FormInput'; // Adjust the path as per your project

const Login = ({ token, setToken }) => {
  const { magic } = useMagic();
  const navigate = useNavigate(); // Use useNavigate for navigation
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState(false);
  const [isLoginInProgress, setLoginInProgress] = useState(false);

  // Check if the token exists in localStorage and redirect to dashboard
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      navigate('/dashboard'); // Redirect to dashboard if token is found
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

      console.log('Checking Magic instance:', magic);
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
      <CardHeader id="login">Email OTP Login</CardHeader>
      <div className="login-method-grid-item-container">
        <FormInput
          onChange={(e) => {
            if (emailError) setEmailError(false);
            setEmail(e.target.value);
          }}
          placeholder={token.length > 0 ? 'Already logged in' : 'Email'}
          value={email}
        />
        {emailError && <span className="error">Enter a valid email</span>}
        <button
          className="login-button"
          disabled={isLoginInProgress || (token.length > 0 ? false : email.length === 0)}
          onClick={handleLogin}
        >
          {isLoginInProgress ? <Spinner /> : 'Log in / Sign up'}
        </button>
      </div>
    </Card>
  );
};

export default Login;
