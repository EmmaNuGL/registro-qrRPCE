const express = require('express');
const router = express.Router();
const Book = require('../models/book.model');

// ✅ Obtener todos los libros
router.get('/', async (req, res) => {
  try {
    const books = await Book.find().sort({ addedDate: -1 });
    res.json(books);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Crear un nuevo libro (con validación previa)
router.post('/', async (req, res) => {
  try {
    const { qr, year, tome, registryFrom, registryTo } = req.body;

    // 🔒 Validación mínima de campos obligatorios
    if (!year || !tome || !registryFrom || !registryTo || !qr) {
      return res.status(400).json({ error: 'Campos obligatorios faltantes' });
    }

    // Verifica si el QR ya existe (evita duplicados)
    const existingBook = await Book.findOne({ qr });
    if (existingBook) {
      return res.status(409).json({ error: 'El código QR ya está registrado' });
    }

    const book = new Book(req.body);
    await book.save();

    res.status(201).json(book);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ✅ Obtener un libro por ID
router.get('/:id', async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ error: 'No encontrado' });
    res.json(book);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Actualizar un libro por ID
router.put('/:id', async (req, res) => {
  try {
    const updated = await Book.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updated) return res.status(404).json({ error: 'No encontrado' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ✅ Eliminar un libro por ID
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Book.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'No encontrado' });
    res.json({ message: 'Eliminado correctamente' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
