"use client";

import { useEffect, useState } from 'react';
import { API_URL } from '../config'

export default function HomePage() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchMessage = async () => {
      try {
        const response = await fetch(`${API_URL}/`);
        const data = await response.json();
        setMessage(data.message);
        console.log(data.message);
      } catch (error) {
        console.error('Error fetching message:', error);
      }
    };

    fetchMessage();
  }, []);

  return (
    <div>
      <h1>Welcome to da Home Page</h1>
      <p>{message}</p>
    </div>
  );
}
