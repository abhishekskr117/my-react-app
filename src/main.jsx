import { StrictMode, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { Box } from '@mui/material';
import Sidebar from './components/Sidebar';
import LoginModal from './components/LoginModal';
import ChatBox from './components/ChatBox';

function RootApp() {
  const [user, setUser] = useState(null); 

  if (!user) {
    return <LoginModal open={true} handleLogin={(username) => setUser(username)} />;
  }

  return (
    <Box
      sx={{
        display: 'flex',
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
      }}
    >
      <Sidebar handleLogout={() => setUser(null)} />
      <Box sx={{ flexGrow: 1, overflowY: 'auto' }}>
        <App user={user} />
      </Box>
      <ChatBox />
    </Box>
  );
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RootApp />
  </StrictMode>
);
