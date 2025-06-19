import { Typography, Box } from '@mui/material';

export default function UserStats() {
  return (
    <Box mt={2}>
      <Typography variant="h6">Stats</Typography>
      <Typography>K/D Ratio: 1.4</Typography>
      <Typography>Win Rate: 58%</Typography>
      <Typography>Headshots: 720</Typography>
    </Box>
  );
}
