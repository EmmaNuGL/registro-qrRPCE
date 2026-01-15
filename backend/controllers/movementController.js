const pool = require('../config/db');

const getMovements = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT m.*, l.titulo, l.codigo_qr, u.nombre as nombre_usuario 
      FROM movimientos m
      JOIN libros l ON m.id_libro = l.id_libro
      LEFT JOIN usuarios u ON m.id_usuario = u.id_usuario
      ORDER BY m.fecha DESC
    `);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createMovement = async (req, res) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const { id_usuario, id_libro, tipo_movimiento, observacion } = req.body;

    // Insertar movimiento
    const movRes = await client.query(
      'INSERT INTO movimientos (id_usuario, id_libro, fecha, tipo_movimiento, observacion) VALUES ($1, $2, NOW(), $3, $4) RETURNING *',
      [id_usuario, id_libro, tipo_movimiento, observacion]
    );

    // Actualizar estado del libro
    let nuevoEstado = 'DISPONIBLE';
    if (tipo_movimiento === 'PRESTAMO') nuevoEstado = 'EN_USO';
    
    await client.query('UPDATE libros SET estado = $1 WHERE id_libro = $2', [nuevoEstado, id_libro]);

    await client.query('COMMIT');
    res.status(201).json(movRes.rows[0]);
  } catch (error) {
    await client.query('ROLLBACK');
    res.status(500).json({ error: error.message });
  } finally {
    client.release();
  }
};

module.exports = { getMovements, createMovement };