const express = require("express");
const router = express.Router();
const loansController = require("../controllers/loansController");

// ==========================
// Crear préstamo
// ==========================
router.post("/", loansController.createLoan);

// ==========================
// Obtener préstamo activo por libro
// ==========================
router.get("/active/:book_id", loansController.getActiveLoanByBook);

// ==========================
// Cerrar préstamo (devolver libro)
// ==========================
router.put("/close/:id", loansController.closeLoan);

// ==========================
// Listar todos los préstamos
// ==========================
router.get("/", loansController.getAllLoans);

// ==========================
// Obtener préstamos por persona
// ==========================
router.get("/user/:person", loansController.getLoansByUser);

module.exports = router;