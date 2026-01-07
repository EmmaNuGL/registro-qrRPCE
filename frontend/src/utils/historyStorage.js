// frontend/src/utils/historyStorage.js

const STORAGE_KEY = "history";

/**
 * Obtiene todo el historial
 */
export function getHistory() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}

/**
 * Agrega un nuevo movimiento al historial
 */
export function addHistory(entry) {
  const history = getHistory();

  const newEntry = {
    id: crypto.randomUUID(),
    date: new Date().toISOString(),
    user: "Sistema",
    ...entry,
  };

  history.unshift(newEntry); // lo más reciente arriba
  localStorage.setItem(STORAGE_KEY, JSON.stringify(history));

  return newEntry;
}

/**
 * Obtiene solo los movimientos de hoy
 */
export function getTodayHistory() {
  const today = new Date().toLocaleDateString("es-ES");

  return getHistory().filter(
    (h) =>
      new Date(h.date).toLocaleDateString("es-ES") === today
  );
}
