const db = require("../config/db");

// =============================
// 🔹 Helper interno para registrar movimientos
// =============================
const registerMovement = async (client, {
  book_id,
  user_id,
  previous_state,
  new_state,
  action,
  person,
  observations
}) => {
  await client.query(
    `INSERT INTO movements
     (book_id, user_id, previous_state, new_state, action, person, observations)
     VALUES ($1, $2, $3, $4, $5, $6, $7)`,
    [book_id, user_id, previous_state, new_state, action, person, observations]
  );
};

// =============================
// 🔹 Crear préstamo
// =============================
exports.createLoan = async (req, res) => {
  const client = await db.connect();

  try {
    await client.query("BEGIN");

    const { book_id, person, observations, user_id } = req.body;

    if (!book_id || !person || !person.trim()) {
      await client.query("ROLLBACK");
      return res.status(400).json({ error: "Faltan datos obligatorios" });
    }

    const bookResult = await client.query(
      `SELECT status FROM books WHERE id_book = $1 FOR UPDATE`,
      [book_id]
    );

    if (bookResult.rows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({ error: "Libro no encontrado" });
    }

    const currentStatus = bookResult.rows[0].status;

    if (currentStatus !== "ARCHIVED") {
      await client.query("ROLLBACK");
      return res.status(400).json({
        error: "El libro no está en archivo y no puede ser prestado",
      });
    }

    const loanResult = await client.query(
      `INSERT INTO loans 
       (book_id, person, loan_date, status, observations)
       VALUES ($1, $2, NOW(), 'ACTIVE', $3)
       RETURNING *`,
      [book_id, person.trim(), observations || null]
    );

    await client.query(
      `UPDATE books
       SET status = 'IN_USE'
       WHERE id_book = $1`,
      [book_id]
    );

    await registerMovement(client, {
      book_id,
      user_id: user_id || null,
      previous_state: currentStatus,
      new_state: 'IN_USE',
      action: 'PRESTAR',
      person: person.trim(),
      observations: observations || 'Préstamo registrado'
    });

    await client.query("COMMIT");

    res.json(loanResult.rows[0]);

  } catch (error) {
    await client.query("ROLLBACK");
    console.error("🔥 ERROR createLoan:", error);
    res.status(500).json({ error: error.message });
  } finally {
    client.release();
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

    res.json(result.rows[0] || null);

  } catch (error) {
    console.error("🔥 ERROR getActiveLoanByBook:", error);
    res.status(500).json({ error: error.message });
  }
};


// =============================
// 🔹 Cerrar préstamo normal
// =============================
exports.closeLoan = async (req, res) => {
  const client = await db.connect();

  try {
    await client.query("BEGIN");

    const { id } = req.params;
    const { returned_by, user_id } = req.body;

    if (!returned_by || !returned_by.trim()) {
      await client.query("ROLLBACK");
      return res.status(400).json({
        error: "Debe indicar quién devuelve el libro",
      });
    }

    const loanResult = await client.query(
      `SELECT * FROM loans 
       WHERE id = $1 AND status = 'ACTIVE'
       FOR UPDATE`,
      [id]
    );

    if (loanResult.rows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({
        error: "Préstamo no encontrado o ya devuelto",
      });
    }

    const loan = loanResult.rows[0];

    const bookRes = await client.query(
      `SELECT status FROM books WHERE id_book = $1 FOR UPDATE`,
      [loan.book_id]
    );
    const previous_state = bookRes.rows[0]?.status || 'UNKNOWN';

    await client.query(
      `UPDATE loans
       SET status = 'RETURNED',
           return_date = NOW(),
           returned_by = $1
       WHERE id = $2`,
      [returned_by.trim(), id]
    );

    await client.query(
      `UPDATE books
       SET status = 'ARCHIVED'
       WHERE id_book = $1`,
      [loan.book_id]
    );

    await registerMovement(client, {
      book_id: loan.book_id,
      user_id: user_id || null,
      previous_state: previous_state,
      new_state: 'ARCHIVED',
      action: 'DEVOLVER',
      person: returned_by.trim(),
      observations: 'Devolución registrada'
    });

    await client.query("COMMIT");

    res.json({ message: "Devolución registrada correctamente" });

  } catch (error) {
    await client.query("ROLLBACK");
    console.error("🔥 ERROR closeLoan:", error);
    res.status(500).json({ error: error.message });
  } finally {
    client.release();
  }
};


// =============================
// 🔹 Forzar regularización
// =============================
exports.forceArchive = async (req, res) => {
  const client = await db.connect();

  try {
    await client.query("BEGIN");

    const { book_id, user_id } = req.body;

    if (!book_id) {
      await client.query("ROLLBACK");
      return res.status(400).json({
        error: "Falta book_id",
      });
    }

    const bookRes = await client.query(
      'SELECT status FROM books WHERE id_book = $1 FOR UPDATE',
      [book_id]
    );
    const previous_state = bookRes.rows.length ? bookRes.rows[0].status : 'ARCHIVED';

    await client.query(
      `UPDATE books
       SET status = 'ARCHIVED'
       WHERE id_book = $1`,
      [book_id]
    );

    await registerMovement(client, {
      book_id,
      user_id: user_id || null,
      previous_state: previous_state,
      new_state: 'ARCHIVED',
      action: 'EDITAR_LIBRO',
      person: 'Admin',
      observations: 'Regularización manual'
    });

    await client.query("COMMIT");

    res.json({
      message: "Libro regularizado manualmente",
    });

  } catch (error) {
    await client.query("ROLLBACK");
    console.error("🔥 ERROR forceArchive:", error);
    res.status(500).json({ error: error.message });
  } finally {
    client.release();
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
