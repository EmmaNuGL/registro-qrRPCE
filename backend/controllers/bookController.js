const pool = require('../config/db');

const getBooks = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM libros ORDER BY fecha_registro DESC');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createBook = async (req, res) => {
  try {
    const { codigo_qr, titulo, anio, ubicacion, estado } = req.body;
    const result = await pool.query(
      'INSERT INTO libros (codigo_qr, titulo, anio, ubicacion, estado, fecha_registro) VALUES ($1, $2, $3, $4, $5, NOW()) RETURNING *',
      [codigo_qr, titulo, anio, ubicacion, estado || 'DISPONIBLE']
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getBookById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM libros WHERE id_libro = $1', [id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Libro no encontrado' });
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getBookByQR = async (req, res) => {
  try {
    const { codigo_qr } = req.params;
    const result = await pool.query('SELECT * FROM libros WHERE codigo_qr = $1', [codigo_qr]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Libro no encontrado' });
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateBookStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { estado } = req.body;
    const result = await pool.query(
      'UPDATE libros SET estado = $1 WHERE id_libro = $2 RETURNING *',
      [estado, id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Libro no encontrado' });
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteBook = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM libros WHERE id_libro = $1 RETURNING *', [id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Libro no encontrado' });
    res.json({ message: 'Libro eliminado' });
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