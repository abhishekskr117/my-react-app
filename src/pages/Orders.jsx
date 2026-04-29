import { useState } from 'react';
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
  CircularProgress,
  Alert,
} from '@mui/material';
import { orderSchema } from '../schemas/validation';
import { useOrders, useCreateOrder, useUpdateOrder } from '../apollo/hooks';

const Orders = () => {
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const { loading: ordersLoading, error: ordersError, data } = useOrders();
  const [createOrder, { loading: createLoading }] = useCreateOrder();
  const [updateOrder, { loading: updateLoading }] = useUpdateOrder();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(orderSchema),
  });

  const orders = data?.orders || [];

  const onSubmit = async (formData) => {
    try {
      if (editingId) {
        await updateOrder({
          variables: {
            id: editingId,
            input: {
              customer: formData.customer,
              product: formData.product,
              quantity: parseInt(formData.quantity),
              status: formData.status,
            },
          },
        });
        setEditingId(null);
      } else {
        await createOrder({
          variables: {
            input: {
              customer: formData.customer,
              product: formData.product,
              quantity: parseInt(formData.quantity),
              status: formData.status,
            },
          },
        });
      }
      setOpen(false);
      reset();
    } catch (error) {
      console.error('Failed to save order:', error);
    }
  };

  const handleEdit = (order) => {
    setEditingId(order.id);
    setValue('customer', order.customer);
    setValue('product', order.product);
    setValue('quantity', order.quantity);
    setValue('status', order.status);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingId(null);
    reset();
  };

  const isLoading = createLoading || updateLoading;

  if (ordersLoading) {
    return (
      <Box p={3} display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Orders Management</Typography>
        <Button 
          variant="contained" 
          onClick={() => {
            setEditingId(null);
            reset();
            setOpen(true);
          }}
        >
          Add Order
        </Button>
      </Box>

      {ordersError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          Failed to load orders: {ordersError.message}
        </Alert>
      )}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
              <TableCell><strong>Customer</strong></TableCell>
              <TableCell><strong>Product</strong></TableCell>
              <TableCell><strong>Quantity</strong></TableCell>
              <TableCell><strong>Status</strong></TableCell>
              <TableCell><strong>Created At</strong></TableCell>
              <TableCell align="right"><strong>Actions</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                  No orders found
                </TableCell>
              </TableRow>
            ) : (
              orders.map((order) => (
                <TableRow key={order.id} hover>
                  <TableCell>{order.customer}</TableCell>
                  <TableCell>{order.product}</TableCell>
                  <TableCell>{order.quantity}</TableCell>
                  <TableCell>
                    <Box
                      sx={{
                        px: 2,
                        py: 0.5,
                        borderRadius: 1,
                        backgroundColor:
                          order.status === 'completed'
                            ? '#c8e6c9'
                            : order.status === 'processing'
                            ? '#fff9c4'
                            : '#ffccbc',
                        display: 'inline-block',
                      }}
                    >
                      {order.status}
                    </Box>
                  </TableCell>
                  <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell align="right">
                    <Button
                      size="small"
                      onClick={() => handleEdit(order)}
                      sx={{ mr: 1 }}
                    >
                      Edit
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>{editingId ? 'Edit Order' : 'Add Order'}</DialogTitle>
        <Box component="form" onSubmit={handleSubmit(onSubmit)}>
          <DialogContent sx={{ pt: 2 }}>
            <TextField
              fullWidth
              label="Customer"
              {...register('customer')}
              error={!!errors.customer}
              helperText={errors.customer?.message}
              sx={{ mb: 2 }}
              disabled={isLoading}
            />
            <TextField
              fullWidth
              label="Product"
              {...register('product')}
              error={!!errors.product}
              helperText={errors.product?.message}
              sx={{ mb: 2 }}
              disabled={isLoading}
            />
            <TextField
              fullWidth
              label="Quantity"
              type="number"
              {...register('quantity', { valueAsNumber: true })}
              error={!!errors.quantity}
              helperText={errors.quantity?.message}
              sx={{ mb: 2 }}
              disabled={isLoading}
            />
            <TextField
              fullWidth
              select
              label="Status"
              {...register('status')}
              error={!!errors.status}
              helperText={errors.status?.message}
              sx={{ mb: 2 }}
              disabled={isLoading}
            >
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="processing">Processing</MenuItem>
              <MenuItem value="completed">Completed</MenuItem>
            </TextField>
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={handleClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" variant="contained" disabled={isLoading}>
              {isLoading ? <CircularProgress size={20} /> : (editingId ? 'Save' : 'Add')}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </Box>
  );
};

export default Orders;