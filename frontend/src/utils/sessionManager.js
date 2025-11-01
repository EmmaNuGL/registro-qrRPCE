// src/utils/sessionManager.js

export const saveUser = (user) => {
  localStorage.setItem("userSession", JSON.stringify(user));
};

export const getCurrentUser = () => {
  const data = localStorage.getItem("userSession");
  return data ? JSON.parse(data) : null;
};

export const clearUser = () => {
  localStorage.removeItem("userSession");
};

export const isAdmin = () => {
  const user = getCurrentUser();
  return user && user.role === "admin";
};
