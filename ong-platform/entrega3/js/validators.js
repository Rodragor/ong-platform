import { showAlert, clearAlerts } from './components.js';

// Utilidades
const onlyDigits = (s) => (s || '').replace(/\D/g, '');

// Validação de CPF (com dígitos verificadores)
export function isValidCPF(cpfRaw) {
  let cpf = onlyDigits(cpfRaw);
  if (!cpf || cpf.length !== 11) return false;
  if (/^(\d)\1{10}$/.test(cpf)) return false; // evita repetidos

  const calc = (base) => {
    let sum = 0;
    for (let i = 0; i < base.length; i++) {
      sum += parseInt(base[i]) * ((base.length + 1) - i);
    }
    let rest = (sum * 10) % 11;
    return (rest === 10) ? 0 : rest;
  };

  const d1 = calc(cpf.slice(0, 9));
  const d2 = calc(cpf.slice(0, 10));
  return d1 === parseInt(cpf[9]) && d2 === parseInt(cpf[10]);
}

export function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email || '');
}
export function isValidPhone(tel) {
  // (11) 99999-9999 ou (11) 9999-9999
  return /^\([0-9]{2}\) [0-9]{4,5}-[0-9]{4}$/.test(tel || '');
}
export function isValidCEP(cep) {
  return /^[0-9]{5}-[0-9]{3}$/.test(cep || '');
}
export function isAdult(dateStr, minYears = 16) {
  if (!dateStr) return false;
  const d = new Date(dateStr + 'T00:00:00');
  if (isNaN(d)) return false;
  const today = new Date();
  let age = today.getFullYear() - d.getFullYear();
  const m = today.getMonth() - d.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < d.getDate())) age--;
  return age >= minYears;
}

// Validação e consistência do formulário (com mensagens)
export function validateForm(form) {
  const msgs = [];
  const get = (id) => form.querySelector('#' + id)?.value?.trim() || '';

  const nome = get('nome');
  const email = get('email');
  const cpf = get('cpf');
  const telefone = get('telefone');
  const nascimento = get('nascimento');
  const cep = get('cep');
  const endereco = get('endereco');
  const cidade = get('cidade');
  const estado = get('estado');

  if (nome.length < 3) msgs.push('Nome deve ter ao menos 3 caracteres.');
  if (!isValidEmail(email)) msgs.push('E-mail inválido.');
  if (!isValidCPF(cpf)) msgs.push('CPF inválido.');
  if (!isValidPhone(telefone)) msgs.push('Telefone inválido (use o formato (00) 00000-0000).');
  if (!isAdult(nascimento, 16)) msgs.push('Idade mínima é 16 anos.');
  if (!isValidCEP(cep)) msgs.push('CEP inválido.');
  if (endereco.length < 3) msgs.push('Endereço é obrigatório.');
  if (cidade.length < 2) msgs.push('Cidade é obrigatória.');
  if (!estado) msgs.push('Selecione um estado.');

  // Consistência extra: CEP deve ter 8 dígitos numéricos (além do pattern)
  if (onlyDigits(cep).length !== 8) msgs.push('CEP deve conter 8 dígitos.');

  return msgs;
}

export function attachFormValidation(selector, { onValid, onInvalid } = {}) {
  const form = document.querySelector(selector);
  if (!form) return;

  const messages = form.querySelector('#form-messages');

  const renderMessages = (msgs) => {
    messages.innerHTML = '';
    clearAlerts(messages);
    if (!msgs.length) {
      showAlert(messages, 'success', 'Tudo certo! Você pode enviar.');
      return;
    }
    msgs.forEach(m => showAlert(messages, 'danger', m));
  };

  const runValidation = () => {
    const msgs = validateForm(form);
    renderMessages(msgs);
    if (msgs.length) onInvalid?.(msgs);
    else onValid?.();
    return msgs.length === 0;
  };

  // Validação em tempo real
  form.addEventListener('input', () => runValidation());
  form.addEventListener('change', () => runValidation());

  // No submit, bloqueia se inválido
  form.addEventListener('submit', (e) => {
    const ok = runValidation();
    if (!ok) {
      e.preventDefault();
      form.reportValidity?.();
    } else {
      e.preventDefault();
      // Simula envio
      showAlert(messages, 'success', 'Formulário enviado com sucesso (simulado).');
      localStorage.removeItem('ong_cadastro'); // limpa storage após envio
    }
  });

  // Validação inicial
  runValidation();
}
