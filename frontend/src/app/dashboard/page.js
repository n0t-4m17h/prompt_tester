'use client';

import React, { useState, useEffect } from 'react';
import { Button, TextField, Typography, Box, Tooltip } from '@mui/material';
import axios from 'axios';

import { API_URL } from '../../../config';
import useAuthChat from '@/hooks/useAuthChat';
import Sidebar from '@/components/sidebar';
import Navbar from '@/components/navbar';
import Alert from '@/components/alert';

export default function Dashboard() {
  const { 
    user, 
    chats, 
    setChats, 
    alertData, 
    setAlertData,
    checkTokenExpiration,
  } = useAuthChat();
  const [currentChat, setCurrentChat] = useState(null);
  const [chatTitle, setChatTitle] = useState('');
  const [userPrompt, setUserPrompt] = useState('');
  const [parameters, setParameters] = useState({ 
    tokens: 1024, temperature: 1, top_p: 1,
  });
  const [isTitleEntered, setIsTitleEntered] = useState(false);
  const [isValidParameters, setIsValidParameters] = useState(true);

  useEffect(() => {
    if (currentChat && currentChat.id) {
      const selectedChat = chats.find(chat => chat.id === currentChat.id);
      setCurrentChat(selectedChat);
      if (selectedChat.messages && selectedChat.messages.length > 0) {
        const lastMessage = selectedChat.messages[
          selectedChat.messages.length - 1
        ];
        setUserPrompt(lastMessage.user_prompt);
        setParameters({
          tokens: lastMessage.parameters.tokens,
          temperature: lastMessage.parameters.temperature,
          top_p: lastMessage.parameters.top_p || 1,
        });
      } else {
        setUserPrompt('');
        setParameters({ tokens: 1024, temperature: 1, top_p: 1 });
      }
    }
  }, [chats, currentChat]);

  useEffect(() => {
    const { tokens, temperature, top_p } = parameters;
    const isValid = (
      tokens >= 0 && tokens <= 8192 &&
      temperature >= 0 && temperature <= 2 &&
      top_p >= 0 && top_p <= 1
    );
    setIsValidParameters(isValid);
  }, [parameters]);

  const handleCloseAlert = () => {
    setAlertData({ ...alertData, show: false });
  };

  const handleNewChat = () => {
    setCurrentChat(null);
    setChatTitle('');
    setUserPrompt('');
    setParameters({ tokens: 1024, temperature: 1, top_p: 1 });
  };

  const handleCreateChat = async () => {
    await checkTokenExpiration();
    try {
      const response = await axios.post(`${API_URL}/chat/chats`, 
        {
          title: chatTitle,
          initial_message: {
            user_prompt: userPrompt,
            parameters,
          },
        }, 
        { withCredentials: true }
      );

      setChats([...chats, response.data]);
      setCurrentChat(response.data);
    } catch (err) {
      console.error('Error creating chat:', err);
      setAlertData({ 
        show: true,
        severity: 'error',
        message: 'Failed to create chat. Please try again.',
      });
    }
  };

  const handleSendPrompt = async () => {
    await checkTokenExpiration();
    try {
      const response = await axios.post(
        `${API_URL}/chat/chats/${currentChat.id}/message`,
        {
          user_prompt: userPrompt,
          parameters,
        }, 
        { withCredentials: true }
      );

      const updatedChat = { 
        ...currentChat, 
        messages: [...currentChat.messages, response.data],
      };
      setCurrentChat(updatedChat);

      const updatedChats = chats.map(chat =>
        chat.id === currentChat.id ? updatedChat : chat
      );
      setChats(updatedChats);
    } catch (err) {
      console.error('Error sending prompt:', err);
      setAlertData({ 
        show: true,
        severity: 'error',
        message: 'Failed to send prompt. Please try again.',
      });
    }
  };

  return (
    <Box sx={{ backgroundColor: 'white', height: '100vh'}}>
      <Navbar />
      <Box display="flex">
        <Sidebar 
          user={user}
          chats={chats} 
          onNewChat={handleNewChat} 
          onSelectChat={setCurrentChat} 
        />
        <Box flex={1} p={3}>
          <Alert alertData={alertData} handleCloseAlert={handleCloseAlert} />
          <Box display="flex">
            <Box flex={2} p={2}>
              <Typography variant="h5" color="black">System Input</Typography>
              {currentChat ? (
                <Box>
                  <Typography variant="h6" color="black">
                    {currentChat.title}
                  </Typography>
                  <TextField
                    label="System prompt"
                    value={userPrompt}
                    onChange={(e) => setUserPrompt(e.target.value)}
                    fullWidth
                    multiline
                    rows={4}
                    margin="normal"
                    variant="outlined"
                    InputProps={{
                      style: { color: 'black' },
                    }}
                    InputLabelProps={{ style: { color: 'darkgray' } }}
                  />
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSendPrompt}
                    disabled={!userPrompt || !isValidParameters}
                  >
                    Enter Prompt
                  </Button>
                </Box>
              ) : (
                <Box>
                  <TextField
                    label="Chat Title"
                    value={chatTitle}
                    onChange={(e) => {
                      setChatTitle(e.target.value);
                      setIsTitleEntered(e.target.value.trim().length > 0);
                    }}
                    fullWidth
                    margin="normal"
                    variant="outlined"
                    InputProps={{
                      style: { color: 'black' },
                    }}
                    InputLabelProps={{ style: { color: 'gray' } }}
                  />
                  <TextField
                    label="System prompt"
                    value={userPrompt}
                    onChange={(e) => setUserPrompt(e.target.value)}
                    fullWidth
                    multiline
                    rows={4}
                    margin="normal"
                    variant="outlined"
                    disabled={!isTitleEntered}  // due to backend handling logic
                    InputProps={{
                      style: { color: 'black' },
                    }}
                    InputLabelProps={{ style: { color: 'gray' } }}
                  />
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleCreateChat}
                    disabled={
                      !isTitleEntered || !userPrompt || !isValidParameters
                    }
                  >
                    Enter prompt
                  </Button>
                </Box>
              )}
            </Box>
            <Box flex={4} p={2}>
              <Typography variant="h5" color="black">Chat History</Typography>
              <Box sx={{ 
                maxHeight: '80vh', 
                overflowY: 'auto', 
                border: '1px solid gray', 
                padding: '10px', 
                borderRadius: '4px', 
              }}>
                {currentChat && currentChat.messages && 
                  currentChat.messages.map(message => (
                    <Box key={message.id} mb={2} 
                      sx={{
                        border: '2px solid darkgray',
                        backgroundColor: 'lightgray',
                      }}>
                      <Typography variant="subtitle1" color="black">
                      USER: {message.user_prompt}
                      </Typography>
                      <Typography variant="subtitle2" color="black">
                      ASSISTANT: {message.model_response}
                      </Typography>
                    </Box>
                  ))}
              </Box>
            </Box>
            <Box flex={1} p={2} bgcolor="none">
              <Typography variant="h5" color="black">Parameters</Typography>
              <Tooltip 
                title={
                  `The maximum number of tokens to generate. Requests can use 
                  up to 8192 tokens shared between prompt and completion.
                  RANGE: 0-8192`
                } 
                arrow placement="left"
              >
                <TextField
                  label="Tokens"
                  type="number"
                  value={parameters.tokens}
                  onChange={(e) => setParameters({ 
                    ...parameters, tokens: e.target.value,
                  })}
                  fullWidth
                  margin="normal"
                  variant="outlined"
                  InputProps={{
                    style: {
                      color: 'black',
                    },
                  }}
                  InputLabelProps={{
                    style: { color: 'gray' },
                  }}
                  // disabled={!isTitleEntered}
                />
              </Tooltip>
              <Tooltip 
                title={
                  `Controls randomness: lowering results in less random
                  completions. As the temperature approaches zero, the model
                  will become deterministic and repetitive. RANGE: 0-2`
                }
                arrow placement="left"
              >
                <TextField
                  label="Temperature"
                  type="number"
                  value={parameters.temperature}
                  onChange={(e) => setParameters({
                    ...parameters, temperature: e.target.value,
                  })}
                  fullWidth
                  margin="normal"
                  variant="outlined"
                  InputProps={{
                    style: {
                      color: 'black',
                    },
                  }}
                  InputLabelProps={{
                    style: { color: 'gray' },
                  }}
                  // disabled={!isTitleEntered}
                />
              </Tooltip>
              <Tooltip 
                title={
                  `Controls diversity via nucleus sampling: 0.5 means half of
                  all likelihood-weighted options are considered. RANGE: 0-1`
                }
                arrow placement="left"
              >
                <TextField
                  label="Top P"
                  type="number"
                  value={parameters.top_p}
                  onChange={(e) => setParameters({
                    ...parameters, top_p: e.target.value,
                  })}
                  fullWidth
                  margin="normal"
                  variant="outlined"
                  InputProps={{
                    style: {
                      color: 'black',
                    },
                  }}
                  InputLabelProps={{
                    style: { color: 'gray' },
                  }}
                  // disabled={!isTitleEntered}
                />
              </Tooltip>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
