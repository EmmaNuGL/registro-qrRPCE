const express = require('express');
const router = express.Router();
const User = require('../models/user.model');

// Obtener todos los usuarios
router.get('/', async (req, res) => {
  try {
    const list = await User.find().sort({ createdAt: -1 });
    res.json(list);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Crear usuario
router.post('/', async (req, res) => {
  try {
    const created = await User.create(req.body);
    res.status(201).json(created);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// Eliminar usuario
router.delete('/:id', async (req, res) => {
  try {
    const del = await User.findByIdAndDelete(req.params.id);
    if (!del) return res.status(404).json({ error: 'No encontrado' });
    res.json({ message: 'Eliminado correctamente' });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;
