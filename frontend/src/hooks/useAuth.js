'use client';

import { useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { API_URL } from '../../config';

export default function useAuth() {
  const router = useRouter();

  useEffect(() => {
    const checkTokenExpiration = async () => {
      try {
        // axios is configured to include credentials/cookies
        await axios.get(`${API_URL}/auth/me`, {}, { withCredentials: true });
      } catch (err) {
        console.error('Token validation error:', err);
        router.push('/auth/login');
      }
    };

    // check token exp every 29mins, just before 30min mark
    checkTokenExpiration();
    const interval = setInterval(checkTokenExpiration, 29 * 60 * 1000);

    return () => clearInterval(interval);
  }, [router]);
}
