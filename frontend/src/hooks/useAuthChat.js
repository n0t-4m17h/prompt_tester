'use client';

import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { API_URL } from '../../config';

export default function useAuthChat() {
  const [user, setUser] = useState(null);
  const [chats, setChats] = useState([]);
  const [alertData, setAlertData] = useState({ 
    show: false, severity: 'error', message: '', 
  });
  const router = useRouter();

  const checkTokenExpiration = useCallback(async () => {
    try {
      const response = await axios.get(
        `${API_URL}/auth/me`, {}, 
        { withCredentials: true }
      );
      setUser(response.data);

      const chatsResponse = await axios.get(
        `${API_URL}/chat/chats`, {},
        { withCredentials: true }
      );
      setChats(chatsResponse.data);
    } catch (err) {
      console.error('Token validation error:', err);
      const msg = 'Session expired. Please log in again.';
      setAlertData({ 
        show: true,
        severity: 'error',
        message: msg,
      });
      router.push('/auth/login?error=Session expired. Please log in again.');
    }
  }, [router]);

  useEffect(() => {
    // check token exp every 29mins, just before 30min mark
    checkTokenExpiration();
    const interval = setInterval(checkTokenExpiration, 29 * 60 * 1000);

    return () => clearInterval(interval);
  }, [checkTokenExpiration]);

  return { 
    user, 
    chats, 
    setChats, 
    alertData, 
    setAlertData, 
    checkTokenExpiration, 
  };
}
