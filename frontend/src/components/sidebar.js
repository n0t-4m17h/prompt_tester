'use client';

import React from 'react';
import { 
  List, ListItem, ListItemText, ListItemButton,
  Button, Box, Tooltip, Typography,
} from '@mui/material';

export default function Sidebar({ user, chats, onNewChat, onSelectChat }) {
  return (
    <Box 
      width={150} 
      bgcolor="primary.light" 
      height="93.5vh" 
      sx={{
        textAlign: 'center', 
        display: 'flex', 
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
    >
      <Box sx={{ 
        maxHeight: '100%', 
      }}>
        <Box p={1} >
          <Button 
            variant="contained"
            color="success"
            onClick={onNewChat}
            size='large'
          >
            New Chat
          </Button>
          <h1 style={{color:'black'}}>Chats</h1>
        </Box>
        <Box sx={{ 
          overflowY: 'auto', 
          maxHeight: '75vh', 
          width: '100%', 
        }}>
          <List>
            {chats.length === 0 ? (
              <h2 style={{color:'white'}}>uh oh, no chats!</h2>
            ) : (
              chats.map(chat => (
                <ListItem key={chat.id} sx={{ width: '100%' }} >
                  <Tooltip title={chat.title} arrow placement="right">
                    <ListItemButton fullWidth
                      onClick={() => onSelectChat(chat)}
                      sx={{ 
                        backgroundColor: 'darkgrey', 
                        border: '1px solid white',
                        width: '100%',
                      }}
                    >
                      <ListItemText 
                        primary={chat.title} 
                        primaryTypographyProps={{ 
                          color: 'black', noWrap: true, 
                        }} 
                      />
                    </ListItemButton>
                  </Tooltip>
                </ListItem>
              ))
            )}
          </List>
        </Box>
      </Box>
      <Box 
        maxHeight="100%" 
        width="100%" 
        p={2} 
        bgcolor="navy" 
        sx={{overflowWrap: 'break-word', overflowY: 'auto'}}
      >
        <Typography variant="body1" color="white">
          {user ? `Hello there, ${user.firstname}!` : 'Not logged in'}
        </Typography>
      </Box>
    </Box>
  );
}
