const express = require('express');
const router = express.Router();
const bookController = require('../controllers/bookController');

// ✅ Obtener todos los libros
router.get('/', bookController.getBooks);

// ✅ Crear un nuevo libro (con validación previa)
router.post('/', bookController.createBook);

// ✅ Obtener un libro por ID
router.get('/:id', bookController.getBookById);

// ✅ Obtener un libro por QR
router.get('/qr/:codigo_qr', bookController.getBookByQR);

// ✅ Actualizar un libro por ID
router.put('/:id', bookController.updateBookStatus); // General update can be added if needed

// ✅ Eliminar un libro por ID
router.delete('/:id', bookController.deleteBook);

module.exports = router;
