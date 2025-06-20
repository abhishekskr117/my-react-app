import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Box, Typography } from '@mui/material';

const data = [
  { match: 'Match 1', kills: 15 },
  { match: 'Match 2', kills: 22 },
  { match: 'Match 3', kills: 19 },
  { match: 'Match 4', kills: 27 },
];

export default function MatchGraph() {
  return (
    <Box mt={4}>
      <Typography variant="h6">Match History</Typography>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="match" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="kills" stroke="#8884d8" />
        </LineChart>
      </ResponsiveContainer>
    </Box>
  );
}
