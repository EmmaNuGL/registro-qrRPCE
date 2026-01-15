const express = require('express');
const router = express.Router();
const movementController = require('../controllers/movementController');

router.get('/', movementController.getMovements);
router.post('/', movementController.createMovement);

module.exports = router;