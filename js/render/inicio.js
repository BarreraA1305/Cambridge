window.MR = window.MR || {};
MR.inicio = function () {
  var m = window.MISSION.mission;
  var p = window.MISSION.people.delegacion || [];
  var ahora = MU.ahora();
  var html = '';
  html += '<div class="hero"><div class="hero-grid">';
  html += '<div><h2>' + MU.esc(MU.tx(m.titulo)) + '</h2>';
  html += '<p class="card-meta">' + MU.esc(m.dependencia) + ' · ' + MU.esc(MU.rango(m.fecha_inicio, m.fecha_fin)) + '</p>';
  html += '<p class="objetivo">' + MU.esc(MU.tx(m.objetivo)) + '</p>';
  html += MU.tradNote(m.objetivo);
  html += '<button class="detalle" type="button" data-toggle="mas">' + (MU.getLang() === 'es' ? 'Ver objetivos específicos ▾' : 'View specific objectives ▾') + '</button>';
  var objs = MU.tx(m.objetivos_especificos) || [];
  html += '<ul class="mas" id="mas">' + objs.map(function (o) { return '<li>' + MU.esc(o) + '</li>'; }).join('') + '</ul>';
  html += '<p class="card-meta"><strong>' + MU.esc(MU.t('destinos')) + ':</strong></p><ul class="chips">';
  (m.ciudades || []).forEach(function (ciudad, i) {
    if (i) html += '<li class="chip-arrow" aria-hidden="true">→</li>';
    html += '<li class="chip">' + MU.esc(MU.tx(ciudad.nombre)) + '</li>';
  });
  html += '</ul></div>';
  html += '<div><div class="now-box"><p class="now-label">' + MU.esc(MU.t('ahora')) + '</p>';
  html += '<p class="now-title">' + MU.esc(ahora.titulo) + '</p><p class="now-meta">' + MU.esc(ahora.meta) + '</p></div>';
  html += '<div class="quick"><a href="#agenda">' + MU.esc(MU.t('ver_agenda')) + '</a><a href="#vuelos">' + MU.esc(MU.t('ver_vuelos')) + '</a><a href="#hospedajes">' + MU.esc(MU.t('ver_hospedaje')) + '</a><a href="' + MU.esc(m.pdf_agenda) + '" target="_blank" rel="noopener noreferrer">' + MU.esc(MU.t('ver_documento')) + '</a></div>';
  html += '</div></div></div>';

  html += '<div class="section-head" style="margin-top:1.5rem"><div><h2>' + MU.esc(MU.t('destinos')) + '</h2></div></div>';
  html += '<div class="cards three-col">';
  (m.ciudades || []).forEach(function (c) {
    var alt = (MU.tx(c.nombre) || '') + ', ' + (MU.getLang() === 'es' ? 'destino de la misión' : 'mission destination');
    html += '<article class="card place">' + MU.foto(c.foto, alt, MU.tx(c.nombre), c.foto_credito);
    html += '<div class="card-body"><h3>' + MU.esc(MU.tx(c.nombre)) + '</h3>';
    if (c.nombre_local && c.nombre_local !== c.nombre) html += '<p class="card-meta">' + MU.esc(c.nombre_local) + '</p>';
    html += MU.refLabel();
    html += '<div class="card-links">';
    (c.enlaces || []).forEach(function (l) {
      html += '<a class="btn btn-sm" href="' + MU.esc(l.url) + '" target="_blank" rel="noopener noreferrer">' + MU.esc(MU.tx(l.etiqueta)) + ' ↗</a>';
    });
    html += '</div></div></article>';
  });
  html += '</div>';

  html += '<div class="section-head" style="margin-top:1.5rem"><div><h2>' + MU.esc(MU.t('comitiva')) + '</h2></div></div>';
  html += '<div class="cards">';
  p.forEach(function (persona) {
    html += '<article class="card"><div class="person"><span class="avatar" aria-hidden="true">' + MU.esc(MU.iniciales(persona.nombre)) + '</span>';
    html += '<div class="person-info"><h3>' + MU.esc(persona.nombre) + '</h3><p class="card-meta">' + MU.esc(MU.tx(persona.cargo)) + '</p><p class="card-meta">' + MU.esc(persona.organizacion) + '</p>';
    if (persona.notas && /pendiente|no aparece|pending/i.test(MU.tx(persona.notas))) {
      html += '<span class="badge badge-warn"><span aria-hidden="true">◌</span> ' + MU.esc(MU.t('por_confirmar')) + '</span>';
    }
    html += '</div></div></article>';
  });
  html += '</div>';
  return html;
};

MR.trasRenderizar = function (id, body) {
  if (id !== 'inicio') return;
  body.querySelectorAll('[data-toggle="mas"]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var destino = document.getElementById(btn.getAttribute('data-toggle'));
      if (!destino) return;
      destino.classList.toggle('abierto');
      var abierto = destino.classList.contains('abierto');
      btn.textContent = abierto
        ? (MU.getLang() === 'es' ? 'Ocultar objetivos específicos ▴' : 'Hide specific objectives ▴')
        : (MU.getLang() === 'es' ? 'Ver objetivos específicos ▾' : 'View specific objectives ▾');
    });
  });
};
