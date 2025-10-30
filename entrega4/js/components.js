export function showAlert(container, type, text) {
  const div = document.createElement('div');
  div.className = `alert alert-${type}`;
  div.setAttribute('role','alert');
  div.textContent = text;
  container.appendChild(div);
}
export function clearAlerts(container) {
  container.querySelectorAll('.alert').forEach(el => el.remove());
}
export function showToast(message, timeout = 2500) {
  const toast = document.getElementById('global-toast');
  if (!toast) return;
  toast.textContent = message;
  toast.style.opacity = '1';
  toast.style.transform = 'translateY(0)';
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(8px)';
  }, timeout);
}
