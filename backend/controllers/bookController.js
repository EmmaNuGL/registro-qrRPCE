const pool = require('../config/db');

/* ===============================
   GET ALL BOOKS
================================ */
const getBooks = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM books ORDER BY entry_date DESC'
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
    const { qr } = req.params;

    const result = await pool.query(
      'SELECT * FROM books WHERE qr_code = $1',
      [qr]
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
   UPDATE BOOK STATUS
================================ */
const updateBookStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const result = await pool.query(
      'UPDATE books SET status = $1 WHERE id_book = $2 RETURNING *',
      [status, id]
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
  updateBookStatus,
  deleteBook
};
