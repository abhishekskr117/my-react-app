import { useState } from 'react';
import { Box, Typography, TextField, Button, Paper, Divider } from '@mui/material';

export default function ChatBox() {
  const [messages, setMessages] = useState([
    { from: 'bot', text: 'Welcome! Ask anything about your Valorant stats.' }
  ]);
  const [input, setInput] = useState('');

  const sendMessage = () => {
    if (!input.trim()) return;

    setMessages([...messages, { from: 'user', text: input }, { from: 'bot', text: `Hey! Abhishek ${input}` }]);
    setInput('');
  };

  return (
    <Paper
       elevation={3}
       sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        borderLeft: '1px solid #333',
        p: 2,
        bgcolor: '#121212',
        color: '#fff'
       }}
    >

      <Typography variant="h6" gutterBottom>Velo Assist</Typography>
      <Divider sx={{ mb: 2 }} />
      
      <Box sx={{ flexGrow: 1, overflowY: 'auto', mb: 1 }}>
        {messages.map((msg, i) => (
          <Box
            key={i}
            sx={{
              textAlign: msg.from === 'user' ? 'right' : 'left',
              mb: 1
            }}
          >
           <Box
              sx={{
                   display: 'inline-block',
                   bgcolor: msg.from === 'user' ? '#8F553E' : '#2c2c2c',
                   color: '#fff',
                   px: 2,
                   py: 1,
                   borderRadius: 2,
                   maxWidth: '80%',
                 }}
            >
              {msg.text}
            </Box>
          </Box>
        ))}
      </Box>

      <Box sx={{ display: 'flex', gap: 1 ,bgcolor: '#2c2c2c', p: 1, borderRadius: 1 }}>
        <TextField
          size="small"
          variant="outlined"
          fullWidth
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          placeholder="Type a message..."
        />
        <Button variant="contained" onClick={sendMessage} style={{backgroundColor: "#8F553E"}}>Send</Button>
      </Box>
    </Paper>
  );
}
