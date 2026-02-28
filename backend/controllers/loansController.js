const db = require("../config/db");

// =============================
// 🔹 Crear préstamo
// =============================
exports.createLoan = async (req, res) => {
  try {
    console.log("========== CREATE LOAN ==========");
    console.log("📥 BODY RECIBIDO:", req.body);

    const { book_id, person, observations } = req.body;

    // Validación básica
    if (!book_id || !person || !person.trim()) {
      console.log("❌ Datos inválidos");
      return res.status(400).json({ error: "Faltan datos obligatorios" });
    }

    // Verificar que el libro exista
    const book = await db.query(
      `SELECT status FROM books WHERE id_book = $1`,
      [book_id]
    );

    console.log("📚 Resultado SELECT libro:", book.rows);

    if (book.rows.length === 0) {
      console.log("❌ Libro no encontrado");
      return res.status(404).json({ error: "Libro no encontrado" });
    }

    const currentStatus = book.rows[0].status;
    console.log("📊 Estado actual en BD:", currentStatus);

    // Si está en uso, no se puede prestar
    if (currentStatus === "IN_USE") {
      console.log("❌ Libro ya está prestado");
      return res.status(400).json({ error: "El libro ya está prestado" });
    }

    // 🔥 Aquí permitimos prestar cuando está ARCHIVED
    if (currentStatus !== "ARCHIVED") {
      console.log("❌ Estado inesperado:", currentStatus);
      return res.status(400).json({ error: "Estado del libro no válido para préstamo" });
    }

    // Crear préstamo
    const loanResult = await db.query(
      `INSERT INTO loans 
       (book_id, person, loan_date, status, observations)
       VALUES ($1, $2, NOW(), 'ACTIVE', $3)
       RETURNING *`,
      [book_id, person.trim(), observations || null]
    );

    // Marcar libro como en uso
    await db.query(
      `UPDATE books
       SET status = $1
       WHERE id_book = $2`,
      ['IN_USE', book_id]
    );

    console.log("✅ Préstamo creado correctamente");

    res.json(loanResult.rows[0]);

  } catch (error) {
    console.error("🔥 ERROR COMPLETO createLoan:", error);
    res.status(500).json({ error: error.message });
  }
};


// =============================
// 🔹 Obtener préstamo activo por libro
// =============================
exports.getActiveLoanByBook = async (req, res) => {
  try {
    const { book_id } = req.params;

    const result = await db.query(
      `SELECT *
       FROM loans
       WHERE book_id = $1
       AND status = 'ACTIVE'
       ORDER BY loan_date DESC
       LIMIT 1`,
      [book_id]
    );

    if (result.rows.length === 0) {
      return res.json(null);
    }

    res.json(result.rows[0]);

  } catch (error) {
    console.error("🔥 ERROR getActiveLoanByBook:", error);
    res.status(500).json({ error: error.message });
  }
};


// =============================
// 🔹 Devolver libro
// =============================
exports.closeLoan = async (req, res) => {
  try {
    console.log("========== CLOSE LOAN ==========");

    const { id } = req.params;
    const { returned_by } = req.body;

    if (!returned_by || !returned_by.trim()) {
      console.log("❌ Falta returned_by");
      return res.status(400).json({ error: "Debe indicar quién devuelve el libro" });
    }

    // Actualizar préstamo
    const result = await db.query(
      `UPDATE loans
       SET status = 'RETURNED',
           return_date = NOW(),
           returned_by = $1
       WHERE id = $2
       AND status = 'ACTIVE'
       RETURNING *`,
      [returned_by.trim(), id]
    );

    if (result.rows.length === 0) {
      console.log("❌ Préstamo no encontrado o ya devuelto");
      return res.status(404).json({ error: "Préstamo no encontrado o ya devuelto" });
    }

    const loan = result.rows[0];

    // Cambiar libro a ARCHIVED (estantería)
    await db.query(
      `UPDATE books
       SET status = $1
       WHERE id_book = $2`,
      ['ARCHIVED', loan.book_id]
    );

    console.log("✅ Devolución registrada correctamente");

    res.json(loan);

  } catch (error) {
    console.error("🔥 ERROR REAL CLOSELOAN:", error);
    res.status(500).json({ error: error.message });
  }
};


// =============================
// 🔹 Listar todos los préstamos
// =============================
exports.getAllLoans = async (req, res) => {
  try {
    const result = await db.query(
      `SELECT l.*, b.volume_name, b.volume_number
       FROM loans l
       JOIN books b ON l.book_id = b.id_book
       ORDER BY l.loan_date DESC`
    );

    res.json(result.rows);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error listando préstamos" });
  }
};


// =============================
// 🔹 Obtener préstamos por persona
// =============================
exports.getLoansByUser = async (req, res) => {
  try {
    const { person } = req.params;

    const result = await db.query(
      `SELECT l.*, b.volume_name, b.volume_number
       FROM loans l
       JOIN books b ON l.book_id = b.id_book
       WHERE l.person = $1
       ORDER BY l.loan_date DESC`,
      [person]
    );

    res.json(result.rows);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error obteniendo préstamos por persona" });
  }
};