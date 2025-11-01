require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// 🧩 Importar rutas
const booksRoutes = require('./routes/books.routes');
const historyRoutes = require('./routes/history.routes');
const usersRoutes = require('./routes/users.routes');

const app = express();

// 🔧 Middlewares
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// 🌐 Rutas principales
app.use('/api/books', booksRoutes);
app.use('/api/history', historyRoutes);
app.use('/api/users', usersRoutes);

// 🧠 Ruta base
app.get('/', (req, res) => {
  res.send('✅ API del sistema QR funcionando correctamente');
});

// 🚀 Conexión a la base de datos
const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ Conectado a MongoDB');
    app.listen(PORT, () => console.log(`🚀 Servidor corriendo en el puerto ${PORT}`));
  })
  .catch((err) => {
    console.error('❌ Error al conectar con MongoDB:', err.message);
  });
