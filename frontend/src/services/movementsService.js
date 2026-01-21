import api from "./api";

// Obtener todos los movimientos
export const getMovements = () => api.get("/movimientos");

// Obtener últimos movimientos
export const getRecentMovements = (limit = 5) =>
  api.get(`/movimientos?limit=${limit}`);

// ✅ CREAR MOVIMIENTO (FALTABA)
export const createMovement = (data) =>
  api.post("/movimientos", data);
