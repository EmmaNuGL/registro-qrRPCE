const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Obtener todos los usuarios
router.get('/', userController.getUsers);

// Crear usuario
router.post('/', userController.createUser);

// Eliminar usuario
router.delete('/:id', userController.deleteUser);

module.exports = router;
