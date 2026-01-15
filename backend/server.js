require('dotenv').config();
const express = require('express');
const cors = require('cors');
const pool = require('./config/db'); // 🔴 CAMBIO AQUÍ

// 🧩 Importar rutas
const booksRoutes = require('./routes/books.routes');
const movementsRoutes = require('./routes/movements.routes');
const usersRoutes = require('./routes/users.routes');

const app = express();

// 🔧 Middlewares
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// 🌐 Rutas principales
app.use('/api/libros', booksRoutes);
app.use('/api/movimientos', movementsRoutes);
app.use('/api/usuarios', usersRoutes);

// 🧠 Ruta base
app.get('/', (req, res) => {
  res.send('✅ API del sistema QR funcionando correctamente');
});

// ✅ PRUEBA DE CONEXIÓN (ESTÁ BIEN UBICADA)
pool.query("SELECT * FROM libros LIMIT 1")
  .then(res => {
    console.log("✅ Conectado a PostgreSQL");
    console.log("Ejemplo libro:", res.rows);
  })
  .catch(err => {
    console.error("❌ Error PostgreSQL:", err.message);
  });

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en el puerto ${PORT}`);
});
