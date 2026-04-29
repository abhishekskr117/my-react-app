import { useMutation, useQuery } from '@apollo/client';
import {
  LOGIN_MUTATION,
  ME_QUERY,
  GET_INVENTORY,
  CREATE_INVENTORY,
  UPDATE_INVENTORY,
  DELETE_INVENTORY,
  GET_SALES,
  CREATE_SALE,
  UPDATE_SALE,
  GET_ORDERS,
  CREATE_ORDER,
  UPDATE_ORDER,
  GET_WORK_ORDERS,
  CREATE_WORK_ORDER,
  UPDATE_WORK_ORDER,
} from './queries';

// Auth Hooks
export const useLogin = () => {
  return useMutation(LOGIN_MUTATION);
};

export const useMe = (options = {}) => {
  return useQuery(ME_QUERY, {
    skip: !localStorage.getItem('token'),
    ...options,
  });
};

// Inventory Hooks
export const useInventory = (options = {}) => {
  return useQuery(GET_INVENTORY, options);
};

export const useCreateInventory = () => {
  return useMutation(CREATE_INVENTORY, {
    refetchQueries: [{ query: GET_INVENTORY }],
  });
};

export const useUpdateInventory = () => {
  return useMutation(UPDATE_INVENTORY, {
    refetchQueries: [{ query: GET_INVENTORY }],
  });
};

export const useDeleteInventory = () => {
  return useMutation(DELETE_INVENTORY, {
    refetchQueries: [{ query: GET_INVENTORY }],
  });
};

// Sales Hooks
export const useSales = (options = {}) => {
  return useQuery(GET_SALES, options);
};

export const useCreateSale = () => {
  return useMutation(CREATE_SALE, {
    refetchQueries: [{ query: GET_SALES }],
  });
};

export const useUpdateSale = () => {
  return useMutation(UPDATE_SALE, {
    refetchQueries: [{ query: GET_SALES }],
  });
};

// Orders Hooks
export const useOrders = (options = {}) => {
  return useQuery(GET_ORDERS, options);
};

export const useCreateOrder = () => {
  return useMutation(CREATE_ORDER, {
    refetchQueries: [{ query: GET_ORDERS }],
  });
};

export const useUpdateOrder = () => {
  return useMutation(UPDATE_ORDER, {
    refetchQueries: [{ query: GET_ORDERS }],
  });
};

// Work Orders Hooks
export const useWorkOrders = (options = {}) => {
  return useQuery(GET_WORK_ORDERS, options);
};

export const useCreateWorkOrder = () => {
  return useMutation(CREATE_WORK_ORDER, {
    refetchQueries: [{ query: GET_WORK_ORDERS }],
  });
};

export const useUpdateWorkOrder = () => {
  return useMutation(UPDATE_WORK_ORDER, {
    refetchQueries: [{ query: GET_WORK_ORDERS }],
  });
};
