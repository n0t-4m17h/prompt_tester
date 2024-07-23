'use client';

import Link from 'next/link';
import { Box } from '@mui/system';

import AuthStyles from '@/styles/auth.styles';

export default function HomePage() {

  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      textAlign: 'center',
      marginTop: '50px',
      width: '100%',
      fontFamily: ['monospace'],
      height: '100%',
    }}>

      <h1>Hello, world! Welcome to</h1>

      <Box sx={{
        margin: 'auto', 
        marginTop: '20px', 
        marginBottom: '50px', 
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}>
        <Box sx={{
          marginTop: '30px', 
          marginBottom: '30px',  
          backgroundColor: '#111',
          border: '2px solid #41FF00 ',
          borderRadius: 3,
          boxShadow: '0px 0px 7px #41FF00',
          width: '500px',
        }}>
          <p style={{
            fontSize: '2rem',
            color: '#41FF00',
            fontWeight: 'bold',
            border: '2px solid #111',
            borderRadius: 10,
            borderWidth: '25px',
          }}>
            ✨ Prompt Tester ✨
          </p>
        </Box>
        <p style={{
          fontSize: '1.25rem',
          fontStyle: 'italic',
          color: 'lightgrey',
          fontWeight: 'bold',
        }}>
          A tool to test different prompts to an AI model
        </p>
      </Box>

      <Link href='/auth/login' passHref>
        <AuthStyles.colorHoverButton 
          variant='contained' 
          color='primary' 
          size='large'
        >
          <p style={{ fontWeight: 'bold' }}>
            Let&apos;s start!
          </p>
        </AuthStyles.colorHoverButton>
      </Link>
    </Box>
  );
}
