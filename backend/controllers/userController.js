const pool = require('../config/db');

const getUsers = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM usuarios ORDER BY id_usuario ASC');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createUser = async (req, res) => {
  try {
    const { nombre, cargo, rol } = req.body;
    const result = await pool.query(
      'INSERT INTO usuarios (nombre, cargo, rol) VALUES ($1, $2, $3) RETURNING *',
      [nombre, cargo, rol]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM usuarios WHERE id_usuario = $1 RETURNING *', [id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Usuario no encontrado' });
    res.json({ message: 'Usuario eliminado' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getUsers, createUser, deleteUser };