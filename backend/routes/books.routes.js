const express = require('express');
const router = express.Router();
const bookController = require('../controllers/bookController');

// ===============================
// 📚 OBTENER TODOS LOS LIBROS
// ===============================
router.get('/', bookController.getBooks);

// ===============================
// ➕ CREAR NUEVO LIBRO
// ===============================
router.post('/', bookController.createBook);

// ===============================
// 🔍 OBTENER LIBRO POR QR
// ⚠️ IMPORTANTE: VA ANTES DE /:id
// ===============================
router.get('/qr/:codigo_qr', bookController.getBookByQR);

// ===============================
// 🔍 OBTENER LIBRO POR ID
// ===============================
router.get('/:id', bookController.getBookById);

// ===============================
// ✏️ EDITAR DATOS DEL LIBRO
// ===============================
router.put('/:id', bookController.updateBook);

// ===============================
// 🔄 CAMBIAR ESTADO (PRÉSTAMO / DEVOLUCIÓN)
// ===============================
router.patch('/:id/status', bookController.updateBookStatus);

// ===============================
// 🗑️ ELIMINAR LIBRO
// ===============================
router.delete('/:id', bookController.deleteBook);

module.exports = router;