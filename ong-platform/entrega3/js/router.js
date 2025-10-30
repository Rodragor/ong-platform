// Roteador simples via hash (#/rota)

let ROUTES = {};
let subscribers = [];

export function initRouter(routes) {
  ROUTES = routes;
  window.addEventListener('hashchange', handleRoute);
  window.addEventListener('load', handleRoute);
  handleRoute();
}

export function navigateTo(href) {
  if (!href.startsWith('#')) href = '#' + href;
  window.location.hash = href;
}

export function onRouteChange(cb) {
  subscribers.push(cb);
}

function parsePath() {
  const hash = window.location.hash || '#/home';
  const [path, queryString] = hash.slice(1).split('?'); // remove '#'
  const searchParams = new URLSearchParams(queryString || '');
  return { path, searchParams };
}

async function handleRoute() {
  const { path, searchParams } = parsePath();
  const renderer = ROUTES[path] || ROUTES['/home'];
  // Render
  const app = document.getElementById('app');
  app.innerHTML = await renderer({ searchParams });
  // Dispara evento para pós-render
  const ev = new CustomEvent('spa:rendered', { detail: { route: path }});
  document.dispatchEvent(ev);
  // Notifica inscritos
  subscribers.forEach(fn => fn(path));
}
