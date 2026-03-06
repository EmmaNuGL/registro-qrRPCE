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
      JOIN books b ON m.book_id = b.id_book
      LEFT JOIN users u ON m.user_id = u.id
      ORDER BY m.date_time DESC
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

  try {

    const {
      book_id,
      user_id,
      previous_state,
      new_state,
      action,
      person,
      observations
    } = req.body;

    const result = await pool.query(
      `INSERT INTO movements
      (book_id, user_id, previous_state, new_state, action, person, observations, date_time)
      VALUES ($1,$2,$3,$4,$5,$6,$7,NOW())
      RETURNING *`,
      [
        book_id,
        user_id || null,
        previous_state,
        new_state,
        action,
        person || "No especificado",
        observations || null
      ]
    );

    res.status(201).json(result.rows[0]);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }

};

module.exports = {
  getMovements,
  createMovement
};