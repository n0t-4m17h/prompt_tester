'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { Button, Alert } from '@mui/material';
import { Box } from '@mui/system';

import AuthStyles from '@/styles/auth.styles';
import { API_URL } from '../../../../config';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [alertData, setAlertData] = useState({ 
    show: false, severity: 'error', message: '', 
  });

  const handleCloseAlert = () => {
    setAlertData({ ...alertData, show: false });
  };

  const router = useRouter();

  const handleRegister = async () => {
    // registration input handling logic
    if (email.length === 0 || password.length === 0 || firstname.length === 0 
        || lastname.length === 0) 
    {
      setAlertData({ 
        show: true, severity: 'error', message: 'Missing input data', 
      });
      return;
    }
    if (password !== confirmPassword) {
      setAlertData({ 
        show: true, severity: 'error', message: 'Passwords do not match', 
      });
      return;
    }
    // email regex checker??
    try {
      // token is stored in httponly cookie, not local storage, but stil in resp
      await axios.post(`${API_URL}/auth/register`, {
        firstname,
        lastname,
        email,
        password,
      });
      router.push('/dashboard');
    } catch (err) {
      console.log(err);
      setAlertData({ 
        show: true,
        severity: 'error',
        message: err.response.data.detail || 'Registration failed',
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
      <h1>Register your account!</h1>
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
        First Name: <input
          type='text'
          onChange={e => setFirstname(e.target.value)}
          value={firstname}
          placeholder='Enter your first name'
        /> <br/>
        Last Name: <input
          type='text'
          onChange={e => setLastname(e.target.value)}
          value={lastname}
          placeholder='Enter your last name'
        /> <br/>
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
        Confirm Password: <input
          type='text'
          onChange={e => setConfirmPassword(e.target.value)}
          value={confirmPassword}
          placeholder='Re-enter your password'
        /> <br/>

        <AuthStyles.authButtonDiv>
          <Button 
            variant='contained' 
            color='success' 
            size='medium' 
            onClick={handleRegister}
          >
            Register
          </Button> <br/>
          <Link href='/auth/login' passHref>
            <Button variant='contained' color='primary' size='medium'>
              Login?
            </Button>
          </Link>
        </AuthStyles.authButtonDiv>
      </AuthStyles.authContent>
      
    </Box>
  );
}
