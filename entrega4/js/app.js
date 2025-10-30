import { initRouter, navigateTo, onRouteChange } from './router.js';
import { renderHome, renderProjetos, renderCadastro } from './templates.js';
import { showToast } from './components.js';
import { restoreForm, setupAutoSave } from './storage.js';
import { attachFormValidation } from './validators.js';

const routes = { '/home': renderHome, '/projetos': renderProjetos, '/cadastro': renderCadastro };

function applyPref(key, attr, fallback){
  const v = localStorage.getItem(key) || fallback;
  document.documentElement.setAttribute(attr, v);
  return v;
}
function togglePref(key, attr, a, b){
  const curr = document.documentElement.getAttribute(attr) || a;
  const next = curr === a ? b : a;
  document.documentElement.setAttribute(attr, next);
  localStorage.setItem(key, next);
  return next;
}

function setupA11yToggles(){
  const themeBtn = document.getElementById('theme-toggle');
  const contrastBtn = document.getElementById('contrast-toggle');

  const theme = applyPref('pref_theme', 'data-theme', (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'));
  const contrast = applyPref('pref_contrast', 'data-contrast', 'normal');
  themeBtn?.setAttribute('aria-pressed', String(theme==='dark'));
  contrastBtn?.setAttribute('aria-pressed', String(contrast==='high'));

  themeBtn?.addEventListener('click', ()=>{
    const next = togglePref('pref_theme', 'data-theme', 'light', 'dark');
    themeBtn.setAttribute('aria-pressed', String(next==='dark'));
    showToast(next==='dark'?'Tema escuro ativado.':'Tema claro ativado.');
  });
  contrastBtn?.addEventListener('click', ()=>{
    const next = togglePref('pref_contrast', 'data-contrast', 'normal', 'high');
    contrastBtn.setAttribute('aria-pressed', String(next==='high'));
    showToast(next==='high'?'Alto contraste ativado.':'Alto contraste desativado.');
  });
}

function setupNavA11y(){
  const navToggle = document.getElementById('nav-toggle');
  const nav = document.getElementById('primary-navigation');

  // aria-expanded do menu mobile
  navToggle?.addEventListener('change', ()=>{
    navToggle.setAttribute('aria-expanded', String(navToggle.checked));
  });

  // Escape fecha menu
  document.addEventListener('keydown',(e)=>{
    if(e.key==='Escape' && navToggle?.checked){
      navToggle.checked=false;
      navToggle.dispatchEvent(new Event('change'));
    }
  });

  // Teclado no menu/submenu
  nav?.addEventListener('keydown',(e)=>{
    const current = document.activeElement;
    const items = [...nav.querySelectorAll('a[role="menuitem"]')];
    const i = items.indexOf(current);
    if(i<0) return;
    if(e.key==='ArrowRight'){ e.preventDefault(); (items[i+1]||items[0]).focus(); }
    if(e.key==='ArrowLeft'){ e.preventDefault(); (items[i-1]||items[items.length-1]).focus(); }
    if(e.key==='ArrowDown' && current.parentElement?.classList.contains('has-submenu')){
      e.preventDefault();
      current.setAttribute('aria-expanded','true');
      const first = current.parentElement.querySelector('.submenu a[role="menuitem"]');
      first?.focus();
    }
    if(e.key==='ArrowUp' && current.closest('.submenu')){
      e.preventDefault();
      current.closest('.has-submenu')?.querySelector('a[role="menuitem"]')?.focus();
    }
  });

  // aria-expanded nos itens com submenu ao focar/sair
  nav?.querySelectorAll('.has-submenu > a').forEach(a=>{
    a.addEventListener('focus', ()=>a.setAttribute('aria-expanded','true'));
    a.addEventListener('blur', ()=>a.setAttribute('aria-expanded','false'));
  });
}

function bootstrap(){
  initRouter(routes);
  setupA11yToggles();
  setupNavA11y();

  onRouteChange((path)=>{
    document.querySelectorAll('nav a[data-link]').forEach(a=>{
      const isActive = a.getAttribute('href').replace('#','') === path;
      if(isActive) a.setAttribute('aria-current','page'); else a.removeAttribute('aria-current');
    });
    // foco no main após navegação
    const main = document.getElementById('app');
    main?.focus();
  });

  document.addEventListener('click',(e)=>{
    const link=e.target.closest('a[data-link]');
    if(link){
      e.preventDefault();
      navigateTo(link.getAttribute('href'));
      const t=document.getElementById('nav-toggle');
      if(t){t.checked=false; t.dispatchEvent(new Event('change'));}
    }
  });

  document.addEventListener('spa:rendered',(ev)=>{
    if(ev.detail?.route==='/cadastro'){
      restoreForm('#cadastroForm');
      setupAutoSave('#cadastroForm');
      attachFormValidation('#cadastroForm',{
        onValid:()=>showToast('Dados válidos.'),
        onInvalid:(m)=>showToast(m[0]||'Revise os campos.')
      });
    }
  });
}
bootstrap();
