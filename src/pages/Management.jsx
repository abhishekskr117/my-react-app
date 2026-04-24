import { Box, Typography } from '@mui/material';

const Management = () => {
  return (
    <Box p={3}>
      <Typography variant="h4">Farm Management</Typography>
      <Typography variant="body1" sx={{ mt: 2 }}>
        Manage farm operations, schedules, and resources.
      </Typography>
    </Box>
  );
};

export default Management;