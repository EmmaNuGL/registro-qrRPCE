const pool = require("../config/db");

/* ===============================
   🔹 HELPER INTERNO PARA REGISTRAR MOVIMIENTOS
================================ */
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

/* ===============================
   GET ALL BOOKS
================================ */
const getBooks = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM books ORDER BY created_at DESC"
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
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const {
      qr_code,
      volume_name,
      volume_number,
      year,
      register_from,
      register_to,
      status,
      observations,
      user_id
    } = req.body;

    const result = await client.query(
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
        status || "ARCHIVED",
        observations || null
      ]
    );

    const newBook = result.rows[0];

    await registerMovement(client, {
      book_id: newBook.id_book,
      user_id: user_id || null,
      previous_state: null,
      new_state: newBook.status,
      action: "CREAR_LIBRO",
      person: null,
      observations: "Libro registrado en el sistema"
    });

    await client.query("COMMIT");
    res.status(201).json(newBook);

  } catch (error) {
    await client.query("ROLLBACK");
    res.status(500).json({ error: error.message });
  } finally {
    client.release();
  }
};

/* ===============================
   GET BOOK BY ID
================================ */
const getBookById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      "SELECT * FROM books WHERE id_book = $1",
      [id]
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
   GET BOOK BY QR
================================ */
const getBookByQR = async (req, res) => {
  try {
    const { codigo_qr } = req.params;

    const result = await pool.query(
      "SELECT * FROM books WHERE qr_code = $1",
      [codigo_qr]
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
   UPDATE BOOK
================================ */
const updateBook = async (req, res) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const { id } = req.params;
    const {
      qr_code,
      volume_name,
      volume_number,
      year,
      register_from,
      register_to,
      status,
      observations,
      user_id
    } = req.body;

    const currentBookResult = await client.query(
      "SELECT status FROM books WHERE id_book = $1 FOR UPDATE",
      [id]
    );

    if (currentBookResult.rows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({ error: "Book not found" });
    }

    const previous_state = currentBookResult.rows[0].status;

    const updatedBookResult = await client.query(
      `UPDATE books SET
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
        volume_number,
        year,
        register_from,
        register_to,
        status,
        observations,
        id
      ]
    );

    await registerMovement(client, {
      book_id: id,
      user_id: user_id || null,
      previous_state,
      new_state: updatedBookResult.rows[0].status,
      action: "EDITAR_LIBRO",
      person: null,
      observations: "Datos del libro actualizados"
    });

    await client.query("COMMIT");
    res.json(updatedBookResult.rows[0]);

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
      "DELETE FROM books WHERE id_book = $1 RETURNING *",
      [id]
    );

    if (!result.rows.length) {
      return res.status(404).json({ error: "Book not found" });
    }

    res.json({ message: "Book deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getBooks,
  createBook,
  getBookById,
  getBookByQR,
  updateBook,
  deleteBook
};