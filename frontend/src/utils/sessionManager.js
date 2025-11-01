export const getCurrentUser = () => {
  const data = localStorage.getItem("user");
  return data ? JSON.parse(data) : null;
};

export const logoutUser = () => {
  localStorage.removeItem("user");
  window.location.href = "/";
};
