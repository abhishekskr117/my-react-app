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
  { name: 'RazeMain', achievements: 10, skins: 23 },
  { name: 'JettDash', achievements: 8, skins: 15 },
];

export default function Sidebar({ handleLogout }) {
  const [collapsed, setCollapsed] = useState(true);

  return (
    <Box
      width={collapsed ? 80 : 240}
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
          {friends.map((friend) => (
            <ListItem key={friend.name} divider>
              {collapsed ? (
                <Tooltip title={friend.name} placement="right">
                  <PeopleIcon sx={{ color: 'white' }} />
                </Tooltip>
              ) : (
                <ListItemText
                  primary={friend.name}
                  secondary={`${friend.achievements} Achievements • ${friend.skins} Skins`}
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
