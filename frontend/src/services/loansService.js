import axios from "axios";

const API = "http://localhost:5000/api/loans";

// 🔹 Crear préstamo
export const createLoan = (data) => {
  return axios.post(API, data);
};

// 🔹 Cerrar préstamo normal
export const closeLoan = (id_loan, data) => {
  return axios.put(`${API}/close/${id_loan}`, data);
};

// 🔹 Obtener préstamo activo por libro
export const getActiveLoanByBook = (id_book) => {
  return axios.get(`${API}/active/${id_book}`);
};

// 🔥 Forzar regularización
export const forceArchive = (data) => {
  return axios.put(`${API}/force`, data);
};