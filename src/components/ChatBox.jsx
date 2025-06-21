import { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Divider,
  IconButton,
  Slide,
} from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';
import CloseIcon from '@mui/icons-material/Close';

export default function ChatBox({ handleLogout }) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { from: 'bot', text: 'Welcome! Ask anything about your Valorant stats. But for now I am repeating what ever you say, Sorry!' }
  ]);
  const [input, setInput] = useState('');

  const sendMessage = () => {
    const trimmed = input.trim();
    if (!trimmed) return;

    if (trimmed === '~~logout') {
      handleLogout(null);
    } else if (trimmed === '~~clear') {
      setMessages([
        { from: 'bot', text: 'Ask me anything about your Valorant stats. But for now I am repeating what ever you say, Sorry!' }
      ]);
    } else {
      setMessages(prev => [
        ...prev,
        { from: 'user', text: trimmed },
        { from: 'bot', text: `You said:  ${trimmed}` }
      ]);
    }

    setInput('');
  };  

  const clearChat = () => {
    messages?.length > 1 && setMessages([
      { from: 'bot', text: 'Ask me anything about your Valorant stats. But for now I am repeating what ever you say, Sorry!' }
    ]);
    setInput('');
  };

  return (
    <>
      {!open && (<IconButton
        onClick={() => setOpen(!open)}
        sx={{
          position: 'fixed',
          top: 16,
          right: 16,
          zIndex: 1200,
          bgcolor: '#8F553E',
          color: '#fff',
          '&:hover': { bgcolor: '#a05e40' }
        }}
      >
        <ChatIcon />
      </IconButton>)}
      <Slide direction="left" in={open} mountOnEnter unmountOnExit>
        <Paper
          elevation={3}
          sx={{
            position: 'fixed',
            top: 0,
            right: 0,
            width: { xs: '100%', sm: 320 },
            height: '100vh',
            bgcolor: '#121212',
            color: '#fff',
            zIndex: 1100,
            p: 2,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">Velo Assist</Typography>
            <IconButton onClick={() => setOpen(false)} sx={{ color: '#fff' }}>
              <CloseIcon />
            </IconButton>
          </Box>
          <Divider sx={{ my: 2 }} />
          <Box sx={{ flexGrow: 1, overflowY: 'auto', mb: 1, maxHeight: 'calc(100vh - 170px)' }}>
            {messages.map((msg, i) => (
              <Box key={i} sx={{ textAlign: msg.from === 'user' ? 'right' : 'left', mb: 1 }}>
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
          <Box sx={{ display: 'flex', gap: 1, bgcolor: '#2c2c2c', p: 1, borderRadius: 1 }}>
            <TextField
              sx={{ '& .MuiInputBase-input': { color: 'white' } }}
              size="small"
              variant="outlined"
              fullWidth
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="Type a message..."
            />
            <Button variant="contained" onClick={sendMessage} sx={{ bgcolor: '#8F553E' }}>
              Send
            </Button>
            {(input || messages?.length > 1) && ( <IconButton onClick={clearChat} sx={{ color: '#8F553E' }}>
              <CloseIcon />
            </IconButton>)}
          </Box>
        </Paper>
      </Slide>
    </>
  );
}
