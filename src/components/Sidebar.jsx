import {Button, Box, List, ListItem, ListItemText, Typography } from '@mui/material';

const friends = [
  { name: 'RazeMain', achievements: 10, skins: 23 },
  { name: 'JettDash', achievements: 8, skins: 15 },
];

export default function Sidebar({ handleLogout }) {
  return (
    <Box width={240} bgcolor="#22495B" p={2} height="100vh">
      <Typography variant="h6" mb={2}>Friends</Typography>
      <List>
        {friends.map((friend) => (
          <ListItem key={friend.name} divider>
            <ListItemText
              primary={friend.name}
              secondary={`${friend.achievements} Achievements • ${friend.skins} Skins`}
            />
          </ListItem>
        ))}
      </List>
      <Button variant="outlined" color="error" fullWidth onClick={() => handleLogout(null)}>
         Logout
      </Button>
    </Box>
  );
}
