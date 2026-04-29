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
import { inventorySchema } from '../schemas/validation';
import { useInventory, useCreateInventory, useDeleteInventory } from '../apollo/hooks';

const Inventory = () => {
  const [open, setOpen] = useState(false);
  const { loading: inventoryLoading, error: inventoryError, data } = useInventory();
  const [createInventory, { loading: createLoading }] = useCreateInventory();
  const [deleteInventory] = useDeleteInventory();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(inventorySchema),
  });

  const inventory = data?.inventory || [];

  const onSubmit = async (formData) => {
    try {
      await createInventory({
        variables: {
          input: {
            name: formData.name,
            quantity: parseInt(formData.quantity),
            type: formData.type,
          },
        },
      });
      setOpen(false);
      reset();
    } catch (error) {
      console.error('Failed to add inventory item:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await deleteInventory({
          variables: { id },
        });
      } catch (error) {
        console.error('Failed to delete inventory item:', error);
      }
    }
  };

  if (inventoryLoading) {
    return (
      <Box p={3} display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Inventory Management</Typography>
        <Button variant="contained" onClick={() => setOpen(true)}>
          Add Item
        </Button>
      </Box>

      {inventoryError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          Failed to load inventory: {inventoryError.message}
        </Alert>
      )}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
              <TableCell><strong>Name</strong></TableCell>
              <TableCell><strong>Quantity</strong></TableCell>
              <TableCell><strong>Type</strong></TableCell>
              <TableCell><strong>Created At</strong></TableCell>
              <TableCell align="right"><strong>Actions</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {inventory.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 3 }}>
                  No inventory items found
                </TableCell>
              </TableRow>
            ) : (
              inventory.map((item) => (
                <TableRow key={item.id} hover>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.quantity}</TableCell>
                  <TableCell>{item.type}</TableCell>
                  <TableCell>{new Date(item.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell align="right">
                    <Button
                      size="small"
                      color="error"
                      onClick={() => handleDelete(item.id)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add Inventory Item</DialogTitle>
        <Box component="form" onSubmit={handleSubmit(onSubmit)}>
          <DialogContent sx={{ pt: 2 }}>
            <TextField
              fullWidth
              label="Name"
              {...register('name')}
              error={!!errors.name}
              helperText={errors.name?.message}
              sx={{ mb: 2 }}
              disabled={createLoading}
            />
            <TextField
              fullWidth
              label="Quantity"
              type="number"
              {...register('quantity', { valueAsNumber: true })}
              error={!!errors.quantity}
              helperText={errors.quantity?.message}
              sx={{ mb: 2 }}
              disabled={createLoading}
            />
            <TextField
              fullWidth
              select
              label="Type"
              {...register('type')}
              error={!!errors.type}
              helperText={errors.type?.message}
              sx={{ mb: 2 }}
              disabled={createLoading}
            >
              <MenuItem value="Mushroom">Mushroom</MenuItem>
              <MenuItem value="Supply">Supply</MenuItem>
              <MenuItem value="Equipment">Equipment</MenuItem>
            </TextField>
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={() => setOpen(false)} disabled={createLoading}>
              Cancel
            </Button>
            <Button type="submit" variant="contained" disabled={createLoading}>
              {createLoading ? <CircularProgress size={20} /> : 'Add'}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </Box>
  );
};

export default Inventory;
