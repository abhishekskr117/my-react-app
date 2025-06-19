import { Box, Typography, Grid, Paper } from '@mui/material';

const stats = [
  { label: 'K/D Ratio', value: '1.42' },
  { label: 'Win Rate', value: '59%' },
  { label: 'Total Matches', value: '128' },
  { label: 'Most Played Agent', value: 'Jett' },
  { label: 'Average Score', value: '237' },
  { label: 'Headshots', value: '715' },
];

export default function StatsDashboard() {
  return (
    <Box mt={4}>
      <Typography variant="h6" gutterBottom>Your Stats</Typography>
      <Grid container spacing={2}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Paper elevation={3} sx={{ p: 2, borderRadius: 2, textAlign: 'center' }}>
              <Typography variant="subtitle1" color="text.secondary">
                {stat.label}
              </Typography>
              <Typography variant="h5" fontWeight="bold">
                {stat.value}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
