(function () {
  var NAV = [
    { id: 'inicio', key: 'nav_inicio', ico: '⌂' },
    { id: 'agenda', key: 'nav_agenda', ico: '▦' },
    { id: 'promocion', key: 'nav_promocion', ico: '▤' },
    { id: 'economia', key: 'nav_economia', ico: '◈' },
    { id: 'reuniones', key: 'nav_reuniones', ico: '◉' },
    { id: 'documentos', key: 'nav_documentos', ico: '▣' },
    { id: 'vuelos', key: 'nav_vuelos', ico: '✈' },
    { id: 'hospedajes', key: 'nav_hospedajes', ico: '⌂' }
  ];
  var cache = {};       // Render HTML por sección e idioma (una vez visitada).
  var seccionActual = null;
  var renderizadoId = null;

  function texto(id, valor) {
    var n = document.getElementById(id);
    if (n && valor !== null && valor !== undefined) n.textContent = valor;
  }
  function activas() {
    return NAV.filter(function (x) { return (window.MISSION.mission.secciones_activas || []).indexOf(x.id) >= 0; });
  }
  function seccionDesdeHash() {
    var id = (location.hash || '').replace(/^#/, '').split('/')[0];
    var found = activas().filter(function (x) { return x.id === id; })[0];
    return found ? found.id : activas()[0].id;
  }
  function subDesdeHash() {
    var partes = (location.hash || '').replace(/^#/, '').split('/');
    return partes.length > 1 ? partes[1] : null;
  }

  function construirNav() {
    var lista = document.getElementById('desktop-nav-list');
    var mas = document.getElementById('more-list');
    lista.innerHTML = ''; mas.innerHTML = '';
    activas().forEach(function (x) {
      var a = document.createElement('a');
      a.href = '#' + x.id; a.textContent = MU.t(x.key); a.setAttribute('data-seccion', x.id);
      lista.appendChild(a);
      var a2 = document.createElement('a');
      a2.href = '#' + x.id; a2.textContent = MU.t(x.key);
      mas.appendChild(a2);
    });
    document.querySelectorAll('.bottom-nav button[data-seccion]').forEach(function (b) {
      var x = NAV.filter(function (n) { return n.id === b.getAttribute('data-seccion'); })[0];
      var lbl = b.querySelector('.nav-label');
      if (lbl && x) lbl.textContent = MU.t(x.key);
    });
  }

  function marcarNav(id) {
    document.querySelectorAll('.desktop-nav a[data-seccion], .bottom-nav button[data-seccion]').forEach(function (a) {
      if (a.getAttribute('data-seccion') === id) a.setAttribute('aria-current', 'page');
      else a.removeAttribute('aria-current');
    });
  }

  function renderVista(id, sub) {
    var view = document.getElementById('view');
    var body = document.getElementById('view-body');
    var clave = id + ':' + MU.getLang();
    var esDinamico = id === 'agenda' || id === 'reuniones';
    if (!esDinamico && !cache[clave]) {
      var fn = window.MR && window.MR[id];
      if (typeof fn !== 'function') { body.innerHTML = '<p class="state">' + MU.esc(MU.t('empty')) + '</p>'; return; }
      try { cache[clave] = fn(); }
      catch (e) { console.error('Error al renderizar ' + id, e); body.innerHTML = '<p class="state">' + MU.esc(MU.t('error')) + '</p>'; return; }
    }
    var nav = NAV.filter(function (n) { return n.id === id; })[0];
    texto('view-title', MU.t(nav ? nav.key : id));
    if (id === 'agenda' && typeof window.MR.inicializarAgenda === 'function') {
      window.MR.inicializarAgenda(sub);
    } else if (id === 'reuniones' && typeof window.MR.inicializarReuniones === 'function') {
      window.MR.inicializarReuniones(sub);
    } else {
      body.innerHTML = cache[clave];
      if (typeof window.MR.trasRenderizar === 'function') window.MR.trasRenderizar(id, body);
    }
    view.hidden = false;
    document.getElementById('loading').hidden = true;
    if (window.MS && typeof MS.rebuild === 'function') MS.rebuild();
  }

  function mostrarSeccion(id, sub, cambiarHash) {
    if (!id) return;
    if (cambiarHash) { location.hash = '#' + id + (sub ? '/' + sub : ''); return; }
    seccionActual = id;
    renderizadoId = id;
    if (window.MR) window.MR.subActual = sub || null;
    marcarNav(id);
    renderVista(id, sub);
    window.scrollTo({ top: 0, behavior: 'auto' });
    var h1 = document.getElementById('view-title');
    if (h1 && typeof h1.focus === 'function') h1.focus({ preventScroll: true });
    var hoja = document.getElementById('more-sheet');
    if (hoja) hoja.hidden = true;
  }

  function aplicarHash() {
    var id = seccionDesdeHash();
    var sub = subDesdeHash();
    var subActual = window.MR ? window.MR.subActual : null;
    if (id !== renderizadoId || (sub && sub !== subActual)) {
      mostrarSeccion(id, sub, false);
    } else if (sub) {
      if (id === 'agenda' && window.MR.seleccionarDia) window.MR.seleccionarDia(sub);
      if (id === 'reuniones' && window.MR.seleccionarReunion) window.MR.seleccionarReunion(sub);
    }
  }

  function detectarIdioma() {
    try {
      var guardado = localStorage.getItem('mision-cambridge-idioma');
      if (guardado === 'es' || guardado === 'en') return guardado;
    } catch (e) {}
    var q = new URLSearchParams(location.search).get('lang');
    if (q === 'es' || q === 'en') return q;
    var nav = (navigator.language || 'es').slice(0, 2);
    return (nav === 'es' || nav === 'en') ? nav : (window.MISSION.mission.idioma_por_defecto || 'es');
  }

  function aplicarIdioma(codigo, redibujar) {
    MU.setLang(codigo);
    var m = window.MISSION.mission;
    document.documentElement.lang = codigo;
    document.title = MU.t('brand') + ' · ' + m.titulo_corto;
    texto('lang-btn', codigo === 'es' ? 'ES · Español' : 'EN · English');
    var boton = document.getElementById('lang-btn');
    boton.setAttribute('aria-label', MU.t('lang_button'));
    texto('skip-link', MU.t('skip'));
    texto('cintillo', MU.t('brand') + ' · ' + (codigo === 'es' ? 'Agenda institucional' : 'Institutional agenda') + ' · ' + (m.version_agenda || (codigo === 'es' ? 'sin versión declarada' : 'no version declared')));
    texto('header-delegacion', MU.tx(m.etiqueta_delegacion));
    texto('header-titulo', m.titulo_corto);
    texto('header-fechas', MU.rango(m.fecha_inicio, m.fecha_fin));
    texto('footer-organizacion', MU.t('footer_institucion'));
    texto('footer-mision', m.titulo);
    texto('footer-version', (codigo === 'es' ? 'Agenda: ' : 'Agenda: ') + (m.version_agenda || (codigo === 'es' ? 'sin versión declarada' : 'no version declared')));
    texto('footer-fecha', MU.t('pie_actualizacion'));
    texto('footer-privado', MU.t('pie_privado'));
    texto('noscript-text', MU.t('noscript'));
    texto('more-label', codigo === 'es' ? 'Todas las secciones' : 'All sections');
    texto('search-title', codigo === 'es' ? 'Buscar en la guía' : 'Search the guide');
    var input = document.getElementById('search-input');
    input.placeholder = MU.t('search');
    texto('search-close', MU.t('cerrar'));
    texto('loading', MU.t('loading'));
    construirNav();
    try { localStorage.setItem('mision-cambridge-idioma', codigo); } catch (e) {}
    if (redibujar && seccionActual) {
      cache = {};
      renderizadoId = null;
      mostrarSeccion(seccionActual, subDesdeHash(), false);
    }
  }

  function arrancar() {
    var datos = window.MISSION || {};
    if (!datos.mission || !datos.agenda) {
      texto('loading', MU.t('error'));
      return;
    }
    aplicarIdioma(detectarIdioma(), false);
    document.getElementById('lang-btn').addEventListener('click', function () {
      aplicarIdioma(MU.getLang() === 'es' ? 'en' : 'es', true);
    });
    document.querySelectorAll('.bottom-nav button[data-seccion]').forEach(function (b) {
      b.addEventListener('click', function () { location.hash = '#' + b.getAttribute('data-seccion'); });
    });
    var masBoton = document.getElementById('mas-boton');
    var hoja = document.getElementById('more-sheet');
    masBoton.addEventListener('click', function () { hoja.hidden = !hoja.hidden; });
    document.addEventListener('click', function (e) {
      if (!hoja.hidden && !hoja.contains(e.target) && e.target !== masBoton && !masBoton.contains(e.target)) hoja.hidden = true;
    });
    if (window.MS && typeof MS.init === 'function') MS.init();
    aplicarHash();
    window.addEventListener('hashchange', aplicarHash);
    if ('serviceWorker' in navigator && (location.protocol === 'https:' || location.hostname === 'localhost')) {
      navigator.serviceWorker.register('sw.js').catch(function () {});
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', arrancar);
  else arrancar();
})();
