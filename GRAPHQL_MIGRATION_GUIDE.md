# Apollo Client Migration Guide

This guide explains how to migrate your React components from REST API calls to GraphQL queries/mutations using Apollo Client.

## Quick Start

### 1. Install Dependencies

Already done! Apollo Client dependencies are added to `package.json`.

### 2. Import Apollo Hooks

Instead of importing from `services/api.js`, import from `apollo/hooks.js`:

```javascript
// OLD
import { inventoryAPI } from '../services/api';

// NEW
import { useInventory, useCreateInventory, useDeleteInventory } from '../apollo/hooks';
```

### 3. Use Apollo Hooks Instead of Direct API Calls

#### Data Fetching (Queries)

```javascript
// OLD REST API
useEffect(() => {
  const fetchData = async () => {
    const data = await inventoryAPI.getAll();
    setInventory(data);
  };
  fetchData();
}, []);

// NEW Apollo Client
const { loading, error, data } = useInventory();
const inventory = data?.inventory || [];
```

#### Data Mutation

```javascript
// OLD REST API
const onSubmit = async (data) => {
  const newItem = await inventoryAPI.create(data);
  addInventoryItem(newItem);
};

// NEW Apollo Client
const [createInventory] = useCreateInventory();

const onSubmit = async (formData) => {
  await createInventory({
    variables: {
      input: {
        name: formData.name,
        quantity: parseInt(formData.quantity),
        type: formData.type,
      },
    },
  });
};
```

## Migration Checklist

- [ ] Update Login page to use `useLogin` hook
- [ ] Update Inventory page to use inventory hooks
- [ ] Update Sales page to use sales hooks
- [ ] Update Orders page to use orders hooks
- [ ] Update Work Orders page to use work orders hooks
- [ ] Remove unused REST API calls from `services/api.js` (keep for backward compatibility if needed)

## Key Differences

| Feature | REST API | GraphQL/Apollo |
|---------|----------|---|
| Loading State | Manual `useState` | Built-in `loading` from hook |
| Error Handling | Try/catch blocks | Built-in `error` from hook |
| Caching | Manual or library | Automatic with Apollo cache |
| Real-time Updates | WebSockets (manual) | Can use subscriptions |
| Refetching | Manual `refetch()` | Automatic refetch queries |
| Type Safety | Manual validation | Schema validation |

## Available Hooks

### Authentication
- `useLogin()` - Login and get token

### Inventory
- `useInventory()` - Get all inventory items
- `useCreateInventory()` - Create new inventory item
- `useUpdateInventory()` - Update inventory item
- `useDeleteInventory()` - Delete inventory item

### Sales
- `useSales()` - Get all sales
- `useCreateSale()` - Create new sale
- `useUpdateSale()` - Update sale

### Orders
- `useOrders()` - Get all orders
- `useCreateOrder()` - Create new order
- `useUpdateOrder()` - Update order

### Work Orders
- `useWorkOrders()` - Get all work orders
- `useCreateWorkOrder()` - Create new work order
- `useUpdateWorkOrder()` - Update work order

## Example Component Migration

See `APOLLO_CLIENT_MIGRATION_EXAMPLE.md` for a complete example of migrating the Inventory component from REST to GraphQL.

## Handling Loading and Error States

```javascript
const { loading, error, data } = useInventory();

if (loading) return <CircularProgress />;
if (error) return <Alert severity="error">{error.message}</Alert>;

return <Table>{/* render data */}</Table>;
```

## Refetching and Cache Updates

Apollo Client automatically refetches queries after mutations. This is configured in the hooks:

```javascript
// In useCreateInventory hook:
refetchQueries: [{ query: GET_INVENTORY }]
```

## Troubleshooting

### Query/Mutation Variables Type Errors
Make sure variable types match the GraphQL schema:
```javascript
// Type mismatch error? Check variable types:
variables: {
  input: {
    quantity: parseInt(quantity), // Must be Int, not string
  },
}
```

### Cache Not Updating After Mutation
1. Check that `refetchQueries` is configured in the hook
2. Use Apollo DevTools browser extension to inspect cache
3. Verify mutation is returning the updated fields

### Authentication Errors (401)
Check that:
1. Token is saved in `localStorage` with key `auth-storage`
2. Apollo Client is sending `Authorization` header (configured in `client.js`)
3. Token hasn't expired

## Advanced Patterns

### Polling (Refresh every X seconds)
```javascript
const { data, startPolling, stopPolling } = useInventory({
  pollInterval: 5000, // Poll every 5 seconds
});
```

### Changing Fetch Policy
```javascript
const { data } = useInventory({
  fetchPolicy: 'network-only', // Always fetch from server
  // or: 'cache-first' (use cache if available)
  // or: 'cache-and-network' (use cache but update in background)
});
```

### Manual Refetch
```javascript
const { refetch } = useInventory();

const handleRefresh = () => {
  refetch();
};
```

## Performance Tips

1. **Use Fragment on fragment** for smaller queries
2. **Paginate** large result sets
3. **Use proper fetch policy** to balance cache vs fresh data
4. **Monitor cache size** with Apollo DevTools

## Next Steps

1. Replace one page component at a time
2. Test each page thoroughly before moving to next
3. Remove old REST API code once all pages are migrated
4. Consider adding TypeScript for better type safety
5. Set up Apollo DevTools for debugging

## Resources

- [Apollo Client Documentation](https://www.apollographql.com/docs/react/)
- [GraphQL Best Practices](https://graphql.org/learn/best-practices/)
- [React Hooks with Apollo](https://www.apollographql.com/docs/react/data/queries/)
