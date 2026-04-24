import { z } from 'zod';

export const loginSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required'),
});

export const inventorySchema = z.object({
  name: z.string().min(1, 'Name is required'),
  quantity: z.number().min(0, 'Quantity must be positive'),
  type: z.string().min(1, 'Type is required'),
});

export const salesSchema = z.object({
  product: z.string().min(1, 'Product is required'),
  quantity: z.number().min(1, 'Quantity must be at least 1'),
  price: z.number().min(0, 'Price must be positive'),
  date: z.string().min(1, 'Date is required'),
});

export const orderSchema = z.object({
  customer: z.string().min(1, 'Customer is required'),
  product: z.string().min(1, 'Product is required'),
  quantity: z.number().min(1, 'Quantity must be at least 1'),
  status: z.string().min(1, 'Status is required'),
});

export const workorderSchema = z.object({
  task: z.string().min(1, 'Task is required'),
  assigned_to: z.string().optional(),
  status: z.string().min(1, 'Status is required'),
});