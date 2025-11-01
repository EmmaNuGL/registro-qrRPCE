export function isNumeric(value) {
  return /^-?\d+$/.test(value);
}
export function isValidRange(from, to) {
  return isNumeric(from) && isNumeric(to) && Number(from) <= Number(to);
}