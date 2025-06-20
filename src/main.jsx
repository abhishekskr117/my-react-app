import { StrictMode, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { Box } from '@mui/material';
import Sidebar from './components/Sidebar';
import LoginModal from './components/LoginModal';

function RootApp() {
  const [user, setUser] = useState(null); 
  
    if (!user) {
    return <LoginModal open={true} handleLogin={(username) => setUser(username)} />;
    }

  return (
    <Box sx={{ display: 'flex', maxHeight: '100vh' }}>
      <Sidebar handleLogout={setUser} />
      <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
        <App user={user}/>
      </Box>
    </Box>
  );
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RootApp />
  </StrictMode>
);
