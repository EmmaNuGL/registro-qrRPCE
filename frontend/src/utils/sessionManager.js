// src/utils/sessionManager.js

// Guarda la sesión del usuario actual
export const saveUser = (user) => {
  localStorage.setItem("userSession", JSON.stringify(user));
};

// Obtiene la sesión actual
export const getCurrentUser = () => {
  const data = localStorage.getItem("userSession");
  return data ? JSON.parse(data) : null;
};

// Cierra sesión
export const logoutUser = () => {
  localStorage.removeItem("userSession");
};

// Verifica si el usuario actual es administrador
export const isAdmin = () => {
  const user = getCurrentUser();
  // Acepta ambos formatos de rol por compatibilidad
  return user && (user.role === "admin" || user.role === "Administrador");
};
