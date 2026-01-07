import api from "./api";

// Obtener todo el historial
export const getHistory = () => api.get("/history");

// Obtener últimos movimientos (para dashboard)
export const getRecentHistory = (limit = 5) =>
  api.get(`/history?limit=${limit}`);
