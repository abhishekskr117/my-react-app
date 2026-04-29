# Go GraphQL Backend Setup Guide

## Prerequisites

Ensure you have the following installed:
- **Go** (version 1.21 or higher): [Download Go](https://golang.org/downloads)
- **gqlgen**: Code generation for GraphQL
- **gqlgen CLI** (optional for development)

## Installation & Setup

### 1. Navigate to the Go Server Directory

```bash
cd backend/go-server
```

### 2. Install Go Dependencies

```bash
go mod download
go mod tidy
```

### 3. Install gqlgen (if not already installed)

```bash
go run github.com/99designs/gqlgen init
```

### 4. Generate GraphQL Code

After modifying `graph/schema.graphql`, generate the necessary files:

```bash
go generate ./...
```

### 5. Run the GraphQL Server

```bash
go run main.go
```

The server will start at: **http://localhost:8000**

- GraphQL Endpoint: `http://localhost:8000/graphql`
- GraphQL Playground: `http://localhost:8000/playground`

## Running Both Frontend and Backend

From the root project directory, use:

```bash
npm run dev:graphql
```

This command:
- Starts the Go GraphQL server on port 8000
- Starts the React frontend on port 5173
- Uses Concurrently to run both processes

## Project Structure

```
backend/go-server/
├── main.go                 # Entry point
├── go.mod                  # Go module dependencies
├── gqlgen.yml              # gqlgen configuration
├── auth/
│   ├── jwt.go              # JWT token generation & verification
│   └── middleware.go       # Authentication middleware
├── database/
│   └── db.go               # Database initialization with GORM & SQLite
├── graph/
│   ├── schema.graphql      # GraphQL schema definition
│   └── resolver.go         # Query & Mutation resolvers
└── models/
    └── models.go           # Go structs for data models
```

## Key Features

### Authentication
- JWT-based authentication
- Tokens stored in Authorization header
- Automatic token verification on protected queries/mutations

### Database
- **SQLite** (file-based) for development
- Can be switched to MySQL/PostgreSQL in production
- GORM ORM for database operations
- Auto-migration for schema

### GraphQL Endpoints

#### Queries
- `me`: Get current authenticated user
- `inventory`: List all inventory items
- `sales`: List all sales transactions
- `orders`: List all customer orders
- `workOrders`: List all work orders

#### Mutations
- `login`: Authenticate user and get token
- CRUD operations for inventory, sales, orders, and work orders

## Troubleshooting

### Port Already in Use
If port 8000 is already in use:

```bash
# Kill the process using port 8000 (macOS/Linux)
lsof -ti:8000 | xargs kill -9

# Or specify a different port in main.go
```

### Database Connection Issues
The database file `mushroom_farm.db` is created automatically in the `go-server` directory.

### Go Dependencies Issues
```bash
go clean -modcache
go mod download
go mod tidy
```

## Converting to MySQL/PostgreSQL

### For MySQL:

```bash
go get gorm.io/driver/mysql
```

Update `database/db.go`:
```go
import "gorm.io/driver/mysql"

dsn := "user:password@tcp(localhost:3306)/mushroom_farm"
DB, _ = gorm.Open(mysql.Open(dsn), &gorm.Config{})
```

### For PostgreSQL:

```bash
go get gorm.io/driver/postgres
```

## Frontend Integration

The React frontend uses Apollo Client to communicate with this GraphQL server:

1. **Apollo Client** configured in `src/apollo/client.js`
2. **GraphQL Queries & Mutations** in `src/apollo/queries.js`
3. **Custom React Hooks** in `src/apollo/hooks.js` for easy data fetching

See the frontend documentation for implementation details.

## Security Notes

⚠️ **Production Security:**
- Change the `jwtSecret` in `auth/jwt.go`
- Use environment variables for sensitive configuration
- Enable HTTPS
- Implement rate limiting
- Add input validation and sanitization
- Use a production database (PostgreSQL/MySQL)

## API Testing

Use GraphQL Playground at `http://localhost:8000/playground` to test queries:

```graphql
query {
  inventory {
    id
    name
    quantity
    type
  }
}
```

## Resources

- [Go Documentation](https://golang.org/doc/)
- [gqlgen Documentation](https://gqlgen.com/)
- [GORM Documentation](https://gorm.io/)
- [GraphQL Specification](https://spec.graphql.org/)
