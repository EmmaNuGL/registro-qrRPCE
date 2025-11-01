const express = require('express');
const router = express.Router();
const History = require('../models/history.model');

// Obtener historial
router.get('/', async (req, res) => {
  try {
    const list = await History.find().sort({ date: -1 });
    res.json(list);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Agregar registro al historial
router.post('/', async (req, res) => {
  try {
    const created = await History.create(req.body);
    res.status(201).json(created);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

module.exports = router;
