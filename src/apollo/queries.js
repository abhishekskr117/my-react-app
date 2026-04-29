import { gql } from '@apollo/client';

// Auth Mutations
export const LOGIN_MUTATION = gql`
  mutation Login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      token
      user {
        id
        username
        role
      }
    }
  }
`;

export const ME_QUERY = gql`
  query Me {
    me {
      id
      username
      role
      createdAt
    }
  }
`;

// Inventory Queries
export const GET_INVENTORY = gql`
  query GetInventory {
    inventory {
      id
      name
      quantity
      type
      createdAt
    }
  }
`;

export const GET_INVENTORY_BY_ID = gql`
  query GetInventoryByID($id: Int!) {
    inventoryByID(id: $id) {
      id
      name
      quantity
      type
      createdAt
    }
  }
`;

export const CREATE_INVENTORY = gql`
  mutation CreateInventory($input: CreateInventoryInput!) {
    createInventory(input: $input) {
      id
      name
      quantity
      type
      createdAt
    }
  }
`;

export const UPDATE_INVENTORY = gql`
  mutation UpdateInventory($id: Int!, $input: UpdateInventoryInput!) {
    updateInventory(id: $id, input: $input) {
      id
      name
      quantity
      type
      createdAt
    }
  }
`;

export const DELETE_INVENTORY = gql`
  mutation DeleteInventory($id: Int!) {
    deleteInventory(id: $id)
  }
`;

// Sales Queries
export const GET_SALES = gql`
  query GetSales {
    sales {
      id
      product
      quantity
      price
      date
      createdAt
    }
  }
`;

export const GET_SALE_BY_ID = gql`
  query GetSaleByID($id: Int!) {
    saleByID(id: $id) {
      id
      product
      quantity
      price
      date
      createdAt
    }
  }
`;

export const CREATE_SALE = gql`
  mutation CreateSale($input: CreateSaleInput!) {
    createSale(input: $input) {
      id
      product
      quantity
      price
      date
      createdAt
    }
  }
`;

export const UPDATE_SALE = gql`
  mutation UpdateSale($id: Int!, $input: UpdateSaleInput!) {
    updateSale(id: $id, input: $input) {
      id
      product
      quantity
      price
      date
      createdAt
    }
  }
`;

// Orders Queries
export const GET_ORDERS = gql`
  query GetOrders {
    orders {
      id
      customer
      product
      quantity
      status
      createdAt
    }
  }
`;

export const GET_ORDER_BY_ID = gql`
  query GetOrderByID($id: Int!) {
    orderByID(id: $id) {
      id
      customer
      product
      quantity
      status
      createdAt
    }
  }
`;

export const CREATE_ORDER = gql`
  mutation CreateOrder($input: CreateOrderInput!) {
    createOrder(input: $input) {
      id
      customer
      product
      quantity
      status
      createdAt
    }
  }
`;

export const UPDATE_ORDER = gql`
  mutation UpdateOrder($id: Int!, $input: UpdateOrderInput!) {
    updateOrder(id: $id, input: $input) {
      id
      customer
      product
      quantity
      status
      createdAt
    }
  }
`;

// Work Orders Queries
export const GET_WORK_ORDERS = gql`
  query GetWorkOrders {
    workOrders {
      id
      task
      assignedTo
      status
      createdAt
    }
  }
`;

export const GET_WORK_ORDER_BY_ID = gql`
  query GetWorkOrderByID($id: Int!) {
    workOrderByID(id: $id) {
      id
      task
      assignedTo
      status
      createdAt
    }
  }
`;

export const CREATE_WORK_ORDER = gql`
  mutation CreateWorkOrder($input: CreateWorkOrderInput!) {
    createWorkOrder(input: $input) {
      id
      task
      assignedTo
      status
      createdAt
    }
  }
`;

export const UPDATE_WORK_ORDER = gql`
  mutation UpdateWorkOrder($id: Int!, $input: UpdateWorkOrderInput!) {
    updateWorkOrder(id: $id, input: $input) {
      id
      task
      assignedTo
      status
      createdAt
    }
  }
`;
