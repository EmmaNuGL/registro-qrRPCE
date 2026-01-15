require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./db');

// 🧩 Importar rutas
const booksRoutes = require('./routes/books.routes');
const movementsRoutes = require('./routes/movements.routes');
const usersRoutes = require('./routes/users.routes');

const app = express();

// 🔧 Middlewares
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// 🌐 Rutas principales
app.use('/api/libros', booksRoutes); // Changed to Spanish to match requirement
app.use('/api/movimientos', movementsRoutes);
app.use('/api/usuarios', usersRoutes);

// 🧠 Ruta base
app.get('/', (req, res) => {
  res.send('✅ API del sistema QR funcionando correctamente');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en el puerto ${PORT}`);
});
