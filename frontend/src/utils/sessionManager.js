// src/utils/sessionManager.js

// Guarda la sesión del usuario actual
export const loginUser = (user) => {
  localStorage.setItem("userSession", JSON.stringify(user));
};

// Obtiene la sesión actual
export const getCurrentUser = () => {
  const data = localStorage.getItem("userSession");
  return data ? JSON.parse(data) : null;
};

// Cierra sesión y redirige
export const logoutUser = () => {
  localStorage.removeItem("userSession");
  window.location.href = "/"; // redirige al inicio o login
};

// Verifica si el usuario actual es administrador
export const isAdmin = () => {
  const user = getCurrentUser();
  return user && (user.role === "Administrador" || user.role === "admin");
};
