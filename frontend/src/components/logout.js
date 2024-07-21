'use client';

import axios from 'axios';
import { useRouter } from 'next/navigation';

import { API_URL } from '../../config';
import AuthStyles from '@/styles/auth.styles';

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
    <AuthStyles.colorHoverButton 
      variant='contained' 
      color='error' 
      size='large'
      onClick={handleLogout}
    >
      <p style={{ fontWeight: 'bold' }}>
        LOGOUT
      </p>
    </AuthStyles.colorHoverButton>
  );
}
