export function showNotification(message, type='info') {
  // Luego lo cambiamos a toasts bonitos, por ahora alert
  if(type==='error') alert('❌ '+message);
  else if(type==='success') alert('✅ '+message);
  else alert(message);
}
