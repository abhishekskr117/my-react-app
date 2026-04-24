# Mushroom Farming Management System

A comprehensive web application for managing mushroom farming operations, built with React, Zustand, Zod, React Hook Form, and MySQL.

## Features

- **Authentication**: Secure login system
- **Inventory Management**: Track mushrooms, supplies, and equipment
- **Sales Management**: Record and track sales
- **Order Management**: Handle customer orders
- **Work Orders**: Manage farm tasks and assignments
- **Fulfillment**: Process order fulfillment
- **Reports**: Generate sales and inventory reports
- **Automation**: Configure automated processes
- **KPI Dashboard**: Monitor key performance indicators

## Tech Stack

- **Frontend**: React 19, Vite, Material-UI, React Router
- **State Management**: Zustand
- **Forms**: React Hook Form with Zod validation
- **Backend**: Node.js, Express.js
- **Database**: SQLite (file-based, no server installation needed)
- **Charts**: Recharts

## Setup Instructions

### Prerequisites

- Node.js (v16 or higher)

### Database Setup

**No database server installation needed!** The app uses SQLite, which creates a local database file automatically.

### Environment Configuration

The `.env` file is already configured for SQLite. No changes needed.

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

### Running the Application

Start both frontend and backend servers:
```bash
npm run dev
```

This will start:
- Frontend on http://localhost:5173
- Backend on http://localhost:5000
The SQLite database file (`backend/mushroom_farm.db`) will be created automatically on first run.
### Login Credentials

- Username: `admin`
- Password: `admin123`

## Project Structure

```
src/
├── components/          # Reusable UI components
├── pages/              # Page components
├── stores/             # Zustand stores
├── services/           # API services
├── schemas/            # Zod validation schemas
└── App.jsx             # Main app component

backend/
├── server.js           # Express server
├── schema.sql          # Database schema
└── .env                # Environment variables
```

## API Endpoints

- `POST /api/login` - User authentication
- `GET /api/inventory` - Get inventory items
- `POST /api/inventory` - Add inventory item
- `GET /api/sales` - Get sales records
- `POST /api/sales` - Add sale record
- `GET /api/orders` - Get orders
- `POST /api/orders` - Add order
- `GET /api/workorders` - Get work orders
- `POST /api/workorders` - Add work order
- `GET /api/reports/*` - Get reports
