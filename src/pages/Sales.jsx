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
} from '@mui/material';
import { salesSchema } from '../schemas/validation';
import { salesAPI } from '../services/api';
import useDataStore from '../stores/dataStore';

const Sales = () => {
  const [open, setOpen] = useState(false);
  const { sales, setSales, addSale } = useDataStore();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(salesSchema),
  });

  useEffect(() => {
    const fetchSales = async () => {
      try {
        const data = await salesAPI.getAll();
        setSales(data);
      } catch (error) {
        console.error('Failed to fetch sales:', error);
      }
    };
    fetchSales();
  }, [setSales]);

  const onSubmit = async (data) => {
    try {
      const newSale = await salesAPI.create(data);
      addSale(newSale);
      setOpen(false);
      reset();
    } catch (error) {
      console.error('Failed to add sale:', error);
    }
  };

  return (
    <Box p={3}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Sales Management</Typography>
        <Button variant="contained" onClick={() => setOpen(true)}>
          Add Sale
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Product</TableCell>
              <TableCell>Quantity</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sales.map((sale) => (
              <TableRow key={sale.id}>
                <TableCell>{sale.product}</TableCell>
                <TableCell>{sale.quantity}</TableCell>
                <TableCell>${sale.price}</TableCell>
                <TableCell>{sale.date}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Add Sale</DialogTitle>
        <Box component="form" onSubmit={handleSubmit(onSubmit)}>
          <DialogContent>
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
              label="Price"
              type="number"
              step="0.01"
              {...register('price', { valueAsNumber: true })}
              error={!!errors.price}
              helperText={errors.price?.message}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Date"
              type="date"
              {...register('date')}
              error={!!errors.date}
              helperText={errors.date?.message}
              InputLabelProps={{ shrink: true }}
              sx={{ mb: 2 }}
            />
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

export default Sales;