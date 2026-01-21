const pool = require('../config/db');

/* ===============================
   GET ALL USERS
================================ */
const getUsers = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM users ORDER BY id_user ASC'
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* ===============================
   CREATE USER
================================ */
const createUser = async (req, res) => {
  try {
    const { name, position, role } = req.body;

    const result = await pool.query(
      `INSERT INTO users (name, position, role, created_at)
       VALUES ($1, $2, $3, NOW())
       RETURNING *`,
      [name, position, role]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* ===============================
   DELETE USER
================================ */
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'DELETE FROM users WHERE id_user = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getUsers,
  createUser,
  deleteUser
};
