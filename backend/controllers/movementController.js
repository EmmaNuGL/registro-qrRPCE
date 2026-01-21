const pool = require('../config/db');

/* ===============================
   GET ALL MOVEMENTS (HISTORY)
================================ */
const getMovements = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        m.*,
        b.volume_name,
        b.qr_code,
        u.name AS user_name
      FROM movements m
      JOIN books b ON m.id_book = b.id_book
      LEFT JOIN users u ON m.id_user = u.id_user
      ORDER BY m.created_at DESC
    `);

    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* ===============================
   CREATE MOVEMENT
================================ */
const createMovement = async (req, res) => {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const {
      id_user,
      id_book,
      movement_type,
      observation
    } = req.body;

    /* Insert movement */
    const movementResult = await client.query(
      `INSERT INTO movements 
      (id_user, id_book, movement_type, observation, created_at)
      VALUES ($1, $2, $3, $4, NOW())
      RETURNING *`,
      [id_user, id_book, movement_type, observation || null]
    );

    /* Update book status */
    let newStatus = 'ARCHIVED';
    if (movement_type === 'CHECK_OUT') newStatus = 'IN_USE';

    await client.query(
      'UPDATE books SET status = $1 WHERE id_book = $2',
      [newStatus, id_book]
    );

    await client.query('COMMIT');
    res.status(201).json(movementResult.rows[0]);

  } catch (error) {
    await client.query('ROLLBACK');
    res.status(500).json({ error: error.message });
  } finally {
    client.release();
  }
};

module.exports = {
  getMovements,
  createMovement
};
