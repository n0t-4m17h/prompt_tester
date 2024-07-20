'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { Button, Alert } from '@mui/material';
import { Box } from '@mui/system';

import AuthStyles from '@/styles/auth.styles';
import { API_URL } from '../../../../config';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [alertData, setAlertData] = useState({ 
    show: false, severity: 'error', message: '',
  });

  const router = useRouter();

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
      // token is stored in httponly cookie, not local storage
      await axios.post(`${API_URL}/auth/login`, {
        email,
        password,
      });
      router.push('/dashboard');
    } catch (err) {
      setAlertData({ 
        show: true,
        severity: 'error',
        message: err.response.data.detail || 'Login failed',
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
        {
          alertData.show && 
          <Alert 
            variant='filled'
            severity={alertData.severity}
            onClose={handleCloseAlert}
          >
            {alertData.message}
          </Alert>
        }
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
