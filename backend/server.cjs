const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const path = require('path');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// ✅ Use SQLite database (file-based, no server needed)
const dbPath = path.join(__dirname, 'mushroom_farm.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('❌ SQLite connection failed:', err.message);
  } else {
    console.log('✅ Connected to SQLite database');
    initializeDatabase();
  }
});

// Initialize database tables
function initializeDatabase() {
  const sql = `
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT DEFAULT 'user'
    );

    CREATE TABLE IF NOT EXISTS inventory (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      quantity INTEGER NOT NULL,
      type TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS sales (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      product TEXT NOT NULL,
      quantity INTEGER NOT NULL,
      price DECIMAL(10,2) NOT NULL,
      date DATE NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      customer TEXT NOT NULL,
      product TEXT NOT NULL,
      quantity INTEGER NOT NULL,
      status TEXT DEFAULT 'pending',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS workorders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      task TEXT NOT NULL,
      assigned_to TEXT,
      status TEXT DEFAULT 'pending',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `;

  db.exec(sql, (err) => {
    if (err) {
      console.error('❌ Error creating tables:', err.message);
    } else {
      console.log('✅ Database tables initialized');
      insertSampleData();
    }
  });
}

// Insert sample data
function insertSampleData() {
  // Check if admin user exists
  db.get("SELECT COUNT(*) as count FROM users WHERE username = 'admin'", [], (err, row) => {
    if (err) {
      console.error('❌ Error checking users:', err.message);
      return;
    }

    if (row.count === 0) {
      // Hash password for admin user
      const hashedPassword = '$2b$10$jqJ9B3eqdLivfI3zOSQ2GOAyC.BeNybEnjlONhMrhB8nkXZzS9VhG'; // admin123

      const insertSql = `
        INSERT INTO users (username, password) VALUES ('admin', ?);
        INSERT INTO inventory (name, quantity, type) VALUES ('Shiitake', 100, 'Mushroom'), ('Oyster', 50, 'Mushroom'), ('Substrate', 200, 'Supply');
      `;

      db.run(insertSql, [hashedPassword], function(err) {
        if (err) {
          console.error('❌ Error inserting sample data:', err.message);
        } else {
          console.log('✅ Sample data inserted');
          startServer(); // Start server after database is ready
        }
      });
    } else {
      console.log('✅ Sample data already exists');
      startServer(); // Start server after database is ready
    }
  });
}

// Start server function
function startServer() {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
}

// JWT Secret check
if (!process.env.JWT_SECRET) {
  console.warn("⚠️ WARNING: JWT_SECRET not set in .env");
}

// ✅ Auth middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ error: 'Access denied' });

  jwt.verify(token, process.env.JWT_SECRET || 'dev_secret', (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.user = user;
    next();
  });
};

// ================= AUTH =================
app.post('/api/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    console.log('🔐 Login attempt for user:', username);

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password required' });
    }

    db.get(
      'SELECT * FROM users WHERE username = ?',
      [username],
      async (err, user) => {
        if (err) {
          console.error('❌ Database error:', err.message);
          return res.status(500).json({ error: 'Database error' });
        }

        if (!user) {
          console.log('❌ User not found');
          return res.status(400).json({ error: 'User not found' });
        }

        console.log('✅ User found, checking password');

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
          console.log('❌ Invalid password');
          return res.status(400).json({ error: 'Invalid password' });
        }

        const token = jwt.sign(
          { id: user.id, username: user.username },
          process.env.JWT_SECRET || 'dev_secret',
          { expiresIn: '1d' }
        );

        console.log('✅ Login successful, sending response');
        res.json({
          token,
          user: { id: user.id, username: user.username }
        });
        console.log('✅ Response sent');
      }
    );

  } catch (err) {
    console.error('❌ Login error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// ================= INVENTORY =================
app.get('/api/inventory', authenticateToken, (req, res) => {
  db.all('SELECT * FROM inventory', [], (err, rows) => {
    if (err) {
      console.error('❌ Inventory fetch error:', err.message);
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

app.post('/api/inventory', authenticateToken, (req, res) => {
  const { name, quantity, type } = req.body;

  if (!name || !quantity || !type) {
    return res.status(400).json({ error: 'All fields required' });
  }

  db.run(
    'INSERT INTO inventory (name, quantity, type) VALUES (?, ?, ?)',
    [name, quantity, type],
    function(err) {
      if (err) {
        console.error('❌ Inventory insert error:', err.message);
        return res.status(500).json({ error: err.message });
      }
      res.json({ id: this.lastID, name, quantity, type });
    }
  );
});

// ================= SALES =================
app.get('/api/sales', authenticateToken, (req, res) => {
  db.all('SELECT * FROM sales', [], (err, rows) => {
    if (err) {
      console.error('❌ Sales fetch error:', err.message);
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

app.post('/api/sales', authenticateToken, (req, res) => {
  const { product, quantity, price, date } = req.body;

  db.run(
    'INSERT INTO sales (product, quantity, price, date) VALUES (?, ?, ?, ?)',
    [product, quantity, price, date],
    function(err) {
      if (err) {
        console.error('❌ Sales insert error:', err.message);
        return res.status(500).json({ error: err.message });
      }
      res.json({ id: this.lastID, product, quantity, price, date });
    }
  );
});

// ================= ORDERS =================
app.get('/api/orders', authenticateToken, (req, res) => {
  db.all('SELECT * FROM orders', [], (err, rows) => {
    if (err) {
      console.error('❌ Orders fetch error:', err.message);
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

app.post('/api/orders', authenticateToken, (req, res) => {
  const { customer, product, quantity, status } = req.body;

  db.run(
    'INSERT INTO orders (customer, product, quantity, status) VALUES (?, ?, ?, ?)',
    [customer, product, quantity, status],
    function(err) {
      if (err) {
        console.error('❌ Orders insert error:', err.message);
        return res.status(500).json({ error: err.message });
      }
      res.json({ id: this.lastID, customer, product, quantity, status });
    }
  );
});

// ================= WORK ORDERS =================
app.get('/api/workorders', authenticateToken, (req, res) => {
  db.all('SELECT * FROM workorders', [], (err, rows) => {
    if (err) {
      console.error('❌ Workorders fetch error:', err.message);
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

app.post('/api/workorders', authenticateToken, (req, res) => {
  const { task, assigned_to, status } = req.body;

  db.run(
    'INSERT INTO workorders (task, assigned_to, status) VALUES (?, ?, ?)',
    [task, assigned_to, status],
    function(err) {
      if (err) {
        console.error('❌ Workorders insert error:', err.message);
        return res.status(500).json({ error: err.message });
      }
      res.json({ id: this.lastID, task, assigned_to, status });
    }
  );
});

// ================= REPORTS =================
app.get('/api/reports/sales', authenticateToken, (req, res) => {
  db.get('SELECT SUM(price * quantity) as total_sales FROM sales', [], (err, row) => {
    if (err) {
      console.error('❌ Sales report error:', err.message);
      return res.status(500).json({ error: err.message });
    }
    res.json(row || { total_sales: 0 });
  });
});

app.get('/api/reports/inventory', authenticateToken, (req, res) => {
  db.all('SELECT type, SUM(quantity) as total FROM inventory GROUP BY type', [], (err, rows) => {
    if (err) {
      console.error('❌ Inventory report error:', err.message);
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

// Test route
app.get('/', (req, res) => {
  res.json({ message: 'Mushroom Farm API is running!' });
});

// Initialize database and start server
initializeDatabase();