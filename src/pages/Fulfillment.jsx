import { Box, Typography } from '@mui/material';

const Fulfillment = () => {
  return (
    <Box p={3}>
      <Typography variant="h4">Order Fulfillment</Typography>
      <Typography variant="body1" sx={{ mt: 2 }}>
        Process and fulfill customer orders.
      </Typography>
    </Box>
  );
};

export default Fulfillment;