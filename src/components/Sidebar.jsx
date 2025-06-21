import {
  Button,
  Box,
  List,
  ListItem,
  ListItemText,
  Typography,
  IconButton,
  Tooltip,
  Divider
} from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import LogoutIcon from '@mui/icons-material/Logout';
import MenuIcon from '@mui/icons-material/Menu';
import { useState } from 'react';

const friends = [
    { name: 'Razefoot', achievements: 5 , status: true },
    { name: 'PhoenixFire', achievements: 2 , status: false },
    { name: 'BattleSage', achievements: 5 , status: true },
    { name: 'Chambur', achievements: 2 ,status: true }
];

export default function Sidebar({ handleLogout, user }) {
  const [collapsed, setCollapsed] = useState(true);

  const filteredFriend = friends?.filter(item => item?.name !== user);  

  return (
    <Box
      width={collapsed ? 50 : 240}
      bgcolor="#8F553E"
      p={2}
      height="97vh"
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
    >
      <Box>
        <Box display="flex" justifyContent={collapsed ? "center" : "space-between"} alignItems="center" mb={2}>
          {!collapsed && <Typography variant="h6" color="white">Friends</Typography>}
          <IconButton onClick={() => setCollapsed(!collapsed)} sx={{ color: 'white' }}>
            <MenuIcon />
          </IconButton>
        </Box>
        <List>
          {filteredFriend.map((friend) => (
            <ListItem key={friend.name} divider>
              {collapsed ? (
                <Tooltip title={friend.name} placement="right">
                  <PeopleIcon sx={{ color: 'white' }} />
                </Tooltip>
              ) : (
                <ListItemText
                  primary={friend.name}
                  secondary={`${friend.achievements} Achievements • ${friend.status ? 'Online' : 'Away'}`}
                  primaryTypographyProps={{ color: "white" }}
                  secondaryTypographyProps={{ color: "lightgray" }}
                />
              )}
            </ListItem>
          ))}
        </List>
      </Box>
      <Box>
        <Divider sx={{ mb: 1, bgcolor: 'error' }} />
        {collapsed ? (
          <Tooltip title="Logout" placement="right">
            <IconButton onClick={() => handleLogout(null)} sx={{ color: 'white' }}>
              <LogoutIcon />
            </IconButton>
          </Tooltip>
        ) : (
          <Button variant="outlined" color="white" fullWidth onClick={() => handleLogout(null)}>
            Logout
          </Button>
        )}
      </Box>
    </Box>
  );
}
