const db = require("../config/db");


// =============================
// 🔹 Crear préstamo
// =============================
exports.createLoan = async (req, res) => {
  try {
    const { book_id, person, observations } = req.body;

    const book = await db.query(
      `SELECT status FROM books WHERE id_book = $1`,
      [book_id]
    );

    if (book.rows.length === 0) {
      return res.status(404).json({ error: "Libro no encontrado" });
    }

    if (book.rows[0].status === "IN_USE") {
      return res.status(400).json({ error: "El libro ya está prestado" });
    }

    const loanResult = await db.query(
      `INSERT INTO loans 
       (book_id, person, loan_date, status, observations)
       VALUES ($1, $2, NOW(), 'ACTIVE', $3)
       RETURNING *`,
      [book_id, person, observations || null]
    );

    await db.query(
      `UPDATE books
       SET status = 'IN_USE'
       WHERE id_book = $1`,
      [book_id]
    );

    res.json(loanResult.rows[0]);

  } catch (error) {
    console.error("🔥 ERROR COMPLETO:", error);
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
    const { id } = req.params;
    const { returned_by } = req.body;

    const result = await db.query(
      `UPDATE loans
       SET status = 'RETURNED',
           return_date = NOW(),
           returned_by = $1
       WHERE id = $2
       RETURNING *`,
      [returned_by || null, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Préstamo no encontrado" });
    }

    const loan = result.rows[0];

    await db.query(
      `UPDATE books
       SET status = 'AVAILABLE'
       WHERE id_book = $1`,
      [loan.book_id]
    );

    res.json(loan);

  } catch (error) {
    console.error("🔥 ERROR closeLoan:", error);
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