const pool = require('../config/db');

/* ===============================
   GET ALL BOOKS
================================ */
const getBooks = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM books ORDER BY created_at DESC'
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* ===============================
   CREATE BOOK
================================ */
const createBook = async (req, res) => {
  try {
    const {
      qr_code,
      volume_name,
      volume_number,
      year,
      register_from,
      register_to,
      status,
      observations
    } = req.body;

    const result = await pool.query(
      `INSERT INTO books
      (qr_code, volume_name, volume_number, year, register_from, register_to, status, observations)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
      RETURNING *`,
      [
        qr_code,
        volume_name,
        volume_number || null,
        year,
        register_from,
        register_to,
        status || 'ARCHIVED',
        observations || null
      ]
    );

    res.status(201).json(result.rows[0]);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* ===============================
   GET BOOK BY ID
================================ */
const getBookById = async (req, res) => {
  try {

    const { id } = req.params;

    const result = await pool.query(
      'SELECT * FROM books WHERE id_book = $1',
      [id]
    );

    if (!result.rows.length) {
      return res.status(404).json({ error: 'Book not found' });
    }

    res.json(result.rows[0]);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* ===============================
   GET BOOK BY QR
================================ */
const getBookByQR = async (req, res) => {
  try {

    const { codigo_qr } = req.params;

    const result = await pool.query(
      'SELECT * FROM books WHERE qr_code = $1',
      [codigo_qr]
    );

    if (!result.rows.length) {
      return res.status(404).json({ error: 'Book not found' });
    }

    res.json(result.rows[0]);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* ===============================
   UPDATE BOOK (EDIT DETAILS)
   🔥 NUEVA FUNCIÓN
================================ */
const updateBook = async (req, res) => {
  try {

    const { id } = req.params;

    const {
      qr_code,
      volume_name,
      volume_number,
      year,
      register_from,
      register_to,
      status,
      observations
    } = req.body;

    const result = await pool.query(
      `UPDATE books
       SET
         qr_code = $1,
         volume_name = $2,
         volume_number = $3,
         year = $4,
         register_from = $5,
         register_to = $6,
         status = $7,
         observations = $8
       WHERE id_book = $9
       RETURNING *`,
      [
        qr_code,
        volume_name,
        volume_number || null,
        year,
        register_from,
        register_to,
        status,
        observations || null,
        id
      ]
    );

    if (!result.rows.length) {
      return res.status(404).json({ error: "Book not found" });
    }

    res.json(result.rows[0]);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* ===============================
   UPDATE BOOK STATUS (WITH MOVEMENT)
================================ */
const updateBookStatus = async (req, res) => {

  const client = await pool.connect();

  try {

    const { id } = req.params;
    const { status, person, user_id, observations } = req.body;

    await client.query("BEGIN");

    // 1️⃣ Obtener libro actual
    const currentBook = await client.query(
      "SELECT * FROM books WHERE id_book = $1",
      [id]
    );

    if (!currentBook.rows.length) {
      await client.query("ROLLBACK");
      return res.status(404).json({ error: "Book not found" });
    }

    const oldStatus = currentBook.rows[0].status;

    // Si no cambia el estado, no registramos movimiento
    if (oldStatus === status) {
      await client.query("ROLLBACK");
      return res.json(currentBook.rows[0]);
    }

    // 2️⃣ Actualizar estado
    const updatedBook = await client.query(
      "UPDATE books SET status = $1 WHERE id_book = $2 RETURNING *",
      [status, id]
    );

    // 3️⃣ Determinar acción
    let action = null;

    if (oldStatus === "ARCHIVED" && status === "IN_USE") {
      action = "OUT";
    }

    if (oldStatus === "IN_USE" && status === "ARCHIVED") {
      action = "IN";
    }

    // 4️⃣ Insertar movimiento
    await client.query(
      `INSERT INTO movements
       (book_id, user_id, previous_state, new_state, action, person, observations, date_time)
       VALUES ($1,$2,$3,$4,$5,$6,$7,NOW())`,
      [
        id.toString(),
        user_id || null,
        oldStatus,
        status,
        action,
        person || "No especificado",
        observations || null
      ]
    );

    await client.query("COMMIT");

    res.json(updatedBook.rows[0]);

  } catch (error) {

    await client.query("ROLLBACK");
    res.status(500).json({ error: error.message });

  } finally {

    client.release();

  }
};

/* ===============================
   DELETE BOOK
================================ */
const deleteBook = async (req, res) => {
  try {

    const { id } = req.params;

    const result = await pool.query(
      'DELETE FROM books WHERE id_book = $1 RETURNING *',
      [id]
    );

    if (!result.rows.length) {
      return res.status(404).json({ error: 'Book not found' });
    }

    res.json({ message: 'Book deleted successfully' });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getBooks,
  createBook,
  getBookById,
  getBookByQR,
  updateBook,        // 🔥 NUEVO
  updateBookStatus,
  deleteBook
};