import { useState } from 'react';
import {
  Dialog, DialogTitle, DialogContent, TextField, Button, Typography
} from '@mui/material';

const validUsers = [
  { username: 'Razefoot', password: 'Razefoot' },
  { username: 'PhoenixFire', password: 'PhoenixFire' },
  { username: 'BattleSage', password: 'BattleSage' },
  { username: 'Chambur', password: 'Chambur' }
];

export default function LoginModal({ open, handleLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = () => {
    const user = validUsers.find(
      (u) => u.username === username && u.password === password
    );
    if (user) {
      handleLogin(user.username);
    } else {
      setError('Invalid credentials!');
    }
  };

  return (
    <Dialog open={open}>
      <DialogTitle>Login</DialogTitle>
      <DialogContent>
        <TextField
          label="Username"
          fullWidth
          margin="dense"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <TextField
          label="Password"
          fullWidth
          margin="dense"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && (
          <Typography color="error" variant="body2">{error}</Typography>
        )}
        <Button
          fullWidth
          variant="contained"
          sx={{ mt: 2 }}
          onClick={handleSubmit}
        >
          Login
        </Button>
      </DialogContent>
    </Dialog>
  );
}
