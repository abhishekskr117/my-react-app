# Go + GraphQL + Apollo Client Integration Guide

This document provides complete setup instructions for running your Mushroom Farm application with:
- **Backend:** Go + GraphQL (gqlgen) + SQLite
- **Frontend:** React + Apollo Client (Vite)

## 📋 System Requirements

Before you start, ensure you have:

1. **Go** 1.21+ - [Download here](https://golang.org/downloads)
2. **Node.js** 18+ and npm
3. **Git** (for version control)

## 🚀 Quick Start (5 minutes)

### Step 1: Install Frontend Dependencies

```bash
npm install
```

This will install Apollo Client and all other dependencies.

### Step 2: Start the Development Server

```bash
npm run dev:graphql
```

This command:
- Starts the Go GraphQL backend at `http://localhost:8000`
- Starts the React frontend at `http://localhost:5173`
- Both run simultaneously using Concurrently

### Step 3: Open Application

Navigate to **http://localhost:5173** in your browser.

## 📁 Project Structure After Setup

```
my-react-app/
├── backend/
│   ├── server.cjs          (OLD: Express REST API - still available)
│   └── go-server/          (NEW: Go GraphQL backend)
│       ├── main.go
│       ├── graph/
│       │   ├── schema.graphql
│       │   └── resolver.go
│       ├── auth/
│       │   ├── jwt.go
│       │   └── middleware.go
│       ├── database/
│       │   └── db.go
│       └── README.md
├── src/
│   ├── apollo/             (NEW: Apollo Client configuration)
│   │   ├── client.js       (Apollo Client setup)
│   │   ├── queries.js      (All GraphQL queries & mutations)
│   │   └── hooks.js        (Custom React hooks)
│   ├── pages/              (Updated to use Apollo hooks)
│   ├── components/
│   ├── stores/             (Zustand state management)
│   └── services/           (Old REST API - can be deprecated)
```

## 🔗 API Endpoints

### GraphQL Server
- **URL:** `http://localhost:8000/graphql`
- **Playground:** `http://localhost:8000/playground` (for testing queries)

### Frontend
- **URL:** `http://localhost:5173`

## 🔐 Default Credentials

Login with:
- **Username:** `admin`
- **Password:** `admin123`

(Configured in `backend/go-server/database/db.go`)

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                  React Frontend (Vite)                   │
│                   http://localhost:5173                  │
│  ┌────────────────────────────────────────────────────┐ │
│  │  Apollo Client                                     │ │
│  │  - Queries & Mutations                             │ │
│  │  - Caching & State Management                      │ │
│  │  - Error Handling & Auth                           │ │
│  └────────────────────────────────────────────────────┘ │
└────────┬─────────────────────────────────────────────────┘
         │ GraphQL Requests (HTTP/WebSocket)
         ▼
┌─────────────────────────────────────────────────────────┐
│            Go GraphQL Server (Port 8000)                │
│                                                          │
│  ┌────────────────────────────────────────────────────┐ │
│  │  GraphQL Handler (gqlgen)                          │ │
│  │  - Schema: schema.graphql                          │ │
│  │  - Resolvers: resolver.go                          │ │
│  └────────────────────────────────────────────────────┘ │
│                      │                                   │
│  ┌──────────────────▼──────────────────────────────┐   │
│  │  Auth Middleware                                 │   │
│  │  - JWT Token Verification                        │   │
│  │  - User Context Injection                        │   │
│  └──────────────────┬──────────────────────────────┘   │
│                     │                                    │
│  ┌──────────────────▼──────────────────────────────┐   │
│  │  Database Layer (GORM + SQLite)                 │   │
│  │  - Users, Inventory, Sales, Orders, WorkOrders  │   │
│  │  - Auto-migration & Connection Pooling          │   │
│  └──────────────────────────────────────────────────┘   │
└───────────────────────────────────────────────────────────┘
```

## 🔄 Migration from REST to GraphQL

### OLD (Still Available)
```bash
npm run dev  # Runs Express server + React
```

### NEW (Recommended)
```bash
npm run dev:graphql  # Runs Go GraphQL server + React
```

To migrate your pages from REST API to GraphQL Apollo hooks:

1. See `GRAPHQL_MIGRATION_GUIDE.md` for detailed instructions
2. See `APOLLO_CLIENT_MIGRATION_EXAMPLE.md` for example migration

## 🐛 Troubleshooting

### Issue: Port 8000 Already in Use
```bash
# Find process using port 8000
lsof -i :8000

# Kill it (if safe)
kill -9 <PID>
```

### Issue: Go Module Not Found
```bash
cd backend/go-server
go mod tidy
go mod download
```

### Issue: Database Lock Error
```bash
# Remove the database file to reset
cd backend/go-server
rm mushroom_farm.db
# Run server again - it will recreate with sample data
```

### Issue: Apollo Client Errors
1. Check browser console (F12) for detailed error messages
2. Check Apollo DevTools (Chrome extension)
3. Verify token in localStorage: Open DevTools → Application → LocalStorage

### Issue: 401 Unauthorized Errors
- Ensure you're logged in
- Token should be automatically sent by Apollo Client
- Check that token hasn't expired (24 hour expiry)

## 📚 Available Pages & Features

After login, you can access:
- **Dashboard** - Overview of key metrics
- **Inventory** - Manage mushroom inventory and supplies
- **Sales** - Track sales transactions
- **Orders** - Manage customer orders
- **Work Orders** - Assign and track tasks
- **Management** - Administrative functions
- **Fulfillment** - Order fulfillment tracking
- **Reports** - View analytics and reports
- **Automation** - Set up automated tasks

## 🧪 Testing GraphQL Queries

1. Navigate to `http://localhost:8000/playground`
2. Test a query:

```graphql
query {
  inventory {
    id
    name
    quantity
    type
    createdAt
  }
}
```

3. To test authenticated queries, include auth header or login first via mutation:

```graphql
mutation {
  login(username: "admin", password: "admin123") {
    token
    user {
      id
      username
      role
    }
  }
}
```

## 🔒 Security Considerations

### Development
- JWT secret is hardcoded (OK for dev)
- CORS allows localhost
- Playground enabled for testing

### Production Checklist
- [ ] Change JWT secret in `backend/go-server/auth/jwt.go`
- [ ] Set environment variables for sensitive config
- [ ] Enable HTTPS only
- [ ] Restrict CORS origins
- [ ] Disable GraphQL Playground
- [ ] Implement rate limiting
- [ ] Use PostgreSQL/MySQL instead of SQLite
- [ ] Add request validation
- [ ] Set up proper logging

## 📖 Documentation Files

- **[Go Backend Setup](backend/go-server/README.md)** - Detailed Go backend instructions
- **[GraphQL Migration Guide](GRAPHQL_MIGRATION_GUIDE.md)** - How to migrate pages to GraphQL
- **[Apollo Client Example](APOLLO_CLIENT_MIGRATION_EXAMPLE.md)** - Real example migration

## 🚀 Next Steps

1. **Run the server**: `npm run dev:graphql`
2. **Login**: Use admin/admin123
3. **Migrate pages**: Follow GRAPHQL_MIGRATION_GUIDE.md
4. **Test GraphQL**: Use GraphQL Playground at http://localhost:8000/playground
5. **Deploy**: Set up CI/CD and prepare for production

## 🆘 Getting Help

### Check Logs
- **Frontend**: Open browser DevTools (F12) → Console
- **Backend**: Check terminal where Go server is running

### Apollo DevTools
- Install [Apollo Client DevTools](https://chrome.google.com/webstore/detail/apollo-client-devtools/jdkknb3d-zefhnfn6l0l1jfbdnghflg)
- Navigate to DevTools → Apollo → Queries & Cache inspection

### Enable Debug Logging (Development)
Add to `src/apollo/client.js`:
```javascript
logErrorMessages: true,
```

## 📞 Support

For issues or questions:
1. Check the troubleshooting section above
2. Review GraphQL schema at `backend/go-server/graph/schema.graphql`
3. Check Apollo Client documentation: https://www.apollographql.com/docs/react/

---

**Last Updated:** April 2025
**Status:** ✅ Ready for Development
