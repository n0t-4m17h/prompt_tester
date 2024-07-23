'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@mui/material';
import { Box } from '@mui/system';

import AuthStyles from '@/styles/auth.styles';
import Alert from '@/components/alert';
import { API_URL } from '../../../../config';

function LoginPageComponent() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [alertData, setAlertData] = useState({ 
    show: false, severity: 'error', message: '',
  });

  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {

    const error = searchParams.get('error');
    console.error('ERROR', error);
    if (error) {
      setAlertData({ show: true, severity: 'error', message: error });
    }
  }, [router, searchParams]);

  const handleCloseAlert = () => {
    setAlertData({ ...alertData, show: false });
  };

  const handleLogin = async () => {
    // login input handling logic
    if (email.length === 0 || password.length === 0) {
      setAlertData({ 
        show: true, severity: 'error', message: 'Missing input data', 
      });
      return;
    }
    // email regex checker??
    try {
      // token is stored in httponly cookie, not local storage, but stil in resp
      await axios.post(`${API_URL}/auth/login`, {
        email,
        password,
      });
      router.push('/dashboard');
    } catch (err) {
      console.error(err);
      let errorMessage = 'Login failed';
      if (err.response) {
        errorMessage = err.response.data.detail || errorMessage;
      } else if (err.request) {
        errorMessage = 'No response from the server. Please try again later.';
      } else {
        errorMessage = err.message;
      }
      setAlertData({
        show: true, severity: 'error', message: errorMessage,
      });
    }
  };

  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      textAlign: 'center',
      marginTop: '50px',
      width: '100%',
      fontFamily: ['monospace'],
    }}>
      <h1>Login to your account!</h1>
      <AuthStyles.authContent>
        <Alert alertData={alertData} handleCloseAlert={handleCloseAlert} />
        Email: <input
          type='text'
          onChange={e => setEmail(e.target.value)}
          value={email}
          placeholder='Enter your email'
        /> <br/>
        Password: <input
          type='text'
          onChange={e => setPassword(e.target.value)}
          value={password}
          placeholder='Enter your password'
        /> <br/>

        <AuthStyles.authButtonDiv>
          <Button 
            variant='contained' 
            color='success' 
            size='medium' 
            onClick={handleLogin}
          >
            Login
          </Button> <br/>
          <Link href='/auth/register' passHref>
            <Button variant='contained' color='primary' size='medium'>
              Register?
            </Button>
          </Link>
        </AuthStyles.authButtonDiv>
      </AuthStyles.authContent>
      
    </Box>
  );
}

// suspence issue due to search params
export default function LoginPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginPageComponent />
    </Suspense>
  );
}
