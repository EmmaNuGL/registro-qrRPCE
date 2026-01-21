require('dotenv').config();
const express = require('express');
const cors = require('cors');
const pool = require('./config/db');

// 📦 Import routes
const booksRoutes = require('./routes/books.routes');
const movementsRoutes = require('./routes/movements.routes');
const usersRoutes = require('./routes/users.routes');

const app = express();

// 🔧 Middlewares
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// 🌐 API routes
app.use('/api/books', booksRoutes);
app.use('/api/movements', movementsRoutes);
app.use('/api/users', usersRoutes);

// 🧠 Base route
app.get('/', (req, res) => {
  res.send('✅ QR Management System API running correctly');
});

// 🧪 PostgreSQL connection test
pool.query('SELECT * FROM books LIMIT 1')
  .then(result => {
    console.log('✅ Connected to PostgreSQL');
    console.log('📘 Sample book:', result.rows);
  })
  .catch(error => {
    console.error('❌ PostgreSQL connection error:', error.message);
  });

// 🚀 Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Backend server running on port ${PORT}`);
});
