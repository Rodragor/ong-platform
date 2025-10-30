// Armazenamento simples em localStorage para o formulário
const KEY = 'ong_cadastro';

export function saveForm(selector) {
  const form = document.querySelector(selector);
  if (!form) return;
  const data = {};
  const fields = form.querySelectorAll('input, select, textarea');
  fields.forEach(f => {
    if (f.type === 'checkbox') data[f.name] = f.checked;
    else data[f.name] = f.value;
  });
  localStorage.setItem(KEY, JSON.stringify(data));
}

export function restoreForm(selector) {
  const form = document.querySelector(selector);
  if (!form) return;
  try {
    const data = JSON.parse(localStorage.getItem(KEY) || '{}');
    Object.entries(data).forEach(([name, value]) => {
      const el = form.elements.namedItem(name);
      if (!el) return;
      if (el.type === 'checkbox') el.checked = !!value;
      else el.value = value || '';
    });
  } catch(e) {
    console.warn('Falha ao restaurar formulário:', e);
  }
}

export function setupAutoSave(selector) {
  const form = document.querySelector(selector);
  if (!form) return;
  const handler = () => saveForm(selector);
  form.addEventListener('input', handler);
  form.addEventListener('change', handler);
}
