import api from "./api";

// Obtener todos los movimientos
export const getMovements = () => api.get("/movements");

// Obtener últimos movimientos
export const getRecentMovements = (limit = 5) =>
  api.get(`/movements?limit=${limit}`);

// Crear movimiento
export const createMovement = (data) =>
  api.post("/movements", data);