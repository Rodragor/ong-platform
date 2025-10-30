import { initRouter, navigateTo, onRouteChange } from './router.js';
import { renderHome, renderProjetos, renderCadastro } from './templates.js';
import { showToast } from './components.js';
import { restoreForm, setupAutoSave } from './storage.js';
import { attachFormValidation } from './validators.js';

// Mapeamento de rotas -> renderizadores
const routes = {
  '/home': renderHome,
  '/projetos': renderProjetos,
  '/cadastro': renderCadastro,
};

// Inicialização da SPA
function bootstrap() {
  initRouter(routes);

  // Atualiza estado visual do menu ao trocar rota
  onRouteChange((path) => {
    document.querySelectorAll('nav a[data-link]').forEach(a => {
      const isActive = a.getAttribute('href').replace('#', '') === path;
      a.toggleAttribute('aria-current', isActive ? 'page' : null);
    });
  });

  // Delegação de eventos globais
  document.addEventListener('click', (e) => {
    const link = e.target.closest('a[data-link]');
    if (link) {
      e.preventDefault();
      navigateTo(link.getAttribute('href'));
      // Fecha menu mobile
      const toggle = document.getElementById('nav-toggle');
      if (toggle) toggle.checked = false;
    }
  });

  // Quando a tela de cadastro renderizar, restaurar dados e ligar validações
  document.addEventListener('spa:rendered', (ev) => {
    if (ev.detail?.route === '/cadastro') {
      restoreForm('#cadastroForm');
      setupAutoSave('#cadastroForm');
      attachFormValidation('#cadastroForm', {
        onValid: () => showToast('Dados válidos. Você pode enviar.'),
        onInvalid: (msgs) => showToast(msgs[0] || 'Por favor, verifique os campos.'),
      });
    }
  });
}

bootstrap();
