# 🚀 Quick Start - Go + GraphQL + Apollo Client

## What Was Built

Your Mushroom Farm application has been completely upgraded with:

✅ **Go GraphQL Backend** - Replaces Express REST API with modern GraphQL architecture  
✅ **Apollo Client** - Frontend integration with caching, state management, and automatic refetching  
✅ **Preserved Existing** - Old REST API still available for reference  

## File Structure Added

```
backend/go-server/          ← NEW Go GraphQL server
├── main.go
├── graph/schema.graphql
├── graph/resolver.go
├── auth/jwt.go
├── models/models.go
└── database/db.go

src/apollo/                 ← NEW Apollo Client config
├── client.js              (Apollo Client setup with auth)
├── queries.js             (All GraphQL queries & mutations)
└── hooks.js               (Custom React hooks for easy usage)

Updated pages:
├── src/pages/Login.jsx    (Now uses useLogin hook)
├── src/pages/Inventory.jsx (Now uses useInventory hook)
└── src/pages/Orders.jsx   (Now uses useOrders hook)
```

## 🎯 Getting Started (3 steps)

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Start Everything
```bash
npm run dev:graphql
```

This starts:
- React frontend: http://localhost:5173
- Go GraphQL server: http://localhost:8000
- GraphQL Playground (testing): http://localhost:8000/playground

### Step 3: Login
- Username: `admin`
- Password: `admin123`

## 📚 Documentation

| Document | Purpose |
|----------|---------|
| [GO_GRAPHQL_SETUP.md](GO_GRAPHQL_SETUP.md) | **Start here** - Complete setup & architecture |
| [backend/go-server/README.md](backend/go-server/README.md) | Backend-specific setup & troubleshooting |
| [GRAPHQL_MIGRATION_GUIDE.md](GRAPHQL_MIGRATION_GUIDE.md) | How to migrate pages from REST to GraphQL |
| [APOLLO_CLIENT_MIGRATION_EXAMPLE.md](APOLLO_CLIENT_MIGRATION_EXAMPLE.md) | Real code example of Inventory page migration |

## 🔄 How to Migrate Remaining Pages

1. Open a page file (e.g., `src/pages/Sales.jsx`)
2. Replace REST API imports:
   ```javascript
   // OLD
   import { salesAPI } from '../services/api';
   
   // NEW
   import { useSales, useCreateSale, useUpdateSale } from '../apollo/hooks';
   ```

3. Replace data fetching:
   ```javascript
   // OLD
   useEffect(() => {
     const data = await salesAPI.getAll();
     setSales(data);
   }, []);
   
   // NEW
   const { loading, error, data } = useSales();
   const sales = data?.sales || [];
   ```

4. Replace mutations:
   ```javascript
   // OLD
   const newSale = await salesAPI.create(data);
   
   // NEW
   const [createSale] = useCreateSale();
   await createSale({ variables: { input: data } });
   ```

**See Inventory & Orders pages for complete examples!**

## 📊 GraphQL Query Examples

Test these in GraphQL Playground (http://localhost:8000/playground):

```graphql
# Login
mutation {
  login(username: "admin", password: "admin123") {
    token
    user { id username role }
  }
}

# Get all inventory
query {
  inventory {
    id
    name
    quantity
    type
    createdAt
  }
}

# Create inventory item
mutation {
  createInventory(input: {
    name: "Shiitake"
    quantity: 50
    type: "Mushroom"
  }) {
    id
    name
  }
}
```

## 🔐 Security Notes for Production

Before deploying:
- [ ] Change JWT secret in `backend/go-server/auth/jwt.go`
- [ ] Set CORS_ORIGINS to production domain
- [ ] Disable GraphQL Playground
- [ ] Use PostgreSQL/MySQL instead of SQLite
- [ ] Enable HTTPS
- [ ] Add rate limiting
- [ ] Add input validation

## 🛠️ Tech Stack

| Layer | Old | New |
|-------|-----|-----|
| Backend | Node.js + Express | Go + gqlgen |
| Database | SQLite | SQLite (upgradeable to MySQL/PostgreSQL) |
| Frontend | REST API | GraphQL + Apollo Client |
| Auth | JWT + manual headers | JWT + Apollo Link |
| State | Zustand + REST | Apollo Cache + Zustand hybrid |

## 🚨 Troubleshooting

### Port 8000 already in use?
```bash
# macOS/Linux
lsof -i :8000 | xargs kill -9

# Windows PowerShell
Get-Process -Id (Get-NetTCPConnection -LocalPort 8000).OwningProcess | Stop-Process
```

### Go modules not working?
```bash
cd backend/go-server
go mod tidy
go mod download
```

### Apollo errors in browser console?
1. Open DevTools (F12)
2. Check the error message
3. Install Apollo DevTools extension for better debugging
4. Check that you're logged in (token in localStorage)

## ✨ Key Features

### Automatic Features (No code needed)
- ✅ JWT token automatically attached to requests
- ✅ 401 errors automatically logout user
- ✅ Cache management built-in
- ✅ Mutations auto-refetch related queries
- ✅ Type-safe GraphQL schema

### To Migrate a Page
1. Import hooks from `src/apollo/hooks.js`
2. Replace `useEffect` data loading with hooks
3. Replace mutation calls with useMutation hooks
4. Add loading/error UI states

## 📞 Support

**Common Issues:**
- Login fails? → Check browser console for errors
- GraphQL errors? → Use playground to test queries first
- Port conflicts? → Use `lsof -i :8000` to find process

**Check these files:**
1. `GO_GRAPHQL_SETUP.md` - Complete architecture overview
2. `GRAPHQL_MIGRATION_GUIDE.md` - Migration patterns
3. `backend/go-server/README.md` - Backend details

## 🎓 Learning Resources

- [Apollo Client Docs](https://www.apollographql.com/docs/react/)
- [GraphQL Official](https://graphql.org/)
- [Go & gqlgen Guide](https://gqlgen.com/)
- [GORM Documentation](https://gorm.io/)

## ✅ Checklist

- [x] Go backend created
- [x] GraphQL schema defined
- [x] Apollo Client configured
- [x] Auth/JWT integrated
- [x] Login page migrated
- [x] Inventory page migrated (example)
- [x] Orders page migrated (example)
- [ ] Sales page - migrate next
- [ ] Work Orders page - migrate next
- [ ] Management page - migrate next
- [ ] Others - migrate as needed

## Next Steps

1. **Start the server:** `npm run dev:graphql`
2. **Test GraphQL:** Visit http://localhost:8000/playground
3. **Migrate pages:** Follow GRAPHQL_MIGRATION_GUIDE.md
4. **Test thoroughly:** Use Apollo DevTools extension
5. **Deploy:** See GO_GRAPHQL_SETUP.md Production Security section

---

**Status:** ✅ Ready for Development  
**Created:** April 2025  
**Backend:** Go + gqlgen  
**Frontend:** React + Apollo Client  
