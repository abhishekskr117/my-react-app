import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
} from '@mui/material';
import { orderSchema } from '../schemas/validation';
import { ordersAPI } from '../services/api';
import useDataStore from '../stores/dataStore';

const Orders = () => {
  const [open, setOpen] = useState(false);
  const { orders, setOrders, addOrder } = useDataStore();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(orderSchema),
  });

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await ordersAPI.getAll();
        setOrders(data);
      } catch (error) {
        console.error('Failed to fetch orders:', error);
      }
    };
    fetchOrders();
  }, [setOrders]);

  const onSubmit = async (data) => {
    try {
      const newOrder = await ordersAPI.create(data);
      addOrder(newOrder);
      setOpen(false);
      reset();
    } catch (error) {
      console.error('Failed to add order:', error);
    }
  };

  return (
    <Box p={3}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Orders Management</Typography>
        <Button variant="contained" onClick={() => setOpen(true)}>
          Add Order
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Customer</TableCell>
              <TableCell>Product</TableCell>
              <TableCell>Quantity</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell>{order.customer}</TableCell>
                <TableCell>{order.product}</TableCell>
                <TableCell>{order.quantity}</TableCell>
                <TableCell>{order.status}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Add Order</DialogTitle>
        <Box component="form" onSubmit={handleSubmit(onSubmit)}>
          <DialogContent>
            <TextField
              fullWidth
              label="Customer"
              {...register('customer')}
              error={!!errors.customer}
              helperText={errors.customer?.message}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Product"
              {...register('product')}
              error={!!errors.product}
              helperText={errors.product?.message}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Quantity"
              type="number"
              {...register('quantity', { valueAsNumber: true })}
              error={!!errors.quantity}
              helperText={errors.quantity?.message}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              select
              label="Status"
              {...register('status')}
              error={!!errors.status}
              helperText={errors.status?.message}
              sx={{ mb: 2 }}
            >
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="processing">Processing</MenuItem>
              <MenuItem value="completed">Completed</MenuItem>
            </TextField>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" variant="contained">Add</Button>
          </DialogActions>
        </Box>
      </Dialog>
    </Box>
  );
};

export default Orders;