'use client';

import axios from 'axios';
import { useRouter } from 'next/router';
import { API_URL } from '../config';

import Button from '@mui/material/Button';

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      // Clear the cookie by setting it to an empty value
      await axios.post(`${API_URL}/auth/logout`, {}, { withCredentials: true });
      router.push('/auth/login');
    } catch (err) {
      console.error('Logout failed', err);
    }
  };

  return (
    <Button 
      variant='contained' 
      color='error' 
      size='medium' 
      onClick={handleLogout}
    >
      LOGOUT
    </Button>
  );
}
