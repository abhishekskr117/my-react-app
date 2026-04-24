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
import { workorderSchema } from '../schemas/validation';
import { workordersAPI } from '../services/api';
import useDataStore from '../stores/dataStore';

const WorkOrders = () => {
  const [open, setOpen] = useState(false);
  const { workorders, setWorkorders, addWorkorder } = useDataStore();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(workorderSchema),
  });

  useEffect(() => {
    const fetchWorkorders = async () => {
      try {
        const data = await workordersAPI.getAll();
        setWorkorders(data);
      } catch (error) {
        console.error('Failed to fetch workorders:', error);
      }
    };
    fetchWorkorders();
  }, [setWorkorders]);

  const onSubmit = async (data) => {
    try {
      const newWorkorder = await workordersAPI.create(data);
      addWorkorder(newWorkorder);
      setOpen(false);
      reset();
    } catch (error) {
      console.error('Failed to add workorder:', error);
    }
  };

  return (
    <Box p={3}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Work Orders</Typography>
        <Button variant="contained" onClick={() => setOpen(true)}>
          Add Work Order
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Task</TableCell>
              <TableCell>Assigned To</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {workorders.map((workorder) => (
              <TableRow key={workorder.id}>
                <TableCell>{workorder.task}</TableCell>
                <TableCell>{workorder.assigned_to || 'Unassigned'}</TableCell>
                <TableCell>{workorder.status}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Add Work Order</DialogTitle>
        <Box component="form" onSubmit={handleSubmit(onSubmit)}>
          <DialogContent>
            <TextField
              fullWidth
              label="Task"
              {...register('task')}
              error={!!errors.task}
              helperText={errors.task?.message}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Assigned To"
              {...register('assigned_to')}
              error={!!errors.assigned_to}
              helperText={errors.assigned_to?.message}
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
              <MenuItem value="in-progress">In Progress</MenuItem>
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

export default WorkOrders;