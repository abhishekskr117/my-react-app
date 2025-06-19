import { useState } from 'react';
import './App.css';
import LoginModal from './components/LoginModal';
import Sidebar from './components/Sidebar';
import UserStats from './components/UserStats';
import Achievements from './components/Achievements';
import Collections from './components/Collections';
import MatchGraph from './components/MatchGraph';
import { Box, Typography } from '@mui/material';
import StatsDashboard from './components/StatsDashboard'; 

function App() {
  const [user, setUser] = useState(null);

  if (!user) {
    return <LoginModal open={true} handleLogin={(username) => setUser(username)} />;
  }

  return (
    <Box  display="flex" justifyContent="space-between" alignItems="center">
      <Sidebar handleLogout={setUser}/>
      <Box p={3} flex={1}>
        <Typography variant="h4">Welcome, {user}</Typography>
        <UserStats />
        <Collections />
        <StatsDashboard />
        <Achievements />
        <MatchGraph />
    </Box>
    </Box>
  );
}

export default App;
