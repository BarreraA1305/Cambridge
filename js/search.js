window.MS = (function () {
  var indice = [];
  var overlay, input, results;

  function add(titulo, meta, href, grupo) {
    var t = MU.tx(titulo);
    if (!t) return;
    var m = MU.tx(meta);
    indice.push({ titulo: t, meta: String(m || ''), href: href, grupo: grupo, clave: MU.norm(t + ' ' + m) });
  }

  function build() {
    indice = [];
    var d = window.MISSION;
    add(d.mission.titulo, d.mission.titulo_corto, '#inicio', MU.getLang() === 'es' ? 'Misión' : 'Mission');
    (d.people.delegacion || []).forEach(function (p) { add(p.nombre, p.cargo, '#inicio', MU.getLang() === 'es' ? 'Personas' : 'People'); });
    (d.people.contrapartes || []).forEach(function (p) { add(p.nombre, p.cargo, '#reuniones', MU.getLang() === 'es' ? 'Contrapartes' : 'Counterparts'); });
    (d.agenda.dias || []).forEach(function (dia) {
      dia.actividades.forEach(function (a) {
        add(a.titulo, dia.etiqueta + ' · ' + MU.hora(a.inicio) + ' · ' + (a.lugar || ''), '#agenda/' + dia.id, MU.getLang() === 'es' ? 'Agenda' : 'Agenda');
      });
    });
    (d.lodging.hoteles || []).forEach(function (h) { add(h.nombre, h.ciudad + ' · ' + h.direccion, '#hospedajes', MU.getLang() === 'es' ? 'Hospedajes' : 'Accommodation'); });
    (d.documents.documentos || []).forEach(function (x) { add(x.titulo, x.categoria, x.archivo, MU.getLang() === 'es' ? 'Documentos' : 'Documents'); });
    (d.promo.material || []).forEach(function (x) { add(x.titulo, x.tipo, x.archivo, MU.getLang() === 'es' ? 'Promoción' : 'Promotion'); });
    (d.economy.indicadores || []).forEach(function (x) { add(x.nombre, x.valor + ' ' + x.unidad, '#economia', MU.getLang() === 'es' ? 'Economía' : 'Economy'); });
    (d.meetings.empresas || []).forEach(function (e) { add(e.nombre, e.sector, '#reuniones', MU.getLang() === 'es' ? 'Contrapartes' : 'Counterparts'); });
    (d.meetings.reuniones || []).forEach(function (r) { add(r.titulo, r.fecha + ' · ' + (r.lugar && r.lugar.nombre), '#reuniones/' + r.dia_id, MU.getLang() === 'es' ? 'Reuniones' : 'Meetings'); });
    (d.flights.rutas || []).forEach(function (r) {
      (r.tramos || []).forEach(function (t) { add(t.numero, t.origen + ' → ' + t.destino + ' · ' + t.aerolinea, '#vuelos', MU.getLang() === 'es' ? 'Vuelos' : 'Flights'); });
    });
  }

  function dibujar(q) {
    var consulta = MU.norm(q.trim());
    if (!consulta) {
      results.innerHTML = '<p class="search-empty">' + MU.esc(MU.getLang() === 'es' ? 'Escribe para buscar empresas, actividades, personas o documentos.' : 'Type to search companies, activities, people or documents.') + '</p>';
      return;
    }
    var encontrados = indice.filter(function (e) { return e.clave.indexOf(consulta) >= 0; }).slice(0, 40);
    if (!encontrados.length) { results.innerHTML = '<p class="search-empty">' + MU.esc(MU.t('sin_resultados')) + ' · ' + MU.esc(q) + '</p>'; return; }
    var grupos = {};
    encontrados.forEach(function (e) { (grupos[e.grupo] = grupos[e.grupo] || []).push(e); });
    var html = '';
    Object.keys(grupos).forEach(function (g) {
      html += '<section class="search-group"><h3>' + MU.esc(g) + '</h3>';
      grupos[g].forEach(function (e) {
        html += '<a class="search-result" href="' + MU.esc(e.href) + '"' + (e.href.indexOf('#') !== 0 ? ' target="_blank" rel="noopener noreferrer"' : '') + '>' + MU.esc(e.titulo) + '<small>' + MU.esc(e.meta) + '</small></a>';
      });
      html += '</section>';
    });
    results.innerHTML = html;
  }

  function abrir() { overlay.hidden = false; input.value = ''; dibujar(''); input.focus(); }
  function cerrar() { overlay.hidden = true; }

  function init() {
    overlay = document.getElementById('search-overlay');
    input = document.getElementById('search-input');
    results = document.getElementById('search-results');
    build();
    document.getElementById('search-open').addEventListener('click', abrir);
    document.getElementById('search-close').addEventListener('click', cerrar);
    overlay.addEventListener('click', function (e) { if (e.target === overlay) cerrar(); });
    input.addEventListener('input', function () { dibujar(input.value); });
    document.addEventListener('keydown', function (e) {
      var etiqueta = (e.target && e.target.tagName || '').toLowerCase();
      if (e.key === '/' && etiqueta !== 'input' && etiqueta !== 'textarea') { e.preventDefault(); abrir(); }
      if (e.key === 'Escape' && !overlay.hidden) cerrar();
    });
  }

  function rebuild() { build(); if (overlay && !overlay.hidden) dibujar(input.value); }
  return { init: init, build: build, rebuild: rebuild };
})();
