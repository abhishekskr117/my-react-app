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
import { inventorySchema } from '../schemas/validation';
import { inventoryAPI } from '../services/api';
import useDataStore from '../stores/dataStore';

const Inventory = () => {
  const [open, setOpen] = useState(false);
  const { inventory, setInventory, addInventoryItem } = useDataStore();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(inventorySchema),
  });

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const data = await inventoryAPI.getAll();
        setInventory(data);
      } catch (error) {
        console.error('Failed to fetch inventory:', error);
      }
    };
    fetchInventory();
  }, [setInventory]);

  const onSubmit = async (data) => {
    try {
      const newItem = await inventoryAPI.create(data);
      addInventoryItem(newItem);
      setOpen(false);
      reset();
    } catch (error) {
      console.error('Failed to add inventory item:', error);
    }
  };

  return (
    <Box p={3}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Inventory Management</Typography>
        <Button variant="contained" onClick={() => setOpen(true)}>
          Add Item
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Quantity</TableCell>
              <TableCell>Type</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {inventory.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.quantity}</TableCell>
                <TableCell>{item.type}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Add Inventory Item</DialogTitle>
        <Box component="form" onSubmit={handleSubmit(onSubmit)}>
          <DialogContent>
            <TextField
              fullWidth
              label="Name"
              {...register('name')}
              error={!!errors.name}
              helperText={errors.name?.message}
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
              label="Type"
              {...register('type')}
              error={!!errors.type}
              helperText={errors.type?.message}
              sx={{ mb: 2 }}
            >
              <MenuItem value="Mushroom">Mushroom</MenuItem>
              <MenuItem value="Supply">Supply</MenuItem>
              <MenuItem value="Equipment">Equipment</MenuItem>
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

export default Inventory;