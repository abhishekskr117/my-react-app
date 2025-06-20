import { useState } from 'react';
import './App.css';
import UserStats from './components/UserStats';
import Achievements from './components/Achievements';
import Collections from './components/Collections';
import MatchGraph from './components/MatchGraph';
import { Box, Typography } from '@mui/material';
import StatsDashboard from './components/StatsDashboard'; 

function App({user}) {
console.log("user", user);

  return (
    <Box  display="flex" justifyContent="space-between" className="app-container">
      <Box p={3} flex={1} className="main-content">
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
