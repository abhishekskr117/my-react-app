import { useState } from 'react';
import { Modal, Box, TextField, Button, Typography } from '@mui/material';

const style = {
  position: 'absolute', top: '50%', left: '50%',
  transform: 'translate(-50%, -50%)',
  bgcolor: 'background.paper', boxShadow: 24, p: 4, borderRadius: 2
};

const validCredentials = { username: 'velo', password: 'velo' };

export default function LoginModal({ open, handleLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = () => {
    if (username === validCredentials.username && password === validCredentials.password) {
      handleLogin(username);
    } else {
      setError('Invalid credentials!');
    }
  };

  return (
    <Modal open={open}>
      <Box sx={style}>
        <Typography variant="h6" mb={2}>Login</Typography>
        <TextField fullWidth margin="normal" label="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
        <TextField fullWidth margin="normal" label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        {error && <Typography color="error">{error}</Typography>}
        <Button variant="contained" fullWidth sx={{ mt: 2 }} onClick={handleSubmit}>Login</Button>
      </Box>
    </Modal>
  );
}
