'use client';

import React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';

import LogoutButton from './logout';

export default function Navbar() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Box sx={{
            marginTop: '5px', 
            marginBottom: '5px',  
            backgroundColor: '#111',
            border: '2px solid #41FF00 ',
            borderRadius: 3,
            boxShadow: '0px 0px 7px #41FF00',
            display: 'flex',
          }}>
            <p style={{
              fontSize: '1rem',
              color: '#41FF00',
              fontWeight: 'bold',
              border: '2px solid #111',
              borderRadius: 10,
              borderWidth: '15px',
            }}>
              ✨ Prompt Tester ✨
            </p>
          </Box>
          <LogoutButton />
        </Toolbar>
      </AppBar>
    </Box>
  );
}
