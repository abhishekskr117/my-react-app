import { StrictMode, useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { Box } from '@mui/material';
import Sidebar from './components/Sidebar';
import LoginModal from './components/LoginModal';
import ChatBox from './components/ChatBox';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles({
  rootContainer: {
    display: 'flex',
    width: '100vw',
    height: '100vh',
    overflow: 'hidden',
  },
  contentContainer: {
    flexGrow: 1,
    overflowY: 'auto',
  },
});

function RootApp() {
  const [user, setUser] = useState(() => localStorage.getItem('user'));
  const classes = useStyles();
  const logoutTimer = useRef(null);

  const handleLogin = (username) => {
    localStorage.setItem('user', username);
    setUser(username);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  useEffect(() => {
    if (!user) return;

    const resetTimer = () => {
      clearTimeout(logoutTimer.current);
      logoutTimer.current = setTimeout(() => {
        alert('Logged out due to inactivity.');
        handleLogout();
      }, 5 * 60 * 1000); 
    };

    resetTimer();

    const events = ['mousemove', 'keydown', 'mousedown', 'touchstart'];
    events.forEach((event) => window.addEventListener(event, resetTimer));

    return () => {
      clearTimeout(logoutTimer.current);
      events.forEach((event) => window.removeEventListener(event, resetTimer));
    };
  }, [user]);

  if (!user) {
    return <LoginModal open={true} handleLogin={handleLogin} />;
  }

  return (
    <Box className={classes.rootContainer}>
      <Sidebar handleLogout={handleLogout} user={user}/>
      <Box className={classes.contentContainer}>
        <App user={user} />
      </Box>
      <ChatBox handleLogout = {handleLogout}/>
    </Box>
  );
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RootApp />
  </StrictMode>
);
