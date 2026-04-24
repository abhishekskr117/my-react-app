import { create } from 'zustand';

const useDataStore = create((set, get) => ({
  inventory: [],
  sales: [],
  orders: [],
  workorders: [],
  reports: {},

  // Inventory actions
  setInventory: (inventory) => set({ inventory }),
  addInventoryItem: (item) => set((state) => ({ inventory: [...state.inventory, item] })),

  // Sales actions
  setSales: (sales) => set({ sales }),
  addSale: (sale) => set((state) => ({ sales: [...state.sales, sale] })),

  // Orders actions
  setOrders: (orders) => set({ orders }),
  addOrder: (order) => set((state) => ({ orders: [...state.orders, order] })),

  // Work orders actions
  setWorkorders: (workorders) => set({ workorders }),
  addWorkorder: (workorder) => set((state) => ({ workorders: [...state.workorders, workorder] })),

  // Reports
  setReports: (reports) => set({ reports }),
}));

export default useDataStore;